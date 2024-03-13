import React from "react";

const NotFound = () => {
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
    <div className="payment-failure-box">
      <h2 style={style}>Payment Failure</h2>
    </div>
  );
};

export default NotFound;
