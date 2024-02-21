// app/api/route.js

import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
// Handles POST requests to /api
export async function POST(request) {
  // ...
  const data = await request.json();
  const stripe = require("stripe")(
    "sk_test_51OeLf7CqP6v2blZgQwQW2HQtJbNOcCL4hJV5XIHOEZ8kEEpUlIWH1S3D2aXQsGXj3Q5j4allzWrGadKV0iD4816W00fgd131p6"
  );
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "https://localhost:3000/",
      customer_email: data.email,
      line_items: [
        {
          price: "price_1OeSHRCqP6v2blZgoInK9Pn9",
          quantity: 1
        }
      ],
      mode: "subscription"
    });
    console.log(session)
    return NextResponse.json({ url: session.url });
   
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" });
  }
}
