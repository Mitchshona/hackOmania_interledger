import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import { OpenAIHelper } from './utils/openai.js';
import { OpenaiService } from './utils/openai.service.js';
import { grantPromse } from "./config/createingrant.js";
import { incomingPaymentPromise } from "./config/createinpay.js";
import { quotePromise } from "./config/createdebitquote.js";
import { outGrant } from "./config/createoutgrant.js";

const app = express();
const PORT = 5600;

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

// Initialize OpenAI helper and service
const openAIHelper = new OpenAIHelper();
const openaiService = new OpenaiService(openAIHelper);

app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.status(200).send("Welcome to root URL of Server");
});

app.post('/api/userpost', (req, res) => {
    const { image, uid } = req.body;
    res.status(200).send("Received user data: UID: " + uid);
});

// Add to your Express server setup
app.post('/createoutgrant', async (req, res) => {
    const oGrant = await outGrant;
    res.status(200);
    res.send(oGrant.continue);
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

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else { 
        console.log("Error occurred, server can't start", error);
    }
});