# SageMontrealBackend

Install dependencies using npm:
### `yarn install`

Create `.env` with:
`SECRET_KEY=<PUT_YOUR_KEY_HERE>` and 
`ENDPOINT_SECRET_KEY=<PUT_YOUR_KEY_HERE>`
`ALLOWED_ORGIN="http://localhost:8000"`

Install the Stripe CLI from (https://github.com/stripe/stripe-cli#installation) to install which we'll use for webhook testing.

After the installation has finished, authenticate the CLI with your Stripe account:
    stripe login --project-name=stripe-payments

To start the webhook forwarding run:
    stripe listen --project-name=stripe-payments --forward-to http://localhost:5000/webhook

This will output a Webhook Secret Key in your terminal. Copy this Key into the placeholder in `.env`

Server is on port 5000.


