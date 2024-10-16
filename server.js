const stripe = require("stripe")(
  "sk_test_51Q86HnK3NibPcMWvJyzQjPsXLooyBqJp0nYgaYRhjeTCWxafXxAAhzLr7HlParZj7xNl6MdMpaLjbZ2KNY38Ot3I00t08aTTD1"
);
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// app.use(
//   cors({
//     origin: ['https://game-token-store.vercel.app', 'https://cryptpay-frontend-phi.vercel.app', 'http://localhost:3000'],
//   })
// );

app.use(cors({
  origin: "https://cryptpay-frontend-phi.vercel.app",
  methods: ["GET", "POST"],
  credentials: false, // Set this if you are using cookies or session-based authentication
}));


app.use(express.static("public"));
app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
  console.log('req','api request')
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
      success_url: `https://cryptpay-frontend-phi.vercel.app/success?success=true&quantity=${product.qnty}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://cryptpay-frontend-phi.vercel.app/?canceled=true`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }

  res.json({ url: session.url });
});

// Start the server
app.listen(3001, () => console.log("Running on port 3001"));
