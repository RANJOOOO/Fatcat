import React, { useState, useEffect, useRef } from "react";
import "../../style/main.scss";
import art1 from "../../assets/images/artwork-preview-1.png";
import verified from "../../assets/icon/verified-artist-small.svg";
import flr from "../../assets/icon/FLR.svg";
import option from "../../assets/icon/more-vertical.svg";
import sale from "../../assets/icon/list-for-sale.svg";
import transfer from "../../assets/icon/transfer.svg";
import copyLink from "../../assets/icon/link.svg";
import view from "../../assets/icon/eye.svg";
import eidt from "../../assets/icon/edit.svg";
import dropdown from "../../assets/icon/chevron-down-extra-small.svg";
import cardImg from "../../assets/images/artwork-preview-6.png";
import cardImg1 from "../../assets/images/artwork-preview-7.png";
import cardImg2 from "../../assets/images/artwork-preview-5.png";
import { Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import ArtistPopUp from "../shared/artistpopup";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";
import AsideFilter from "./asideFilter";
import Dropdown from "../shared/dropdown";
import userProfile from "../../assets/images/face-3.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";
import Button from "../button";
import { get } from "firebase/database";

const LayoutRow = (props) => {
  const [show, setShow] = useState({});
  const [activePrice, setActivePrice] = useState("listPrice");
  const [priceShow, setPriceShow] = useState(false);
  const dropdownRef = useRef(null);
  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;

  const [collectionDetails, setCollectionDetails] = useState(props?.ApvNFT);
  const [nftDetails, setNftDetails] = useState([]);
  const [listedNfts, setListedNfts] = useState([]);
  const navigate = useNavigate();
  const [collectionData, setCollectionData] = useState([]);
  const [nftFilteredDetails, setNftFilteredDetails] = useState(collectionData);

  const location = useLocation();
  // Initialize web3 with your Ethereum node URL
  // const web3 = new Web3(window.ethereum);
  const [web3, setWeb3] = useState(new Web3(window.ethereum));

  useEffect(() => {
    if (collectionDetails?.selectedNetwork === "Coston") {
      setWeb3(new Web3(process.env.REACT_APP_COSTON_RPC_URL));
    } else {
      setWeb3(new Web3(process.env.REACT_APP_COSTON2_RPC_URL));
    }
  }, [collectionDetails]);

  // toolip
  const tooltip = <Tooltip id="tooltip">List price: 4900929 FLR</Tooltip>;
  const tooltipLSP = (
    <Tooltip id="tooltipLSP">Last sale price: 576 FLR</Tooltip>
  );
  const tooltipBO = <Tooltip id="tooltipBO">Best offer: 9760929 FLR</Tooltip>;

  // price Filter handle
  const priceHandleShow = () => setPriceShow(true);
  const priceHandleHide = () => setPriceShow(false);

  const showOption = (index) => {
    setShow({ [index]: true });
    console.log(index);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  // ----------- Handle option menu end

  const handleIPriceTick = (tick) => {
    setActivePrice(tick);
  };

  const priceOptions = [
    { value: "listPrice", label: "List price" },
    { value: "lastPrice", label: "Last sale price" },
    { value: "bestOffer", label: "Best offer" },
  ];

  const getAllListNFTData = async () => {
    // const accounts = await web3.eth.getAccounts();
    console.log("collectionDetails", collectionDetails);
    if (collectionDetails?.Approved) {
      // getting nft records from Marketplace contract
      //console.log("Marketplace_coston_contractAddress", Marketplace_coston_contractAddress);
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
      //console.log("contract", contract);
      const data = await contract.methods.getAllListedNfts().call();
      //console.log("nft contract data", data);
      setListedNfts(data);
    }
  };

  const Backend_url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // getListNFTData();
    setNftDetails(props?.nftDetails);
    getAllListNFTData();
    console.log("nftDetails", nftDetails);
  }, [props?.nftDetails]);

  useEffect(() => {
    if (props?.nfts !== undefined) {
      let nftListDetails = [];
      props?.nfts?.map((item) => {
        let isListed = false;
        let isSaleListed = false;
        let isOfferListed = false;
        console.log("useEffect item", item);

        listedNfts[0]?.map((nft) => {
          if (nft?.uriData === item?.uri) {
            console.log("layout grid nftDetail :", nft);
            isListed = true;
            isSaleListed = true;
            nft = {
              ...nft,
              ...item,
              isListed: true,
              isSaleListed: true,
            };
            nftListDetails.push(nft);
            return;
          }
        });
        listedNfts[1]?.map((nft) => {
          if (nft?.uriData === item?.uri) {
            console.log("layout grid nftDetail :", nft);
            isListed = true;
            isOfferListed = true;
            nft = {
              ...nft,
              ...item,
              isListed: true,
              isOfferListed: true,
            };
            nftListDetails.push(nft);
            return;
          }
        });
        console.log("useEffect isListed", isListed);
        if (!isListed) {
          console.log("useEffect isListed false", isListed);
          console.log("nftDetails", nftDetails);
          const listedDetail = nftDetails?.find((nft) => {
            return nft.uri == item.uri;
          });
          console.log("listedDetail", listedDetail);
          let data = { ...item, listedDetail, isListed: false };
          nftListDetails.push(data);
          return;
        }
      });
      setCollectionData(nftListDetails);
      setNftFilteredDetails(nftListDetails);
      console.log("nftListDetails", nftListDetails);
    } else {
      setCollectionData([]);
      setNftFilteredDetails([]);
    }
  }, [nftDetails, listedNfts, props?.nfts]);

  useEffect(() => {
    console.log("sort filter", props?.sortFilter);
    if (props?.sortFilter !== undefined) {
      let sortedData = [];
      if (props?.sortFilter === "Recently Minted") {
        sortedData = collectionData.sort((a, b) => {
          const dateA = new Date(a?.data?.mintedAt);
          const dateB = new Date(b?.data?.mintedAt);
          return dateB - dateA;
        });
      } else if (props?.sortFilter === "Recently Listed") {
        sortedData = collectionData
          .filter((item) => {
            return item.isListed; // Only keep listed items
          })
          .sort((a, b) => {
            const dateA = new Date(parseInt(a?.listedData?.listTime) * 1000);
            const dateB = new Date(parseInt(b?.listedData?.listTime) * 1000);
            return dateB - dateA;
          });
      } else if (props?.sortFilter === "Lowest price") {
        if (collectionData.length > 0) {
          sortedData = collectionData
            .filter((item) => {
              return item.isListed; // Only keep listed items
            })
            .sort((a, b) => {
              // Prioritize sale listings over offer listings
              if (a.isSaleListed && b.isSaleListed) {
                return (
                  parseFloat(a?.listedData?.price) -
                  parseFloat(b?.listedData?.price)
                );
              }
              if (a.isOfferListed && b.isOfferListed) {
                return (
                  parseFloat(a?.listedData?.minimumBid) -
                  parseFloat(b?.listedData?.minimumBid)
                );
              }
            });
        }
      } else if (props?.sortFilter === "Highest price") {
        if (collectionData.length > 0) {
          sortedData = collectionData
            .filter((item) => {
              return item.isListed; // Only keep listed items
            })
            .sort((a, b) => {
              // Prioritize sale listings over offer listings
              if (a.isSaleListed && b.isSaleListed) {
                return (
                  parseFloat(b?.listedData?.price) -
                  parseFloat(a?.listedData?.price)
                );
              }
              if (a.isOfferListed && b.isOfferListed) {
                return (
                  parseFloat(b?.listedData?.minimumBid) -
                  parseFloat(a?.listedData?.minimumBid)
                );
              }
            });
        }
      }
      setNftFilteredDetails(sortedData);
    }
  }, [props?.sortFilter]);

  const handleSelectedFilterChange = (newFilter) => {
    let filteredData = [];
    collectionData.filter((item) => {
      console.log("filter item", item);
      // Filter by categories
      // Check if any category is selected
      const isCategorySelected = Object.values(newFilter.selectCategories).some(
        (category) => category
      );
      let categoriesFilter;
      if (isCategorySelected) {
        //console.log("true");
        categoriesFilter = Object.keys(newFilter.selectCategories).every(
          (category) =>
            newFilter.selectCategories[category]
              ? item.data.selectedTags.includes(category)
              : true
        );
      } else {
        console.log("false");
        categoriesFilter = true;
      }

      // Filter by currency
      const selectedCurrency = Object.values(newFilter.selectCurrency).some(
        (currency) => currency
      );
      let currencyFilter = true;

      if (selectedCurrency) {
        console.log("selectedCurrency", selectedCurrency);
        currencyFilter =
          selectedCurrency &&
          (newFilter.selectCurrency.allChains ||
            (newFilter.selectCurrency.flr &&
              item.data.selectedBlockchain.toLowerCase() === "flare network") ||
            (newFilter.selectCurrency.sgb &&
              item.data.selectedBlockchain.toLowerCase() ===
                "songbird network"));
      }

      // Filter by price
      let priceFilter;
      if (
        newFilter.selectPrice.min === "" &&
        newFilter.selectPrice.max === ""
      ) {
        //console.log("default price");
        priceFilter = true;
      } else {
        //console.log("not all");
        if (item.isSaleListed) {
          priceFilter =
            (newFilter.selectPrice.min === "" ||
              parseFloat(item.listedData.price) >=
                parseFloat(newFilter.selectPrice.min)) &&
            (newFilter.selectPrice.max === "" ||
              parseFloat(item.listedData.price) <=
                parseFloat(newFilter.selectPrice.max));
        }
        if (item.isOfferListed) {
          priceFilter =
            (newFilter.selectPrice.min === "" ||
              parseFloat(item.listedData.minimumBid) >=
                parseFloat(newFilter.selectPrice.min)) &&
            (newFilter.selectPrice.max === "" ||
              parseFloat(item.listedData.minimumBid) <=
                parseFloat(newFilter.selectPrice.max));
        }
      }
      let statusFilter = false;

      if (
        newFilter.selectStatus.buyNow ||
        newFilter.selectStatus.onOffer ||
        newFilter.selectStatus.new
      ) {
        //console.log("isListed", item.isListed);
        statusFilter =
          (newFilter.selectStatus.buyNow && item.isSaleListed) ||
          (newFilter.selectStatus.onOffer && item.isOfferListed) ||
          (newFilter.selectStatus.new && !item.isListed);
      } else {
        statusFilter = true;
      }

      console.log("statusFilter", statusFilter);
      console.log("priceFilter", priceFilter);
      console.log("currencyFilter", currencyFilter);
      console.log("categoriesFilter", categoriesFilter);

      // Return item if all filters pass
      if (categoriesFilter && currencyFilter && priceFilter && statusFilter) {
        filteredData.push(item);
        //console.log("filteredData", filteredData);
      }
    });
    setNftFilteredDetails(filteredData);
  };

  return (
    <div>
      <div className="d-flex">
        <div className={props.flag ? "my-filter w-25" : "d-none"}>
          <AsideFilter onSelectedFilterChange={handleSelectedFilterChange} />
        </div>
        {/* {`grid-display artworkGrid  ${props.flag ? "w-75 active" : ""}`} */}
        {/* <div className="row-layout"  > */}

        <div className={`row-layout   ${props.flag ? "w-75 active" : "w-100"}`}>
          <div className="row-layout-head justify-content-between">
            <label className="small head-1 c1">
              {nftFilteredDetails?.length} Items
            </label>
            <label className="small head-1 c2 hide-on-mobile">Artist Fee</label>
            <label
              className="small head-1 c4 hide-on-mobile"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              List Type
            </label>
            <label
              className="small head-1 c3 hide-on-mobile"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              List price
            </label>
            <label className="small head-1 c5 hide-on-mobile pe-4"></label>
            <label
              className="small text-black d-flex align-items-center justify-content-end hide-on-desktop w-50 "
              onClick={priceHandleShow}
            >
              {
                priceOptions.find((option) => option.value === activePrice)
                  ?.label
              }
              <img src={dropdown} alt="dropdown" />
            </label>
          </div>

          {/* row layout content */}

          <div className="row-layout-body">
            {props?.nfts == undefined ? (
              <></>
            ) : (
              nftFilteredDetails.map((item, index) => {
                console.log("layout row item", item);
                return (
                  <div
                    className="row-content d-flex align-items-center justify-content-between "
                    key={index}
                  >
                    {/* Artwork Items */}
                    <div className="c1 d-flex align-items-center artwork-item">
                      <div className="art-img">
                        <img
                          src={item.data.image}
                          alt="artwork image"
                          className="img-100"
                        />
                      </div>

                      <div className="user-name d-flex flex-column">
                        <label className="text-black  text-capitalize hover-underline pointer">
                          {/* Artwork Name */}
                          {item?.data?.artName
                            ? item?.data?.artName
                            : "Artwork"}
                        </label>
                        <p className="body-medium fw-bold v-center text-medium-grey  hover-underline pointer show-artist-popup">
                          @
                          {item?.data?.artistName
                            ? item?.data?.artistName
                            : "Artist"}
                          <img
                            src={verified}
                            alt="verified"
                            className="ms-2 img-18"
                          />
                          {/* <ArtistPopUp
                            userProfile={userProfile}
                            verified={verified}
                            left="0px"
                            top="-200px"
                          /> */}
                        </p>
                      </div>
                    </div>

                    {/* List price */}
                    <div className={` c3 pricing d-flex align-items-center`}>
                      <label className=" text-black ">
                        {item?.data?.artistFee}
                      </label>
                      <p>%</p>
                    </div>

                    {/* Last Sale Price */}

                    <div
                      className="c2 pricing d-flex align-items-center item-hide"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <img src={flr} alt="flr" />
                      <OverlayTrigger
                        placement="top"
                        overlay={tooltipLSP}
                        id="tooltipLSP"
                      >
                        <label className=" text-black ">576</label>
                      </OverlayTrigger>
                      <p>FLR</p> */}
                      {!collectionDetails?.Approved && (
                        <div className="offer my-4 mt-5">
                          <p className="body-large text-bold-black  ">
                            Not Approved
                          </p>
                        </div>
                      )}
                      {props.isOwner &&
                      collectionDetails?.Approved &&
                      !item?.isListed ? (
                        <div
                          style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <Button
                              text="List for Sale"
                              className="btn-prime btn-primary br-30 font-16 px-2 py-2 mx-1 "
                              height="25px"
                              width="50%"
                              onClick={() => {
                                // //console.log("ListDetial", ListDetail);
                                navigate(`/list-forSale`, {
                                  state: {
                                    data: item?.data,
                                    nftDetails: item,
                                  },
                                });
                              }}
                            />
                          </div>
                          <br />
                          <div>
                            <Button
                              text="List for Offer"
                              className="btn-prime btn-primary br-30 font-16 px-2 py-2 mx-1"
                              height="25px"
                              width="50%"
                              onClick={() => {
                                // //console.log("ListDetial", ListDetail);
                                navigate(`/list-forOffer`, {
                                  state: {
                                    data: item?.data,
                                    nftDetails: item,
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <center>
                          <div className="offer ">
                            {item?.isSaleListed && (
                              <p className="body-large text-bold-black  ">
                                Listed For Sale
                              </p>
                            )}
                            {item?.isOfferListed && (
                              <p className="body-large text-bold-black  ">
                                Listed For Offer
                              </p>
                            )}
                          </div>
                        </center>
                      )}
                    </div>

                    {/* Best Offer */}
                    <div
                      className={` c3 pricing d-flex align-items-center `}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <label className="text-black">
                        {item?.isListed
                          ? item?.isSaleListed
                            ? item?.listedData?.price
                            : item?.isOfferListed
                            ? item?.listedData?.minimumBid
                            : "--"
                          : "--"}
                      </label>
                    </div>

                    <div className="c5 pricing d-flex align-items-center cursor-pointer position-relative item-hide justify-content-end d-none">
                      <img
                        // className="pe-4"
                        src={option}
                        alt="option"
                        onClick={() => showOption(index)}
                      />

                      {/* Collected Artwork more option popup */}
                      {show[index] ? (
                        <div className="collection-option" ref={dropdownRef}>
                          <div className="collection-item">
                            <img src={sale} alt="sale" />
                            <label className="text-black no-text-transform">
                              List for sale
                            </label>
                          </div>
                          <div className="collection-item">
                            <img src={transfer} alt="sale" />
                            <label className="text-black no-text-transform">
                              {" "}
                              Transfer{" "}
                            </label>
                          </div>
                          <div className="collection-item">
                            <img src={copyLink} alt="sale" />
                            <label className="text-black no-text-transform">
                              {" "}
                              Copy link{" "}
                            </label>
                          </div>
                          <div className="collection-item">
                            <img src={view} alt="sale" />
                            <label className="text-black no-text-transform">
                              View item{" "}
                            </label>
                          </div>
                          <div className="collection-item">
                            <img src={eidt} alt="sale" />
                            <label className="text-black no-text-transform">
                              {" "}
                              Edit item
                            </label>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="c5 pricing d-flex align-items-center cursor-pointer position-relative item-hide justify-content-end dropdown ">
                      <img
                        src={option}
                        alt=""
                        className="dropdown-toggle no-after"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <ul class="dropdown-menu no-border bg-transparent">
                        <Dropdown />
                      </ul>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* List Price menu */}
      <Offcanvas
        show={priceShow}
        onHide={priceHandleHide}
        placement="bottom"
        className="sub-menu-offcanvas"
      >
        <div className="more-menu-sm price-more-menu">
          <div className="menu-head">
            <label className="text-black">change</label>
            <div className="close-btn cursor-pointer">
              <img
                src={close}
                alt="close"
                className="img-24"
                onClick={priceHandleHide}
              />
            </div>
          </div>

          <div className="share">
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className={`no-text-transform h-64 text-black ${
                  activePrice === option.value ? "fw-bold" : "fw-normal"
                }`}
                onClick={() => handleIPriceTick(option.value)}
              >
                {option.label}
                <img
                  src={tick}
                  alt="tick"
                  className={`${
                    activePrice === option.value
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

export default LayoutRow;
