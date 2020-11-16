const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const MongoClient = require('mongodb').MongoClient;
require("dotenv/config");
const fs = require('fs');

const stripe = require("stripe")(process.env.SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET_KEY;

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE);

// App Initialization
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
}

app.post('/webhook', cors(corsOptions), function(request, response) {
  const sig = request.headers['stripe-signature'];
  const body = request.body;

  let event;

  try {
    event = request.body;
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  let intent = null;
  switch (event['type']) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log(intent.charges.data[0])
      console.log(intent.charges.data[0].billing_details.name)
      console.log(intent.charges.data[0].billing_details.email)
      base('Customers').create([
        {
          "fields": {
            "Name": intent.charges.data[0].billing_details.name,
            "Email": intent.charges.data[0].billing_details.email
          }
        },
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      });
      break;
  }
  response.sendStatus(200);
});

app.get("/inventory/:name", cors(corsOptions), async (req, res) =>{
  try{
    const info = req.params.name
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@cluster0.flka5.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
      const col = client.db(process.env.MONGODB_DBNAME).collection("merch-inventory");
      const queryResult = col.find( { "name": info } ).toArray((err, result) => {
        if (err) throw err;
        var inventory = new Object;
        result.forEach((product) => {
          inventory[product.size] = product.availability;
        });

        res.status(200).json(inventory);
        client.close();
      });
    });
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// PORT, Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));
