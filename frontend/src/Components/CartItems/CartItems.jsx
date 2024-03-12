import React, { useContext, useState } from "react";
import "./CartItems.css";
import remove_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { loadStripe } from "@stripe/stripe-js";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);
  // const order = all_product.filter((e) => {
  //   if (cartItems[e] > 0) {
  //     e.quantity = cartItems[e.id];
  //     return e;
  //   }
  // });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51OtWHKSAc6aIc4xETrAoABKeyPSVlAFAAlqhN7vOMQs7TKyvvDPMxizCUQXtYPXrZ1cpJbVLOjqHJwBBKgQtEewz00RLpTDqhU"
    );
    const body = {
      products: cartItems,
    };

    const response = await fetch(
      "http://localhost:4000/createCheckoutSession",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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

  return (
    <div>
      <div className="cartitems">
        <div className="cartitems-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            return (
              <div>
                <div className="cartitems-format-main cartitems-format">
                  <img
                    className="cartitems-product-icon"
                    src={e.image}
                    alt=""
                  />
                  <p className="cartitems-product-title">{e.name}</p>
                  <p>₹{e.new_price}</p>
                  <button className="cartitems-quantity">
                    {cartItems[e.id]}
                  </button>
                  <p>₹{e.new_price * cartItems[e.id]}</p>
                  <img
                    onClick={() => {
                      removeFromCart(e.id);
                    }}
                    className="cartitems-remove-icon"
                    src={remove_icon}
                    alt=""
                  />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}

        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>₹{getTotalCartAmount()}</h3>
              </div>
            </div>
            <div className="address-form">
              <h2>Add New Address</h2>
              <div>
                <label>Street:</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Pincode:</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button onClick={makePayment}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
