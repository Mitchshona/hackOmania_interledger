import fs from "fs";
const PRIVATE_KEY_PATH = "./private1.key";
// const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
// console.log(privateKey);

const privateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIHq7ZrYjJram8D2TZdEGHHkWH+/5Z/nhV/JssbUaFDWU
-----END PRIVATE KEY-----`;

const encodedKey = Buffer.from(privateKey, "utf8").toString();
console.log(encodedKey);
