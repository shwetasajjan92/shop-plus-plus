import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartItems.css";
import remove_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import Payment from "../../Components/Payment/Payment";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const order = all_product
    .filter((e) => cartItems[e.id] > 0)
    .map((e) => ({ ...e, quantity: cartItems[e.id] }));

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
                  <p>${e.new_price}</p>
                  <button className="cartitems-quantity">
                    {cartItems[e.id]}
                  </button>
                  <p>${e.new_price * cartItems[e.id]}</p>
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
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
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

            {localStorage.getItem("auth-token") ? (
              <Payment order={order} address={address} />
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  window.scrollTo(0, 0);
                }}
              >
                LOGIN TO PROCEED
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
