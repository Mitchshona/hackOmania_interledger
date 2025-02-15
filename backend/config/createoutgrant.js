import {
    createAuthenticatedClient,
    isPendingGrant,
} from "@interledger/open-payments";
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

/**
 * Creates an outgoing grant request with interactive authentication
 * @param {Object} params - Grant parameters
 * @param {string} params.walletAddress - The wallet address URL
 * @param {string} params.privateKey - The private key
 * @param {string} params.keyId - The key ID
 * @returns {Promise<Object>} Grant details or error information
 */
export async function createOutgoingGrant({ walletAddress, privateKey, keyId, accessToken, paymentId, quote }) {
    const nonce = randomUUID();

    try {
        const client = await createAuthenticatedClient({
            walletAddressUrl: walletAddress,
            privateKey: privateKey,
            keyId: keyId,
        });

        const walletAddressInfo = await client.walletAddress.get({
            url: walletAddress,
        });

        const grant = await client.grant.request(
            {
                url: walletAddressInfo.authServer,
            },
            {
                access_token: {
                    access: [
                        {
                            identifier: walletAddressInfo.id,
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
                        uri: `http://localhost:5600/continuegrant?nonce=${nonce}`,
                        nonce: nonce,
                    },
                },
            }
        );

        if (!isPendingGrant(grant)) {
            throw new Error("Expected interactive grant");
        }

        console.log("NONCE:", nonce);
        console.log("Interaction URL:", grant.interact.redirect);

        return {
            success: true,
            grant: grant,
            nonce: nonce,
            interactionUrl: grant.interact.redirect
        };

    } catch (error) {
        console.error("Grant Error:", error.response?.body || error.message);
        return {
            success: false,
            error: error.response?.body || error.message,
            nonce: nonce
        };
    }
}

/**
 * Wrapper function to handle outgoing grant creation
 * @param {string} walletAddress - The wallet address URL
 * @param {string} privateKey - The private key
 * @param {string} keyId - The key ID
 * @returns {Promise<Object>} Result object with grant details or error
 */
export async function outgoingGrantPromise(walletAddress, privateKey, keyId, accessToken, paymentId, quote) {
    try {
        const params = {
            walletAddress,
            privateKey,
            keyId,
            accessToken,
            paymentId,
            quote
        };

        const result = await createOutgoingGrant(params);
        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to create outgoing grant'
        };
    }
}