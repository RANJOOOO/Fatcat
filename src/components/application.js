import React from "react";
import "../style/main.scss";
import { Icon } from "@iconify/react";
import img65 from "../assets/icon/spiked-circle/black/65px.svg";
import arrowAngle from "../assets/icon/arrow-angle-right.svg";
const Application = () => {
  return (
    <>
      {/* In this section Artist apply to showcase work */}

      <section className="application">
        <div className="application-content">
          <p>we hand-select the world's leading artist's</p>
          <h1 className="italic">artist</h1>
          <h2>application</h2>
          <p>
            <img src={img65} alt="circle-65" className="img-65" />
            apply to showcase your work
          </p>
        </div>

        <a href="/apply">
          <div className="application-footer">
            <h4>Apply</h4>
            <div className="view-more">
              <img src={arrowAngle} alt="arrow" />
            </div>
          </div>
        </a>
      </section>
    </>
  );
};

export default Application;
