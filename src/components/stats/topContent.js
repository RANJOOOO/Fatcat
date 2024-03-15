import React, { useState } from "react";
import profile from "../../assets/images/artwork-example-2.png";
import verified from "../../assets/icon/verified-artist-small.svg";
import drop from "../../assets/icon/chevron-down-extra-small.svg";
import { Offcanvas } from "react-bootstrap";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";

const TopContent = (prop) => {
  const data = [
    {
      id: 1,
      name: "Araminta",
      volume: 139105,
      worksSold: 456,
      highestSale: 8710,
      avgPrice: 1157,
      join: "Feb, 2023",
    },
    {
      id: 2,
      name: "Waverly",
      volume: 139105,
      worksSold: 456,
      highestSale: 8710,
      avgPrice: 1157,
      join: "dec, 2023",
    },
    {
      id: 3,
      name: "Lavender",
      volume: 139105,
      worksSold: 456,
      highestSale: 8710,
      avgPrice: 1157,
      join: "march, 2023",
    },
    {
      id: 4,
      name: "Bancroft",
      volume: 139105,
      worksSold: 456,
      highestSale: 8710,
      avgPrice: 1157,
      join: "jan, 2023",
    },
  ];
  const [priceShow, setPriceShow] = useState(false);
  const [activeArtistValue, setActivePrice] = useState("volume");

  const artistHandleShow = () => setPriceShow(true);
  const artistHandleHide = () => setPriceShow(false);
  const artistOptions = [
    { value: "volume", label: "Volume" },
    { value: "work sold", label: "Works sold" },
    { value: "highest sale", label: "Highest sale" },
    { value: "average price", label: "Aveage price" },
    { value: "joined", label: "Joined" },
  ];
  const handleIArtistTick = (tick) => {
    setActivePrice(tick);
    artistHandleHide();
  };
  return (
    <>
      <div className="stat-content-wrapper">
        <div className={`stats-table ${prop.class} `}>
          <div className="v-center stats-table-head">
            <div className="c1 hide-on-mobile">
              <label className="small">#</label>
            </div>
            <div className="c2 hide-on-mobile">
              <label className="small"> {prop.name}</label>
            </div>
            <div className="c3 hide-on-mobile">
              <label className="small">{prop.head3}</label>
            </div>
            <div className="c4 hide-on-mobile">
              <label className="small"> {prop.head4}</label>
            </div>
            <div className="c5 hide-on-mobile">
              <label className="small"> {prop.head5}</label>
            </div>
            <div className="c6 hide-on-mobile">
              <label className="small"> {prop.head6} </label>
            </div>
            <div className="c7 hide-on-mobile">
              <label className="small"> {prop.head7}</label>
            </div>
            <div className="d-flex  w-100 hide-on-desktop">
              <div className="d-flex  w-50">
                <div className="c1">
                  <label className="small">#</label>
                </div>
                <div className="">
                  <label className="small"> {prop.name}</label>
                </div>
              </div>
              <div
                className=" w-50 v-center justify-content-end"
                onClick={artistHandleShow}
              >
                {/* <label className="small text-black"> {prop.head7}</label> */}
                <label className="small text-black">{activeArtistValue}</label>
                <img src={drop} alt="" />
              </div>
            </div>
          </div>
          <div className="stats-table-body ">
            {data.map((item, index) => {
              return (
                <div className="stats-table-row v-center" key={index}>
                  {/* id */}
                  <div className="c1">
                    <label className="text-black ">{item.id}</label>
                  </div>

                  {/* profile */}
                  <div className="c2 pointer">
                    <div className="profile">
                      <img
                        src={profile}
                        alt="profile"
                        className="profile-img rounded-circle"
                      />
                      <label className="text-black no-text-transform mx-2 pointer">
                        {item.name}
                      </label>
                      <img src={verified} alt="verified" className="verified" />
                    </div>
                  </div>

                  {/* volume */}
                  <div className="c3 item-hide">
                    <label className="text-black ">${item.volume}</label>
                  </div>

                  {/* work sold */}
                  <div className="c4 item-hide">
                    <label className="text-black "> {item.worksSold} </label>
                  </div>

                  {/* highest sale */}
                  <div className="c5 item-hide">
                    <label className="text-black "> ${item.highestSale}</label>
                  </div>

                  {/* Average Price */}
                  <div className="c6 item-show">
                    <label className="text-black "> ${item.avgPrice}</label>
                  </div>

                  {/* Joined */}
                  <div className="c7 item-hide">
                    <label className="text-black "> {item.join}</label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Offcanvas
        show={priceShow}
        onHide={artistHandleHide}
        placement="bottom"
        className="sub-menu-offcanvas"
      >
        <div className="more-menu-sm price-more-menu">
          <div className="menu-head">
            <label className="text-black">change</label>
            <div className="close-btn cursor-pointer">
              <img
                src={close}
                alt="close"
                className="img-24"
                onClick={artistHandleHide}
              />
            </div>
          </div>

          <div className="share">
            {artistOptions.map((option) => (
              <label
                key={option.value}
                className={`no-text-transform h-64 text-black ${
                  activeArtistValue === option.value ? "fw-bold" : "fw-normal"
                }`}
                onClick={() => handleIArtistTick(option.value)}
              >
                {option.label}
                <img
                  src={tick}
                  alt="tick"
                  className={`${
                    activeArtistValue === option.value
                      ? "active opacity-100"
                      : "opacity-0"
                  }`}
                />
              </label>
            ))}
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default TopContent;
