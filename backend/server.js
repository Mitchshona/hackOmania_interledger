import express from "express";
// server.js
import 'dotenv/config';  // FIRST IMPORT
import { outGrant } from "./config/createoutgrant.js";
const app = express();
const PORT = 5600;

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.post('/api/userpost', (req, res)=>{
    const { image, uid } = req.body;
    res.status(200);
    res.send("Welcome to root URL of Server");
});

// Add to your Express server setup
app.post('/createoutgrant', async (req, res) => {
    const oGrant = await outGrant;
    res.status(200);
    res.send(oGrant.continue);
});
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else { 
        console.log("Error occurred, server can't start", error);
    }
});
