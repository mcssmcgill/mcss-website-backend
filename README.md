# MCSS Backend

Install dependencies using npm:
```
npm install
```

Create `.env` with:
```
SECRET_KEY=<PUT_YOUR_KEY_HERE>
ENDPOINT_SECRET_KEY=<PUT_YOUR_KEY_HERE>
ALLOWED_ORGIN=http://localhost:8000
```
## Stripe CLI Setup
Install the Stripe CLI from (https://github.com/stripe/stripe-cli#installation) to install which we'll use for webhook testing.

After the installation has finished, authenticate the CLI with your Stripe account:
```
stripe login --project-name=stripe-payments
```

To start the webhook forwarding run:
```
stripe listen --project-name=stripe-payments --forward-to http://localhost:5000/webhook
```

This will output a webhook key in your terminal. Copy this key into the placeholder in `.env`

Server is on port 5000.


