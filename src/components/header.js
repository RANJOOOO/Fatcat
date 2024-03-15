import React from "react";
import backArrow from "../assets/icon/arrow-left.svg";
import { useNavigate } from "react-router-dom";
const Header = (props) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="header2 ">
        {/* To navigate one step back */}
        <img
          src={backArrow}
          alt="backArrow"
          className="pointer"
          onClick={(e) => navigate(-1)}
        />
        <h6 className="fw-normal w-100 text-center">{props.head}</h6>
      </div>
    </div>
  );
};

export default Header;
