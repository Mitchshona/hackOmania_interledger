import {
    createAuthenticatedClient,
    isPendingGrant,
} from "@interledger/open-payments";
import dotenv from 'dotenv';
import { quotePromise } from './createdebitquote.js';
import { randomUUID } from 'crypto';

dotenv.config();

const NONCE = randomUUID();

// Export as regular async function instead of IIFE
export const outGrant = async () => {  // Removed ()
    try {
        const quote = await quotePromise;
        console.log("Using quote:", quote.id);
        console.log("Debit Amount:", quote.debitAmount.value, quote.debitAmount.assetCode);

        const client = await createAuthenticatedClient({
            walletAddressUrl: process.env.WALLET_ADDRESS,
            privateKey: process.env.PRIVATE_KEY_PATH,
            keyId: process.env.KEY_ID,
        });

        const walletAddress = await client.walletAddress.get({
            url: process.env.WALLET_ADDRESS,
        });

        const grant = await client.grant.request(
            {
                url: walletAddress.authServer,
            },
            {
                access_token: {
                    access: [
                        {
                            identifier: walletAddress.id,
                            type: "outgoing-payment",
                            actions: ["list", "list-all", "read", "read-all", "create"],
                            limits: {
                                debitAmount: {
                                    assetCode: quote.debitAmount.assetCode,
                                    assetScale: quote.debitAmount.assetScale,
                                    value: quote.debitAmount.value,
                                },
                            },
                        },
                    ],
                },
                interact: {
                    start: ["redirect"],
                    finish: {
                        method: "redirect",
                        uri: "http://localhost:3344",
                        nonce: NONCE,
                    },
                },
            }
        );

        if (!isPendingGrant(grant)) {
            throw new Error("Expected interactive grant");
        }

        console.log("NONCE:", NONCE);
        console.log("Interaction URL:", grant.interact.redirect);
        return grant;

    } catch (error) {
        console.error("Grant Error:", error.response?.body || error.message);
        throw error; // Don't exit process, just throw
    }
}; // Removed ()

console.log("NONCE =", NONCE);
