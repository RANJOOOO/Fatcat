import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import Button from "../button";
import star24 from "../../assets/icon/spiked-circle/black/24px.svg";
import location from "../../assets/icon/location.svg";
import twitter from "../../assets/icon/twitter.svg";
import instagram from "../../assets/icon/instagram.svg";
import arrow from "../../assets/icon/chevron-down-extra-small.svg";
import EditProfile from "./editProfile";
import { getUserData } from "../../firebase/firebase";
import { useAccount } from "wagmi";

const ProfileTab = ({ userDataByUserName }) => {
  const { address } = useAccount();
  const [showBidModal, setShowBidModal] = useState(false);
  const [show1, setShow1] = useState(false);

  const handleBidModal = () => {
    setShowBidModal((prev) => !prev);
  };

  const handleShowBio = () => {
    setShow1(!show1);
  };

  const [userData, setUserData] = useState("");
  const getfirebasedata = async () => {
    const data = await getUserData(address);
    console.log(data);
    setUserData(data);
  };

  useEffect(() => {
    if (address) {
      getfirebasedata();
    }
  }, [address]);

  // storing username in localstorage
  const username = userData?.userName;
  localStorage.setItem("userName", username);

  return (
    <div>
      <div className="profile-about">
        <div className="left-content">
          <div className="about-head">
            <label>
              about <img src={star24} alt="star" />
            </label>
            {userDataByUserName?.documentData ? (
              <p className="body-small">
                {userDataByUserName?.documentData?.userLocation == ""
                  ? "Location is not added"
                  : userDataByUserName?.documentData?.userLocation}
                <span>
                  <img src={location} alt="location" />
                </span>
              </p>
            ) : (
              <p className="body-small">
                {userData?.userLocation
                  ? userData?.userLocation
                  : "London, United Kingdom"}
                <span>
                  <img src={location} alt="location" />
                </span>
              </p>
            )}
          </div>

          {/* if profile is not filled */}
          {userDataByUserName?.documentData ? (
            <>
              {userDataByUserName?.documentData?.userAbout == "" ? (
                <div className="about-details ">
                  <p className="body-medium">about is not added </p>
                </div>
              ) : (
                <div className="about-details ">
                  <p
                    className="body-medium"
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                    }}
                  >
                    {userDataByUserName?.documentData?.userAbout}
                  </p>
                </div>
              )}
            </>
          ) : userData?.userAbout ? (
            // userData.userAbout
            <div className="about-details ">
              {show1 ? (
                <>
                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                    }}
                    className="body-medium"
                  >
                    {userData.userAbout}
                  </p>
                  <div className="readmore-layer ">
                    <div className="divider full">
                      <Button
                        text="READ LESS"
                        width="115px"
                        height="25px"
                        className="btn-prime btn-secondary read-btn"
                        imageSrc={arrow}
                        onClick={handleShowBio}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p
                    className="body-medium"
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                    }}
                  >
                    {userData?.userAbout?.slice(0, 400)}
                  </p>
                  <div className="readmore-layer ">
                    <div className="divider truncated">
                      <Button
                        text="READ MORE"
                        width="115px"
                        height="25px"
                        className="btn-prime btn-secondary read-btn"
                        imageSrc={arrow}
                        onClick={handleShowBio}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="social-icons">
                <a href="#" target="_blank">
                  <img src={twitter} alt="twitter" />
                </a>
                <a href="#" target="_blank">
                  <img src={instagram} alt="instagram" />
                </a>
              </div>
            </div>
          ) : (
            <div className="user-bio">
              <p className="body-large ">You haven't added a bio yet.</p>
              <Button
                text="Add a bio"
                className="btn-prime btn-secondary"
                height="36px"
                width="126px"
                onClick={handleBidModal}
              />
            </div>
          )}
          <div className="about-details m-0 p-0">
            {/* <div className="social-icons">
              {userDataByUserName ? (
                <>
                  {userDataByUserName?.documentData?.userTwiter == "" ? (
                    <></>
                  ) : (
                    <a
                      href={userDataByUserName?.documentData?.userTwiter}
                      target="_blank"
                    >
                      <img src={twitter} alt="twitter" />
                    </a>
                  )}
                 
                </>
              ) : (
                <>
                  {userData?.userTwitterLink == "" ? (
                    <></>
                  ) : (
                    <a href={userData?.userTwitterLink} target="_blank">
                      <img src={twitter} alt="twitter" />
                    </a>
                  )}
                </>
              )}
            </div> */}
          </div>
          {/* if profile is filled */}
        </div>

        {/* Total collect and sold arts */}

        <div className="right-content">
          <div className="counter created">
            <div className="value">
              <h5>0</h5>
            </div>
            <label className="small">Created</label>
          </div>{" "}
          <div className="counter">
            <div className="value">
              <h5>0</h5>
            </div>
            <label className="small">collected</label>
          </div>
          <div className="counter">
            <div className="value">
              <h5>0</h5>
            </div>
            <label className="small">Sold</label>
          </div>
        </div>
      </div>

      <EditProfile show={showBidModal} handleModal={handleBidModal} />
    </div>
  );
};

export default ProfileTab;
