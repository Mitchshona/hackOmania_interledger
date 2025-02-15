// createOutgoingPayment.js
import { createAuthenticatedClient } from "@interledger/open-payments";
import { readFileSync } from 'fs';

/**
 * Creates an outgoing payment using Open Payments client
 * @param {Object} params
 * @param {string} params.walletAddress - Wallet address URL
 * @param {string} params.privateKey - Path to private key file
 * @param {string} params.keyId - Authentication key ID
 * @param {string} params.accessToken - Outgoing payment access token
 * @param {string} params.quoteUrl - Valid quote URL
 * @returns {Promise<Object>} Payment creation result
 */
export async function createOutgoingPayment({ walletAddress, privateKey, keyId, accessToken, quote}) {
  try {
    // Validate required parameters
    if (!walletAddress || !privateKey || !keyId || !accessToken || !quote) {
      throw new Error("Missing required parameters");
    }

    // // Load private key
    // const privateKey = readFileSync(privateKeyPath, 'utf8');
    console.log(walletAddress, privateKey, keyId, accessToken, quote);
    // Create authenticated client
    const client = await createAuthenticatedClient({
      walletAddressUrl: walletAddress,
      privateKey,
      keyId
    });

    // Create outgoing payment
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: new URL(walletAddress).origin,
        accessToken
      },
      {
        walletAddress,
        quoteId: quote.id
      }
    );

    return {
      success: true,
      paymentUrl: outgoingPayment.id,
      details: outgoingPayment
    };

  } catch (error) {
    console.error("Payment creation failed:", error.response?.body || error.message);
    return {
      success: false,
      error: error.response?.body || error.message,
      code: error.response?.status || 500
    };
  }
}
