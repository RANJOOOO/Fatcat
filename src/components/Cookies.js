import "../style/main.scss";
import close from "../assets/icon/close-small.svg";
import { React, useState } from "react";
import Button from "./button";
import useLocalStorage from "use-local-storage";
const Cookies = () => {
  const [visible, setVisible] = useLocalStorage("");
  const [conditionAccepted, setConditionAccepted] = useLocalStorage(false);

  // ============ handleVisible FUNCTIONS ============
  /* 
        @dev handleVisible is used to manage cookies.
        @param visible it  handle flag
    */
  const handleVisible = () => {
    console.log("visible", visible);
    console.log("conditionAccepted", conditionAccepted);
    setVisible(!visible);
    setConditionAccepted(true);
  };
  return (
    <div>
      {/* Cookies Manage Preference */}

      <div className="cookies" style={{ display: !visible ? "none" : "flex" }}>
        <p className="body-medium ">
          We use cookies on our website to give you the most relevant
          experience. Cookies help us understand how you interact with our site,
          allowing us to tailor content just for you. You can always
          <span> Manage Preferences </span>
          or change them later in your settings. <a href="">Privacy Policy.</a>
        </p>
        <div className="cookies-btns">
          <Button
            className=" btn-prime btn-primary  "
            text=" Reject All"
            onClick={handleVisible}
          />

          <Button
            className="btn-prime btn-secondary"
            text=" Accept All"
            onClick={handleVisible}
          />
        </div>

        <div className="close-cookies" onClick={handleVisible}>
          <img src={close} alt="close" />
        </div>
      </div>
    </div>
  );
};

export default Cookies;
