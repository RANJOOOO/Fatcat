import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import verified from "../../assets/icon/verified-artist-small.svg";
import sgb from "../../assets/icon/SGB.svg";
import flr from "../../assets/icon/FLR.svg";
import profile from "../../assets/icon/profile-picture.svg";
import loader from "../../assets/icon/loader-medium.svg";
import userProfile from "../../assets/images/face-3.png";
import AsideFilterExplore from "./asideFilterExplore";
import ArtistPopUp from "../shared/artistpopup";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { get, set } from "firebase/database";
import { getAllUsers } from "../../firebase/firebase";
import Web3 from "web3";

import { useAccount } from "wagmi";

const LayoutExploreGrid = (props) => {
  console.log(props);
  const [collectedArts, setCollectedArts] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [offerNftData, setOfferNftData] = useState([]);
  const { address } = useAccount();

  useEffect(() => {
    console.log("accountAddress", address);
  }, [address]);

  useEffect(() => {
    if (props?.listedNft) {
      // Update state in a single call to ensure synchronous behavior
      setCollectedArts(props?.listedNft);
      setNftData(props?.listedNft?.nftData);
      setOfferNftData(props?.listedNft?.offerNftData);
    }
  }, [props?.listedNft]);

  useEffect(() => {
    if (props?.listedNft) {
      console.log(nftData);
      console.log(offerNftData);
    }
  }, [nftData, offerNftData]);

  const navigate = useNavigate();

  const navigateTo = (item, listType) => {
    navigate("/single-artwork/", {
      state: { page: "explore", data: item, listType: listType },
    });
  };
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
    let artistName = "";
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
      <div
        className={
          props.flag ? "d-flex align-item-center justify-content-between" : ""
        }
      >
        <div className={props.flag ? "my-filter w-25" : "d-none"}>
          {/* <AsideFilterExplore /> */}
          <AsideFilterExplore
            onSelectedFilterChange={props.onSelectedFilterChange}
          />
        </div>
        <div
          className={`grid-display artworkGrid  ${
            props.flag ? "w-75 active" : ""
          }`}
        >
          {nftData &&
            nftData.map((item, index) => {
              console.log("explore grid items", item);
              if (item?.listedData?.listed === false || item === undefined) {
                return <></>;
              } else {
                return (
                  <div className="collection-grid-card" key={index}>
                    <div className="card-head  ">
                      <div className="user-img">
                        <img
                          src={getArtistImage(item?.meta?.data?.artistAddress)}
                          alt="profile image"
                          className="img-100"
                        />
                      </div>

                      <div className="user-name">
                        <p className="body-large hover-underline pointer">
                          {item?.meta?.data?.artName || "Art Name"}
                        </p>
                        <p className="fw-bold text-medium-grey hoverBlack show-artist-popup ">
                          @
                          {getArtistNamebyAdress(
                            item?.meta?.data?.artistAddress
                          )}
                          <img
                            src={verified}
                            alt="verified"
                            className="img-18 ms-1"
                          />
                          {/* artsit pop up here */}
                          <ArtistPopUp
                            userProfile={getArtistImage(
                              item?.meta?.data?.artistAddress
                            )}
                            verified={verified}
                            artistName={getArtistNamebyAdress(
                              item?.meta?.data?.artistAddress
                            )} // passing artist as prop
                            left="-60px"
                            top="-215px"
                          />
                        </p>
                      </div>
                    </div>

                    <div className="card-body">
                      <div
                        className="art-img"
                        onClick={() => navigateTo(item, "listed")}
                      >
                        <img
                          src={item?.meta?.data?.image}
                          alt="art"
                          className="img-100 artwork-hover"
                        />
                        <img
                          src={item?.meta?.data?.image}
                          alt="chain"
                          className="chainImage"
                        />
                      </div>
                      {item.meta?.data?.selectedBlockchain === "Coston" ? (
                        <>
                          <div className="chain-logo ">
                            <OverlayTrigger
                              placement="top"
                              overlay={tooltip2(
                                item.meta?.data?.selectedBlockchain
                              )}
                              id="tooltip1"
                            >
                              <img src={sgb} alt="chain logo" />
                            </OverlayTrigger>
                          </div>
                          <OverlayTrigger
                            placement="top"
                            overlay={tooltip1(item?.listedData?.price)}
                            id="tooltip1"
                          >
                            <div className="sgb">
                              <img src={sgb} alt="sgb" />
                              <p className="body-large text-white ms-1">
                                {item?.listedData?.price.length > 3 ? (
                                  <>{item?.listedData?.price / 10 + "K"}</>
                                ) : (
                                  <>{item?.listedData?.price}</>
                                )}
                              </p>
                            </div>
                          </OverlayTrigger>
                        </>
                      ) : (
                        <>
                          <div className="chain-logo ">
                            <OverlayTrigger
                              placement="top"
                              overlay={tooltip2(
                                item.meta?.data?.selectedBlockchain
                              )}
                              id="tooltip1"
                            >
                              <img src={flr} alt="chain logo" />
                            </OverlayTrigger>
                          </div>
                          <OverlayTrigger
                            placement="top"
                            overlay={tooltip1(item?.listedData?.price)}
                            id="tooltip1"
                          >
                            <div className="sgb">
                              <img src={flr} alt="flr" />
                              <p className="body-large text-white ms-1">
                                {item?.listedData?.price.length > 3 ? (
                                  <>{item?.listedData?.price / 10 + "K"}</>
                                ) : (
                                  <>{item?.listedData?.price}</>
                                )}
                              </p>
                            </div>
                          </OverlayTrigger>
                        </>
                      )}
                    </div>
                    {/* <div className="stacked-buttons ">
                    <div style={{ margin: "6px" }}>
                      <Button
                        text="Buy Now"
                        className="btn-prime btn-ternary br-30 font-18"
                        height="50px"
                        width="100%"
                        onClick={() => BuyNow(item)}
                      />
                    </div>
                    <span
                      className="or"
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      or
                    </span>
                    {/* Make Offer Button 
                    <div style={{ margin: "6px" }}>
                      <Button
                        text="Make Offer"
                        className="btn-prime btn-ternary br-30 font-18"
                        height="50px"
                        width="100%"
                        onClick={() => makeOffer(item)}
                      />
                    </div>
                  </div> */}

                    <div className="card-footer">
                      <div className="owner">
                        <p className="body-medium text-medium-grey ">Owner</p>
                        <label className="medium text-black">
                          <img src={profile} alt="profile" />
                          {getArtistNamebyAdress(item?.listedData?.owner) ||
                            item?.listedData?.owner.slice(0, 3) +
                              "..." +
                              item?.listedData?.owner.slice(-3)}
                          {/* artsit pop up here */}
                        </label>
                        <ArtistPopUp
                          userProfile={userProfile}
                          verified={verified}
                          artistName={
                            getArtistNamebyAdress(item?.listedData?.owner) ||
                            "OwnerName"
                          } // passing artist as prop
                          left="10px"
                          top="-170px"
                        />
                      </div>
                      {/* <div className="offer">
                        <p className="body-large text-bold-black ">
                          Listed For Sale
                        </p>
                      </div> */}
                      <div className="offer">
                        <p className="body-medium text-medium-grey ">
                          Last Price
                        </p>
                        <label className="medium text-black">
                          {item?.listedData?.LastPrice || "--"}
                        </label>
                      </div>
                      {/* <div className="offer">
                      <p className="body-medium text-medium-grey ">
                        Best Offer
                      </p>
                      <label className="medium text-black">
                        <img src={sgb} alt="profile" />
                        {item.offer}
                      </label>
                    </div> */}
                    </div>
                  </div>
                );
              }
            })}
          {offerNftData &&
            offerNftData.map((item, index) => {
              console.log("explore grid items", item);
              if (item?.listedData?.listed === false || item === undefined) {
                return <></>;
              } else {
                return (
                  <div className="collection-grid-card" key={index}>
                    <div className="card-head  ">
                      <div className="user-img">
                        <img
                          src={getArtistImage(item?.meta?.data?.artistAddress)}
                          alt="profile image"
                          className="img-100"
                        />
                      </div>

                      <div className="user-name">
                        <p className="body-large hover-underline pointer">
                          {item?.meta?.data?.artName || "Art Name"}
                        </p>
                        <p className="fw-bold text-medium-grey hoverBlack show-artist-popup ">
                          @
                          {getArtistNamebyAdress(
                            item?.meta?.data?.artistAddress
                          )}
                          <img
                            src={verified}
                            alt="verified"
                            className="img-18 ms-1"
                          />
                          {/* artsit pop up here */}
                          <ArtistPopUp
                            userProfile={getArtistImage(
                              item?.meta?.data?.artistAddress
                            )}
                            verified={verified}
                            artistName={getArtistNamebyAdress(
                              item?.meta?.data?.artistAddress
                            )} // passing artist as prop
                            left="-60px"
                            top="-215px"
                          />
                        </p>
                      </div>
                    </div>

                    <div className="card-body">
                      <div
                        className="art-img"
                        onClick={() => navigateTo(item, "offer")}
                      >
                        <img
                          src={item?.meta?.data?.image}
                          alt="art"
                          className="img-100 artwork-hover"
                        />
                        <img
                          src={item?.chainimg}
                          alt="chain"
                          className="chainImage"
                        />
                      </div>
                      {/* <div className="chain-logo ">
                        <img src={sgb} alt="chain logo" />
                      </div> */}
                      {item.meta?.data?.selectedBlockchain === "Coston" ? (
                        <>
                          <div className="chain-logo ">
                            <OverlayTrigger
                              placement="top"
                              overlay={tooltip2(
                                item.meta?.data?.selectedBlockchain
                              )}
                              id="tooltip1"
                            >
                              <img src={sgb} alt="chain logo" />
                            </OverlayTrigger>
                          </div>
                          <div className="chain-logo ">
                            <img src={sgb} alt="chain logo" />
                          </div>
                          <OverlayTrigger
                            placement="top"
                            overlay={tooltip1(item?.listedData?.minimumBid)}
                            id="tooltip1"
                          >
                            <div className="sgb">
                              <img src={sgb} alt="sgb" />
                              <p className="body-large text-white ms-1">
                                {item?.listedData?.minimumBid.length > 3 ? (
                                  <>{item?.listedData?.minimumBid / 10 + "K"}</>
                                ) : (
                                  <>{item?.listedData?.minimumBid}</>
                                )}
                              </p>
                            </div>
                          </OverlayTrigger>
                        </>
                      ) : (
                        <>
                          <div className="chain-logo ">
                            <OverlayTrigger
                              placement="top"
                              overlay={tooltip2(
                                item.meta?.data?.selectedBlockchain
                              )}
                              id="tooltip1"
                            >
                              <img src={flr} alt="chain logo" />
                            </OverlayTrigger>
                          </div>
                          <OverlayTrigger
                            placement="top"
                            overlay={tooltip1(item?.listedData?.minimumBid)}
                            id="tooltip1"
                          >
                            <div className="sgb">
                              <img src={flr} alt="flr" />
                              <p className="body-large text-white ms-1">
                                {item?.listedData?.minimumBid.length > 3 ? (
                                  <>{item?.listedData?.minimumBid / 10 + "K"}</>
                                ) : (
                                  <>{item?.listedData?.minimumBid}</>
                                )}
                              </p>
                            </div>
                          </OverlayTrigger>
                        </>
                      )}
                    </div>
                    {/* <div className="stacked-buttons ">
                    <div style={{ margin: "6px" }}>
                      <Button
                        text="Buy Now"
                        className="btn-prime btn-ternary br-30 font-18"
                        height="50px"
                        width="100%"
                        onClick={() => BuyNow(item)}
                      />
                    </div>
                    <span
                      className="or"
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      or
                    </span>
                    {/* Make Offer Button 
                    <div style={{ margin: "6px" }}>
                      <Button
                        text="Make Offer"
                        className="btn-prime btn-ternary br-30 font-18"
                        height="50px"
                        width="100%"
                        onClick={() => makeOffer(item)}
                      />
                    </div>
                  </div> */}

                    <div className="card-footer">
                      <div className="owner">
                        <p className="body-medium text-medium-grey ">Owner</p>
                        <label className="medium text-black">
                          <img src={profile} alt="profile" />

                          {getArtistNamebyAdress(item?.listedData?.owner) ||
                            item?.listedData?.owner.slice(0, 3) +
                              "..." +
                              item?.listedData?.owner.slice(-3)}

                          {/* artsit pop up here */}
                        </label>
                        <ArtistPopUp
                          userProfile={getArtistImage(
                            item?.meta?.data?.artistAddress
                          )}
                          verified={verified}
                          artistName={
                            getArtistNamebyAdress(item?.listedData?.owner) ||
                            "OwnerName"
                          } // passing artist as prop
                          left="10px"
                          top="-170px"
                        />
                      </div>
                      {/* <div className="offer">
                        <p className="body-large text-bold-black ">
                          Listed For Offer
                        </p>
                      </div> */}
                      <div className="offer">
                        <p className="body-medium text-medium-grey ">
                          Best Offer
                        </p>
                        <label className="medium text-black">
                          {item?.listedData?.BestOffer || "--"}
                        </label>
                      </div>

                      {/* <div className="offer">
                      <p className="body-medium text-medium-grey ">
                        Best Offer
                      </p>
                      <label className="medium text-black">
                        <img src={sgb} alt="profile" />
                        {item.offer}
                      </label>
                    </div> */}
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>

      <div className="content-loader rotate-360 d-none">
        <img src={loader} alt="loader" />
      </div>
    </div>
  );
};

export default LayoutExploreGrid;
