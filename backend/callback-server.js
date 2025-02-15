// callback-server.js
import express from 'express';

const app = express();
const PORT = 3344;

app.get('/callback', (req, res) => {
  const interactRef = req.query.interact_ref;
  console.log('💡 Received interact_ref:', interactRef);
  res.send(`<h1>Authorization Complete</h1><p>Interact Ref: ${interactRef}</p>`);
  
  // Store interact_ref temporarily
  process.env.INTERACT_REF = interactRef;
});

app.listen(PORT, () => {
  console.log(`🔌 Callback server running at http://localhost:${PORT}`);
});
