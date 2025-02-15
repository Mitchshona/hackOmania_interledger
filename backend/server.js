import express from "express";
// server.js
import 'dotenv/config';  // FIRST IMPORT
import { grantPromse } from "./config/createingrant.js";
import { incomingPaymentPromise } from "./config/createinpay.js";
import { quotePromise } from "./config/createdebitquote.js";
import { outGrant } from "./config/createoutgrant.js";
const app = express();
const PORT = 5600;

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.post('/api/userpost', (req, res)=>{
    const { image, uid } = req.body;
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.post('/createingrant', (req, res) => {
    const iGrant = grantPromise(WALLET_ADDRESS, PRIVATE_KEY_PATH, KEY_ID);
    res.status(200);
    res.send(iGrant.continue);
});
// Add to your Express server setup
app.post('/createoutgrant', (req, res) => {
    const oGrant = outGrant();
    res.status(200);
    res.send(oGrant.continue);
});
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else { 
        console.log("Error occurred, server can't start", error);
    }
});
