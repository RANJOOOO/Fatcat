import React from "react";
import "../style/main.scss";
import logo from "../assets/images/logo.png";
import discord from "../assets/icon/discord-white.svg";
import twitter from "../assets/icon/twitter-white.svg";
import star from "../assets/images/star35.png";
import { Link } from "react-router-dom";
const FooterV2 = () => {
  return (
    <div>
      <section className="footer  footerV2 ">
        <div className="footer-content">
          <div className="left">
            <div className="site-logo">
              <div>
                <img src={star} alt="logo" className="invert1" />
                <img src={logo} alt="logo" className="invert1" />
              </div>
            </div>
            <div className="d-flex gap-4 mt-5">
              <img src={discord} alt="logo" />
              <img src={twitter} alt="logo" />
            </div>
          </div>

          <div className="center f-links d-flex  ">
            <label className="small">Community</label>
            <a href="#">Join</a>
            <a href="#">Guidelines</a>
            <a href="#">Discord</a>
            <a href="#">Twitter</a>
          </div>

          <div className="right f-links">
            <label className="small">art</label>
            <a href="/apply">Submit artist profile </a>
            <a href="/explore">Explore art</a>
            <a href="#">Help Center</a>
          </div>

          <div className="right2 f-links">
            <label className="small">legal</label>
            <a href="#">Terms of Service </a>
            <a href="#">Privacy Policy</a>
            <a href="#">Bug Bounty Program</a>
            <a href="#">Report content</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FooterV2;
