import React, { useState, useEffect } from "react";

import Button from "../button";
import "../../style/main.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../firebase/firebase";
import { handleFollow } from "../../firebase/firebase";
import { checkIfFollowed } from "../../firebase/firebase";
import {
  unfollowArtist,
  getFollowersData,
  getArtCreatedByArtistLength,
} from "../../firebase/firebase";

const ArtistPopUp = ({ userProfile, verified, left, top, artistName }) => {
  const [follow, setFollow] = useState(true);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [createdArts, setCreatedArts] = useState(0);

  const navigate = useNavigate();

  let username = localStorage?.getItem("userName");
  const [isFollowed, setIsFollowed] = useState(false);

  const fetchFollowStatus = async (username, artistName) => {
    const result = await checkIfFollowed(username, artistName);
    console.log("result", result);
    setIsFollowed(result);
  };

  const getFollowData = async () => {
    const result = await getFollowersData(artistName);
    console.log("follow result", result);
    setTotalFollowers(result.count);
  };

  const getCreatedArts = async () => {
    const result = await getArtCreatedByArtistLength(artistName);
    console.log("created result", result);
    setCreatedArts(result);
  };

  useEffect(() => {
    fetchFollowStatus(username, artistName);
    getFollowData();
    getCreatedArts();
  }, [username, artistName]);

  const followBtn = async () => {
    if (isFollowed) {
      unfollowArtist(username, artistName);
      getFollowData();
      toast.warn("Unfollowed Succesfully");
    } else {
      handleFollow(username, artistName, follow);
      getFollowData();
      toast.success("Followed Succesfully");
    }
    setIsFollowed(!isFollowed);
  };

  const popupStyle = {
    position: "absolute",
    left: left || 0, // If left prop is not provided, default to 0
    top: top || 0, // If top prop is not provided, default to 0
  };

  return (
    <div className="artist-popup" style={popupStyle}>
      <div className="pop-head">
        <div
          className="user-img"
          onClick={() => {
            artistName === "You"
              ? navigate(`/profile`)
              : navigate(`/profile/${artistName}`);
          }}
        >
          <img
            src={userProfile}
            alt="profile image"
            className="img-100 m-0  rounded-circle"
          />
        </div>
        <p
          className="body-large pointer v-center"
          onClick={() => {
            artistName === "You"
              ? navigate(`/profile`)
              : navigate(`/profile/${artistName}`);
          }}
        >
          {/* added artist name from prop */}
          {artistName}
          {/* @artistName */}
          <img src={verified} alt="verified" />
        </p>
      </div>
      <div className="popup-body">
        <div className="created">
          <label className="medium">Created</label>
          <label className="text-black">{createdArts}</label>
        </div>
        <div className="created">
          <label className="medium">Followers</label>
          <label className="text-black">{totalFollowers}</label>
        </div>
      </div>

      <Button
        text={isFollowed ? "Following" : "Follow"}
        width="100%"
        height="36px"
        className={
          !isFollowed
            ? "btn-prime btn-primary"
            : "btn-prime btn-secondary bg-transparent"
        }
        onClick={followBtn}
      />
    </div>
  );
};
export default ArtistPopUp;
