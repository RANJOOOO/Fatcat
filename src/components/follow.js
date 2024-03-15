import React, { useEffect, useState } from "react";
// import "./follow.scss";
import "../style/main.scss";
import { Icon } from "@iconify/react";
import star65 from "../assets/icon/spiked-circle/black/65px.svg";
import heroStar from "../assets/images/hero-star.png";
import arrowAnglrRight from "../assets/icon/arrow-angle-right.svg";

const Follow = () => {
  const [opacity2, setOpacity2] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        setOpacity2(false);
      } else {
        setOpacity2(true);
      }
    });
  }, []);

  return (
    <>
      {/* Follow Us Section */}

      <div className="follow">
        <div className="follow-content">
          <div className="left">
            <h1>
              follow
              <br />
              <span className="italic">us</span>
            </h1>
          </div>
          <div className="center">
            <p>
              <img src={star65} alt="star-65" className="img-65" />
              social media + contacts
            </p>
            <p className="body-large">
              Join our growing community <br /> of art enthusiasts
            </p>
          </div>

          <div className="right ">
            <img
              src={heroStar}
              alt="star"
              className="fixed-star"
              style={{ opacity: opacity2 ? "0" : "0" }}
            />
          </div>
        </div>

        {/* Social Links */}

        <div className="social-follow">
          <h5>TWITTER</h5>
          <div className="view-more">
            <a href="#">
              <img src={arrowAnglrRight} alt="star" />
            </a>
          </div>
        </div>

        <div className="social-follow">
          <h5>discord</h5>
          <div className="view-more">
            <a href="#">
              <img src={arrowAnglrRight} alt="arrow" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Follow;
