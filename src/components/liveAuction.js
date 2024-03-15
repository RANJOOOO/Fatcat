import { Icon } from "@iconify/react";
import React from "react";
import "../style/main.scss";
import SectionHeader from "./sectionHeader";
import auctioncard from "../assets/images/artwork-example-1.png";
import auctioncard1 from "../assets/images/artwork-example-2.png";
import auctioncard2 from "../assets/images/artwork-example-3.png";
import img5 from "../assets/icon/circleRed.svg";
import userProfile from "../assets/images/face-3.png";
import verified from "../assets/icon/verified-artist-small.svg";

import ArtistPopUp from "./shared/artistpopup";
import { useNavigate } from "react-router-dom";

const LiveAuction = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="live-auction site-container">
        {/* Section Header values getting from props */}
        <SectionHeader
          title="live"
          title2="auction"
          isImage={true}
          img={img5}
        />
        <div className="live-auction-content">
          {/* Using map function to get live auction card data */}
          {auction.map((item, index) => {
            return (
              <div className="auction-card" key={index}>
                <div className="auction-header">
                  <img
                    src={item.img}
                    alt="card image"
                    className="img-100 pointer"
                  />
                  <div className="timer">
                    <p className="body-medium ">
                      20
                      <span>H</span>6<span>M</span>
                      32<span>s</span>
                    </p>
                  </div>
                </div>
                <div className="auction-body position-relative">
                  <p className="position-relative">
                    <span className="hover-underline pointer show-artist-popup">
                      {item.bidder}
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                        left="-30px"
                        top="-215px"
                      />
                    </span>{" "}
                    bidded on
                    <span className="hover-underline pointer">
                      {" "}
                      {item.nft}{" "}
                    </span>{" "}
                    for ${item.bidValue}
                  </p>

                  <label className="small">{item.timeago} hours ago</label>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
// Live auction cards data
const auction = [
  {
    img: auctioncard,
    bidder: "@anonymous_person22",
    nft: "artwork name",
    bidValue: "5,340",
    timeago: "3",
  },
  {
    img: auctioncard1,
    bidder: "@anonymous_person24",
    nft: "artwork name",
    bidValue: "9,340",
    timeago: "10",
  },
  {
    img: auctioncard2,
    bidder: "@anonymous_person62",
    nft: "artwork name",
    bidValue: "5,940",
    timeago: "4",
  },
];
export default LiveAuction;
