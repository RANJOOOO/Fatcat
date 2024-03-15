import React, { useState, useEffect } from "react";
import "../../style/main.scss";
import spike from "../../assets/icon/spiked-circle/black/35px.svg";
import flr from "../../assets/icon/FLR.svg";
import sgb from "../../assets/icon/SGB.svg";
import drop from "../../assets/icon/chevron-down-extra-small.svg";
import tick from "../../assets/icon/tick-small-white.svg";
import TopArtist from "./topArtist";
import TopCollection from "./topCollection";
import { getAllCollectionStats, getCollections } from "../../firebase/firebase";
import {
  getAllArtistDetails,
  getAllArtistStats,
  getAllUsers,
} from "../../firebase/firebase";
import { set } from "firebase/database";

const StatTabs = () => {
  // const timeOptions = ["24h", "7d", "30d", "All"];

  const [statTab, setActiveStatTab] = useState("Artist");
  const [timeTab, setActiveTimeTab] = useState("All");
  const [currTab, setActiveCurrTab] = useState("All");

  const [selectedTimeOption, setSelectedTimeOption] = useState("24h");

  const [timeDropdown, setTimeDropdown] = useState(false);
  const [chainDropdown, setChainDropdown] = useState(false);

  const selectTab = (tabname) => {
    setActiveStatTab(tabname);
  };

  const selectTimeTab = (timeTabName) => {
    setActiveTimeTab(timeTabName);
    setTimeDropdown(!timeDropdown);
  };

  const selectCurrTab = (currTabName) => {
    setActiveCurrTab(currTabName);
    setChainDropdown(!chainDropdown);
  };

  const toggleTime = () => {
    setTimeDropdown(!timeDropdown);
    setChainDropdown(false);
  };
  const toggleChain = () => {
    setChainDropdown(!chainDropdown);
    setTimeDropdown(false);
  };
  const handleOptionClick = (option) => {
    setSelectedTimeOption(option);
    setTimeDropdown(false);
  };

  const [collectionData, setCollectionData] = useState([]);
  const [collectionStats, setCollectionStats] = useState([]);
  const [collectionStatsData, setCollectionStatsData] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [artist, setArtist] = useState([]);

  const handleGetCollections = async () => {
    await getCollections()
      .then((res) => {
        console.log("Collections", res);
        setCollectionData(res);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleGetAllCollectionStats = async () => {
    await getAllCollectionStats()
      .then((res) => {
        console.log("Collection Stats", res);
        setCollectionStatsData(res);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleGetAllArtistStats = async () => {
    console.log("getAllArtistStats");

    await getAllArtistStats()
      .then((res) => {
        setData(res);
        console.log("artists stats res", res);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleGetAllUsers = async () => {
    console.log("getAllUsers");
    await getAllUsers()
      .then((res) => {
        setUser(res);
        console.log("user res", res);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  useEffect(() => {
    handleGetCollections();
    handleGetAllCollectionStats();
    handleGetAllArtistStats();
    handleGetAllUsers();
  }, []);

  useEffect(() => {
    let data = collectionStatsData;

    console.log("collections Stats data", data);
    console.log("collections Stats collectionData", collectionData);
    const result = data.map((item) => {
      collectionData.map((data) => {
        if (item?.collectionId === data?.documentId) {
          item.data = data;
        }
      });
      return item;
    });
    console.log("collections Stats result", result);
    setCollectionStats(result);
  }, [collectionData, collectionStatsData]);

  useEffect(() => {
    getAllArtistDetails().then((res) => {
      console.log("artist details res", res);
      const ArtistDetails = data?.map((item) => {
        // console.log("item", item);
        let itemData = item;
        res.map((user) => {
          // console.log("data", user);
          if (user?.documentId === item?.artistAddress) {
            itemData.data = user?.data;
          }
        });
        user.map((user) => {
          // console.log("user", user);
          if (item?.artistAddress === user?.id) {
            itemData.image = user?.image;
            itemData.userName = user?.userName;
          }
        });
        return itemData;
      });

      console.log("ArtistDetails 1", ArtistDetails);
      ArtistDetails.sort((a, b) => {
        return b?.salesCount - a?.salesCount;
      });
      console.log("ArtistDetails 2", ArtistDetails);
      setArtist(ArtistDetails);
    });
  }, [data, user]);

  return (
    <>
      <div>
        <div className="stats-header site-container ">
          <h3 className="fw-bold text-uppercase">
            <img src={spike} alt="spike" />
            <span>top</span>
            {statTab}
          </h3>
        </div>

        <div className="stat-tabs site-container v-center justify-content-between">
          <div className="left-content">
            <ul>
              <li
                className={`stat-tab v-center ${
                  statTab === "Artist" ? "active " : ""
                }`}
                onClick={() => selectTab("Artist")}
              >
                <label className="text-black pointer ">Artist</label>
              </li>

              {/* <li
                className={`stat-tab v-center ${
                  statTab === "Series" ? "active " : ""
                }`}
                onClick={() => selectTab("Series")}
              >
                <label className="text-black pointer ">Series</label>
              </li> */}

              <li
                className={`stat-tab v-center ${
                  statTab === "Collections" ? "active " : ""
                }`}
                onClick={() => selectTab("Collections")}
              >
                <label className="text-black pointer ">Collections</label>
              </li>

              {/* <li
                className={`stat-tab v-center ${
                  statTab === "Collectors" ? "active " : ""
                }`}
                onClick={() => selectTab("Collectors")}
              >
                <label className="text-black pointer ">Collectors</label>
              </li> */}
            </ul>
          </div>

          <div className="right-content v-center">
            {/* <ul className="time-tabs v-center hide-on-mobile">
              <li
                className={`time-tab v-center ${
                  timeTab === "24h" ? "active " : ""
                }`}
                onClick={() => setActiveTimeTab("24h")}
              >
                <label className=" pointer ">24h</label>
              </li>

              <li
                className={`time-tab v-center ${
                  timeTab === "7d" ? "active " : ""
                }`}
                onClick={() => setActiveTimeTab("7d")}
              >
                <label className=" pointer ">7d</label>
              </li>

              <li
                className={`time-tab v-center ${
                  timeTab === "30d" ? "active " : ""
                }`}
                onClick={() => setActiveTimeTab("30d")}
              >
                <label className=" pointer ">30d</label>
              </li>

              <li
                className={`time-tab v-center ${
                  timeTab === "All" ? "active " : ""
                }`}
                onClick={() => setActiveTimeTab("All")}
              >
                <label className=" pointer ">All</label>
              </li>
            </ul> */}

            <ul className="time-tab v-center ms-5 hide-on-mobile">
              {/* flr */}
              <li
                className={`time-tab v-center ${
                  currTab === "FLR" ? "active " : ""
                }`}
                onClick={() => selectCurrTab("FLR")}
              >
                <label className=" pointer ">
                  <img src={flr} alt="flr" />
                </label>
              </li>

              {/* sgb */}
              <li
                className={`time-tab v-center ${
                  currTab === "SGB" ? "active " : ""
                }`}
                onClick={() => selectCurrTab("SGB")}
              >
                <label className=" pointer ">
                  <img src={sgb} alt="sgb" />
                </label>
              </li>

              {/* All */}
              <li
                className={`time-tab v-center ${
                  currTab === "All" ? "active " : ""
                }`}
                onClick={() => selectCurrTab("All")}
              >
                <label className=" pointer ">All</label>
              </li>
            </ul>

            <div className="w-100 d-flex justify-content-between hide-on-desktop">
              {/* ------------------------------------------ */}

              <div class="dropdown time-tab-dropdown">
                <div
                  class=" bg-transparent dropdown-toggle  dropdown-btn w-100 v-center  justify-content-between no-after"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <p className="body-large">{timeTab}</p>
                  <img src={drop} alt="dropdown" />
                </div>
                {/* <ul class="dropdown-menu dropdown-on w-100 p-0">
                  <p
                    className={`body-large  ${
                      "24h" === timeTab ? "selected" : ""
                    }`}
                    onClick={() => selectTimeTab("24h")}
                  >
                    24h
                    {timeTab === "24h" && <img src={tick} alt="tick" />}
                  </p>


                  <p
                    className={`body-large  ${
                      "7d" === timeTab ? "selected" : ""
                    }`}
                    onClick={() => selectTimeTab("7d")}
                  >
                    7d
                    {timeTab === "7d" && <img src={tick} alt="tick" />}
                  </p>


                  <p
                    className={`body-large  ${
                      "30d" === timeTab ? "selected" : ""
                    }`}
                    onClick={() => selectTimeTab("30d")}
                  >
                    30d
                    {timeTab === "30d" && <img src={tick} alt="tick" />}
                  </p>


                  <p
                    className={`body-large  ${
                      "All" === timeTab ? "selected" : ""
                    }`}
                    onClick={() => selectTimeTab("All")}
                  >
                    All
                    {timeTab === "All" && <img src={tick} alt="tick" />}
                  </p>
                </ul> */}
              </div>

              {/* ------------------------------------------ */}

              <div class="dropdown time-tab-dropdown">
                <div
                  class=" bg-transparent dropdown-toggle  dropdown-btn w-100 v-center  justify-content-between no-after"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <p className="body-large">{currTab}</p>
                  <img src={drop} alt="dropdown" />
                </div>
                <ul class="dropdown-menu dropdown-on w-100 p-0">
                  <p
                    className={`body-large  ${
                      "FLR" === currTab ? "selected" : ""
                    }`}
                    onClick={() => selectCurrTab("FLR")}
                  >
                    FLR
                    {currTab === "FLR" && <img src={tick} alt="tick" />}
                  </p>

                  {/* SGB */}
                  <p
                    className={`body-large  ${
                      "SGB" === currTab ? "selected" : ""
                    }`}
                    onClick={() => selectCurrTab("SGB")}
                  >
                    SGB
                    {currTab === "SGB" && <img src={tick} alt="tick" />}
                  </p>

                  {/* All */}
                  <p
                    className={`body-large  ${
                      currTab === "All" ? "selected" : ""
                    }`}
                    onClick={() => selectCurrTab("All")}
                  >
                    All
                    {currTab === "All" && <img src={tick} alt="tick" />}
                  </p>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="active-tabs site-container">
          {statTab == "Artist" ? (
            <TopArtist currencyFilter={currTab} artist={artist} />
          ) : statTab == "Series" ? (
            <TopArtist currencyFilter={currTab} />
          ) : statTab == "Collections" ? (
            <TopCollection
              currencyFilter={currTab}
              collectionStats={collectionStats}
            />
          ) : statTab == "Collectors" ? (
            <TopCollection currencyFilter={currTab} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default StatTabs;
