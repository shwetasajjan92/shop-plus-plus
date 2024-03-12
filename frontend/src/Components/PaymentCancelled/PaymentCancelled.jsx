import React from "react";
import "./PaymentCancelled.css";
import red_cross from "../Assets/red-cross.png";

const PaymentCancelled = () => {
  return (
    <div className="payment-cancelled-container">
      <img src={red_cross} alt="Red Cross" className="red-cross-image" />
      <h1>Your payment was cancelled</h1>
      <button className="return-to-home-button">Return to Home</button>
    </div>
  );
};

export default PaymentCancelled;
