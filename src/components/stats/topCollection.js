import React, { useState, useEffect } from "react";
import profile from "../../assets/images/artwork-example-2.png";
import verified from "../../assets/icon/verified-artist-small.svg";
import drop from "../../assets/icon/chevron-down-extra-small.svg";
import { Offcanvas } from "react-bootstrap";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";
import flr from "../../assets/icon/FLR.svg";
import sgb from "../../assets/icon/SGB.svg";

const TopCollection = (props) => {
  const [collectionData, setCollectionData] = useState(
    props?.collectionStats || []
  );

  useEffect(() => {
    console.log("props.collectionStats", props?.collectionStats);
    setCollectionData(props?.collectionStats);
  }, [props?.collectionStats]);

  // const collectionData = [
  //   {
  //     id: 1,
  //     name: "Flyfish ",
  //     volume: 4.9,
  //     change: -2,
  //     floorPrice: 1157,
  //     sale: 12,
  //     type: "FLR",
  //   },
  //   {
  //     id: 2,
  //     name: "CryptoPunks ",
  //     volume: 4.9,
  //     change: 8,
  //     floorPrice: 157,
  //     sale: 49,
  //     type: "FLR",
  //   },
  //   {
  //     id: 3,
  //     name: "CryptoKitties",
  //     volume: 4.9,
  //     change: -2,
  //     floorPrice: 11257,
  //     sale: 1,
  //     type: "SGB",
  //   },
  //   {
  //     id: 4,
  //     name: "Mutant Ape Yacht Club",
  //     volume: 10,
  //     change: 12,
  //     floorPrice: 657,
  //     sale: 19,
  //     type: "SGB",
  //   },
  //   {
  //     id: 5,
  //     name: "Dribblie",
  //     volume: 760,
  //     change: 0,
  //     floorPrice: 1157,
  //     sale: 0,
  //     type: "SGB",
  //   },
  // ];

  const [collectionShow, setCollectionShow] = useState(false);
  const [activeCollectionValue, setActivePrice] = useState("volume");

  const collectionHandleShow = () => setCollectionShow(true);
  const collectionHandleHide = () => setCollectionShow(false);
  const collectionOptions = [
    { value: "volume", label: "VOLUME" },
    { value: "change", label: "change" },
    { value: "floor price", label: "floor price" },
    { value: "sale", label: "sale" },
  ];
  const handleICollectionTick = (tick) => {
    setActivePrice(tick);
    setCollectionShow(false);
  };

  const filteredCollectionData =
    props.currencyFilter === "All"
      ? collectionData
      : props?.currencyFilter === "SGB"
      ? collectionData.filter(
          (item) => item?.data?.data?.selectedNetwork === "Coston"
        )
      : collectionData.filter(
          (item) => item?.data?.data?.selectedNetwork === "Coston2"
        );

  return (
    <>
      <div className="stat-content-wrapper">
        <div className="stats-table collectible-table">
          <div className="v-center stats-table-head">
            {/* id */}
            <div className="c1 hide-on-tablet ">
              <label className="small">#</label>
            </div>

            {/* collection */}
            <div className="c2 hide-on-tablet ">
              <label className="small">collection</label>
            </div>
            {/* volume */}
            <div className="c3 hide-on-tablet ">
              <label className="small">VOLUME</label>
            </div>

            {/* work sold */}
            {/* <div className="c4 hide-on-tablet ">
              <label className="small"> % change</label>
            </div> */}
            {/* highest sale */}
            <div className="c5 hide-on-tablet ">
              <label className="small"> floor price</label>
            </div>

            {/* average sale */}
            <div className="c6 hide-on-tablet text-end">
              <label className="small"> sales</label>
            </div>

            <div className="d-flex  w-100 hide-on-desktop2">
              <div className="d-flex  w-50">
                <div className="c1">
                  <label className="small">#</label>
                </div>
                <div className="">
                  <label className="small"> collection</label>
                </div>
              </div>
              <div className=" w-50 v-center justify-content-end">
                {/* <label className="small text-black"> {prop.head7}</label> */}
                <label
                  className="small text-black"
                  onClick={collectionHandleShow}
                >
                  {activeCollectionValue}
                </label>
                <img src={drop} alt="" />
              </div>
            </div>
          </div>
          <div className="stats-table-body ">
            {/* {collectionData.map((item, index) => { */}
            {filteredCollectionData.map((item, index) => {
              console.log("item", item);
              return (
                <div className="stats-table-row v-center" key={index}>
                  {/* id */}

                  <div className="c1">
                    <label className="text-black ">{index + 1}</label>
                  </div>

                  {/* profile */}
                  <div className="c2 pointer">
                    <div className="profile">
                      <img
                        src={item?.data?.data?.img || profile}
                        alt="profile"
                        className="profile-img rounded-circle"
                      />
                      <label className="text-black no-text-transform mx-2 pointer">
                        {item?.data?.data?.name}
                      </label>
                      <img src={verified} alt="verified" className="verified" />
                    </div>
                  </div>

                  {/* volume */}

                  {/* <div className="c3 hide-on-tablet "> */}
                  <div
                    className={`c3 ${
                      activeCollectionValue === "volume"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    {item?.data?.data?.selectedNetwork === "Coston" ? (
                      <label className="text-black v-center">
                        <img src={sgb} alt="sgb" className="hide-on-mobile" />
                        <span className="mx-2">
                          {item?.SGBvolume[-1] ? item?.SGBvolume[-1] : "---"}
                        </span>
                      </label>
                    ) : (
                      <label className="text-black v-center">
                        <img src={flr} alt="flr" className="hide-on-mobile" />
                        <span className="mx-2">
                          {item?.FLRvolume[-1] ? item?.FLRvolume[-1] : "---"}
                        </span>
                        FLR
                      </label>
                    )}
                  </div>

                  {/* change */}
                  {/* <div
                    className={`c4 ${
                      activeCollectionValue === "change"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    <label
                      className={
                        item.change > 0 ? "text-success " : "text-error"
                      }
                    >
                      {item.change}%
                    </label>
                  </div> */}

                  {/* FLOOR PRICE*/}
                  <div
                    className={`c5 ${
                      activeCollectionValue === "floor price"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    {/* <label className="text-black v-center">
                      <img src={flr} alt="flr" />
                      <span className="mx-2">{item.floorPrice}M</span>
                      FLR
                    </label> */}

                    {item?.data?.data?.selectedNetwork === "Coston" ? (
                      <label className="text-black v-center">
                        <img src={sgb} alt="sgb" className="hide-on-mobile" />
                        <span className="mx-2">
                          {item?.floorPrice[-1] ? item?.floorPrice[-1] : "---"}
                        </span>
                      </label>
                    ) : (
                      <label className="text-black v-center">
                        <img src={flr} alt="flr" />
                        <span className="mx-2">
                          {item?.floorPrice[-1] ? item?.floorPrice[-1] : "---"}
                        </span>
                        FLR
                      </label>
                    )}
                  </div>

                  {/* sale*/}
                  <div
                    className={`c6 text-end ${
                      activeCollectionValue === "sale"
                        ? "item-show"
                        : "hide-on-tablet "
                    }`}
                  >
                    <label className="text-black  "> {item?.saleCount}</label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Offcanvas
        show={collectionShow}
        onHide={collectionHandleHide}
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
                onClick={collectionHandleHide}
              />
            </div>
          </div>

          <div className="share">
            {collectionOptions.map((option) => (
              <label
                key={option.value}
                className={` h-64 text-black ${
                  activeCollectionValue === option.value
                    ? "fw-bold"
                    : "fw-normal"
                }`}
                onClick={() => handleICollectionTick(option.value)}
              >
                {option.label}
                <img
                  src={tick}
                  alt="tick"
                  className={`${
                    activeCollectionValue === option.value
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

export default TopCollection;
