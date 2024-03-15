import React, { useEffect, useState } from "react";
import message from "../../assets/icon/email.svg";
import profile from "../../assets/icon/profile-black.svg";
import arrow from "../../assets/icon/chevron-up-small.svg";
import NotificationSettings from "./notificationSettings";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [tabMenu, setTabMenu] = useState(true);

  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleMenu = () => {
    setWindowWidth(window.innerWidth);
    if (windowWidth < 992) {
      setTabMenu(!tabMenu);
    } else if (windowWidth > 992) {
      setTabMenu(true);
    }
  };
  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleMenu);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleMenu);
    };
  }, [windowWidth]); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <div className="account-settings">
        <div className="acc-settings-head v-center">
          <h6>Settings</h6>
          <h3 className="fw-bold text-capitalize hide-on-mobile">
            {selectedTab} settings
          </h3>
        </div>
        <div className="account-content">
          <div className="left-content">
            {/* Desktop aside bar */}
            <ul className="hide-on-mobile">
              <li
                className={`h-64 v-center pointer ${
                  selectedTab === "profile" ? "active" : ""
                }`}
                onClick={() => handleTabClick("profile")}
              >
                <label className="text-black no-text-transform v-center profile  ps-3 pointer">
                  <img src={profile} alt="profile" className="me-2" />
                  Profile
                </label>
                {/* <img src={arrow} alt="arror" className="rotate-90 img-18" /> */}
              </li>
              <li
                className={`h-64 v-center pointer ${
                  selectedTab === "notifications" ? "active" : ""
                }`}
                onClick={() => handleTabClick("notifications")}
              >
                <label className="text-black no-text-transform v-center    ps-3 pointer">
                  <img src={message} alt="profile" className="me-2" />
                  Notifications
                </label>
              </li>
            </ul>

            {/* mobile */}
            <ul className="hide-on-desktop flex-column">
              <li
                className="h-64 v-center pointer"
                onClick={() => navigate("/notification")}
              >
                <label className="text-black no-text-transform v-center profile  ps-md-3 ps-1 pointer">
                  <img src={profile} alt="profile" className="me-2" />
                  Profile
                </label>
                <img src={arrow} alt="arror" className="rotate-90 img-18" />
              </li>

              <li
                className="h-64 v-center pointer"
                onClick={() => navigate("/notification-settings")}
              >
                <label className="text-black no-text-transform v-center   ps-md-3 ps-1 pointer">
                  <img src={message} alt="profile" className="me-2" />
                  Notifications
                </label>
                <img src={arrow} alt="arror" className="rotate-90 img-18" />
              </li>
            </ul>
          </div>

          <div className="right-content">
            {selectedTab === "profile" && (
              // <NotificationSettings activeClass={"active"} />
              <h3 className="mt-4">Coming Soon</h3>
            )}
            {selectedTab === "notifications" && (
              <NotificationSettings activeClass={"active"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
