import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import { OpenAIHelper } from './utils/openai.js';
import { OpenaiService } from './utils/openai.service.js';
import { createAuthenticatedClient, isFinalizedGrant } from "@interledger/open-payments";
import { grantPromise } from "./config/createingrant.js";
import { incomingPaymentPromise } from "./config/createinpay.js";
import { quotePromise } from "./config/createdebitquote.js";
import { outgoingGrantPromise } from "./config/createoutgrant.js";
import { createOutgoingPayment } from "./config/createoutpay.js";
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";import { initializeApp } from "firebase/app";import fs from 'fs';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5600;

const openai = new OpenAIHelper();
const openaiService = new OpenaiService(openai);
app.use(bodyParser.json({ limit: '50mb' }));

const backend_endpoint = process.env.BACKEND_ENDPOINT;

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
  };
  
const appFire = initializeApp(firebaseConfig);
const db = getFirestore(appFire);

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.post('/api/userpost', (req, res) => {
    const { image, uid } = req.body;
    res.status(200).send("Received user data: UID: " + uid);
});

app.post('/createingrant', async (req, res) => {
    const { WALLET_ADDRESS, privateKey, KEY_ID } = req.body;

    try {
        const result = await grantPromise(WALLET_ADDRESS, privateKey, KEY_ID);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

app.post('/api/analyze-image', async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ message: "Image is required" });
    }

    try {
        const analysis = await openaiService.validateImage(image);
        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error analyzing image:', error);
        res.status(500).json({ message: "Failed to analyze image", error: error.message });
    }
});

app.post('/createinpay', async (req, res) => {
    const { WALLET_ADDRESS, privateKey, KEY_ID, ACCESS_TOKEN, AMOUNT } = req.body;
    try {
        const result = await incomingPaymentPromise(WALLET_ADDRESS, privateKey, KEY_ID, ACCESS_TOKEN, AMOUNT);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

app.post('/createdebitquote', async (req, res) => {
    const { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, PAYMENTID  } = req.body;
    try {
        const result = await quotePromise(WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, PAYMENTID);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

app.post('/api/userCreateIncoming', async (req, res) => {
    const { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID } = req.body;
    
    let privateKey;
    try {
        privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: `Failed to read private key file: ${error.message}`
        });
    }
    const inGrant = await axios.post(`${backend_endpoint}/createingrant`, { WALLET_ADDRESS, privateKey, KEY_ID });
    console.log(inGrant.data);
    const ACCESS_TOKEN = inGrant.data.grantData.accessToken;
    const inPay = await axios.post(`${backend_endpoint}/createinpay`, { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN });
    const PAYMENTID = inPay.data.paymentId;
    console.log(inPay.data);
    const debitQuote = await axios.post(`${backend_endpoint}/createdebitquote`, { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, PAYMENTID });
    const QUOTE = debitQuote.data.quote;
    console.log(debitQuote.data);
    // const outgoingGrant = await axios.post(`${backend_endpoint}/createoutgrant`, { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, PAYMENTID, QUOTE });
    // grantSessions.set(outgoingGrant.nonce, {
    //     continueUri: outgoingGrant.grant.continue.uri,
    //     continueAccessToken: outgoingGrant.grant.continue.accessToken,
    //     clientConfig: { 
    //         WALLET_ADDRESS, 
    //         PRIVATE_KEY_PATH, 
    //         KEY_ID 
    //     }
    // });
    res.status(200).json(debitQuote.data);
});

const grantSessions = new Map();

app.post('/createoutgrant', async (req, res) => {
    const { 
        WALLET_ADDRESS, 
        PRIVATE_KEY_PATH, 
        KEY_ID, 
        ACCESS_TOKEN, 
        PAYMENTID, 
        QUOTE 
    } = req.body;

    try {
        // Basic parameter validation
        if (!WALLET_ADDRESS || !PRIVATE_KEY_PATH || !KEY_ID) {
            return res.status(400).json({
                success: false,
                error: "Missing required parameters: WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID"
            });
        }

        const result = await outgoingGrantPromise(
            WALLET_ADDRESS,
            PRIVATE_KEY_PATH,
            KEY_ID,
            ACCESS_TOKEN,
            PAYMENTID,
            QUOTE
        );

        grantSessions.set(result.nonce, {
            continueUri: result.grant.continue.uri,
            continueAccessToken: result.grant.continue.access_token.value,
            quote: QUOTE,    
            clientConfig: { 
                WALLET_ADDRESS, 
                PRIVATE_KEY_PATH, 
                KEY_ID,
            }
        });
        res.json({
            interaction_url: result.grant.interact.redirect,
            session_id: result.nonce// Send to client
        });
        // res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
        console.error('Grant creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server processing error',
            details: error.response?.body || null
        });
    }
});

app.get('/continuegrant', async (req, res) => {
    const { nonce, hash, interact_ref } = req.query;

    // 1. Validate required parameters
    if (!hash || !interact_ref) {
        return res.status(400).json({ 
            error: "Missing required parameters",
            required: ["hash", "interact_ref"]
        });
    }

    const session = grantSessions.get(nonce)
    console.log("Session:", session.clientConfig.PRIVATE_KEY_PATH);
    const privateKey = fs.readFileSync(session.clientConfig.PRIVATE_KEY_PATH, 'utf8');

    const client = await createAuthenticatedClient({
        walletAddressUrl: session.clientConfig.WALLET_ADDRESS,
        privateKey: privateKey,
        keyId: session.clientConfig.KEY_ID,
      });
    console.log("Grant continuation token:", session.continueUri);
    console.log("Grant continuation URI:", session.continueAccessToken);
    const grantResult = await client.grant.continue(
        {
          accessToken: session.continueAccessToken,
          url: session.continueUri,
        },
        {
          interact_ref: interact_ref,
        },
      );
    console.log("Grant Result:", grantResult);
    if (!isFinalizedGrant(grantResult)) {
        throw new Error("Expected finalized grant. Received non-finalized grant.");
    }
    const accessToken = grantResult.access_token.value;
    console.log("Interact ref:", interact_ref); 
    let WALLET_ADDRESS = session.clientConfig.WALLET_ADDRESS; 
    let KEY_ID = session.clientConfig.KEY_ID;
    let quote = session.quote;

    console.log(WALLET_ADDRESS, privateKey, KEY_ID, accessToken, quote);
    const result = await createOutgoingPayment({
        walletAddress: WALLET_ADDRESS,
        privateKey: privateKey,
        keyId: KEY_ID,
        accessToken: accessToken,
        quote: quote,
    });
    // const outPay = axios.post(`${backend_endpoint}/createoutpay`, { WALLET_ADDRESS, privateKey, KEY_ID, accessToken, quoteURL });
    res.redirect("http://localhost:3000/user/joel3?success=true");
});

app.post('/createoutpay', async (req, res) => {
    const { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, QUOTE } = req.body;
    try {
        const result = await createOutgoingPayment(WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, QUOTE);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

app.post('/api/userCreateInComingDonation', async (req, res) => {
    const { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, AMOUNT, USER_ID } = req.body;
    
    let privateKey;
    try {
        privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: `Failed to read private key file: ${error.message}`
        });
    }
    const inGrant = await axios.post(`${backend_endpoint}/createingrant`, { WALLET_ADDRESS, privateKey, KEY_ID });
    console.log(inGrant.data);
    const ACCESS_TOKEN = inGrant.data.grantData.accessToken;
    const inPay = await axios.post(`${backend_endpoint}/createinpay`, { WALLET_ADDRESS, privateKey, KEY_ID, ACCESS_TOKEN, AMOUNT});
    const donationData = {
        userId: USER_ID,
        paymentId: inPay.data.paymentId,
        accessToken: inPay.data.accessToken,
        createdAt: new Date().toISOString(),
        amount: AMOUNT,
        walletAddress: WALLET_ADDRESS
    };
    // Add a new document with paymentId as the document ID
    await setDoc(doc(db, "donations", USER_ID), donationData);
    res.status(200).json(inPay.data);
});

app.post('/api/userCreateOutGoingDonation', async (req, res) => {
    const { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, RECEIPIENT_UID } = req.body;
    
    const donationsRef = collection(db, "donations");
        const q = query(donationsRef, where("userId", "==", RECEIPIENT_UID));

        // 2. Execute query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({
                success: false,
                error: "No donations found for this user"
            });
        }

        // 3. Get first matching document (assuming 1:1 UID:payment)
    const doc = querySnapshot.docs[0];
    const paymentData = doc.data();
    console.log("Payment Data:", paymentData);
    let privateKey;
    try {
        privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: `Failed to read private key file: ${error.message}`
        });
    }
    const client = await createAuthenticatedClient({
        walletAddressUrl: WALLET_ADDRESS,
        privateKey: privateKey,
        keyId: KEY_ID,
      });

    const sendingWalletAddress = await client.walletAddress.get({
        url: WALLET_ADDRESS, // Make sure the wallet address starts with https:// (not $)
      });
    const quoteGrant = await client.grant.request(
        {
          url: sendingWalletAddress.authServer,
        },
        {
          access_token: {
            access: [
              {
                type: "quote",
                actions: ["create", "read"],
              },
            ],
          },
        }
      );
    
    const ACCESS_TOKEN = quoteGrant.access_token.value;
    const PAYMENTID = paymentData.paymentId;
    const debitQuote = await axios.post(`${backend_endpoint}/createdebitquote`, { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID, ACCESS_TOKEN, PAYMENTID });
    const QUOTE = debitQuote.data.quote;
    console.log(debitQuote.data);
    const result = await outgoingGrantPromise(
        WALLET_ADDRESS,
        PRIVATE_KEY_PATH,
        KEY_ID,
        ACCESS_TOKEN,
        paymentData.paymentId,
        QUOTE
    );

    grantSessions.set(result.nonce, {
        continueUri: result.grant.continue.uri,
        continueAccessToken: result.grant.continue.access_token.value,
        quote: QUOTE,    
        clientConfig: { 
            WALLET_ADDRESS, 
            PRIVATE_KEY_PATH, 
            KEY_ID,
        }
    });    
    console.log(result);
    res.status(200).json(result);
});


// app.post('/db/api/getUserBalance', async (req, res) => {
//     const { WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID } = req.body;
//     let privateKey;
//     try {
//         privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             error: `Failed to read private key file: ${error.message}`
//         });
//     }
//     const client = await createAuthenticatedClient({
//         walletAddressUrl: WALLET_ADDRESS,
//         privateKey: privateKey,
//         keyId: KEY_ID,
//       });
//     const walletAddress = await client.walletAddress.get({
//         url: WALLET_ADDRESS, // Make sure the wallet address starts with https:// (not $)
//       });
//     console.log("Current Balance:", walletAddress);
//     res.status(200).json(walletAddress);
// });

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else { 
        console.log("Error occurred, server can't start", error);
    }
});