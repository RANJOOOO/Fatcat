import React, { useEffect, useState } from "react";
import "../style/main.scss";
import { Icon } from "@iconify/react";
import spike65 from "../assets/icon/spiked-circle/black/65px.svg";
import spike35 from "../assets/icon/spiked-circle/black/35px.svg";
import discord from "../assets/icon/discord.svg";
import twitter from "../assets/icon/twitter.svg";
import bannerlarge from "../assets/images/artwork-example-large-1.png";
import heroStar from "../assets/images/hero-star.png";
import spotlight from "../assets/images/spotlight-header.svg";
import spotlight_ from "../assets/images/spotlight-header-mob.svg";
import arrowdown from "../assets/images/arrowdown.svg";
import Cookies from "./Cookies";
import { getFeaturedUser, getSpotlightUser } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";

import Carousel from "react-bootstrap/Carousel";

const Hero = () => {
  const [opacity, setOpacity] = useState(true);
  const [opacity2, setOpacity2] = useState(true);
  const [featuredUser, setFeaturedUser] = useState([]);
  const [spotlightUser, setSpotlightUser] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  // ============ useEffect FUNCTIONS ============
  /* 
        @dev useEffect is used to manage scroll of featured element.
        @param  opacity
    */
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setOpacity(false);
      } else {
        setOpacity(true);
      }

      if (window.scrollY > 600) {
        setOpacity2(false);
      } else {
        setOpacity2(true);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getFeaturedUser();
      const spotlightUser = await getSpotlightUser();
      console.log("User Data", user);
      setFeaturedUser(user);
      console.log("Spotlight User Data", spotlightUser[0]);
      setSpotlightUser(spotlightUser[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let featuredImages = [];
    if (spotlightUser?.spotFeaturedImage1) {
      featuredImages.push({
        image: spotlightUser?.spotFeaturedImage1,
        Name: spotlightUser?.spotFeaturedName1,
      });
    }
    if (spotlightUser?.spotFeaturedImage2) {
      featuredImages.push({
        image: spotlightUser?.spotFeaturedImage2,
        Name: spotlightUser?.spotFeaturedName2,
      });
    }
    if (spotlightUser?.spotFeaturedImage3) {
      featuredImages.push({
        image: spotlightUser?.spotFeaturedImage3,
        Name: spotlightUser?.spotFeaturedName3,
      });
    }
    console.log("featuredImages", featuredImages);
    setFeaturedImages(featuredImages);
  }, [spotlightUser]);

  return (
    <>
      {spotlightUser?.spotActive && (
        <section className="hero">
          <div className="hero-content">
            <div className="top-content">
              <div className="left">
                {/* <h1 className="text-uppercase">
                spotlight <img src={spike65} alt="star" />
              </h1> */}
                <img
                  src={spotlight}
                  alt="spotlight"
                  className="img-fluid desktop-img"
                />
                <img
                  src={spotlight_}
                  alt="spotlight"
                  className="img-fluid d-none mobile-img"
                />
                {/* <h6>@{spotlightUser.spotUsername}</h6> */}
                <h6>
                  {spotlightUser?.spotUsername
                    ? "@" + spotlightUser?.spotUsername
                    : "@ArtistName"}
                </h6>
              </div>

              <div className="right">
                <p className="body-large">Follow</p>
                <Link
                  to={`https://www.twitter.com/${spotlightUser.spotTwitter}`}
                  target="_blank"
                >
                  <img src={twitter} alt="twitter" />
                </Link>
                <Link to={spotlightUser?.spotWebsite} target="_blank">
                  <img src={discord} alt="discord" />
                </Link>
              </div>
            </div>

            <div className="bottom-content">
              <div
                className="left-content overflow-hidden"
              // style={{ maxWidth: "426px" }}
              >
                <Carousel indicators={false} controls={true} touch={true}>
                  {featuredImages.map((item, index) => (
                    <Carousel.Item>
                      <div key={index}>
                        <div className="hero-thumbnail">
                          <img
                            src={item?.image ? item?.image : bannerlarge}
                            alt="banner image"
                            className="img-fluid img-100"
                          />
                          {/* Uncomment the next line if you want to use spotlightUser.spotFeaturedImage3 */}
                          {/* <img src={spotlightUser.spotFeaturedImage3} alt="banner image" className="img-fluid img-100" /> */}
                        </div>
                        <p>
                          <img src={spike35} alt="star" className="img-35" />
                          {item?.Name}
                        </p>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
              {featuredUser?.image && (
                <div
                  className="right-content trans-7"
                  style={{ opacity: opacity ? "1" : "0" }}
                >
                  <p className="body-large ">{featuredUser?.id}</p>
                  <div className="divider "></div>
                  <div className="">
                    <img
                      src={featuredUser?.image}
                      alt="star"
                      className="br-50"
                      style={{
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  </div>
                </div>
              )}
              <img
                className="arrowdown hide-on-desktop"
                src={arrowdown}
                alt="star"
              />
            </div>
          </div>
          <Cookies />
        </section>
      )}
    </>
  );
};

export default Hero;
