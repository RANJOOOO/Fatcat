import React from "react";
import circle65 from "../assets/icon/spiked-circle/black/65px.svg";
import "../style/main.scss";
import Button from "./button";
import { useNavigate } from "react-router-dom";
const StartCollecting = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="collecting site-container">
        <div className="collection-content">
          <div className="left-content">
            <Button
              className="btn-prime btn-primary"
              text="Start Collecting"
              onClick={() => navigate("/explore")}
            />
          </div>
          <div className="right-content">
            <h1>
              <span>Start</span> <br />
              collecting
            </h1>
            <p>
              <span>The Catalyst</span> showcases the exceptional art in the
              space. We meticulously hand-select only the finest artists across
              the physical and digital world.
            </p>
          </div>
        </div>
        <div className="collection-footer">
          <p className="body-large">
            <img src={circle65} alt="circle" className="img-65 " />
            explore, collect, create
          </p>
        </div>
      </section>
    </>
  );
};

export default StartCollecting;
