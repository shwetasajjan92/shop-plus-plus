import React, { useState, useEffect } from "react";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  let addressString;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/orders", {
          method: "GET",
          headers: {
            Accept: "application/json", // Corrected accept type
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersData = await response.json();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchOrders();
  }, []); // Run once on component mount

  if (orders.length > 0) {
    console.log("........", orders);
    const address = orders[orders.length - 1].address;
    addressString = `${address.street}, ${address.city}, ${address.pincode}, ${address.state} `;
  }

  return (
    <div>
      <div className="cartitems">
        <h3>Last Order</h3>
        <div className="cartitems-format-main">
          <p>Products</p>
          <p>Title</p>

          <p>Quantity</p>
          <p>Price</p>
          <p>Total</p>
        </div>
        <hr />
        {orders.length > 0
          ? orders[orders.length - 1].products.map((item) => (
              <div
                key={item.id}
                className="cartitems-format-main cartitems-format"
              >
                <img
                  className="cartitems-product-icon"
                  src={item.image}
                  alt=""
                />
                <p className="cartitems-product-title">{item.name}</p>
                <button className="cartitems-quantity">{item.quantity}</button>

                <p> ${item.new_price}</p>
                <p>${item.new_price * item.quantity}</p>
              </div>
            ))
          : "No orders"}
      </div>
      {addressString && (
        <div class="address">
          <strong>Delivery Address :</strong> {addressString}
        </div>
      )}
    </div>
  );
};

export default Order;
