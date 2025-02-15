import {
    createAuthenticatedClient,
    isFinalizedGrant,
  } from "@interledger/open-payments";
import { outGrant } from './createoutgrant.js';
import dotenv from 'dotenv';

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const KEY_ID = process.env.KEY_ID;

  // Use in async context
const oGrant = await outGrant;

console.log("Grant continuation token:", oGrant.continue.accessToken);
console.log("Grant continuation URI:", oGrant.continue.uri);
const CONTINUE_ACCESS_TOKEN = oGrant.continue.accessToken;
const CONTINUE_URI = oGrant.continue.uri;

const client = await createAuthenticatedClient({
    walletAddressUrl: WALLET_ADDRESS,
    privateKey: PRIVATE_KEY_PATH,
    keyId: KEY_ID,
  });

const grant = await client.grant.continue(
    {
      accessToken: CONTINUE_ACCESS_TOKEN,
      url: CONTINUE_URI,
    },
    {
      interact_ref: "d03588b3-0c72-405d-afa7-411d8f81cd59",
    },
  );

if (!isFinalizedGrant(grant)) {
    throw new Error("Expected finalized grant. Received non-finalized grant.");
  }

console.log("OUTGOING_PAYMENT_ACCESS_TOKEN =", grant.access_token.value);
  console.log(
    "OUTGOING_PAYMENT_ACCESS_TOKEN_MANAGE_URL =",
    grant.access_token.manage,
  );
  