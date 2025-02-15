import { createAuthenticatedClient } from "@interledger/open-payments";
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;
const WALLET_ADDRESS1 = "https://ilp.interledger-test.dev/hackomania2";

async function main() {
    try {
        // Verify private key can be read
        const privateKey = readFileSync(PRIVATE_KEY_PATH, 'utf8');
        console.log("Private key loaded successfully");
        
        console.log("Creating authenticated client...");
        const client = await createAuthenticatedClient({
            walletAddressUrl: WALLET_ADDRESS,
            privateKey: privateKey, // Using the key content directly
            keyId: KEY_ID,
        });
        
        console.log("Client created successfully");
        
        // Try a basic GET request first
        console.log("Attempting to fetch wallet address...");
        const walletAddress = await client.walletAddress.get({
            url: WALLET_ADDRESS1,
        });
        const walletAddressKeys = await client.walletAddress.getKeys({
            url: WALLET_ADDRESS1,
        });
        console.log("WALLET ADDRESS KEYS:", JSON.stringify(walletAddressKeys, null, 2));  
        console.log("WALLET ADDRESS:", walletAddress);
    } catch (error) {
        console.error("Detailed error information:");
        console.error("Message:", error.message);
        console.error("Description:", error.description);
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        if (error.cause) {
            console.error("Cause:", error.cause);
        }
        if (error.stack) {
            console.error("Stack:", error.stack);
        }
    }
}

main();
