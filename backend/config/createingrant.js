import {
  createAuthenticatedClient,
  isPendingGrant,
} from "@interledger/open-payments";
import dotenv from 'dotenv';

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

// Initialize client and grant as promises
const clientPromise = createAuthenticatedClient({
  walletAddressUrl: WALLET_ADDRESS,
  privateKey: PRIVATE_KEY_PATH,
  keyId: KEY_ID,
});

const walletAddressPromise = clientPromise.then(client => 
  client.walletAddress.get({ url: WALLET_ADDRESS })
);

export const grantPromise = walletAddressPromise.then(async walletAddress => {
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
          type: "quote",  // Add quote permissions
          actions: ["create", "read"]
        }],
      },
    }
  );

  if (isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // Log values immediately when grant resolves
  console.log("INCOMING_PAYMENT_ACCESS_TOKEN =", grant.access_token.value);
  console.log("INCOMING_PAYMENT_ACCESS_TOKEN_MANAGE_URL =", grant.access_token.manage);

  return {
    accessToken: grant.access_token.value,
    manageUrl: grant.access_token.manage
  };
}).catch(error => {
  console.error("Grant initialization failed:");
  console.error("Error:", error.response?.body || error.message);
  console.error("Environment variables:", {
    WALLET_ADDRESS: !!WALLET_ADDRESS,
    PRIVATE_KEY_PATH: !!PRIVATE_KEY_PATH,
    KEY_ID: !!KEY_ID
  });
  process.exit(1);
});

// Original grant export maintained
export const grant = grantPromise;
  