import React, { useState, useEffect } from "react";
import "../../style/main.scss";
import { Modal } from "react-bootstrap";
import user from "../../assets/images/face-4.png";
import Button from "../button";
import {
  unfollowArtist,
  checkIfFollowed,
  handleFollow,
  setUsername,
} from "../../firebase/firebase";
import ArtistPopUp from "../shared/artistpopup";

const FollowModal = ({ show, handleModal1, data, dataType }) => {
  //  1 check type of data
  // -- if (following data type) set state to false
  // -- if (follower data type check if follow back or not)
  // --if follwed back set state to false and if not followed back set state to true
  // --if state is false make it true and delete it and if state is true make it false and add data in db

  const [isFollowed, setIsFollowed] = useState(Array(data.length).fill(false));
  let username = localStorage?.getItem("userName");

  useEffect(() => {
    if (dataType === "following") {
      // Update isFollowed using the setIsFollowed function
      setIsFollowed(Array(data.length).fill(false));
    } else if (dataType === "followers") {
      data.forEach(async (item, index) => {
        const isFollowedBack = await checkIfFollowed(username, item);
        // Update isFollowed using the setIsFollowed function
        setIsFollowed((prevIsFollowed) => {
          const updatedIsFollowed = [...prevIsFollowed];
          updatedIsFollowed[index] = !isFollowedBack;
          return updatedIsFollowed;
        });
      });
    }
  }, [dataType, data]);

  const followhandle = async (index, item) => {
    // alert(isFollowed[index]);
    if (isFollowed[index] == false) {
      // Handle unfollow action
      await unfollowArtist(username, item);
      const newIsFollowed = [...isFollowed];
      newIsFollowed[index] = true;
      setIsFollowed(newIsFollowed);
    } else {
      // Handle follow action
      await handleFollow(username, item);
      const newIsFollowed = [...isFollowed];
      newIsFollowed[index] = false;
      setIsFollowed(newIsFollowed);
    }
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleModal1}
        centered
        size="lg"
        className="follower-modal"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <label className="medium">
              {dataType === "followers"
                ? `Followers (${data.length})`
                : `Following (${data.length})`}
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-2"
            >
              <div className="follower">
                <div className="follower-img">
                  <img src={user} alt="user" className="img-100" />
                </div>
                <label className="text-black text-lowercase">@{item}</label>
              </div>
              <div className="follow-btn">
                <Button
                  width="126px"
                  height="36px"
                  text={!isFollowed[index] ? "Following" : "Follow"}
                  className={
                    isFollowed[index]
                      ? "btn-prime btn-primary"
                      : "btn-prime btn-secondary bg-transparent"
                  }
                  onClick={() => followhandle(index, item)}
                />
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FollowModal;
