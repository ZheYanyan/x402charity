require('dotenv').config();
const express = require('express');
const { x402charity } = require('x402charity/express');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// x402 Charity Middleware: Auto-donate $0.001 on every POST request
app.use(x402charity({
  privateKey: process.env.DONATION_PRIVATE_KEY,
  donateEndpoint: process.env.DONATE_ENDPOINT,
  charity: {
    id: process.env.CHARITY_ID,
    name: process.env.CHARITY_NAME,
    walletAddress: process.env.CHARITY_WALLET,
    chain: process.env.CHARITY_CHAIN,
    description: process.env.CHARITY_DESCRIPTION,
    verified: false,
    x402Endpoint: process.env.DONATE_ENDPOINT,
  },
  amount: process.env.DONATION_AMOUNT || '$0.001',
  // Only donate on POST requests (e.g. form submissions, API writes)
  shouldDonate: (req) => req.method === 'POST',
}));

// Example API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'x402charity Express Example',
    docs: 'POST /api/action to trigger an automatic donation',
    donation_amount: process.env.DONATION_AMOUNT || '$0.001',
    charity: process.env.CHARITY_NAME
  });
});

// Example endpoint that triggers a donation
app.post('/api/action', (req, res) => {
  res.json({
    success: true,
    message: 'Action completed! A donation has been made to charity automatically.',
    donation: {
      amount: process.env.DONATION_AMOUNT || '$0.001',
      charity: process.env.CHARITY_NAME,
      transaction_hash: req.x402Receipt?.txHash || 'N/A (test mode)'
    }
  });
});

// Example endpoint that doesn't trigger donations (GET request)
app.get('/api/data', (req, res) => {
  res.json({
    data: 'This is public data, no donation triggered for GET requests.',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💸 Automatic donations enabled: ${process.env.DONATION_AMOUNT || '$0.001'} per POST request to ${process.env.CHARITY_NAME}`);
  console.log(`🔗 Charity wallet: ${process.env.CHARITY_WALLET} (${process.env.CHARITY_CHAIN})`);
});
