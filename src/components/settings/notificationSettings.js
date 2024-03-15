import React, { useEffect, useState } from "react";
import unCheck from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import successWhite from "../../assets/icon/tick-white.svg";
import arrow from "../../assets/icon/chevron-up-small.svg";
import { useNavigate } from "react-router-dom";
import {
  getSettingFirebase,
  saveSettingToFirebase,
} from "../../firebase/firebase";
import { useAccount } from "wagmi";

const NotificationSettings = (props) => {
  // status checkbox states
  const { address } = useAccount();
  const [selectNotif, setSelectNotif] = useState({
    itemSold: false,
    bidActivity: false,
    outBid: false,
    auctionExpire: false,
    successPurchase: false,
    newFollower: false,
    followActivity: false,
    priceChange: false,
  });
  const handleNotifications = (tag) => {
    setSelectNotif((prevSelectedTags) => {
      const updatedTags = {
        ...prevSelectedTags,
        [tag]: !prevSelectedTags[tag],
      };
      // Call saveSetting with the updated state
      saveSettingToFirebase(updatedTags,address);
      return updatedTags;
    });
  };
  
  // const [success, setSuccess] = useState(false);
  // const saveSetting = async () => {
  //   alert("Saving data in database");
  //   for(let a in selectNotif){
  //     alert(selectNotif[a]);
  //   }
  //   const result = await saveSettingToFirebase(selectNotif, address);
  //   console.log(result);
  //   setSuccess(result);
  //   setTimeout(() => {
  //     setSuccess(false);
  //   }, 3000);
  // };
  // useEffect(() => {
  //   if (
  //     selectNotif.itemSold ||
  //     selectNotif.bidActivity ||
  //     selectNotif.outBid ||
  //     selectNotif.auctionExpire ||
  //     selectNotif.successPurchase ||
  //     selectNotif.newFollower ||
  //     selectNotif.followActivity ||
  //     selectNotif.priceChange
  //   ) {
  //     saveSetting();
  //   }
  // }, [selectNotif]);

  const navigate = useNavigate();

  const getSetting = async () => {
    const settings = await getSettingFirebase(address);
    console.log(settings.data);
    setSelectNotif(settings.data);
  };
  useEffect(() => {
    getSetting();
  }, []);

  return (
    <div>
      <section className={`settings site-container ${props.activeClass}`}>
        {/* desktop */}
        {/* <h3 className="fw-bolder hide-on-mobile">Notification settings</h3> */}
        {/* mobile */}
        <h6
          className="  mt-0 v-center hide-on-desktop bb-lightest-grey pb-4"
          onClick={() => navigate("/account-settings")}
        >
          <img src={arrow} alt="arrow" className="me-3 rotate-270  " />
          Notification settings
        </h6>

        <div className="notification ">
          {/* item sold */}
          <div className="notification-box mh-80 v-center ">
            <p
              className={`body-large   fw-normal v-center pointer  ${
                selectNotif.itemSold ? "selected" : ""
              }`}
              onClick={() => handleNotifications("itemSold")}
            >
              <img
                src={selectNotif.itemSold ? checked : unCheck}
                alt="checkbox"
              />
              Item sold
            </p>
            <p className="text-medium-grey ">
              When someone purchases one of your items
            </p>
          </div>

          {/* Bid Activity */}

          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.bidActivity ? "selected" : ""
              }`}
              onClick={() => handleNotifications("bidActivity")}
            >
              <img
                src={selectNotif.bidActivity ? checked : unCheck}
                alt="checkbox"
              />
              Bid Activity
            </p>
            <p className="text-medium-grey ">
              When someone bids on one of your items
            </p>
          </div>

          {/* Outbid */}
          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.outBid ? "selected" : ""
              }`}
              onClick={() => handleNotifications("outBid")}
            >
              <img
                src={selectNotif.outBid ? checked : unCheck}
                alt="checkbox"
              />
              Outbid
            </p>
            <p className="text-medium-grey ">
              When an offer you placed is exceeded by another user
            </p>
          </div>

          {/* Auction Expiration */}
          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.auctionExpire ? "selected" : ""
              }`}
              onClick={() => handleNotifications("auctionExpire")}
            >
              <img
                src={selectNotif.auctionExpire ? checked : unCheck}
                alt="checkbox"
              />
              Auction Expiration
            </p>
            <p className="text-medium-grey ">
              When a timed auction you create ends
            </p>
          </div>

          {/*Successful Purchase  */}
          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.successPurchase ? "selected" : ""
              }`}
              onClick={() => handleNotifications("successPurchase")}
            >
              <img
                src={selectNotif.successPurchase ? checked : unCheck}
                alt="checkbox"
              />
              Successful Purchase
            </p>
            <p className="text-medium-grey ">
              When you successfully purchase an item
            </p>
          </div>

          {/* New Follower */}
          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.newFollower ? "selected" : ""
              }`}
              onClick={() => handleNotifications("newFollower")}
            >
              <img
                src={selectNotif.newFollower ? checked : unCheck}
                alt="checkbox"
              />
              New Follower
            </p>
            <p className="text-medium-grey ">When you gain a new follower</p>
          </div>

          {/* Follow Activity*/}
          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.followActivity ? "selected" : ""
              }`}
              onClick={() => handleNotifications("followActivity")}
            >
              <img
                src={selectNotif.followActivity ? checked : unCheck}
                alt="checkbox"
              />
              Follow Activity
            </p>
            <p className="text-medium-grey ">
              When someone you follow lists an item for sale
            </p>
          </div>

          {/* Price Change */}
          <div className="notification-box mh-80 v-center">
            <p
              className={`body-large   fw-normal v-center pointer ${
                selectNotif.priceChange ? "selected" : ""
              }`}
              onClick={() => handleNotifications("priceChange")}
            >
              <img
                src={selectNotif.priceChange ? checked : unCheck}
                alt="checkbox"
              />
              Price Change
            </p>
            <p className="text-medium-grey ">
              When an item you made an offer on changes in price
            </p>
          </div>
        </div>

        {/* <div className={success ? "success-alert " : "success-alert d-none"}>
          <img src={successWhite} alt="success" />
          <p className="body-medium ">Settings updated successfully</p>
        </div> */}
      </section>
    </div>
  );
};

export default NotificationSettings;
