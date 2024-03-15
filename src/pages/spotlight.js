import React, { useEffect, useState } from "react";
import "../style/main.scss";
import Button from "../components/button";
import { toast } from "react-toastify";
import user from "../assets/images/face-7.png";
import thumb from "../assets/images/artwork-example-5.png";
import website from "../assets/icon/website-white.svg";
import instagram from "../assets/icon/instagram.svg";
import discord from "../assets/icon/discord.svg";
import twitter from "../assets/icon/twitter.svg";
import more from "../assets/icon/arrow-angle-right-grey.svg";
import FooterV2 from "../components/footerV2";
import { getSpotlightUser, getUserDataByUserName } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Spotlight = () => {
  const [userData, setUserData] = useState([]);
  const [userDataByUserName, setUserDataByUserName] = useState([]);

  const navigate = useNavigate();

  const profile = "OBAID324";

  useEffect(() => {
    const fetchData = async () => {
      const users = await getSpotlightUser();
      console.log("User Data", users);
      setUserData(users[0]);
    };
    fetchData();
    console.log("userData", userData);
  }, []);

  useEffect(() => {
    if (userData?.spotUsername) {
      getUserNameForProfile();
    }
  }, [userData]);

  const getUserNameForProfile = async () => {
    console.log(userData?.spotUsername);
    const userNamedata = await getUserDataByUserName(userData?.spotUsername);
    setUserDataByUserName(userNamedata);
  };

  return (
    <div>
      <div className="spotlight-page h-center site-container">
        {userData?.spotActive ? (
          <div className="spotlight-page-content   ">
            <p className="text-white">SPOTLIGHT ARTIST</p>
            <h4 className="medium-head text-white mt-3 pb-4">
              The Spotlight — a deeper look into the captivating and
              forward-thinking work of a generative artist.
            </h4>

            {userData?.spotUsername && (
              <div className="profile-box br-30 v-center justify-content-between">
                <div className="left v-center">
                  <div className="profile-img">
                    {userDataByUserName?.documentData?.image ? (
                      <img
                        src={userDataByUserName?.documentData.image}
                        alt="profile"
                        className="img-45"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      <img src={user} alt="user" className="img-45" />
                    )}
                  </div>
                  <h6 className="fw-bold text-white ms-2 text-normal">
                    @{userData?.spotUsername}
                  </h6>
                </div>
                <div className="right pe-1">
                  <Button
                    text="View profile"
                    className="btn-prime text-white btn-primary bg-transparent"
                    width="126px"
                    height="36px"
                    onClick={() =>
                      navigate(`/profile/${userData?.spotUsername}`)
                    }
                  />
                </div>
              </div>
            )}
            <div className="artist-about-box  v-center justify-content-between">
              <div className="left">
                <a href="#" className="v-center">
                  <img src={website} alt="site" className="img-30" />
                  <p className="text-white ms-2">{userData?.spotWebsite}</p>
                </a>
              </div>
              <div className="right">
                <div className="social-links">
                  <a href={userData?.spotTwitter}>
                    <img src={instagram} alt="instagram" className="invert1" />
                  </a>
                  <a href={userData?.spotTwitter}>
                    <img src={discord} alt="discord" className="invert1" />
                  </a>
                  <a href={userData?.spotTwitter}>
                    <img src={twitter} alt="twitter" className="invert1" />
                  </a>
                </div>
              </div>
            </div>
            {userData?.spotBio && (
              <div className="artist-about">
                <h5 className="italic-head no-text-transform text-white fw-normal mb-50">
                  {userData?.spotBio}
                </h5>
              </div>
            )}
            {userData?.spotSection1image && (
              <div className="artwork-box">
                <img
                  src={userData?.spotSection1image}
                  alt="thumbnail"
                  className="w-100 h-100"
                />
                {/* <p className="body-large mt-3 pt-2 text-white fw-bold">
              Artwork name
            </p> */}
                {/* <label htmlFor="" className="small v-center pointer mt-2">
                view artwork <img src={more} alt="arrow" className="img-12" />
              </label> */}
              </div>
            )}

            {userData?.spotUsername && (
              <div className="user-ico v-center">
                {/* <img src={user} alt="user" className="img-45" /> */}
                {userDataByUserName?.documentData?.image ? (
                  <img
                    src={userDataByUserName?.documentData.image}
                    alt="profile"
                    className="img-45"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <img src={user} alt="user" className="img-45" />
                )}
                <h4 className="medium-head ms-2 text-white">
                  @{userData?.spotUsername}
                </h4>
              </div>
            )}
            {userData?.spotHeader1 && userData?.spotSection2image && (
              <div className="q-box mt-60">
                <h6 className="text-white fw-normal text-italic pb-4 bb1 ">
                  {userData?.spotHeader1}
                </h6>
                <p
                  className="body-large  fw-normal details text-white mt-60"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                >
                  {userData?.spotSection1}
                </p>

                <div className="artwork-box">
                  <img
                    src={userData?.spotSection2image}
                    alt="thumbnail"
                    className="w-100 h-100"
                  />
                  {/* <p className="body-large mt-3 pt-2 text-white fw-bold">
                Artwork name
              </p> */}
                  {/* <label htmlFor="" className="small v-center pointer mt-2">
                view artwork <img src={more} alt="arrow" className="img-12" />
              </label> */}
                </div>
              </div>
            )}

            {userData?.spotHeader2 && userData?.spotSection3image1 && (
              <div className="q-box mt-60">
                <h6 className="text-white fw-normal text-italic pb-4 bb1">
                  {userData?.spotHeader2}
                </h6>
                <p
                  className="body-large  fw-normal details text-white mt-60"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                >
                  {userData?.spotSection2}
                </p>

                <div className="artwork-box">
                  <img
                    src={userData?.spotSection3image1}
                    alt="thumbnail"
                    className="w-100 h-100"
                  />
                  {/* <p className="body-large mt-3 pt-2 text-white fw-bold">
                Artwork name
              </p>
              <label htmlFor="" className="small v-center pointer mt-2">
                view artwork <img src={more} alt="arrow" className="img-12" />
              </label> */}
                </div>
              </div>
            )}

            <div className="explore-spotlight">
              <h6 className="text-white">
                Explore other works from this artist
                <a
                  className="text-light-grey body-large ms-3 pointer"
                  href="/explore"
                >
                  see more <img src={more} alt="arrow" className="img-12" />
                </a>
              </h6>

              {userData?.spotSection3image1 && userData?.spotSection3image2 && (
                <div className="more pt-4 v-center justify-content-between">
                  <div className="artwork-box-sm ">
                    <img
                      src={userData?.spotSection3image1}
                      alt="thumbnail"
                      className="thumbnail"
                    />
                    {/* <p className="body-large mt-3 pt-2 text-white fw-bold">
                  Artwork name
                </p>
                <label htmlFor="" className="small v-center pointer mt-2">
                  view artwork <img src={more} alt="arrow" className="img-12" />
                </label> */}
                  </div>

                  <div className="artwork-box-sm">
                    <img
                      src={userData?.spotSection3image2}
                      alt="thumbnail"
                      className="thumbnail"
                    />
                    <p className="body-large mt-3 pt-2 text-white fw-bold">
                      Artwork name
                    </p>
                    <label htmlFor="" className="small v-center pointer mt-2">
                      view artwork{" "}
                      <img src={more} alt="arrow" className="img-12" />
                    </label>
                  </div>
                </div>
              )}
            </div>
            {userData?.spotUsername && (
              <div className="profile-box  follow-box br-30 v-center justify-content-between  ">
                <div className="left v-center">
                  {/* <img src={user} alt="user" className="img-45" /> */}
                  {userDataByUserName?.documentData?.image ? (
                    <img
                      src={userDataByUserName?.documentData?.image}
                      alt="profile"
                      className="img-45"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <img src={user} alt="user" className="img-45" />
                  )}
                  <h6 className="fw-bold text-white ms-2 text-normal">
                    @{userData?.spotUsername}
                  </h6>
                </div>
                <div className="right pe-1 v-center gap-3">
                  <Button
                    text="Follow Artist"
                    className="btn-prime text-white btn-primary bg-transparent"
                    width="126px"
                    height="36px"
                    onClick={() => toast.success("Followed")}
                  />{" "}
                  <Button
                    text="View profile"
                    className="btn-prime text-black btn-primary bg-white"
                    width="126px"
                    height="36px"
                    onClick={() =>
                      navigate(`/profile/${userData?.spotUsername}`)
                    }
                  />
                </div>
              </div>
            )}

            <div className="artist-about-box  v-center justify-content-between">
              <div className="left">
                <a href="#" className="v-center">
                  <img src={website} alt="site" className="img-30" />
                  <p className="text-white ms-2">{userData?.spotWebsite}</p>
                </a>
              </div>
              <div className="right">
                <div className="social-links">
                  <a
                    href={userDataByUserName?.documentData?.userTwiter}
                    target="_blank"
                  >
                    <img src={instagram} alt="instagram" className="invert1" />
                  </a>
                  {/* <a  target={}>
                  <img src={discord} alt="discord" className="invert1" />
                </a> */}
                  <a href={userData?.spotTwitter} target="_blank">
                    <img src={twitter} alt="twitter" className="invert1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="spotlight-page-content   ">
            <p className="text-white">SpotLight Disabled</p>
          </div>
        )}
      </div>
      <FooterV2 />
    </div>
  );
};

export default Spotlight;
