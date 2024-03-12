import React, { useState } from "react";
import "./Payment.css";

const Payment = ({ totalAmount, address, onPayment }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    // You can integrate with Stripe or any other payment gateway here
    // For demonstration purpose, I'm assuming a successful payment
    onPayment();
  };

  return (
    <div className="payment-form">
      <h2>Payment Details</h2>
      <div>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Expiry Date:</label>
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </div>
      <div>
        <label>CVV:</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
      </div>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default Payment;
