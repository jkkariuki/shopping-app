const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const chkoutSuccess = "https://shopping-app-jk.herokuapp.com";
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();

app.use(cors());
app.use(
  //   express.static(path.join(__dirname, "..", "client", "shopapp", "build"))
  express.static(path.resolve(__dirname + "/public"))

  //   express.static(path.join(__dirname + "path"))
);

app.use(express.json());

app.get("*", (req, res) => {
  res.sendFile(
    // path.resolve(__dirname, "..", "client", "shopapp", "build", "index.html")
    path.resolve(__dirname, "public", "index.html")
  );
});

app.post("/checkout", async (req, res) => {
  console.log("!!!!!!!!STRIPE KEY: " + process.env.STRIPE_KEY);
  console.log(req.body);
  const items = req.body.items;
  console.log(items);
  let lineItems = [];
  items.map((item) => {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.thumbnail],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://shopping-app-jk.herokuapp.com/success",
    cancel_url: "https://shopping-app-jk.herokuapp.com/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(PORT, () => console.log("listening on port 5000"));
