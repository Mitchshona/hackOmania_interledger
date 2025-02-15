// createdebitquote.js
import { createAuthenticatedClient } from "@interledger/open-payments";

/**
 * Creates a debit quote with parameterized configuration
 * @param {string} walletAddress - Wallet address URL
 * @param {string} privateKeyPath - Path to private key file
 * @param {string} keyId - Authentication key ID
 * @returns {Promise<Object>} Quote creation result
 */
export async function quotePromise(walletAddress, privateKey, keyId, accessToken, paymentId) {
  try {
    if (!walletAddress || !privateKey || !keyId) {
      throw new Error("Missing required parameters");
    }

    // Create authenticated client
    const client = await createAuthenticatedClient({
      walletAddressUrl: walletAddress,
      privateKey: privateKey,
      keyId: keyId,
    });

    // Get wallet details
    const walletDetails = await client.walletAddress.get({ url: walletAddress });
    console.log("Wallet Details:", walletDetails);
    // Create the quote
    const quote = await client.quote.create(
      {
        url: new URL(walletAddress).origin,
        accessToken: accessToken,
      },
      {
        method: "ilp",
        walletAddress: walletAddress,
        receiver: paymentId,
        debitAmount: {
          value: "10", // Default value or make parameter
          assetCode: walletDetails.assetCode,
          assetScale: walletDetails.assetScale,
        },
      }
    );

    return {
      success: true,
      quote: quote,
      paymentId: paymentId,
      accessToken: accessToken
    };

  } catch (error) {
    console.error("Quote Creation Failed:", error);
    return {
      success: false,
      error: error.message,
      details: error.response?.body || null
    };
  }
}

// Example usage:
// const result = await quotePromise(
//   "https://wallet.example/alice",
//   "/path/to/private.key",
//   "key-12345"
// );


