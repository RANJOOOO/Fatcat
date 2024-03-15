import React, { useEffect } from "react";
import "../../style/main.scss";
import Button from "../button";
import star35 from "../../assets/icon/spiked-circle/black/35px.svg";
import more from "../../assets/icon/more-horizontal.svg";
import copy from "../../assets/icon/copy-grey.svg";
import copy1 from "../../assets/icon/copy.svg";
import hide from "../../assets/icon/private-profile.svg";
import close from "../../assets/icon/close.svg";
import copylink from "../../assets/icon/link.svg";
import twitter from "../../assets/icon/twitter.svg";
import report from "../../assets/icon/report.svg";
// import placeholder from "../../assets/icon/profile-large.svg";
import placeholder from "../../assets/images/profile-1.svg";

import user from "../../assets/images/face-4.png";
import EditProfile from "./editProfile";
import { useState } from "react";
import { Modal, Offcanvas } from "react-bootstrap";
import FollowModal from "./followModal";
import { toast } from "react-toastify";
import Dropdown from "../shared/dropdown";
import {
  getUserData,
  getFollowersData,
  getFollowingData,
  getUserDataByUserName,
} from "../../firebase/firebase";
import { useAccount } from "wagmi";
import { getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import sortby from "../../assets/icon/sort-by.svg";
import tick from "../../assets/icon/tick-large-black.svg";

const Header = ({ id, setUserDataByUserName, userDataByUserName }) => {
  const [showBidModal, setShowBidModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  // const [moreMenu, setMoreMenu] = useState(false);
  // const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  const [followersData, setFollowersData] = useState({ count: 0, data: [] });
  const [followingData, setFollowingData] = useState({ count: 0, data: [] });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = "0X9683…C315";

  const handleBidModal = () => {
    setShowBidModal((prev) => !prev);
  };

  const handleModalClick = (type) => {
    setModalType(type);
    setShowFollowModal(true);
  };

  const handleModalClose = () => {
    setShowFollowModal(false);
    setModalType("");
  };

  const copyAddress = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Address Copied");
      })
      .catch((error) => {
        toast.warning(" Failed to copy tex");
      });
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("Link copied");
      })
      .catch((error) => {
        toast.warning("Link copying Failed", error);
      });
  };

  let username = localStorage?.getItem("userName");
  useEffect(() => {
    // Fetch followers data (count and usernames) and set it to state
    getFollowersData(username)
      .then((data) => setFollowersData(data))
      .catch((error) => console.error("Error fetching followers data:", error));

    // Fetch following data (count and usernames) and set it to state
    getFollowingData(username)
      .then((data) => setFollowingData(data))
      .catch((error) => console.error("Error fetching following data:", error));
  }, [modalType]);

  // share on twitter
  const shareOnTwitter = () => {
    const currentUrl = window.location.href;
    const tweetText = "Check out this page: " + currentUrl;
    const tweetUrl =
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText);
    window.open(tweetUrl, "_blank");
  };

  const privateProfile = () => {
    toast.warning("Profile private");
  };
  const [userData, setUserData] = useState("");
  const getfirebasedata = async () => {
    if (address) {
      const data = await getUserData(address);
      console.log(data);
      setUserData(data);
    }
  };

  useEffect(() => {
    getfirebasedata();
  }, [address]);
  useEffect(() => {
    console.log(userData?.userName);
  }, [userData]);
  const [isloggedin, setislogged] = useState("");

  useEffect(() => {
    const isLogged = localStorage?.getItem("catalystSigner");
    setislogged(isLogged);
  }, []);

  const getUserNameForProfile = async () => {
    console.log(id);
    const userNamedata = await getUserDataByUserName(id);
    console.log(userNamedata);
    setUserDataByUserName(userNamedata);
  };

  useEffect(() => {
    if (id) {
      getUserNameForProfile();
    }
  }, [id]);

  const navigate = useNavigate();
  const [activeOfferFilter, setActiveOfferFilter] = useState("All offers");
  const handleOfferTick = (tick) => {
    setActiveOfferFilter(tick);
  };
  return (
    <div>
      <div className="profile-header site-container ">
        <div className="left-content">
          <div className="user-name">
            <img src={star35} alt="star" />
            {id == undefined ? (
              <h5>
                {userData?.userName != undefined
                  ? "@" + userData?.userName
                  : "@_username"}
              </h5>
            ) : (
              <h5>
                {userDataByUserName?.documentData?.userName != undefined
                  ? "@" + userDataByUserName?.documentData?.userName
                  : "@_username"}
              </h5>
            )}
          </div>
          <div className="profile-headlines">
            <p className="body-medium">
              {userData?.userHeadline
                ? userData?.userHeadline
                : "This is a headline example."}
            </p>
          </div>
          <div className="profile-controls">
            <div className="d-flex">
              {isloggedin ? (
                id == undefined ? (
                  <>
                    <Button
                      text="Edit profile"
                      className="btn-prime btn-primaryA"
                      onClick={handleBidModal}
                    />
                    <div>
                      <div
                        className="more-opt cursor-pointer icon-shadow hide-on-desktop"
                        onClick={handleShow}
                      >
                        <img src={more} alt="option" />
                      </div>
                    </div>
                    <div className="ofr-recieved d-flex align-items-center filter dropdown hide-on-mobile ">
                      <p
                        className="body-medium dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="more-opt cursor-pointer icon-shadow ">
                          <img src={more} alt="option" />
                        </div>
                      </p>
                      <ul className="dropdown-menu">
                        <li className="dropdown-item " onClick={copyAddress}>
                          <img
                            src={copy}
                            alt="tick"
                            className=" invert-0   img-24"
                          />
                          Copy Address
                        </li>{" "}
                        <li className="dropdown-item " onClick={copyPageLink}>
                          <img
                            src={copylink}
                            alt="tick"
                            className=" invert-0    "
                          />
                          Copy Link
                        </li>
                        <li
                          className="dropdown-item "
                          onClick={() => navigate("/report-issue")}
                        >
                          <img
                            src={report}
                            alt="tick"
                            className=" invert-0    "
                          />
                          Report
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="user-acc cursor-pointer " onClick={copyAddress}>
              {userDataByUserName?.documentId ? (
                <p className="body-small">
                  {userDataByUserName?.documentId &&
                    userDataByUserName?.documentId?.slice(0, 5) +
                      "..." +
                      userDataByUserName?.documentId?.slice(
                        userDataByUserName?.documentId?.length - 6,
                        userDataByUserName?.documentId?.length
                      )}
                  <span>
                    <img src={copy} alt="copy" />
                  </span>
                </p>
              ) : (
                <p className="body-small">
                  {address &&
                    address?.slice(0, 5) +
                      "..." +
                      address?.slice(address?.length - 6, address?.length)}
                  <span>
                    <img src={copy} alt="copy" />
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="right-content">
          <div className="d-flex followings">
            <div
              className="follow cursor-pointer"
              onClick={() => handleModalClick("followers")}
            >
              <p>{followersData.count}</p>
              <label className="followers-label cursor-pointer">
                Followers
              </label>
            </div>
            <div
              className="follow cursor-pointer"
              onClick={() => handleModalClick("following")}
            >
              <p>{followingData.count}</p>
              <label className="followers-label">Following</label>
            </div>
          </div>

          <div className="profile-img">
            {userDataByUserName?.documentData?.image ? (
              <img
                src={userDataByUserName?.documentData.image}
                alt="profile"
                className="img-100 "
              />
            ) : userData?.image == "" ||
              userData?.image == undefined ||
              userData?.image == null ? (
              // <div className="border w-100 h-100 rounded-circle v-center h-center border-dark">
              <img src={placeholder} alt="profile" className="img-100  " />
            ) : (
              // </div>
              <img src={userData?.image} alt="profile" className="img-100 " />
            )}
          </div>
        </div>

        <div className="private-btn  hide-on-mobile ">
          <Button
            imageSrc={hide}
            text="PRIVATE PROFILE"
            width="146px"
            height="29px"
            onClick={privateProfile}
            className="pe-none"
          />
        </div>

        {/* more Menu */}

        {/* To add back layer when more menu is open */}
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="bottom">
        <div className="more-menu-sm trans-7 ">
          <div className="menu-head pb-0">
            <label className="text-black">profile</label>
            <div className="close-btn">
              <img
                src={close}
                alt="close"
                className="img-24 cursor-pointer"
                onClick={handleClose}
              />
            </div>
          </div>

          <div className="address">
            <label className="medium h-64 d-flex align-items-end">
              address
            </label>
            <label
              className="d-flex align-items-center h-64 text-black cursor-pointer"
              onClick={copyAddress}
            >
              <img src={copy1} alt="copy" className="me-3 " />
              {text}
            </label>
          </div>

          <div className="share">
            <label className="medium h-64 d-flex align-items-end">share</label>
            <label
              className="d-flex align-items-center h-64 cursor-pointer text-black"
              onClick={copyPageLink}
            >
              <img src={copylink} alt="copy" className="me-3 " />
              Copy Link
            </label>
          </div>

          <div className="report">
            <label className="medium h-64 d-flex align-items-end">more</label>
            <label
              className="d-flex align-items-center h-64 text-black cursor-pointer"
              onClick={() => navigate("/report-issue")}
            >
              <img src={report} alt="report" className="me-3 " />
              Report
            </label>
          </div>
        </div>
      </Offcanvas>

      <EditProfile show={showBidModal} handleModal={handleBidModal} />

      <FollowModal
        show={showFollowModal}
        handleModal1={handleModalClose}
        data={
          modalType === "followers" ? followersData.data : followingData.data
        }
        dataType={modalType}
      />
    </div>
  );
};
const offerFilter = [
  { value: "Offers made", label: "Offers made" },
  { value: "Offers received", label: "Offers received" },
  { value: "Expired offers", label: "Expired offers" },
  { value: "All offers", label: "All offers" },
];
export default Header;
