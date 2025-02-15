import {
  createAuthenticatedClient,
  isPendingGrant,
} from "@interledger/open-payments";
import dotenv from 'dotenv';

dotenv.config();

// Initialize client
const clientPromise = createAuthenticatedClient({
  walletAddressUrl: WALLET_ADDRESS,
  privateKey: PRIVATE_KEY_PATH,
  keyId: KEY_ID,
});

// Get wallet address
const walletAddressPromise = clientPromise.then(client => 
  client.walletAddress.get({ url: WALLET_ADDRESS })
);

// Create and export grant promise
export const grantPromise = walletAddressPromise.then(async walletAddress => {
  try {
    const client = await clientPromise;
    const grant = await client.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [{
            type: "incoming-payment",
            actions: ["list", "read", "read-all", "complete", "create"],
          },
          {
            type: "quote",
            actions: ["create", "read"]
          }],
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
      walletAddress: WALLET_ADDRESS,
      privateKeyPath: PRIVATE_KEY_PATH,
      keyId: KEY_ID,
      grant: grant,
      continue: true
    };

    // Log for debugging
    console.log("Grant successfully initialized:");
    console.log("Access Token:", grant.access_token.value);
    console.log("Manage URL:", grant.access_token.manage);
    console.log("Wallet Address:", WALLET_ADDRESS);
    console.log("Key ID:", KEY_ID);

    return grantData;

  } catch (error) {
    console.error("Grant initialization failed:");
    console.error("Error:", error.response?.body || error.message);
    console.error("Environment variables status:", {
      WALLET_ADDRESS: !!WALLET_ADDRESS,
      PRIVATE_KEY_PATH: !!PRIVATE_KEY_PATH,
      KEY_ID: !!KEY_ID
    });

    // Return error object instead of exiting
    return {
      error: true,
      message: error.response?.body || error.message,
      continue: false,
      environmentStatus: {
        WALLET_ADDRESS: !!WALLET_ADDRESS,
        PRIVATE_KEY_PATH: !!PRIVATE_KEY_PATH,
        KEY_ID: !!KEY_ID
      }
    };
  }
});

// Export both promise and resolved grant
export const grant = grantPromise;

// Export environment variables for use in other modules
export const config = {
  WALLET_ADDRESS,
  PRIVATE_KEY_PATH,
  KEY_ID
};