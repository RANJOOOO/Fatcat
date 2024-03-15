import React, { useState } from "react";
import Header from "../header";
import spike from "../../assets/icon/spiked-circle/black/24px.svg";
import Collection from "../../assets/icon/collection-white.svg";
import logo from "../../assets/images/logo.png";
import Button from "../button";
import { useNavigate } from "react-router-dom";
const CreateArtTabs = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Artwork");
  const createNavigation = () => {
    if (selectedTab === "Artwork") {
      navigate("/create-art");
    } else if (selectedTab === "Collection") {
      alert("hyu");
      navigate("/create-collections");
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  return (
    <div>
      <div className="create-art-tabs">
        <Header head="Create" />
        <div className="content-wrapper">
          <div className="left">
            <label className="small">CREATE</label>
            <div className="wrapper-tabs">
              <label
                className={`text-black pointer no-text-transform mb-3 ${
                  selectedTab === "Artwork" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Artwork")}
              >
                <img src={spike} alt="spike" />
                Artwork
              </label>
              <label
                className={`text-black pointer no-text-transform mb-3 ${
                  selectedTab === "Collection" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Collection")}
              >
                <img src={Collection} alt="spike" />
                Collection
              </label>
            </div>
          </div>

          <div className="right ">
            <div className="site-logo">
              <img src={logo} alt="" className="invert1" />
            </div>
            <h4 className="medium-head text-white">
              <img src={spike} alt="" className="img-48 invert1 me-3" />
              Create New {selectedTab}
            </h4>
            <p className="w-50 text-white body-medium fw-light mt-3 mb-5">
              Create a new artwork and mint it to one of your own ERC-721 smart
              contract.{" "}
              <a href="#" className="text-white text-decoration-underline">
                Learn more
              </a>
            </p>
            <Button
              text={`Create ${selectedTab}`}
              className="border-0 bg-white text-black btn-prime btn-primary fs-6 br-30"
              width="195px"
              height="47px"
              onClick={createNavigation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArtTabs;
