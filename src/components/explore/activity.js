import React, { useEffect, useState } from "react";
import "../../style/main.scss";

import loader from "../../assets/icon/loader-small-white.svg";
import loaderLarge from "../../assets/icon/loader-large.svg";
import art5 from "../../assets/images/artwork-example-5.png";
import art1 from "../../assets/images/artwork-example-4.png";
import art2 from "../../assets/images/artwork-example-2.png";
import art3 from "../../assets/images/artwork-example-1.png";
import art4 from "../../assets/images/artwork-example-3.png";
import userProfile from "../../assets/images/face-5.png";
import { Dropdown, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import wFLR from "../../assets/icon/wrapped-FLR.svg";
import dropdown from "../../assets/icon/chevron-down-smallest.svg";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";
import auction from "../../assets/icon/auction.svg";
import listing from "../../assets/icon/listing.svg";
import offer from "../../assets/icon/offer.svg";
import sold from "../../assets/icon/sold.svg";
import transfer from "../../assets/icon/transfer.svg";
import verified from "../../assets/icon/verified-artist-small.svg";
import ArtistPopUp from "../shared/artistpopup";
import { getCollectionHistoryByCollectionId } from "../../firebase/firebase";
import { useLocation } from "react-router-dom";
import { getAllUsers } from "../../firebase/firebase";
import { useAccount } from "wagmi";

const Activity = () => {
  const [show, setShow] = useState(false);
  const { address } = useAccount();
  // click handles
  const handleShow = () => setShow(true);

  const [activeOffer, setActiveOffer] = useState("currentOffer");
  const [priceShow, setPriceShow] = useState(false);
  const [showmore, setShowmore] = useState(false);
  const [showContent, setShowContent] = useState("show more");
  const [selectedItem, setSelectedItem] = useState("All"); // Initial value
  const [data, setData] = useState([]); // Initial value
  const [activity, setActivity] = useState(data); // filtered value

  const location = useLocation();

  useEffect(() => {
    console.log("location", location.pathname.split("/")[2]);
    getCollectionHistoryByCollectionId(location.pathname.split("/")[2]).then(
      (res) => {
        console.log("Activity data:", res);
        setData(res);
        setActivity(res);
      }
    );
  }, []);

  const handleActivityHeading = () => setPriceShow(!priceShow);

  const handleMoreContent = (index) => {
    setShowmore((prevState) => ({
      ...prevState,
      [index]: !prevState[index] || false,
    }));
  };
  const handleItemClick = (value) => {
    setSelectedItem(value);
    if (value === "All") {
      setActivity(data);
    } else {
      setActivity(data.filter((item) => item.action === value));
    }
  };

  const handleIPriceTick = (tick) => {
    setActiveOffer(tick);
  };

  // Function to format Ethereum address to 0x23....234 format
  const formatEthereumAddress = (address) => {
    if (!address) {
      return ""; // handle empty address case if needed
    }

    // Check if the address is already in the correct format
    if (address.startsWith("0x")) {
      address = address.slice(2); // Remove '0x' prefix for manipulation
    }

    // Get the first 4 and last 3 characters of the address
    const shortenedAddress = address.slice(0, 4) + "..." + address.slice(-3);

    // Add '0x' prefix to the shortened address
    return "0x" + shortenedAddress;
  };

  function timeAgo(timestamp) {
    const currentDate = new Date();
    const providedDate = new Date(timestamp * 1000); // Convert seconds to milliseconds

    const timeDifference = currentDate - providedDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (days < 30) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  }

  const tooltip1 = (artPrice) => {
    return <Tooltip id="tooltip1">{artPrice}</Tooltip>;
  };

  const tooltip2 = (chainName) => {
    return <Tooltip id="tooltip2">Chain: {chainName}</Tooltip>;
  };

  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // const getAccount = async () => {
  //   console.log("account", account);
  //   return account;
  // };

  const checkUser = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log("Curent user", user);
    if (user) {
      setUserData(user);
    }
  };

  useEffect(() => {
    checkUser();
    const fetchUserData = async () => {
      const users = await getAllUsers();
      console.log("users", users);
      setUserData(users);
    };
    fetchUserData();
  }, []);

  const getArtistNamebyAdress = (accountAddress) => {
    let artistName = "Not Found";
    console.log("address", address);
    console.log("current user", accountAddress);
    if (address === accountAddress) {
      return "You";
    } else {
      console.log("users", userData);
      userData?.forEach((user) => {
        if (user?.id === accountAddress) {
          artistName = user?.userName;
        }
      });
    }

    console.log("artist name", artistName);
    return artistName;
  };

  const getArtistImage = (accountAddress) => {
    let artistImage = userProfile;
    console.log("users", userData);
    userData?.forEach((user) => {
      if (user?.id === accountAddress) {
        if (user?.image) {
          artistImage = user?.image;
        } else {
          artistImage = userProfile;
        }
      }
    });

    console.log("artist image", artistImage);
    return artistImage;
  };

  return (
    <div>
      <div className="offers activities analytics">
        <div className="create-artwork pt-2">
          <Dropdown className="select-collection">
            <Dropdown.Toggle id="dropdown-basic">
              {selectedItem}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <Dropdown.Item onClick={() => handleItemClick("All")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick("listedOffer")}>
                Listed for Offer
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick("listedSale")}>
                Listed for Sale
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick("offer")}>
                Offer
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick("sold")}>
                Sold
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick("tranfer")}>
                Transfer
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="offer-table mt-4">
          <div className="offer-table-content hide-on-1024">
            {/* table heading */}

            <div className="offer-table-head ">
              <label className="small v-center c1 ">all activity</label>
              <label className="small v-center c2  ">artwork</label>
              <label className="small v-center  c4 ">from</label>
              <label className="small v-center  c4  ">to</label>
              <label className="small  v-center c5  ">price</label>
              <label className="small v-center  c6  ">time</label>
            </div>

            <div className="offer-table-body ">
              {activity.map((item, index) => {
                console.log("activity", item);
                return (
                  <div
                    className={`offer-table-content    ${
                      item.offerStatus === "Accept" ? "" : " "
                    }`}
                    key={index}
                  >
                    {/* All activity */}

                    <div className="art">
                      <label
                        className={` small text-black text-capitalize v-center activity-box  m-0  bg-auction  ${
                          item.action === "listedOffer"
                            ? "bg-auction"
                            : item.action === "sold"
                            ? "bg-sold"
                            : item.action === "listedSale"
                            ? "bg-listing"
                            : item.action === "offer"
                            ? "bg-offer"
                            : item.action === "tranfer"
                            ? "bg-transfer"
                            : ""
                        }`}
                      >
                        <img
                          src={
                            item.action === "listedOffer"
                              ? auction
                              : item.action === "sold"
                              ? sold
                              : item.action === "listedSale"
                              ? listing
                              : item.action === "offer"
                              ? offer
                              : item.action === "tranfer"
                              ? transfer
                              : ""
                          }
                          alt=""
                          className="img-12 me-1"
                        />
                        {item.action}
                      </label>
                    </div>

                    {/* Artwork */}
                    <div className="art">
                      <div className="art-img p-0 border-0">
                        <img
                          src={item?.artworkUri?.image}
                          alt="art"
                          className="img-100"
                        />
                      </div>
                      <label className="text-black ">
                        {item?.artworkUri?.artName}
                      </label>
                    </div>

                    {/* from */}
                    <div className="v-center ">
                      <div className="art-img p-0 border-0 img-26">
                        <img
                          src={getArtistImage(item?.from)}
                          alt="art"
                          className="img-100 "
                        />
                      </div>
                      <p className="ms-2 fw-bold text-black no-text-transform spotlight-page-content   pointer show-artist-popup">
                        {formatEthereumAddress(item.from)}

                        <ArtistPopUp
                          userProfile={getArtistImage(item?.from)}
                          artistName={getArtistNamebyAdress(item?.from)}
                          verified={verified}
                          left="-50px"
                          top="-215px"
                        />
                      </p>
                    </div>

                    {/* to */}
                    <div className="v-center ">
                      <div className="art-img p-0 border-0 img-26">
                        <img
                          src={getArtistImage(item?.to)}
                          alt="art"
                          className="img-100"
                        />
                      </div>
                      <p className="ms-2 fw-bold text-black no-text-transform  pointer show-artist-popup">
                        {formatEthereumAddress(item.to)}

                        <ArtistPopUp
                          userProfile={getArtistImage(item?.to)}
                          artistName={getArtistNamebyAdress(
                            item?.artworkUri?.from
                          )}
                          verified={verified}
                          left="-50px"
                          top="-215px"
                        />
                      </p>
                    </div>

                    {/*Price  */}

                    <div className="v-center c6  offerAction">
                      <label className="text-black ">
                        <OverlayTrigger
                          placement="top"
                          overlay={tooltip1(item.price)}
                        >
                          <img src={wFLR} alt="" className="me-2" />
                        </OverlayTrigger>
                        {item.price}
                        <span className="body-extra-small ms-2">FLR</span>
                      </label>
                    </div>

                    {/* Time */}
                    <div className="v-center c6  offerAction">
                      <label className="text-black no-text-transform">
                        {timeAgo(item?.timestamp?.seconds)}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-offer-table-content ">
            <div className="offer-table-head bb1 v-center justify-content-between pb-2 ">
              <label className="small v-center c1 ">all activity</label>
              <label className="small v-center  c6  text-black ">Details</label>
            </div>
            <div className="mb-offer-table-body ">
              {activity.map((item, index) => {
                return (
                  <div
                    className="row-content d-flex  mh-76 bb1 flex-column"
                    key={index}
                  >
                    <div className="top-content v-center justify-content-between w-100">
                      <div className="left-content v-center">
                        <img
                          src={item.artworkImage}
                          alt="artwork"
                          className="img-48"
                        />
                        <div className="d-flex flex-column ms-2">
                          <label className="text-black no-text-transform">
                            {/* ArtworkName */}
                            {item.artworkName}
                          </label>
                          <label
                            className="small fw-bold"
                            onClick={() => handleMoreContent(index)}
                          >
                            {/* See more */}
                            {showContent}
                            <img
                              src={dropdown}
                              alt="dropwdown"
                              className="border-0 p-0"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="right-content">
                        <p className="body-small text-capitalize  v-center fw-semibold">
                          <img
                            src={
                              item.activity === "auction"
                                ? auction
                                : item.activity === "sold"
                                ? sold
                                : item.activity === "listing"
                                ? listing
                                : item.activity === "offer"
                                ? offer
                                : item.activity === "transfer"
                                ? transfer
                                : ""
                            }
                            alt="auction"
                            className="img-12 me-1"
                          />
                          {item.activity}
                        </p>

                        <div className="currency">
                          <img src={wFLR} alt="wflr" className="img-14" />
                          <label className="text-black fw-semibold medium">
                            4.9M <span className="body-extra-small">WFLR</span>
                          </label>
                        </div>
                        <label className="small fw-semibold no-text-transform">
                          2h ago
                        </label>
                      </div>
                    </div>

                    {showmore[index] ? (
                      <div className="btm-content w-100 mt-2 v-center justify-content-between ">
                        <div>
                          <label htmlFor="" className="small">
                            to
                          </label>
                          <p className="body-medium fw-semibold">{item.to}</p>
                        </div>

                        <div>
                          <label htmlFor="" className="small">
                            tx hash
                          </label>
                          <p className="body-medium fw-semibold">0xd1…4k78</p>
                        </div>
                        <div>
                          <label htmlFor="" className="small">
                            from
                          </label>
                          <p className="body-medium fw-semibold">
                            {item.fromOffer}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Offcanvas
        show={priceShow}
        onHide={handleActivityHeading}
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
                onClick={handleActivityHeading}
              />
            </div>
          </div>

          <div className="share">
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className={`no-text-transform h-64 text-black ${
                  activeOffer === option.value ? "fw-bold" : "fw-normal"
                }`}
                onClick={() => handleIPriceTick(option.value)}
              >
                {option.label}
                <img
                  src={tick}
                  alt="tick"
                  className={`${
                    activeOffer === option.value
                      ? "active opacity-100"
                      : "opacity-0"
                  }`}
                />
              </label>
            ))}
          </div>
        </div>
      </Offcanvas>
    </div>
  );
};
// const activity = [
//   {
//     activity: "auction",
//     artworkImage: art1,
//     artworkName: "Artwork Name",
//     offer: 87500,
//     from: "@fromThisUser",
//     to: "@sellerName",
//     price: "71.25k",
//     userImage: userProfile,
//     fromOffer: "@buyerName",
//     offerStatus: "Accept",
//   },
//   {
//     activity: "listing",
//     artworkImage: art2,
//     artworkName: "Artwork Name",
//     offer: 87500,
//     from: "@fromThisUser",
//     to: "0xd1…4k78",
//     price: "71.25k",
//     userImage: userProfile,
//     fromOffer: "@buyerName",
//     offerStatus: "Accept",
//   },
//   {
//     activity: "offer",
//     artworkImage: art3,
//     artworkName: "Artwork Name",
//     offer: 87500,
//     from: "@fromThisUser",
//     to: "@sellerName",
//     price: "71.25k",
//     userImage: userProfile,
//     fromOffer: "@buyerName",
//     offerStatus: "Accept",
//   },
//   {
//     activity: "sold",
//     artworkImage: art4,
//     artworkName: "Artwork Name",
//     offer: 87500,
//     from: "@fromThisUser",
//     to: "0xd1…4k78",
//     price: "71.25k",
//     userImage: userProfile,
//     fromOffer: "@buyerName",
//     offerStatus: "Accept",
//   },
//   {
//     activity: "transfer",
//     artworkImage: art5,
//     artworkName: "Artwork Name",
//     offer: 87500,
//     from: "@fromThisUser",
//     to: "@sellerName",
//     price: "71.25k",
//     userImage: userProfile,
//     fromOffer: "@buyerName",
//     offerStatus: "Accept",
//   },
// ];
// ---------------------------------------
const priceOptions = [
  { value: "all activity", label: "All Activity" },
  { value: "offerDiffernce", label: "Difference" },
  { value: "offerDate", label: "Date" },
  { value: "offerFrom", label: "From" },
  { value: "offerAction", label: "Action" },
];
export default Activity;
