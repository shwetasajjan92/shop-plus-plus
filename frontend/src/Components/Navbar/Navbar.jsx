import React, { useContext, useRef } from "react";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";

const Navbar = () => {
  const [menu, setMenu] = useState(null);
  const { getTotalCartItems } = useContext(ShopContext);
  const style = { textDecoration: "none" };
  const menuRef = useRef();
  const navigate = useNavigate();
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <div className="navbar">
      <div className="nav-logo" onClick={handleLogoClick}>
        <img src={logo} alt="" />
        <p>ShopPlusPlus</p>
      </div>
      <img
        src={nav_dropdown}
        className="nav-drop"
        onClick={dropdown_toggle}
        alt=""
        width="30px"
      />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={style} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("men")}>
          <Link style={style} to="/men">
            Men
          </Link>
          {menu === "men" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("women")}>
          <Link style={style} to="/women">
            Women
          </Link>
          {menu === "women" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link style={style} to="/kids">
            Kids
          </Link>
          {menu === "kids" ? <hr /> : <></>}
        </li>

        {/* <li>Shop </li>
        <li>Men </li>
        <li>Women </li>
        <li>Kids</li> */}
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="" />
        </Link>

        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
