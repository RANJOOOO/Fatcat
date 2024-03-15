// Banner.jsx
import React from "react";
import close from "../assets/icon/close-small.svg";

const Banner = ({ message, onClose }) => {
  return (
    <div className="banner">
      <p className="banner-message">{message}</p>
      <img
        src={close}
        className="close-button invert1"
        alt="close"
        onClick={onClose}
      />
    </div>
  );
};

export default Banner;
