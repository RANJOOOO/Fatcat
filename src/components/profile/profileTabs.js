import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import star20 from "../../assets/icon/spiked-circle/black/24px.svg";
import profileicon from "../../assets/icon/profile.svg";
import collection from "../../assets/icon/collection.svg";
import noOffer from "../../assets/icon/offers.svg";
import likes from "../../assets/icon/likes.svg";
import created from "../../assets/icon/created.svg";
import ProfileTab from "./profileTab";
import UserCollections from "./userCollections";
import Offers from "./offers";
import Likes from "./likes";
import CreatedArtwork from "./createdArtwork";
const ProfileTabs = ({ id, setUserDataByUserName, userDataByUserName }) => {
  const [key, setKey] = useState("profile");
  useEffect(() => {
    console.log(userDataByUserName);
  }, [userDataByUserName]);
  return (
    <div className="profile-tabs  site-container pb-5 mb-5">
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3 profile-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab
          eventKey="profile"
          title={
            <span>
              <img
                src={key == "profile" ? star20 : profileicon}
                alt="star"
                className={
                  key == "profile"
                    ? "hide-on-mobile spikeimg"
                    : "hide-on-mobile"
                }
              />
              Profile
            </span>
          }
        >
          <ProfileTab userDataByUserName={userDataByUserName} />
        </Tab>

        {/* Created */}

        <Tab
          eventKey="created"
          title={
            <span>
              <img
                src={key == "created" ? star20 : created}
                alt="created"
                className={
                  key == "created"
                    ? "hide-on-mobile spikeimg"
                    : "hide-on-mobile"
                }
              />
              created
            </span>
          }
        >
          <CreatedArtwork userDataByUserName={userDataByUserName} />
        </Tab>

        {/* Collection */}

        <Tab
          eventKey="collected"
          title={
            <span>
              <img
                src={key == "collected" ? star20 : collection}
                alt="collection"
                className={
                  key == "collected"
                    ? "hide-on-mobile spikeimg"
                    : "hide-on-mobile"
                }
              />
              collected
            </span>
          }
        >
          <UserCollections propFromCollections="d-nones" />
        </Tab>

        {/* Offers */}

        <Tab
          eventKey="offers"
          title={
            <span>
              {/* if no offer */}
              <img
                src={key == "offers" ? star20 : noOffer}
                alt="offer"
                className={
                  key == "offers" ? "hide-on-mobile spikeimg" : "hide-on-mobile"
                }
              />
              {/* else */}
              {/* <img src={haveOffer} alt="offer" className="hide-on-mobile " /> */}
              offers
            </span>
          }
        >
          <Offers />
        </Tab>

        {/* Likes */}
        <Tab
          eventKey="like"
          title={
            <span>
              <img
                src={key == "like" ? star20 : likes}
                alt="like"
                className={
                  key == "like" ? "hide-on-mobile spikeimg" : "hide-on-mobile"
                }
              />
              Likes
            </span>
          }
        >
          <Likes />
        </Tab>
      </Tabs>

      {/* <div className="mobile-filter">mobile fileter-</div> */}
    </div>
  );
};

export default ProfileTabs;
