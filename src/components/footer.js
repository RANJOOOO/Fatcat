import React from "react";
import "../style/main.scss";
import logo from "../assets/icon/logo.svg";
import star from "../assets/images/star35.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* It contains widgets links */}
      <section className="footer">
        <div className="footer-content">
          <div className="left">
            <div className="site-logo">
              <div>
                <img src={star} alt="logo" className="hide-on-desktop" />
              </div>
              <div>
                <img src={logo} alt="logo" />
              </div>
            </div>
            <h4>© 2023 The Catalyst</h4>
          </div>
          <div className="center f-links">
            <a href="/explore">Explore Art</a>
            <a href="/allcollections">Explore Drops</a>
            <a href="/blogs">Spotlight</a>
            <Link to="/report-issue">Report Content</Link>
          </div>
          <div className="right f-links">
            <a href="#">Cooking preferences </a>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and Conditions</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
