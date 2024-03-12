import React from "react";
import "./Navbar.css";
import navlogo from "../../../src/assets/logo.png";
import navProfile from "../../assets/nav-profile.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={navlogo} alt="" width="60px" />
        <span>
          <div className="website">ShopPlusPlus</div>
          <div className="admin">Admin</div>
        </span>
      </div>
      <img src={navProfile} className="nav-profile" alt=""></img>
    </div>
  );
};

export default Navbar;
