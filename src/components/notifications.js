import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button";

// icons
import spike from "../assets/icon/spiked-circle/black/35px.svg";
import minted from "../assets/icon/favicon-24px.svg";
import unread from "../assets/icon/circleRed.svg";
import arrow from "../assets/icon/chevron-up-small.svg";
import offerMade from "../assets/icon/offer-made.svg";
import listed from "../assets/icon/list-for-sale.svg";
import {
  getNotifications,
  markAllNotificationsAsRead,
  updateSingleIsReadInDatabase,
  getSettingFirebase,
  updateNotificationVisiblity,
} from "../firebase/firebase";
import { useAccount } from "wagmi";

const Notifications = (props) => {
  const navigate = useNavigate();
  const { address } = useAccount();
  let username = localStorage?.getItem("userName");
  const [notification, setNotification] = useState([]);
  const [isRead, setIsRead] = useState(false);

  const allRead = () => {
    markAllNotificationsAsRead(username);
    fetchNotification();
    setIsRead(true);
  };
  useEffect(() => {
    if (username) {
      // getNotifications(username, address).then((notification) => {
      //   setNotification(notification);
      // });
      fetchNotification();
    }
  }, []);

  const fetchNotification = async () => {
    try {
      const notifications = await getNotifications(username, address);
      setNotification(notifications);
    } catch (error) {
      console.error(error);
    }
  };

  const getSetting = async () => {
    try {
      const settings = await getSettingFirebase(address);
      if (settings && settings.data) {
        console.log(settings.data);
        for (let a of notification) {
          updateNotificationVisiblity(settings.data[a.notificationType], a.id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  const markNotificationAsRead = async (notification) => {
    try {
      await updateSingleIsReadInDatabase(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div>
      <section className={`notifications  site-container ${props.activeClass}`}>
        <div
          className={`section-header-2 v-center justify-content-between ${props.noBorder} `}
        >
          {/* desktop */}
          <h3 className={` fw-bolder v-center hide-on-mobile ${props.hide}`}>
            <img src={spike} alt="spike" className="me-1" />
            Notifications
          </h3>

          {/* mobile */}
          <h6
            className={`mt-0 v-center hide-on-desktop ${props.hide}`}
            onClick={() => navigate("/account-settings")}
          >
            <img src={arrow} alt="arrow" className="me-3 rotate-270 " />
            Notifications
          </h6>

          {/* <p className="body-large fw-bold">Volume</p> */}
          <Button
            text={"Mark all as Read"}
            // className="btn-prime btn-primary hide-on-mobile"
            className={`btn-prime ${
              isRead ? "btn-secondary" : "btn-primary"
            } hide-on-mobile  `}
            disabled={isRead}
            width="123px"
            height="36px"
            onClick={allRead}
          />
        </div>

        {/* <h5 className="fw-bold no-text-transform">History</h5> */}

        <div className="notifications-content">
          {notification.map(
            (notification, index) => (
              console.log("notification.isRead", notification.isRead),
              notification.isVisible ? (
                <div
                  className="histrory-list justify-content-between"
                  key={index}
                >
                  <div className="d-flex pointer">
                    <div className="left img-24 v-center justify-content-center">
                      {notification.notificationType == "listed" && (
                        <img src={listed} alt="offer" className="img-14" />
                      )}
                      {notification.notificationType == "successPurchase" && (
                        <img src={offerMade} alt="offer" className="img-14" />
                      )}
                      {notification.notificationType == "bidActivity" && (
                        <img src={offerMade} alt="offer" className="img-14" />
                      )}
                      {notification.notificationType == "soldItem" && (
                        <img src={offerMade} alt="offer" className="img-14" />
                      )}
                      {notification.notificationType == "minted" && (
                        <img src={minted} alt="offer" />
                      )}
                    </div>
                    <div className="right">
                      <p className="body-medium">
                        {!notification.isRead && (
                          <img
                            src={unread}
                            alt="notification"
                            className="img-12 me-1"
                          />
                        )}

                        {notification.content}
                      </p>
                      <label className="small">{notification.createdAt}</label>
                    </div>
                  </div>
                  <div>
                    <label
                      // className="medium pointer text-black no-text-transform hide-on-mobile"
                      className={`medium pointer  no-text-transform hide-on-mobile ${
                        notification.isRead ? "text-gray" : "text-primary"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      Mark as read
                    </label>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </section>
      <div className="footer-read-btn v-center justify-content-center hide-on-desktop ">
        <Button
          text={"Mark as Read"}
          className="btn-prime btn-primary"
          width="90%"
          height="36px"
          onClick={allRead}
        />
      </div>
    </div>
  );
};

export default Notifications;
