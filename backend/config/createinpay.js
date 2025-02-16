import { createAuthenticatedClient } from "@interledger/open-payments";

/**
 * Creates an incoming payment using the Open Payments client
 * @param {Object} params - Payment parameters
 * @param {string} params.walletAddress - The wallet address URL
 * @param {string} params.privateKey - The private key
 * @param {string} params.keyId - The key ID
 * @param {string} params.accessToken - The access token
 * @param {string} params.amount - The payment amount
 * @returns {Promise<Object>} Payment details including ID and access token
 */
export async function createIncomingPayment({ walletAddress, privateKey, keyId, accessToken, amount }) {
  try {
    const client = await createAuthenticatedClient({
      walletAddressUrl: walletAddress,
      privateKey: privateKey,
      keyId: keyId,
    });

    const payment = await client.incomingPayment.create(
      {
        url: new URL(walletAddress).origin,
        accessToken,
      },
      {
        walletAddress: walletAddress,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      }
    );

    console.log("INCOMING PAYMENT URL:", payment.id);
    console.log("Access Token:", accessToken);

    return {
      success: true,
      paymentId: payment.id,
      accessToken: accessToken
    };

  } catch (error) {
    console.error("Payment Error:", error.response?.body || error.message);
    return {
      success: true,
      error: error.response?.body || error.message
    };
  }
}

/**
 * Wrapper function to handle incoming payment creation
 * @param {string} walletAddress - The wallet address URL
 * @param {string} privateKey - The private key
 * @param {string} keyId - The key ID
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} Result object with payment details or error
 */
export async function incomingPaymentPromise(walletAddress, privateKey, keyId, accessToken) {
  try {
    // Create proper params object
    const params = {
      walletAddress,
      privateKey,
      keyId,
      accessToken
    };

    const result = await createIncomingPayment(params);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create incoming payment'
    };
  }
}