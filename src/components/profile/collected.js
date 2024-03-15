import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import { Offcanvas } from "react-bootstrap";
import LayoutGrid from "./layoutGrid";
import LayoutRow from "./layoutRow";
import LayoutArtwork from "./layoutArtwork";
import Button from "../button";
import Input from "../inputs";
import Accordion from "react-bootstrap/Accordion";
import AsideFilter from "./asideFilter";
import NoContent from "../noContent";
import AllCollections from "../allcollections";
import { useNavigate } from "react-router-dom";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";

// icons

import filter from "../../assets/icon/filter.svg";
import grid from "../../assets/icon/display-grid-active.svg";
import row from "../../assets/icon/display-row-active.svg";
import artwork from "../../assets/icon/display-artwork-active.svg";
import sortby from "../../assets/icon/sort-by.svg";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";

// collected are
import { getCollections } from "../../firebase/firebase";
import { useAccount, useWalletClient } from "wagmi";

const Collected = (props) => {
  const [activeLayout, setactiveLayout] = useState("grid");
  const [mobileLayout, setMobileLayout] = useState(false);
  const { address } = useAccount();

  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;

  const [collectionDetails, setCollectionDetails] = useState(props?.ApvNFT);
  const [nftDetails, setNftDetails] = useState([]);
  // const web3 = new Web3(window.ethereum);

  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (collectionDetails?.selectedNetwork === "Coston") {
      setWeb3(new Web3(process.env.REACT_APP_COSTON_RPC_URL));
      console.log("connected to coston explorer collection");
    }
    if (collectionDetails?.selectedNetwork === "Coston2") {
      setWeb3(new Web3(process.env.REACT_APP_COSTON2_RPC_URL));
      console.log("connected to coston2 explorer collection");
    }
  }, [collectionDetails]);

  const getListNFTData = async () => {
    // const accounts = await web3.eth.getAccounts();
    if (collectionDetails?.Approved && web3 !== null) {
      // getting nft records from Marketplace contract
      let MarketplaceAddress;
      if (collectionDetails?.selectedNetwork === "Coston") {
        MarketplaceAddress = Marketplace_coston_contractAddress;
      } else if (collectionDetails?.selectedNetwork === "Coston2") {
        MarketplaceAddress = Marketplace_coston2_contractAddress;
      }
      console.log(
        "collectionDetails?.selectedNetwork",
        collectionDetails?.selectedNetwork
      );
      console.log("MarketplaceAddress", MarketplaceAddress);
      const contract = new web3.eth.Contract(contractABI, MarketplaceAddress);
      console.log("contract", contract);
      const data = await contract.methods
        .getNFTDetail(address, [`${collectionDetails.contractAddress}`])
        .call({ from: address });
      console.log("nft contract data", data);
      setNftDetails(data[0]);
    }
  };

  useEffect(() => {
    getListNFTData();
  }, [collectionDetails, web3]);

  const [itemNumber, setItemNumber] = useState(0);

  useEffect(() => {
    setItemNumber(nftDetails.length);
  }, [nftDetails]);

  const navigate = useNavigate();

  const [showSideFilter, setShowSideFilter] = useState(false);
  const [Flag, setFlag] = useState(false);
  const [showFilter, setShowFilter] = useState("show filter");

  //  handle mobile filters
  const handleClose = () => setMobileLayout(false);
  const handleShow = () => setMobileLayout(true);

  // layout tabs handles

  const handleActiveLayout = (image) => {
    setactiveLayout(image);
    setMobileLayout(false);
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
  // const collectionSortFilter = [
  //   { value: "Recently collected", label: "Recently collected" },
  //   { value: "Recently received", label: "Recently received" },
  //   { value: "Lowest price", label: "Lowest price" },
  //   { value: "Highest price", label: "Highest price" },
  //   { value: "Recently Listed", label: "Recently Listed" },
  //   { value: "Highest last sale", label: "Highest last sale" },
  //   { value: "Oldest", label: "Oldest" },
  // ];
  const collectionSortFilter = [
    { value: "Recently Minted", label: "Recently Minted" },
    { value: "Lowest price", label: "Lowest price" },
    { value: "Highest price", label: "Highest price" },
    { value: "Recently Listed", label: "Recently Listed" },
  ];

  const [activeCollection, setActiveCollection] = useState("Recently Minted");

  const handleIPriceTick = (tick) => {
    setActiveCollection(tick);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    console.log("props collected", props);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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
    useState("Recently Minted");

  const showMobileSortFilter = () => {
    setCollectionMobileFilter(true);
  };
  const hideMobileSortFilter = () => setCollectionMobileFilter(false);
  const handleCollectionTick = (tick) => {
    setActiveCollectionFilter(tick);
    setCollectionMobileFilter(false);
  };

  const startCollecting = () => {
    // Handle the button click event
  };
  useEffect(() => {
    console.log(showSideFilter);
  }, [showSideFilter]);

  // getting collections from firebase
  let username = localStorage?.getItem("userName");
  const [collections, setCollections] = useState([]);
  // const navigate = useNavigate();
  const getUserCollections = async () => {
    const usercollections = await getCollections();
    console.log(usercollections);
    setCollections(usercollections);
  };
  useEffect(() => {
    getUserCollections();
  }, []);

  useEffect(() => {
    console.log(collections);
  }, [collections]);

  return (
    <div>
      <div className="collected-arts ">
        {/* <div className={` ${props.propFromCollections}`}>
          <NoContent
            buttonText="Start collecting"
            messageSpan={<span>collected</span>}
            onClick={startCollecting}
          />
        </div> */}

        {/* User having  arts */}

        <div className="have-arts">
          <div className="collection-filter">
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
                  className="medium text-black cursor-pointer ms-1 hide-on-mobile "
                >
                  {showSideFilter ? "hide filter" : "show filter"}
                </label>
              </div>
              <div className="t-items">
                <label className="medium ms-4">{itemNumber} Items</label>
              </div>
            </div>

            <div className="right">
              {/* layout tabs for desktop version */}
              <div className="collection-grid hide-on-mobile">
                <img
                  src={grid}
                  alt="grid"
                  className={
                    activeLayout === "grid" ? "active opacity-100 " : ""
                  }
                  onClick={() => handleActiveLayout("grid")}
                />
                <div className="divider"></div>
                <img
                  src={row}
                  alt="grid"
                  className={activeLayout === "row" ? "active opacity-100" : ""}
                  onClick={() => handleActiveLayout("row")}
                />
                <div className="divider"></div>
                <img
                  src={artwork}
                  alt="grid"
                  className={
                    activeLayout === "artwork" ? "active opacity-100" : ""
                  }
                  onClick={() => handleActiveLayout("artwork")}
                />
              </div>

              {/* layout tabs for  mobile menu */}
              <div className="collection-grid-sm">
                <span
                  className="hide-on-desktop d-flex align-items-center me-1"
                  onClick={handleShow}
                >
                  <img
                    src={layout}
                    alt="layout"
                    className={activeLayout === "grid" ? "active " : ""}
                  />
                </span>
              </div>

              {/* Sorting filter dropdown desktop*/}
              <div className="recent-collection filter dropdown hide-on-mobile ">
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
                    console.log("active", activeCollection);
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
              </div>

              {/* Sorting filter dropdown Mobile*/}
              <div className="recent-collection filter hide-on-desktop ">
                <p className="body-medium " onClick={showMobileSortFilter}>
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
          </div>

          {/* will show active Layout */}

          {activeLayout == "grid" ? (
            <LayoutGrid
              flag={Flag}
              nfts={props.nfts}
              ApvNFT={props.ApvNFT}
              nftDetails={nftDetails}
              isOwner={props.isOwner}
              sortFilter={activeCollection}
            />
          ) : activeLayout == "row" ? (
            <LayoutRow
              flag={Flag}
              nfts={props.nfts}
              ApvNFT={props.ApvNFT}
              nftDetails={nftDetails}
              isOwner={props.isOwner}
              sortFilter={activeCollection}
            />
          ) : activeLayout == "artwork" ? (
            <LayoutArtwork
              flag={Flag}
              nfts={props.nfts}
              ApvNFT={props.ApvNFT}
              nftDetails={nftDetails}
              isOwner={props.isOwner}
              sortFilter={activeCollection}
            />
          ) : (
            <></>
          )}
        </div>
        {/* show those arts that matches username */}
      </div>

      {/* layout filter */}

      <Offcanvas
        show={mobileLayout}
        onHide={handleClose}
        placement="bottom"
        className="sub-menu-offcanvas"
      >
        <div className="more-menu-sm price-more-menu ">
          <div className="menu-head">
            <label className="text-black">layout</label>
            <div className="close-btn cursor-pointer">
              <img
                src={close}
                alt="close"
                className="img-24"
                onClick={handleClose}
              />
            </div>
          </div>

          <div className="share">
            <label
              className=" h-64 text-black"
              onClick={() => handleActiveLayout("grid")}
            >
              <div>
                <img src={grid} alt="grid" className="me-3 " />
                Grid Layout
              </div>

              <img
                src={tick}
                alt="tick"
                className={
                  activeLayout === "grid" ? "active opacity-100" : "opacity-0"
                }
              />
            </label>
            <label
              className=" h-64 text-black"
              onClick={() => handleActiveLayout("row")}
            >
              <div className="cursor-pointer">
                <img src={row} alt="row" className="me-3 " />
                Row Layout
              </div>
              <img
                src={tick}
                alt="tick"
                className={
                  activeLayout === "row" ? "active opacity-100" : "opacity-0"
                }
              />
            </label>
            <label
              className=" h-64 text-black"
              onClick={() => handleActiveLayout("artwork")}
            >
              <div className="cursor-pointer">
                <img src={artwork} alt="artwork" className="me-3 " />
                Artwork Layout
              </div>

              <img
                src={tick}
                alt="tick"
                className={
                  activeLayout === "artwork"
                    ? "active opacity-100"
                    : "opacity-0"
                }
              />
            </label>
          </div>
        </div>
      </Offcanvas>

      {/* mobile multi filter */}
      <Offcanvas
        show={showSideFilter}
        onHide={closeMobileSideFilter}
        placement="bottom"
        className="sub-menu-offcanvas collection-multi-filter"
      >
        <div className="more-menu-sm price-more-menu ">
          <div className="menu-head">
            <label htmlFor="">{itemNumber} Items</label>
            <label className="text-black multi-filter-head">Filters</label>
            <div className="close-btn cursor-pointer">
              <img
                src={close}
                alt="close"
                className="img-24"
                onClick={closeMobileSideFilter}
              />
            </div>
          </div>

          <AsideFilter />
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
  );
};

export default Collected;
