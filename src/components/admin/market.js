import React, { useState, useEffect } from "react";
import Button from "../button";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import unchecked from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import Input from "../inputs";
import { useNavigate } from "react-router-dom";
import UseWindowResize from "../../customHooks/useWindowResize";
import {
  addOrUpdateTopBannerText,
  getTopBannerText,
} from "../../firebase/firebase";
import { set } from "firebase/database";

const Market = () => {
  const [spotActive, setSpotActive] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [banner, setBanner] = useState("");
  const [inputText, setInputText] = useState("");

  const navigate = useNavigate();

  const getBanner = async () => {
    const banner = await getTopBannerText();
    console.log("banner: ", banner);
    setBanner(banner);
    setSpotActive(banner?.enable);
    setInputText(banner?.text);
  };

  useEffect(() => {
    getBanner();
  }, []);

  useEffect(() => {
    if (inputText !== banner?.text || spotActive !== banner?.enable) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [inputText, spotActive]);

  UseWindowResize(1024, "/admin");
  return (
    <div>
      <div className="market-pormotion">
        <div className="admin-content-head v-center justify-content-between header-fixed  ">
          {/* Header for desktop */}
          <h3 className="fw-bold text-capitalize for-desktop">Marketing</h3>
          {/* Header for mobile */}
          <h6
            className="fw-bold text-capitalize for-mobile"
            onClick={() => navigate(-1)}
          >
            <img src={leftArrow} alt="back" className="me-3" />
            Marketing
          </h6>

          {/* button is disabled until some state has changed on the page */}
          {/* when some data is changed or entered in form fields then save changes button btn-ternary class will replace with btn-primary  */}
          <Button
            width="170px"
            height="47px"
            className={`br-30 ${changesMade ? "btn-primary" : "btn-ternary"}`}
            text="Save changes"
            disabled={!changesMade}
            onClick={() => {
              addOrUpdateTopBannerText(inputText, spotActive);
              setChangesMade(false);
            }}
          />
        </div>
        <div className="market-content mt-36">
          <p className="body-large fw-bold ">Banner</p>
          <p className="body-medium mt-3 pt-2">
            Enabling this Banner temporarily shows a banner at the top of the
            landing page, above the navigation.
          </p>
          <div className="enable-banner mt-4 mb-5 ms-3">
            <label
              className="text-black no-text-transform v-center pointer"
              onClick={(e) => setSpotActive(!spotActive)}
            >
              <img
                src={spotActive ? checked : unchecked}
                alt="checkbox"
                className="me-3"
              />
              Enable Banner
            </label>
          </div>

          <div className="spot-input-box">
            <label className="medium text-black">Banner message</label>

            {/* everywhere there is an SGB / FLR address field it should follow
              the same error rules */}

            <div className="input-box br-30 ps-3 mt-3">
              <Input
                placeholder="Add banner message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
