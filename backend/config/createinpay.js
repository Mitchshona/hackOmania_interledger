// createinpay.js
import { createAuthenticatedClient } from "@interledger/open-payments";
import { grantPromise } from './createingrant.js';
import dotenv from 'dotenv';

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

export const incomingPaymentPromise = grantPromise.then(async ({ accessToken }) => {
  try {
    const client = await createAuthenticatedClient({
      walletAddressUrl: WALLET_ADDRESS,
      privateKey: PRIVATE_KEY_PATH,
      keyId: KEY_ID,
    });

    const payment = await client.incomingPayment.create(
      {
        url: new URL(WALLET_ADDRESS).origin,
        accessToken,
      },
      {
        walletAddress: WALLET_ADDRESS,
        incomingAmount: {
          value: "10",
          assetCode: "SGD",
          assetScale: 2,
        },
        expiresAt: new Date(Date.now() + 600_000).toISOString(),
      }
    );

    console.log("INCOMING PAYMENT URL:", payment.id, accessToken);
    return {
        paymentId: payment.id,
        accessToken: accessToken
      };
      
  } catch (error) {
    console.error("Payment Error:", error.response?.body || error.message);
    process.exit(1);
  }
});