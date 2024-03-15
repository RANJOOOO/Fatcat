import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import verified from "../../assets/icon/verified-artist-small.svg";
import sgb from "../../assets/icon/SGB.svg";
import profile from "../../assets/icon/profile-picture.svg";
import videoArt from "../../assets/icon/video-fill.svg";
import loader from "../../assets/icon/loader-medium.svg";
import chainImage from "../../assets/icon/SGB.svg";
import userProfile from "../../assets/images/face-3.png";
import cardImg from "../../assets/images/artwork-preview-6.png";
import cardImg1 from "../../assets/images/artwork-preview-7.png";
import cardImg2 from "../../assets/images/artwork-preview-5.png";
import AsideFilterExplore from "./asideFilterExplore";
import ArtistPopUp from "../shared/artistpopup";
import { useNavigate } from "react-router-dom";
import { Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getAllArts, getAllUsers } from "../../firebase/firebase";
import Button from "../button";
import { useAccount } from "wagmi";

const LayoutDropGrid = (props) => {
  console.log(props);
  const { address } = useAccount();
  const [collectedArts, setCollectedArts] = useState([]);

  useEffect(() => {
    console.log("useEffect");
    getAllArts().then((res) => {
      console.log(res);
      setCollectedArts(res);
    });
  }, []);

  //   const collectedArts = [
  //     {
  //       artName: "Avatar",
  //       artistName: "Robert",
  //       value: "9.75",
  //       artImg: cardImg,
  //       offer: "700",
  //       owner: "You",
  //       videoArt: videoArt,
  //       chainimg: chainImage,
  //     },
  //     {
  //       artName: "Memes",
  //       artistName: "James",
  //       value: "9.75",
  //       artImg: cardImg1,
  //       offer: "1200",
  //       owner: "You",
  //       videoArt: videoArt,
  //       chainimg: chainImage,
  //     },
  //     {
  //       artName: "Gaming ",
  //       artistName: "Mary",
  //       value: "9.75",
  //       artImg: cardImg2,
  //       offer: "7000",
  //       owner: "You",
  //       videoArt: videoArt,
  //       chainimg: chainImage,
  //     },
  //     {
  //       artName: "Music ",
  //       artistName: "Patricia",
  //       value: "9.75",
  //       artImg: cardImg,
  //       offer: "3300",
  //       owner: "You",
  //       chainimg: chainImage,
  //     },
  //     {
  //       artName: "Photography ",
  //       artistName: "Wilson",
  //       value: "9.75",
  //       artImg: cardImg1,
  //       offer: "7300",
  //       owner: "You",
  //       chainimg: chainImage,
  //     },
  //   ];
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate("/single-artwork");
  };
  const tooltip1 = <Tooltip id="tooltip1"> 9752 SGB</Tooltip>;

  const [userData, setUserData] = useState([]);
  // const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // let user = JSON.parse(localStorage.getItem("user"));
    // if (user == null || user == undefined || user == "") {
    // const account = web3.eth.accounts[0];
    // console.log("account", account);
    // setCurrentUser(account);
    // console.log("current user", currentUser);
    // }
    // console.log("Curent user", user);
    // if (user) {
    //   setUserData(user);
    // }
    const fetchUserData = async () => {
      const users = await getAllUsers();
      console.log("users", users);
      setUserData(users);
    };
    fetchUserData();
  }, []);

  const getArtistNamebyAdress = (ArtistAddress) => {
    let artistName = "";
    if (address === ArtistAddress) {
      return "You";
    }

    console.log("users", userData);
    userData?.forEach((user) => {
      if (user?.id === ArtistAddress) {
        artistName = user?.userName;
      }
    });

    console.log("artist name", artistName, "address", ArtistAddress);
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
        </div>
        <div
          className={`grid-display artworkGrid  ${
            props.flag ? "w-75 active" : ""
          }`}
        >
          {collectedArts.map((item, index) => {
            console.log("item", item);
            if (item.data?.isMinted === true) {
              return <></>;
            } else {
              return (
                <div className="collection-grid-card" key={index}>
                  <div className="card-head  ">
                    <div className="user-img">
                      <img
                        src={getArtistImage(item?.data?.artistAddress)}
                        alt="profile image"
                        className="img-100 rounded-circle"
                      />
                    </div>

                    <div className="user-name">
                      <p className="body-large hover-underline pointer">
                        {(item?.data?.name).length > 13
                          ? (item?.data?.name).slice(0, 13) + "..."
                          : item?.data?.name}
                      </p>
                      <p className="fw-bold text-medium-grey hoverBlack  show-artist-popup ">
                        @{getArtistNamebyAdress(item?.data?.artistAddress)}
                        <img
                          src={verified}
                          alt="verified"
                          className="img-18 ms-1"
                        />
                        {/* artsit pop up here */}
                        <ArtistPopUp
                          userProfile={getArtistImage(
                            item?.data?.artistAddress
                          )}
                          verified={verified}
                          artistName={getArtistNamebyAdress(
                            item?.data?.artistAddress
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
                      //   onClick={navigateTo}
                    >
                      <img
                        src={item.data?.image}
                        alt="art"
                        className="img-100 artwork-hover"
                      />
                      {/* <img
                      src={item.chainimg}
                      alt="chain"
                      className="chainImage"
                    /> */}
                    </div>
                    {/* <div className="chain-logo ">
                    <img src={sgb} alt="chain logo" />
                  </div> */}
                    {/* <OverlayTrigger
                    placement="top"
                    overlay={tooltip1}
                    id="tooltip1"
                  >
                    <div className="sgb">
                      <img src={sgb} alt="sgb" />
                      <p className="body-large text-white ms-1">
                        {item.value}k
                      </p>
                    </div>
                  </OverlayTrigger> */}
                  </div>

                  {/* <div className="owner">
                    <p className="body-medium text-medium-grey ">Artist</p>
                    <label className="medium text-black">
                      <img src={profile} alt="profile" />
                      {item?.data?.usename}
                      {/* artsit pop up here
                    </label>
                    <ArtistPopUp
                      userProfile={userProfile}
                      verified={verified}
                      artistName = {item?.data?.usename} // passing artist as prop
                      left="10px"
                      top="-170px"
                    />
                  </div> */}
                  {/* List NFT Button for Popup */}
                  <div className="card-footer">
                    <Button
                      text="Mint NFT"
                      className="btn-prime btn-ternary br-30 font-18"
                      height="50px"
                      width="100%"
                      onClick={() =>
                        navigate(`/mint-art`, {
                          state: { art: item.data, doc: item.documentId },
                        })
                      }
                    />
                  </div>
                  <div className="card-footer">
                    <div className="owner" style={{ textAlign: "center" }}>
                      <p className="body-medium text-medium-grey">Artist</p>
                      <label
                        className="medium text-black"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={profile}
                          alt="profile"
                          style={{ marginBottom: "5px" }}
                        />
                        {getArtistNamebyAdress(item?.data?.artistAddress)}
                        {/* artsit pop up here */}
                      </label>
                      <ArtistPopUp
                        userProfile={getArtistImage(item?.data?.artistAddress)}
                        verified={verified}
                        artistName={getArtistNamebyAdress(
                          item?.data?.artistAddress
                        )} // passing artist as prop
                        left="10px"
                        top="-170px"
                      />
                    </div>

                    <div className="offer">
                      <p className="body-medium text-medium-grey ">
                        Artist Percentage
                      </p>
                      <center>
                        <label className="medium text-black">
                          {/* <img src={sgb} alt="profile" /> */}
                          {item?.data?.artistFee} %
                        </label>
                      </center>
                    </div>
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

export default LayoutDropGrid;
