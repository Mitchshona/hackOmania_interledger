// createdebitquote.js
import { createAuthenticatedClient } from "@interledger/open-payments";
import { incomingPaymentPromise } from './createinpay.js';
import dotenv from 'dotenv';

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

// Export the quote creation process as a promise
export const quotePromise = (async () => {
  try {
    const { paymentId, accessToken } = await incomingPaymentPromise;
    
    console.log("PAYMENT_ID =", paymentId);
    console.log("INCOMING_PAYMENT_ACCESS_TOKEN =", accessToken);

    const client = await createAuthenticatedClient({
      walletAddressUrl: WALLET_ADDRESS,
      privateKey: PRIVATE_KEY_PATH,
      keyId: KEY_ID,
    });

    const walletAddress = await client.walletAddress.get({
      url: WALLET_ADDRESS,
    });

    const quote = await client.quote.create(
      {
        url: new URL(WALLET_ADDRESS).origin,
        accessToken,
      },
      {
        method: "ilp",
        walletAddress: WALLET_ADDRESS,
        receiver: paymentId,
        debitAmount: {
          value: "10",
          assetCode: walletAddress.assetCode,
          assetScale: walletAddress.assetScale,
        },
      }
    );

    console.log("QUOTE_URL =", quote.id);
    return quote;

  } catch (error) {
    console.error("Quote Error:", error.response?.body || error.message);
    process.exit(1);
  }
})();

