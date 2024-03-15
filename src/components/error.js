import React from "react";
import sadFace from "../assets/icon/sad-face.svg";
import Button from "./button";
import { useNavigate } from "react-router-dom";
const Error = ({ heading, errorMessage, buttonText, navPath }) => {
  const navigate = useNavigate();
  const move = () => {
    navigate(navPath);
  };
  return (
    <div>
      <section className="error site-container">
        <img src={sadFace} alt="sadFace" />
        <h1 className="w-100 text-center">{heading}</h1>

        <p className="text-center">{errorMessage}</p>

        <Button
          text={buttonText}
          className="btn-prime btn-primary br-30"
          width="218px"
          height="50px"
          onClick={move}
        ></Button>
      </section>
    </div>
  );
};

export default Error;
