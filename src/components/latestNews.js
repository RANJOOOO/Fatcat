import React from "react";
// import "./news.scss";
import "../style/main.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import news1 from "../assets/images/artwork-preview-1.png";
import news2 from "../assets/images/artwork-preview-2.png";
import news3 from "../assets/images/artwork-preview-5.png";
import news4 from "../assets/images/artwork-preview-6.png";
import { useNavigate } from "react-router-dom";
import ArtistPopUp from "./shared/artistpopup";
import userProfile from "../assets/images/face-3.png";
import verified from "../assets/icon/verified-artist-small.svg";
const LatestNews = () => {
  // Setting for latest news slider

  const navigate = useNavigate();

  return (
    <>
      <section className="news  ">
        <h5 className="section-head">
          <span>latest</span>
          news
        </h5>
        <div className="news-slider">
          {/* latest News Slider */}
          <Slider {...settings}>
            {latestnews.map((item, index) => {
              return (
                <div>
                  <div className="news-card" key={index}>
                    <div className="news-header">
                      <img
                        src={item.img}
                        alt="card image"
                        className="img-100"
                      />
                    </div>
                    <div className="news-body">
                      <p>
                        <span className="hover-underline pointer show-artist-popup">
                          {item.winner}
                          <ArtistPopUp
                            userProfile={userProfile}
                            verified={verified}
                            left="10px"
                            top="-215px"
                          />
                        </span>{" "}
                        won an auction on{" "}
                        <span
                          className="hover-underline pointer"
                          onClick={() => navigate("/single-artwork")}
                        >
                          {item.content}
                        </span>{" "}
                        with a bid of ${item.bid}
                      </p>
                      <label className="small">{item.time}</label>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>

          {/* <Slider {...settings}>
            <div>
              <div className="news-card">
                <div className="news-header">
                  <img src={news1} alt="card image" className="img-100" />
                </div>
                <div className="news-body">
                  <p>
                    <span className="hover-underline pointer show-artist-popup">
                      @anonymous_person22
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                        left="10px"
                        top="-215px"
                      />
                    </span>{" "}
                    won an auction on{" "}
                    <span
                      className="hover-underline pointer"
                      onClick={() => navigate("/single-artwork")}
                    >
                      In in the light of summer
                    </span>{" "}
                    with a bid of $5,590
                  </p>
                  <label className="small">1 hour ago</label>
                </div>
              </div>
            </div>

            <div>
              <div className="news-card">
                <div className="news-header">
                  <img src={news1} alt="card image" className="img-100" />
                </div>
                <div className="news-body">
                  <p>
                    <span className="hover-underline pointer show-artist-popup">
                      @anonymous_person22
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                        left="10px"
                        top="-215px"
                      />
                    </span>{" "}
                    won an auction on{" "}
                    <span
                      className="hover-underline pointer"
                      onClick={() => navigate("/single-artwork")}
                    >
                      In in the light of summer
                    </span>{" "}
                    with a bid of $5,590
                  </p>
                  <label className="small">1 hour ago</label>
                </div>
              </div>
            </div>

            <div>
              <div className="news-card">
                <div className="news-header">
                  <img src={news1} alt="card image" className="img-100" />
                </div>
                <div className="news-body">
                  <p>
                    <span className="hover-underline pointer show-artist-popup">
                      @anonymous_person22
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                        left="10px"
                        top="-215px"
                      />
                    </span>{" "}
                    won an auction on{" "}
                    <span
                      className="hover-underline pointer"
                      onClick={() => navigate("/single-artwork")}
                    >
                      In in the light of summer
                    </span>{" "}
                    with a bid of $5,590
                  </p>
                  <label className="small">1 hour ago</label>
                </div>
              </div>
            </div>
          </Slider> */}
        </div>
      </section>
    </>
  );
};
var settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerPadding: "0px",
  autoplay: false,
  autoplaySpeed: 3000,
  fade: true,
  // cssEase: "linear",
  responsive: [
    {
      breakpoint: 567,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 787,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

// Latest news data
const latestnews = [
  {
    img: news1,
    winner: "@anonymous_person22",
    content: "In in the light of summer",
    bid: "5,490",
    time: "3 hour ago",
  },
  {
    img: news2,
    winner: "@anonymous_person33",
    content: "In in the light of summer",
    bid: "5,490",
    time: "1 hour ago",
  },
  {
    img: news3,
    winner: "@anonymous_person11",
    content: "In in the light of summer",
    bid: "5,590",
    time: "2 hour ago",
  },
  {
    img: news4,
    winner: "@anonymous_person44",
    content: "In in the light of summer",
    bid: "9,490",
    time: "13 hour ago",
  },
];
export default LatestNews;
