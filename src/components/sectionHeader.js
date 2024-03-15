import React from "react";
import arrowAnglrRight from "../assets/icon/arrow-angle-right.svg";
import star from "../assets/icon/spiked-circle/black/45px.svg";
import { Link } from "react-router-dom";

const SectionHeader = (props) => {
  // predefine section header
  return (
    <div>
      <div className="section-header">
        <div className="head-img">
          <img src={star} alt="star" className="img-45" />
        </div>
        <h5 className="section-head">
          {props.isImage ? <img src={props.img} alt="circle" /> : <></>}

          <span>{props.title}</span>
          {props.title2}
        </h5>
        <div className="view-more">
          <Link to={props.link}>
            see more
            <img src={arrowAnglrRight} alt="arrow" className="img-12" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
