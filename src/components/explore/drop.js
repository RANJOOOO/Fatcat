import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import { Tab, Tabs } from "react-bootstrap";
// icons
import star20 from "../../assets/icon/spiked-circle/black/24px.svg";
import grid from "../../assets/icon/display-grid.svg";
import artwork from "../../assets/icon/display-artwork.svg";
import collection from "../../assets/icon/collection.svg";
import useScrollToTop from "../../customHooks/scrollToTop";
import AllCollections from "../allcollections";
import filter from "../../assets/icon/filter.svg";
import row from "../../assets/icon/display-row-active.svg";
import sortby from "../../assets/icon/sort-by.svg";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";
// import LayoutGrid from "../profile/layoutGrid";
import LayoutDropGrid from "./layoutDropGrid";
import AsideFilterExplore from "./asideFilterExplore";
import { Offcanvas } from "react-bootstrap";

const Drop = () => {
  const [key, setKey] = useState("artwork");
  useScrollToTop();

  const [activeLayout, setactiveLayout] = useState("grid");
  const [mobileLayout, setMobileLayout] = useState(false);

  // multi filters\w

  const [showSideFilter, setShowSideFilter] = useState(false);
  const [Flag, setFlag] = useState(false);

  //  handle mobile filters
  // const handleClose = () => setMobileLayout(false);
  // const handleShow = () => setMobileLayout(true);

  // layout tabs handles

  const handleActiveLayout = (image) => {
    setactiveLayout(image);
  };

  // let layout handle the icon of currently selected layout
  let layout;
  if (activeLayout == "grid") {
    layout = grid;
  } else if (activeLayout == "row") {
    layout = row;
  } else if (activeLayout == "artwork") {
    layout = artwork;
  }

  // ======================collection sorting filter
  const collectionSortFilter = [
    { value: "Recently active", label: "Recently active" },
    { value: "Ending soon", label: "Ending soon" },
    { value: "Lowest price", label: "Lowest price" },
    { value: "Highest price", label: "Highest price" },
    { value: "Newest", label: "Newest" },
    { value: "Oldest", label: "Oldest" },
  ];

  const [activeCollection, setActiveCollection] = useState("Recently active");

  const handleIPriceTick = (tick) => {
    setActiveCollection(tick);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 992) {
        setShowSideFilter(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  // to show and hide collection multi filter
  const showMobileSideFilter = () => {
    if (windowWidth < 1000) {
      setShowSideFilter(true);
    } else {
      setFlag(!Flag);
    }
  };

  const closeMobileSideFilter = () => setShowSideFilter(false);

  // mobile sort filter
  const [collectionMobileFilter, setCollectionMobileFilter] = useState(false);
  const [activeCollectionFilter, setActiveCollectionFilter] =
    useState("Recently active");
  const hideMobileSortFilter = () => setCollectionMobileFilter(false);

  const showMobileSortFilter = () => {
    setCollectionMobileFilter(true);
  };
  const handleCollectionTick = (tick) => {
    setActiveCollectionFilter(tick);
    setCollectionMobileFilter(false);
  };

  return (
    <div>
      <div className="explore-art  explore-art-wrapper ">
        <div className="explore-art-content">
          <h4 className="fw-bold ">Drops</h4>
          <p className="body-large ">
            The Catalyst gallery of Currently Live Drops.
          </p>
          <div className="profile-tabs">
            <Tabs
              defaultActiveKey="artwork"
              id="uncontrolled-tab-example"
              className="mb-3 profile-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab
                eventKey="artwork"
                title={
                  <span>
                    <img
                      src={key == "artwork" ? star20 : artwork}
                      alt="star"
                      className={
                        key == "artwork"
                          ? "hide-on-mobile spikeimg"
                          : "hide-on-mobile"
                      }
                    />
                    artwork
                  </span>
                }
              >
                <div>
                  <div>
                    {/* <div className="collection-filter">
                      <div className="left">
                        <div
                          className="show-filter cursor-pointer "
                          onClick={showMobileSideFilter}
                        >
                          <span>
                            <img src={filter} alt="filter" id="filter" />
                          </span>
                          <label
                            htmlFor="filter"
                            className="medium text-black cursor-pointer ms-1 hide-on-mobile"
                          >
                            Show Filters
                          </label>
                        </div>
                        <div className="t-items">
                          <label className="medium ms-4">34 Items</label>
                        </div>
                      </div>

                      <div className="right"> */}
                    {/* Sorting filter dropdown desktop*/}
                    {/* <div className="recent-collection filter dropdown hide-on-mobile ">
                          <p
                            className="body-medium dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span className="hide-on-mobile">
                              {
                                collectionSortFilter.find(
                                  (option) => option.value === activeCollection
                                )?.label
                              }
                            </span>
                            <span>
                              <img src={sortby} alt="sortby" />
                            </span>
                          </p>
                          <ul className="dropdown-menu">
                            {collectionSortFilter.map((option) => {
                              return (
                                <li
                                  className="dropdown-item"
                                  key={option.value}
                                  onClick={() => handleIPriceTick(option.value)}
                                >
                                  <img
                                    src={tick}
                                    alt="tick"
                                    className={`${
                                      activeCollection === option.value
                                        ? "active opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {option.label}
                                </li>
                              );
                            })}
                          </ul>
                        </div> */}

                    {/* Sorting filter dropdown Mobile*/}
                    {/* <div className="recent-collection filter hide-on-desktop ">
                          <p
                            className="body-medium "
                            onClick={showMobileSortFilter}
                          >
                            <span className="hide-on-mobile">
                              {
                                collectionSortFilter.find(
                                  (option) => option.value === activeCollection
                                )?.label
                              }
                            </span>
                            <span>
                              <img src={sortby} alt="sortby" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div> */}
                    {/* <LayoutExploreGrid flag={Flag} />
        |<LayoutGrid /> */}
                    <LayoutDropGrid flag={Flag} />
                  </div>
                  <Offcanvas
                    show={showSideFilter}
                    onHide={closeMobileSideFilter}
                    placement="bottom"
                    className="sub-menu-offcanvas collection-multi-filter aside-filter-offcanvas"
                  >
                    <div className="more-menu-sm price-more-menu ">
                      <div className="menu-head">
                        {/* <label htmlFor="">1023 Items</label> */}
                        <label className="text-black multi-filter-head">
                          Filters
                        </label>
                        <div className="close-btn cursor-pointer">
                          <img
                            src={close}
                            alt="close"
                            className="img-24"
                            onClick={closeMobileSideFilter}
                          />
                        </div>
                      </div>
                      {/* 
                      <AsideFilterExplore /> */}
                    </div>
                  </Offcanvas>

                  {/* Collection Sorting Filter mobile menu */}
                  <Offcanvas
                    show={collectionMobileFilter}
                    onHide={hideMobileSortFilter}
                    placement="bottom"
                    className="sub-menu-offcanvas"
                  >
                    <div className="more-menu-sm price-more-menu">
                      <div className="menu-head">
                        <label className="text-black">sort by</label>
                        <div className="close-btn cursor-pointer">
                          <img
                            src={close}
                            alt="close"
                            className="img-24"
                            onClick={hideMobileSortFilter}
                          />
                        </div>
                      </div>

                      <div className="share">
                        {collectionSortFilter.map((option) => (
                          <label
                            key={option.value}
                            className={`no-text-transform h-64 text-black ${
                              activeCollectionFilter === option.value
                                ? "fw-bold"
                                : "fw-normal"
                            }`}
                            onClick={() => handleCollectionTick(option.value)}
                          >
                            {option.label}
                            <img
                              src={tick}
                              alt="tick"
                              className={`${
                                activeCollectionFilter === option.value
                                  ? "active opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </Offcanvas>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drop;
