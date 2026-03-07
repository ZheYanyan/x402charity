# Express.js x402charity Integration Example

This example shows how to integrate automatic micro-donations into an Express.js application using x402charity. Every POST request to your API will automatically trigger a small USDC donation to a charity of your choice.

## Features
- 🎁 Automatic donations on every POST request
- 🔒 No user wallets or crypto knowledge required
- 📊 All donations are on-chain and publicly verifiable
- ⚡ Works with any existing Express.js application
- 💰 Company funds donations from a dedicated wallet

## Prerequisites
1. Node.js 16+
2. A deployed x402charity server (https://github.com/allscale-io/x402charity)
3. A wallet private key with USDC on Base (for funding donations)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `DONATION_PRIVATE_KEY`: Private key of the wallet that funds donations
- `DONATE_ENDPOINT`: URL of your deployed x402charity server
- `CHARITY_WALLET`: Wallet address of the charity receiving donations
- Other charity and donation settings

### 3. Run the server
```bash
npm start
```

The server will start on `http://localhost:3000`

## Usage

### Test donation flow
1. Make a POST request to trigger a donation:
```bash
curl -X POST http://localhost:3000/api/action
```

Response:
```json
{
  "success": true,
  "message": "Action completed! A donation has been made to charity automatically.",
  "donation": {
    "amount": "$0.001",
    "charity": "Give Directly",
    "transaction_hash": "0xabc123def456..."
  }
}
```

2. GET requests won't trigger donations:
```bash
curl http://localhost:3000/api/data
```

## How It Works

1. The `x402charity` middleware automatically intercepts all requests
2. When a POST request is received, it triggers a donation to your configured charity
3. The donation is signed and settled on Base chain via the x402 protocol
4. The transaction hash is returned in the response for verification

## Customization

### Change when donations are triggered
Modify the `shouldDonate` function in `app.js` to control when donations happen:

```js
shouldDonate: (req) => {
  // Donate only on successful POST requests to /api/purchase
  return req.method === 'POST' && req.path === '/api/purchase' && req.statusCode === 200;
}
```

### Change donation amount per endpoint
Use different amounts for different routes:

```js
app.use('/api/premium', x402charity({
  amount: '$0.01', // Higher donation for premium features
  // ... other config
}));

app.use('/api/basic', x402charity({
  amount: '$0.001', // Lower donation for basic features
  // ... other config
}));
```

## Example Use Cases
- **E-commerce**: Donate $0.01 on every order
- **SaaS**: Donate $0.001 on every API call
- **Games**: Donate $0.005 on every in-game purchase
- **Social Platforms**: Donate $0.001 on every post/comment

## License
MIT
