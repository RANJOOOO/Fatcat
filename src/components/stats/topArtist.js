import React, { useState, useEffect } from "react";
import profile from "../../assets/images/artwork-example-2.png";
import userProfile from "../../assets/images/face-2.png";
import verified from "../../assets/icon/verified-artist-small.svg";
import drop from "../../assets/icon/chevron-down-extra-small.svg";
import { Offcanvas } from "react-bootstrap";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";
import flr from "../../assets/icon/FLR.svg";
import ArtistPopUp from "../shared/artistpopup";

const TopArtist = (props) => {
  const [artist, setArtist] = useState(props.artist || []);

  useEffect(() => {
    console.log("top artist", props.artist);
    setArtist(props.artist);
  }, [props.artist]);

  // const data = [
  //   {
  //     id: 1,
  //     name: "Araminta",
  //     volume: 15,
  //     worksSold: 456,
  //     highestSale: 8710,
  //     avgPrice: 1157,
  //     join: "Feb, 2023",
  //     type: "SGB",
  //   },
  //   {
  //     id: 2,
  //     name: "Waverly",
  //     volume: 3.9,
  //     worksSold: 456,
  //     highestSale: 8710,
  //     avgPrice: 1157,
  //     join: "dec, 2023",
  //     type: "FLR",
  //   },
  //   {
  //     id: 3,
  //     name: "Lavender",
  //     volume: 135,
  //     worksSold: 456,
  //     highestSale: 8710,
  //     avgPrice: 1157,
  //     join: "march, 2023",
  //     type: "SGB",
  //   },
  //   {
  //     id: 4,
  //     name: "Bancroft",
  //     volume: 139105,
  //     worksSold: 456,
  //     highestSale: 8710,
  //     avgPrice: 1157,
  //     join: "jan, 2023",
  //     type: "USD",
  //   },
  //   {
  //     id: 5,
  //     name: "Elizabeth",
  //     volume: 4.9,
  //     worksSold: 123,
  //     highestSale: 5432,
  //     avgPrice: 8764,
  //     join: "Dec, 2019",
  //     type: "FLR",
  //   },
  // ];
  const [priceShow, setPriceShow] = useState(false);
  const [activeArtistValue, setActivePrice] = useState("volume");

  const artistHandleShow = () => setPriceShow(true);
  const artistHandleHide = () => setPriceShow(false);
  const artistOptions = [
    { value: "volume", label: "Volume" },
    { value: "works sold", label: "Works sold" },
    { value: "highest sale", label: "Highest sale" },
    { value: "average price", label: "Average price" },
    { value: "joined", label: "Joined" },
  ];
  const handleIArtistTick = (tick) => {
    setActivePrice(tick);
    artistHandleHide();
  };

  // const filteredCollectionData =
  //   props.currencyFilter === "All"
  //     ? data
  //     : data.filter((item) => item.type === props.currencyFilter);
  return (
    <>
      <div className="stat-content-wrapper">
        <div className="stats-table">
          <div className="v-center stats-table-head">
            {/* id */}
            <div className="c1 hide-on-tablet">
              <label className="small">#</label>
            </div>

            {/* artist */}
            <div className="c2 hide-on-tablet ">
              <label className="small">ARTIST</label>
            </div>
            {/* volume */}
            {/* <div className="c3 hide-on-tablet ">
              <label className="small">VOLUME</label>
            </div> */}

            {/* work sold */}
            <div className="c4 hide-on-tablet ">
              <label className="small"> works sold</label>
            </div>
            {/* highest sale */}
            <div className="c5 hide-on-tablet ">
              <label className="small"> highest sale</label>
            </div>

            {/* average sale */}
            <div className="c6 hide-on-tablet ">
              <label className="small"> average sale</label>
            </div>

            {/* join */}
            <div className="c7 hide-on-tablet text-end">
              <label className="small"> joined</label>
            </div>

            {/* Mobile column content */}
            <div className="d-flex  w-100 hide-on-desktop2">
              <div className="d-flex  w-50 ">
                <div className="c1">
                  <label className="small">#</label>
                </div>
                <div className="">
                  <label className="small"> artist</label>
                </div>
              </div>
              <div className=" w-50 v-center justify-content-end">
                {/* <label className="small text-black"> {prop.head7}</label> */}
                <label
                  className="small text-black no-text-transform"
                  onClick={artistHandleShow}
                >
                  {/* {activeArtistValue} */}
                  {
                    artistOptions.find(
                      (option) => option.value === activeArtistValue
                    )?.label
                  }
                </label>
                <img src={drop} alt="" />
              </div>
            </div>
          </div>
          <div className="stats-table-body ">
            {artist.map((item, index) => {
              return (
                <div className="stats-table-row   v-center" key={index}>
                  {/* id */}
                  <div className="c1">
                    <label className="text-black ">{index + 1}</label>
                  </div>

                  {/* profile */}
                  <div className="c2 pointer">
                    <div className="profile show-artist-popup">
                      <img
                        src={item?.image ? item?.image : profile}
                        alt="profile"
                        className="profile-img rounded-circle"
                      />
                      <label className="text-black no-text-transform mx-2 pointer  ">
                        {item?.data?.name}
                      </label>
                      <img src={verified} alt="verified" className="verified" />
                      <ArtistPopUp
                        userProfile={item?.image ? item?.image : profile}
                        artistName={item?.userName}
                        verified={verified}
                        left="-50px"
                        top="-200px"
                      />
                    </div>
                  </div>

                  {/* volume */}
                  {/* <div
                    className={`c3 ${
                      activeArtistValue === "volume"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    {/* <label className="text-black ">${item.volume}</label> */}

                  {/* {item.type === "SGB" ? (
                      <label className="text-black v-center">
                        <span className="mx-2">{item.volume}M</span>
                      </label>
                    ) : item.type === "FLR" ? (
                      <label className="text-black v-center">
                        <img src={flr} alt="flr" className="hide-on-mobile" />
                        <span className="mx-2">{item.volume}K</span>
                        FLR
                      </label>
                    ) : item.type === "USD" ? (
                      <label className="text-black v-center">
                        <span className="mx-2">${item.volume}</span>
                      </label>
                    ) : (
                      <></>
                    )}
                  </div>  */}

                  {/* work sold */}
                  <div
                    className={`c4 ${
                      activeArtistValue === "works sold"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    <label className="text-black "> {item.salesCount} </label>
                  </div>

                  {/* highest sale */}
                  <div
                    className={`c5 ${
                      activeArtistValue === "highest sale"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    {/* <label className="text-black "> ${item.highestSale}</label> */}
                    <label className="text-black v-center">
                      <span className="mx-2">{item.higherSale}</span>
                    </label>
                    {/* {item.type === "SGB" ? (
                      <label className="text-black v-center">
                        <span className="mx-2">{item.higherSale}K</span>
                      </label>
                    ) : item.type === "FLR" ? (
                      <label className="text-black v-center">
                        <img src={flr} alt="flr" />
                        <span className="mx-2">{item.higherSale}K</span>
                        FLR
                      </label>
                    ) : item.type === "USD" ? (
                      <label className="text-black v-center">
                        <span className="mx-2">${item.highestSale}</span>
                      </label>
                    ) : (
                      <></>
                    )} */}
                  </div>

                  {/* Average Price */}
                  <div
                    className={`c6 ${
                      activeArtistValue === "average price"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    <label className="text-black v-center">
                      <span className="mx-2">{item?.AverageSale}</span>
                    </label>
                    {/* {item.type === "SGB" ? (
                      <label className="text-black v-center">
                        <span className="mx-2">${item.AverageSale}</span>
                      </label>
                    ) : item.type === "FLR" ? (
                      <label className="text-black v-center">
                        <img src={flr} alt="flr" />
                        <span className="mx-2">{item.AverageSale}K</span>
                        FLR
                      </label>
                    ) : item.type === "USD" ? (
                      <label className="text-black v-center">
                        <span className="mx-2">${item.AverageSale}</span>
                      </label>
                    ) : (
                      <></>
                    )} */}
                  </div>

                  {/* Joined */}
                  <div
                    className={`c7 text-end ${
                      activeArtistValue === "joined"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    <label className="text-black text-lowercase">
                      {" "}
                      {new Date(item?.data?.creationTime).toDateString()}
                    </label>
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

export default TopArtist;
