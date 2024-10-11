const stripe = require("stripe")(
  "sk_test_51Q86HnK3NibPcMWvJyzQjPsXLooyBqJp0nYgaYRhjeTCWxafXxAAhzLr7HlParZj7xNl6MdMpaLjbZ2KNY38Ot3I00t08aTTD1"
);
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.static("public"));
app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
  const product = req.body;
  console.log("Product :-", product);

  const lineItem = {
    price_data: {
      currency: "usd",
      product_data: {
        name: "Gamecoins",
      },
      unit_amount: parseFloat(product.price) * 100,
    },
    quantity: parseInt(product.qnty),
  };

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      line_items: [lineItem],
      mode: "payment",
      success_url: `${process.env.YOUR_DOMAIN}/success?success=true&quantity=${product.qnty}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.YOUR_DOMAIN}?canceled=true`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }

  res.json({ url: session.url });
});

// Start the server
app.listen(3001, () => console.log("Running on port 3001"));
