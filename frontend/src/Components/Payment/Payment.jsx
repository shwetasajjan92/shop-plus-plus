import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const Payment = ({ order, address }) => {
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51OtWHKSAc6aIc4xETrAoABKeyPSVlAFAAlqhN7vOMQs7TKyvvDPMxizCUQXtYPXrZ1cpJbVLOjqHJwBBKgQtEewz00RLpTDqhU"
    );

    console.log("Address : ", address);

    const body = {
      products: order,
      address: address,
    };

    const response = await fetch(
      `http://54.146.34.43:3000/createCheckoutSession`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          body,
        }),
      }
    );

    const session = await response.json();
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      console.log(result.error);
    }
  };

  return <button onClick={makePayment}>Check out</button>;
};

export default Payment;
