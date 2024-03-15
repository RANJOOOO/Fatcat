import React, { useEffect, useState } from "react";
import "../../style/main.scss";

import verified from "../../assets/icon/verified-artist-small.svg";
import loader from "../../assets/icon/loader-large.svg";
import userProfile from "../../assets/images/face-3.png";
import cardImg from "../../assets/images/artwork-preview-6.png";
import cardImg1 from "../../assets/images/artwork-preview-7.png";
import cardImg2 from "../../assets/images/artwork-preview-5.png";
import Button from "../button";
import sad from "../../assets/icon/sad-face.svg";
import { useNavigate } from "react-router-dom";

import { getFavoritesForUser } from "../../firebase/firebase"; // Import the function to fetch favorite documents

const Likes = () => {
  const collectedArts = [
    {
      artName: "Avatar",
      artistName: "Robert",
      value: "1200",
      artImg: cardImg,
      offer: "700",
      owner: "@ownerUserna…",
    },
    {
      artName: "Memes",
      artistName: "James",
      value: "1200",
      artImg: cardImg1,
      offer: "1200",
      owner: "@ownerUserna…",
    },
    {
      artName: "Gaming ",
      artistName: "Mary",
      value: "1200",
      artImg: cardImg2,
      offer: "7000",
      owner: "@ownerUserna…",
    },
    {
      artName: "Music ",
      artistName: "Patricia",
      value: "1200",
      artImg: cardImg,
      offer: "3300",
      owner: "@ownerUserna…",
    },
    {
      artName: "Photography ",
      artistName: "Wilson",
      value: "1200",
      artImg: cardImg1,
      offer: "7300",
      owner: "@ownerUserna…",
    },
  ];

  // getting likes from firebase

  const [favoriteData, setFavoriteData] = useState([]);
  let username = localStorage?.getItem("userName");
  useEffect(() => {
    if (username) {
      getFavoritesForUser(username).then((favorites) => {
        setFavoriteData(favorites);
      });
    }
  }, [username]);
  const navigate = useNavigate();
  const exploreArts = () => {
    console.log("explore arts");
    navigate("/explore");
  };
  return (
    <>
      {favoriteData?.length == 0 ? (
        <div className="no-content ">
          <img src={sad} alt="sad" />
          <p className="body-large">
            You haven’t <span>liked </span>
            any artwork yet.
          </p>
          <Button
            text="Explore art"
            width="166px"
            height="36px"
            className="btn-prime btn-primary"
            onClick={exploreArts}
          />
        </div>
      ) : (
        <div className="art-likes">
          <div className="grid-display">
            {favoriteData.map((item, index) => {
              return (
                <div className="collection-grid-card" key={index}>
                  <div className="card-head">
                    <div className="user-img">
                      <img
                        src={userProfile}
                        alt="profile image"
                        className="img-100"
                      />
                    </div>

                    <div className="user-name">
                      <p className="body-large hover-underline pointer">
                        {item?.name}
                      </p>
                      <label className="hover-underline pointer">
                        @{item?.username}
                        <img src={verified} alt="verified" />
                      </label>

                      <div className="artist-popup ">
                        <div className="pop-head">
                          <div className="user-img">
                            <img
                              src={userProfile}
                              alt="profile image"
                              className="img-100"
                            />
                          </div>
                          <p className="body-large">
                            @artistName
                            <img src={verified} alt="verified" />
                          </p>
                        </div>
                        <div className="popup-body">
                          <div className="created">
                            <label className="medium">Created</label>
                            <label className="text-black">45</label>
                          </div>
                          <div className="created">
                            <label className="medium">Followers</label>
                            <label className="text-black">9798</label>
                          </div>
                        </div>
                        <Button
                          text="Follow"
                          width="100%"
                          height="36px"
                          className="btn-prime btn-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card-body overflow-hidden">
                    <img
                      src={item?.image}
                      alt="art"
                      className="img-100 artwork-hover cursor-pointer"
                    />

                    <div className="sgb">
                      {/* <img src={sgb} alt="sgb" /> */}
                      <p className="body-large text-white ms-1">$300</p>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="owner">
                      <p className="body-medium text-medium-grey ">Owner</p>
                      <label className="medium text-black">
                        {item?.username}
                      </label>

                      <div className="artist-popup ">
                        <div className="pop-head">
                          <div className="user-img">
                            <img
                              src={userProfile}
                              alt="profile image"
                              className="img-100"
                            />
                          </div>
                          <p className="body-large">
                            @artistName
                            <img src={verified} alt="verified" />
                          </p>
                        </div>
                        <div className="popup-body">
                          <div className="created">
                            <label className="medium">Created</label>
                            <label className="text-black">45</label>
                          </div>
                          <div className="created">
                            <label className="medium">Followers</label>
                            <label className="text-black">9798</label>
                          </div>
                        </div>
                        <Button
                          text="Follow"
                          width="100%"
                          height="36px"
                          className="btn-prime btn-primary"
                        />
                      </div>
                    </div>
                    <div className="offer">
                      <p className="body-medium text-medium-grey ">
                        Last sale price
                      </p>
                      <label className="medium text-black">
                        {/* <img src={sgb} alt="profile" /> */}$300
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className="content-loader rotate-360">
          <img src={loader} alt="loader" className="img-35" />
        </div> */}
        </div>
      )}
    </>
  );
};

export default Likes;
