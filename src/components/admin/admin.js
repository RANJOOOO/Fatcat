import React, { useEffect, useState } from "react";
import SpotLight from "./spotLight";
import Featured from "./featured";
import home from "../../assets/icon/home.svg";
import check from "../../assets/icon/check-circle.svg";
import sun from "../../assets/icon/sun.svg";
import settings from "../../assets/icon/settings.svg";
import list from "../../assets/icon/list-for-sale.svg";
import close from "../../assets/icon/close.svg";
import arrow from "../../assets/icon//chevron-down-extra-small.svg";
import { useNavigate } from "react-router-dom";
import Market from "./market";
import Blacklist from "./blacklist";
import SiteSetting from "./siteSetting";
import Whitelist from "./whitelist";
import Dashboard from "./dashboard";
import ArtistApllied from "./artistapplied";
import CollectionApplied from "./collectionApplied";
import { getAdminUser } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const account = useAccount();
  const [tabMenu, setTabMenu] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [mobileWidth, setMobileWidth] = useState(window.innerWidth);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setMobileWidth(window.innerWidth);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   if (mobileWidth < 1024) {
  //     setTabMenu(false);
  //   } else {
  //     setTabMenu(true);
  //   }
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [mobileWidth]);

  const [adminAddress, setAdminAddress] = useState([]);

  useEffect(() => {
    const getAdmin = async () => {
      const admin = await getAdminUser();
      setAdminAddress(admin);
    };

    getAdmin();
  }, []);

  useEffect(() => {
    setLoading(true);
    // console.log("adminAddress: ", adminAddress);
    // console.log("account: ", account.address);
    const admins = adminAddress?.address;
    // console.log("admins: ", admins);
    // console.log("condition: ", admins?.includes(account.address));
    // console.log("condition: ", admins?.length > 0);

    if (
      admins?.length > 0 &&
      admins !== undefined &&
      account.address !== undefined
    ) {
      // console.log("inside admins: ", admins);
      // console.log("admins: ", admins);
      if (admins?.includes(account.address)) {
        setLoading(false);
      } else {
        toast.error("You are not authorized to access this page");
        navigate("/");
      }
    }
  }, [adminAddress, account.address]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  return (
    <div>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="admin-dashbooard d-flex">
          <div className="left-content">
            <div className="admin-nav">
              <h6 className="text-capitalize admin-head v-center">
                admin panel
              </h6>
              <div className="admin-menu-links">
                {/* Desktop aside bar */}
                <ul className=" menu-link for-desktop">
                  {/* Dashboard */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "Dashboard" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Dashboard")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={home} alt="profile" className="me-3" />
                        Dashboard
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                    {/* <img src={arrow} alt="arror" className="rotate-90 img-18" /> */}
                  </li>
                  {/* Whitelist */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "Whitelist" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Whitelist")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={check} alt="profile" className="me-3" />
                        Whitelist
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>
                  {/* Spotlight */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "Spotlight" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Spotlight")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={sun} alt="profile" className="me-3" />
                        Spotlight
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>{" "}
                  {/* Featured Art */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "Featured" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Featured")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={sun} alt="profile" className="me-3" />
                        Featured Art
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>{" "}
                  {/* Spotlight */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "SiteSetting" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("SiteSetting")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={settings} alt="profile" className="me-3" />
                        Site Settings
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>
                  {/* Marketing & Promotions */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "Marketing" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Marketing")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={list} alt="profile" className="me-3" />
                        Marketing
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>
                  {/* Blacklist*/}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "Blacklist" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("Blacklist")}
                  >
                    <label className="text-black no-text-transform v-center justify-content-between  w-100   ps-3 pointer">
                      <span>
                        <img src={close} alt="profile" className="me-3" />
                        Blacklist
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>
                  {/* Artist Apllied*/}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "ArtistApllied" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("ArtistApllied")}
                  >
                    <label className="text-black no-text-transform v-center justify-content-between  w-100   ps-3 pointer">
                      <span>
                        <img src={check} alt="profile" className="me-3" />
                        Artist Apllied
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>
                  {/* collection Applied */}
                  <li
                    className={`h-64 v-center pointer ${
                      selectedTab === "collectionApplied" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("collectionApplied")}
                  >
                    <label className="text-black no-text-transform v-center justify-content-between  w-100   ps-3 pointer">
                      <span>
                        <img src={check} alt="profile" className="me-3" />
                        Collection Applied
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 hide-on-desktop"
                      />
                    </label>
                  </li>
                </ul>

                {/* mobile */}
                <ul className=" menu-link flex-column for-mobile">
                  {/* Dashboard */}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/admin-dashboard")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={home} alt="profile" className="me-3" />
                        Dashboard
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                    {/* <img src={arrow} alt="arror" className="rotate-90 img-18" /> */}
                  </li>
                  {/* Whitelist */}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/whitelist")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={check} alt="profile" className="me-3" />
                        Whitelist
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                  {/* Spotlight */}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/spotlight")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={sun} alt="profile" className="me-3" />
                        Spotlight
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                  {/* Featured Art */}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/featured-art")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={sun} alt="profile" className="me-3" />
                        Featured Art
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>

                  {/* site-settings */}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/site-settings")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={settings} alt="profile" className="me-3" />
                        Site Setting
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                  {/* Marketing & Promotions */}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/marketing-promotions")}
                  >
                    <label className="text-black no-text-transform v-center    justify-content-between  w-100 ps-3 pointer">
                      <span>
                        <img src={list} alt="profile" className="me-3" />
                        Marketing
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                  {/* Blacklist*/}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/black-list")}
                  >
                    <label className="text-black no-text-transform v-center justify-content-between  w-100   ps-3 pointer">
                      <span>
                        <img src={close} alt="profile" className="me-3" />
                        Blacklist
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                  {/* Artist Apllied*/}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/artist-applied")}
                  >
                    <label className="text-black no-text-transform v-center justify-content-between  w-100   ps-3 pointer">
                      <span>
                        <img src={check} alt="profile" className="me-3" />
                        Artist Apllied
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                  {/* collection Applied*/}
                  <li
                    className="h-64 v-center pointer "
                    onClick={() => navigate("/collection-applied")}
                  >
                    <label className="text-black no-text-transform v-center justify-content-between  w-100   ps-3 pointer">
                      <span>
                        <img src={check} alt="profile" className="me-3" />
                        Collection Applied
                      </span>
                      <img
                        src={arrow}
                        alt="profile"
                        className="me-3 rotate-270 "
                      />
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="right-content w-100 hide-on-mobile">
            {selectedTab === "Dashboard" ? <Dashboard /> : <></>}
            {selectedTab === "Whitelist" ? <Whitelist /> : <></>}
            {selectedTab === "Spotlight" ? <SpotLight /> : <></>}
            {selectedTab === "Featured" ? <Featured /> : <></>}
            {selectedTab === "SiteSetting" ? <SiteSetting /> : <></>}
            {selectedTab === "Marketing" ? <Market /> : <></>}
            {selectedTab === "Blacklist" ? <Blacklist /> : <></>}
            {selectedTab === "ArtistApllied" ? <ArtistApllied /> : <></>}
            {selectedTab === "collectionApplied" ? (
              <CollectionApplied />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
