import {
  createAuthenticatedClient,
  isPendingGrant,
} from "@interledger/open-payments";

/**
 * Initialize and configure Open Payments client with grant authorization
 * @param {string} walletAddress - The wallet address URL
 * @param {string} privateKey - The private key
 * @param {string} keyId - The key ID
 * @returns {Promise} Promise that resolves to either grant data or error object
 */
export async function initializeOpenPaymentsClient(walletAddress, privateKey, keyId) {
  // Initialize client
  const clientPromise = createAuthenticatedClient({
    walletAddressUrl: walletAddress,
    privateKey: privateKey,
    keyId: keyId,
  });

  try {
    const client = await clientPromise;
    const walletAddressInfo = await client.walletAddress.get({ url: walletAddress });

    const grant = await client.grant.request(
      { url: walletAddressInfo.authServer },
      {
        access_token: {
          access: [
            {
              type: "incoming-payment",
              actions: ["list", "read", "read-all", "complete", "create"],
            },
            {
              type: "quote",
              actions: ["create", "read"]
            }
          ],
        },
      }
    );

    if (isPendingGrant(grant)) {
      throw new Error("Expected non-interactive grant");
    }

    // Create response object with all relevant data
    const grantData = {
      accessToken: grant.access_token.value,
      manageUrl: grant.access_token.manage,
      walletAddress: walletAddress,
      privateKey: privateKey,
      keyId: keyId,
      grant: grant,
      continue: true
    };

    // Log for debugging
    console.log("Grant successfully initialized:");
    console.log("Access Token:", grant.access_token.value);
    console.log("Manage URL:", grant.access_token.manage);
    console.log("Wallet Address:", walletAddress);
    console.log("Key ID:", keyId);

    return grantData;

  } catch (error) {
    console.error("Grant initialization failed:");
    console.error("Error:", error.response?.body || error.message);
    console.error("Parameters status:", {
      walletAddress: !!walletAddress,
      privateKey: !!privateKey,
      keyId: !!keyId
    });

    // Return error object
    return {
      error: true,
      message: error.response?.body || error.message,
      continue: false,
      parametersStatus: {
        walletAddress: !!walletAddress,
        privateKey: !!privateKey,
        keyId: !!keyId
      }
    };
  }
}

// Export a function to get the grant data
export async function grantPromise(walletAddress, privateKey, keyId) {
  try {
    const grantData = await initializeOpenPaymentsClient(walletAddress, privateKey, keyId);
    return {
      success: true,
      grantData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to initialize grant'
    };
  }
}