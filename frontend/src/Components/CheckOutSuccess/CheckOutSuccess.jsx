import React, { useContext, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";

const CheckoutSuccess = () => {
  const { clearCart, getTotalCartAmount } = useContext(ShopContext);

  useEffect(() => {
    clearCart();
    getTotalCartAmount();
  }, [clearCart, getTotalCartAmount]);

  const style = {
    width: "200px",
    height: "200px",
    backgroundColor: "lightgreen",
    border: "2px solid green",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "auto",
    marginTop: "30px",
  };

  return (
    <div className="payment-success-box">
      <h2 style={style}>Payment Success</h2>
    </div>
  );
};

export default CheckoutSuccess;
