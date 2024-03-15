import React, { useState, useEffect } from "react";

import filter from "../../assets/icon/filter.svg";
import grid from "../../assets/icon/display-grid-active.svg";
import row from "../../assets/icon/display-row-active.svg";
import artwork from "../../assets/icon/display-artwork-active.svg";
import sortby from "../../assets/icon/sort-by.svg";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";
import LayoutGrid from "../profile/layoutGrid";
import LayoutExploreGrid from "./layoutExploreGrid";
import AsideFilterExplore from "./asideFilterExplore";
import { Offcanvas } from "react-bootstrap";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";

const ExploreArt = () => {
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
  // const collectionSortFilter = [
  //   { value: "Recently active", label: "Recently active" },
  //   { value: "Ending soon", label: "Ending soon" },
  //   { value: "Lowest price", label: "Lowest price" },
  //   { value: "Highest price", label: "Highest price" },
  //   { value: "Newest", label: "Newest" },
  //   { value: "Oldest", label: "Oldest" },
  // ];
  const collectionSortFilter = [
    { value: "Lowest price", label: "Lowest price" },
    { value: "Highest price", label: "Highest price" },
    { value: "Recently Listed", label: "Recently Listed" },
  ];

  const [activeCollection, setActiveCollection] = useState("Recently Listed");

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
    useState("Recently Listed");
  const hideMobileSortFilter = () => setCollectionMobileFilter(false);

  const showMobileSortFilter = () => {
    setCollectionMobileFilter(true);
  };
  const handleCollectionTick = (tick) => {
    setActiveCollectionFilter(tick);
    setCollectionMobileFilter(false);
  };

  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;
  const [nftDetails, setNftDetails] = useState([]);
  const [nftFilteredDetails, setNftFilteredDetails] = useState([]);

  // Initialize web3 with your Ethereum node URL
  // const web3 = new Web3(window.ethereum);
  const web3_coston = new Web3(process.env.REACT_APP_COSTON_RPC_URL);
  const web3_coston2 = new Web3(process.env.REACT_APP_COSTON2_RPC_URL);

  const getListedNtfs = async () => {
    const contract_coston = new web3_coston.eth.Contract(
      contractABI,
      Marketplace_coston_contractAddress
    );
    const contract_coston2 = new web3_coston2.eth.Contract(
      contractABI,
      Marketplace_coston2_contractAddress
    );

    console.log("contracts", contract_coston + " " + contract_coston2);
    const res_coston = await contract_coston.methods.getAllListedNfts().call();
    const res_coston2 = await contract_coston2.methods
      .getAllListedNfts()
      .call();
    // const res = await contract.methods.getAllListedNfts().call();
    // const list_res = [res_coston[0], res_coston2[0]];
    const list_res = [...res_coston[0], ...res_coston2[0]];
    // const offer_res = [res_coston[1], res_coston2[1]];
    const offer_res = [...res_coston[1], ...res_coston2[1]];
    console.log("res", res_coston);
    console.log("res2", res_coston2);
    console.log("list_res", list_res);
    console.log("offer_res", offer_res);

    const res = [list_res, offer_res];
    setNftDetails(res);
    console.log("res_coston", res_coston);
    console.log("res_coston2", res_coston2);
  };

  useEffect(() => {
    getListedNtfs();
    console.log("nftDetails", nftDetails);
  }, []);

  // const [nftDetails, setCollectedArts] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [offerNftData, setOfferNftData] = useState([]);

  const Backend_url = process.env.REACT_APP_BACKEND_URL;

  const getNftMetadata = async (tokens_uri) => {
    console.log("url: " + `${Backend_url}/getNFTMetadata`);
    console.log("tokens_uri: " + tokens_uri);
    const response = await fetch(`${Backend_url}/getNFTMetadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uri: tokens_uri,
      }),
    });
    const json = await response.json();
    return {
      uri: tokens_uri, // Include the URI in the result object
      data: json.data.data,
    };
  };

  const getNftDetails = async () => {
    try {
      console.log("nftDetails: ", nftDetails);
      const ListedNftMeta = await Promise.all(
        nftDetails[0].map(async (art) => {
          console.log("nft List Details art: ", art);
          const metaData = await getNftMetadata(art[2]);
          // console.log("metaData: ", metaData);
          return { ...art, meta: metaData };
        })
      );

      const ListOfferNftMeta = await Promise.all(
        nftDetails[1].map(async (art) => {
          console.log("nft Offer Details art: ", art);
          const metaData = await getNftMetadata(art[2]);
          // console.log("metaData: ", metaData);
          return { ...art, meta: metaData };
        })
      );

      setOfferNftData(ListOfferNftMeta);
      setNftData(ListedNftMeta);
      const data = {
        nftData: ListedNftMeta,
        offerNftData: ListOfferNftMeta,
      };

      setItemsNumber(ListedNftMeta.length + ListOfferNftMeta.length); // set the number of items
      setNftFilteredDetails(data);
      // console.log("ListedNftMeta: ", ListedNftMeta);
    } catch (error) {
      console.error("Error fetching NFT details:", error);
    }
  };

  const [itemsNumber, setItemsNumber] = useState(0);

  useEffect(() => {
    if (nftDetails) {
      getNftDetails();
    }
    console.log("nftData: ", nftData);
    console.log("offerNftData: ", offerNftData);
    // setNftFilteredDetails(nftDetails);
  }, [nftDetails]);

  // useEffect(() => {
  //   console.log("sort filter", activeCollection);
  //   const collectionData = [...nftData, ...offerNftData];
  //   console.log("collectionData", collectionData);

  //   if (activeCollection !== undefined) {
  //     let filteredData = {
  //       nftData: [],
  //       offerNftData: [],
  //     };
  //     let sortedNftData = [];
  //     let sortedOfferNftData = [];
  //     if (activeCollection === "Recently Listed") {
  //       sortedNftData = nftData
  //         .filter((item) => {
  //           return item.isListed; // Only keep listed items
  //         })
  //         .sort((a, b) => {
  //           const dateA = new Date(parseInt(a?.listedData?.listTime) * 1000);
  //           const dateB = new Date(parseInt(b?.listedData?.listTime) * 1000);
  //           return dateB - dateA;
  //         });
  //       sortedOfferNftData = offerNftData
  //         .filter((item) => {
  //           return item.isListed; // Only keep listed items
  //         })
  //         .sort((a, b) => {
  //           const dateA = new Date(parseInt(a?.listedData?.listTime) * 1000);
  //           const dateB = new Date(parseInt(b?.listedData?.listTime) * 1000);
  //           return dateB - dateA;
  //         });
  //       filteredData = {
  //         nftData: sortedNftData,
  //         offerNftData: sortedOfferNftData,
  //       };
  //     } else if (activeCollection === "Lowest price") {
  //       sortedNftData = nftData
  //         .filter((item) => {
  //           return item.isListed; // Only keep listed items
  //         })
  //         .sort((a, b) => {
  //           // Prioritize sale listings over offer listings
  //           return (
  //             parseFloat(a?.listedData?.price) -
  //             parseFloat(b?.listedData?.price)
  //           );
  //         });
  //       sortedOfferNftData = offerNftData
  //         .filter((item) => {
  //           return item.isListed; // Only keep listed items
  //         })
  //         .sort((a, b) => {
  //           return (
  //             parseFloat(a?.listedData?.minimumBid) -
  //             parseFloat(b?.listedData?.minimumBid)
  //           );
  //         });
  //       filteredData = {
  //         nftData: sortedNftData,
  //         offerNftData: sortedOfferNftData,
  //       };
  //     } else if (activeCollection === "Highest price") {
  //       sortedNftData = nftData
  //         .filter((item) => {
  //           return item.isListed; // Only keep listed items
  //         })
  //         .sort((a, b) => {
  //           // Prioritize sale listings over offer listings
  //           return (
  //             parseFloat(b?.listedData?.price) -
  //             parseFloat(a?.listedData?.price)
  //           );
  //         });
  //       sortedOfferNftData = offerNftData
  //         .filter((item) => {
  //           return item.isListed; // Only keep listed items
  //         })
  //         .sort((a, b) => {
  //           return (
  //             parseFloat(b?.listedData?.minimumBid) -
  //             parseFloat(a?.listedData?.minimumBid)
  //           );
  //         });
  //       filteredData = {
  //         nftData: sortedNftData,
  //         offerNftData: sortedOfferNftData,
  //       };
  //     }
  //     console.log("sortedData", filteredData);
  //     setNftFilteredDetails(filteredData);
  //   }
  // }, [activeCollection]);

  const handleSelectedFilterChange = (newFilter) => {
    console.log("handleSelectedFilterChange", newFilter);
    console.log("nftData", nftData);
    console.log("offerNftData", offerNftData);

    // selectCategories:
    // 3D: false
    // Animation: true
    // Fantasy: false
    // Geometric: true
    // Phygital: false

    // selectCurrency:
    // allChains: false
    // flr: false
    // sgb: false

    // selectPrice:
    // max: ""
    // min: ""

    // selectStatus:
    // buyNow: false
    // onOffer: false
    // Do something with the new filter value, e.g., update state
    console.log("newFilter", newFilter);
    let filteredData = {
      nftData: [],
      offerNftData: [],
    };
    if (newFilter.selectStatus.buyNow) {
      console.log("buyNow");
      nftData.filter((item) => {
        console.log("filter item", item);
        // Filter by categories
        // Check if any category is selected
        const isCategorySelected = Object.values(
          newFilter.selectCategories
        ).some((category) => category);
        let categoriesFilter;
        if (isCategorySelected) {
          console.log("true");
          categoriesFilter = Object.keys(newFilter.selectCategories).every(
            (category) =>
              newFilter.selectCategories[category]
                ? item.meta.data.selectedTags.includes(category)
                : true
          );
        } else {
          console.log("false");
          categoriesFilter = true;
        }

        // Filter by currency
        // const selectedCurrency = Object.values(newFilter.selectCurrency).some(
        //   (currency) => currency
        // );
        // const currencyFilter =
        //   selectedCurrency &&
        //   (newFilter.selectCurrency.allChains ||
        //     (newFilter.selectCurrency.flr &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "flare network") ||
        //     (newFilter.selectCurrency.sgb &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "songbird network"));
        const selectedCurrency = Object.values(newFilter.selectCurrency).some(
          (currency) => currency
        );
        let currencyFilter = true;

        if (selectedCurrency) {
          //console.log("selectedCurrency", selectedCurrency);
          currencyFilter =
            selectedCurrency &&
            (newFilter.selectCurrency.allChains ||
              (newFilter.selectCurrency.flr &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "flare network") ||
              (newFilter.selectCurrency.sgb &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "songbird network"));
        }

        // Filter by price
        let priceFilter;
        if (
          newFilter.selectPrice.min === "" &&
          newFilter.selectPrice.max === ""
        ) {
          console.log("all");
          priceFilter = true;
        } else {
          console.log("not all");
          priceFilter =
            (newFilter.selectPrice.min === "" ||
              parseFloat(item.listedData.price) >=
                parseFloat(newFilter.selectPrice.min)) &&
            (newFilter.selectPrice.max === "" ||
              parseFloat(item.listedData.price) <=
                parseFloat(newFilter.selectPrice.max));
        }
        // Return item if all filters pass
        console.log("categoriesFilter", categoriesFilter);
        console.log("currencyFilter", currencyFilter);
        console.log("priceFilter", priceFilter);

        if (categoriesFilter && currencyFilter && priceFilter) {
          filteredData.nftData.push(item);
          console.log("filteredData", filteredData);
        }
      });
    } else if (newFilter.selectStatus.onOffer) {
      console.log("onOffer");

      offerNftData.filter((item) => {
        console.log("filter item", item);
        // Filter by categories
        // Check if any category is selected
        const isCategorySelected = Object.values(
          newFilter.selectCategories
        ).some((category) => category);
        let categoriesFilter;
        if (isCategorySelected) {
          console.log("true");
          categoriesFilter = Object.keys(newFilter.selectCategories).every(
            (category) =>
              newFilter.selectCategories[category]
                ? item.meta.data.selectedTags.includes(category)
                : true
          );
        } else {
          console.log("false");
          categoriesFilter = true;
        }

        // Filter by currency
        // const selectedCurrency = Object.values(newFilter.selectCurrency).some(
        //   (currency) => currency
        // );
        // const currencyFilter =
        //   selectedCurrency &&
        //   (newFilter.selectCurrency.allChains ||
        //     (newFilter.selectCurrency.flr &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "flare network") ||
        //     (newFilter.selectCurrency.sgb &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "songbird network"));
        const selectedCurrency = Object.values(newFilter.selectCurrency).some(
          (currency) => currency
        );
        let currencyFilter = true;

        if (selectedCurrency) {
          //console.log("selectedCurrency", selectedCurrency);
          currencyFilter =
            selectedCurrency &&
            (newFilter.selectCurrency.allChains ||
              (newFilter.selectCurrency.flr &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "flare network") ||
              (newFilter.selectCurrency.sgb &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "songbird network"));
        }

        // Filter by price
        let priceFilter;
        if (
          newFilter.selectPrice.min === "" &&
          newFilter.selectPrice.max === ""
        ) {
          console.log("all");
          priceFilter = true;
        } else {
          console.log("not all");
          priceFilter =
            (newFilter.selectPrice.min === "" ||
              parseFloat(item.listedData.minimumBid) >=
                parseFloat(newFilter.selectPrice.min)) &&
            (newFilter.selectPrice.max === "" ||
              parseFloat(item.listedData.minimumBid) <=
                parseFloat(newFilter.selectPrice.max));
        }
        // Return item if all filters pass
        if (categoriesFilter && currencyFilter && priceFilter) {
          filteredData.offerNftData.push(item);
          console.log("filteredData", filteredData);
        }
      });
    } else {
      console.log("all");

      nftData.filter((item) => {
        console.log("filter item", item);
        // Filter by categories
        // Check if any category is selected
        const isCategorySelected = Object.values(
          newFilter.selectCategories
        ).some((category) => category);
        let categoriesFilter;
        if (isCategorySelected) {
          console.log("true");
          categoriesFilter = Object.keys(newFilter.selectCategories).every(
            (category) =>
              newFilter.selectCategories[category]
                ? item.meta.data.selectedTags.includes(category)
                : true
          );
        } else {
          console.log("false");
          categoriesFilter = true;
        }

        // Filter by currency
        // const selectedCurrency = Object.values(newFilter.selectCurrency).some(
        //   (currency) => currency
        // );
        // const currencyFilter =
        //   selectedCurrency &&
        //   (newFilter.selectCurrency.allChains ||
        //     (newFilter.selectCurrency.flr &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "flare network") ||
        //     (newFilter.selectCurrency.sgb &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "songbird network"));
        const selectedCurrency = Object.values(newFilter.selectCurrency).some(
          (currency) => currency
        );
        let currencyFilter = true;

        if (selectedCurrency) {
          //console.log("selectedCurrency", selectedCurrency);
          currencyFilter =
            selectedCurrency &&
            (newFilter.selectCurrency.allChains ||
              (newFilter.selectCurrency.flr &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "flare network") ||
              (newFilter.selectCurrency.sgb &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "songbird network"));
        }

        // Filter by price
        let priceFilter;
        if (
          newFilter.selectPrice.min === "" &&
          newFilter.selectPrice.max === ""
        ) {
          console.log("all");
          priceFilter = true;
        } else {
          console.log("not all");
          priceFilter =
            (newFilter.selectPrice.min === "" ||
              parseFloat(item.listedData.price) >=
                parseFloat(newFilter.selectPrice.min)) &&
            (newFilter.selectPrice.max === "" ||
              parseFloat(item.listedData.price) <=
                parseFloat(newFilter.selectPrice.max));
        }
        // Return item if all filters pass
        if (categoriesFilter && currencyFilter && priceFilter) {
          filteredData.nftData.push(item);
          console.log("filteredData", filteredData);
        }
      });

      offerNftData.filter((item) => {
        console.log("filter item", item);
        // Filter by categories
        // Check if any category is selected
        const isCategorySelected = Object.values(
          newFilter.selectCategories
        ).some((category) => category);
        let categoriesFilter;
        if (isCategorySelected) {
          console.log("true");
          categoriesFilter = Object.keys(newFilter.selectCategories).every(
            (category) =>
              newFilter.selectCategories[category]
                ? item.meta.data.selectedTags.includes(category)
                : true
          );
        } else {
          console.log("false");
          categoriesFilter = true;
        }

        // Filter by currency
        // const selectedCurrency = Object.values(newFilter.selectCurrency).some(
        //   (currency) => currency
        // );
        // const currencyFilter =
        //   selectedCurrency &&
        //   (newFilter.selectCurrency.allChains ||
        //     (newFilter.selectCurrency.flr &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "flare network") ||
        //     (newFilter.selectCurrency.sgb &&
        //       item.meta.data.selectedBlockchain.toLowerCase() ===
        //         "songbird network"));
        const selectedCurrency = Object.values(newFilter.selectCurrency).some(
          (currency) => currency
        );
        let currencyFilter = true;

        if (selectedCurrency) {
          //console.log("selectedCurrency", selectedCurrency);
          currencyFilter =
            selectedCurrency &&
            (newFilter.selectCurrency.allChains ||
              (newFilter.selectCurrency.flr &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "flare network") ||
              (newFilter.selectCurrency.sgb &&
                item.meta.data.selectedBlockchain.toLowerCase() ===
                  "songbird network"));
        }

        // Filter by price
        let priceFilter;
        if (
          newFilter.selectPrice.min === "" &&
          newFilter.selectPrice.max === ""
        ) {
          console.log("all");
          priceFilter = true;
        } else {
          console.log("not all");
          priceFilter =
            (newFilter.selectPrice.min === "" ||
              parseFloat(item.listedData.minimumBid) >=
                parseFloat(newFilter.selectPrice.min)) &&
            (newFilter.selectPrice.max === "" ||
              parseFloat(item.listedData.minimumBid) <=
                parseFloat(newFilter.selectPrice.max));
        }
        // Return item if all filters pass
        if (categoriesFilter && currencyFilter && priceFilter) {
          filteredData.offerNftData.push(item);
          console.log("filteredData", filteredData);
        }
      });
    }
    setNftFilteredDetails(filteredData);
  };

  return (
    <div>
      <div>
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
                className="medium text-black cursor-pointer ms-1 hide-on-mobile"
              >
                Show Filters
              </label>
            </div>
            <div className="t-items">
              <label className="medium ms-4">{itemsNumber} Items</label>
            </div>
          </div>

          <div className="right">
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
            </div> */}
          </div>
        </div>
        <LayoutExploreGrid
          flag={Flag}
          listedNft={nftFilteredDetails}
          onSelectedFilterChange={handleSelectedFilterChange}
        />
        {/* |<LayoutGrid /> */}
      </div>
      <Offcanvas
        show={showSideFilter}
        onHide={closeMobileSideFilter}
        placement="bottom"
        className="sub-menu-offcanvas collection-multi-filter aside-filter-offcanvas"
      >
        <div className="more-menu-sm price-more-menu ">
          <div className="menu-head">
            <label htmlFor="">
              {nftFilteredDetails?.length ? nftFilteredDetails?.length : "0"}{" "}
              Items
            </label>
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

          {/* <AsideFilterExplore /> */}
          <AsideFilterExplore
            onSelectedFilterChange={handleSelectedFilterChange}
          />
        </div>
      </Offcanvas>

      {/* Collection Sorting Filter mobile menu */}
      {/* <Offcanvas
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
      </Offcanvas> */}
    </div>
  );
};

export default ExploreArt;
