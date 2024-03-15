import React from "react";
import { useState, useEffect } from "react";
import "../../style/main.scss";
import art1 from "../../assets/images/artwork-preview-1.png";
import art2 from "../../assets/images/artwork-preview-2.png";
import art3 from "../../assets/images/artwork-preview-3.png";
import art4 from "../../assets/images/artwork-preview-4.png";
import art5 from "../../assets/images/artwork-preview-5.png";
import sgb from "../../assets/icon/SGB.svg";
import loader from "../../assets/icon/loader-medium.svg";
import verified from "../../assets/icon/verified-artist-small.svg";
import profile from "../../assets/icon/profile-picture.svg";
import videoArt from "../../assets/icon/video-fill.svg";
import chainImage from "../../assets/icon/SGB.svg";
import userProfile from "../../assets/images/face-3.png";
import cardImg from "../../assets/images/artwork-preview-6.png";
import cardImg1 from "../../assets/images/artwork-preview-7.png";
import cardImg2 from "../../assets/images/artwork-preview-5.png";
import Button from "../button";
import ArtistPopUp from "../shared/artistpopup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AsideFilter from "./asideFilter";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";

const LayoutArtwork = (props) => {
  const tooltip = <Tooltip id="tooltip">Chain: Songbird</Tooltip>;
  const tooltip1 = <Tooltip id="tooltip1">List Price: 7602 FLR</Tooltip>;

  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;

  const [collectionDetails, setCollectionDetails] = useState(props?.ApvNFT);
  const [nftDetails, setNftDetails] = useState([]);
  const [listedNfts, setListedNfts] = useState([]);
  // Initialize web3 with your Ethereum node URL
  // const web3 = new Web3(window.ethereum);
  const [web3, setWeb3] = useState();

  useEffect(() => {
    if (collectionDetails?.selectedNetwork === "Coston") {
      setWeb3(new Web3(process.env.REACT_APP_COSTON_RPC_URL));
    } else {
      setWeb3(new Web3(process.env.REACT_APP_COSTON2_RPC_URL));
    }
  }, [collectionDetails]);

  const getAllListNFTData = async () => {
    // const accounts = await web3.eth.getAccounts();
    if (collectionDetails?.Approved) {
      // getting nft records from Marketplace contract
      //console.log("Marketplace_coston_contractAddress", Marketplace_coston_contractAddress);
      let MarketplaceAddress;
      if (collectionDetails?.selectedNetwork === "Coston") {
        MarketplaceAddress = Marketplace_coston_contractAddress;
      } else {
        MarketplaceAddress = Marketplace_coston2_contractAddress;
      }
      console.log("MarketplaceAddress", MarketplaceAddress);
      const contract = new web3.eth.Contract(contractABI, MarketplaceAddress);
      //console.log("contract", contract);
      const data = await contract.methods.getAllListedNfts().call();
      //console.log("nft contract data", data);
      setListedNfts(data);
    }
  };

  useEffect(() => {
    // getListNFTData();
    setNftDetails(props?.nftDetails);
    getAllListNFTData();
    //console.log("nftDetails", nftDetails);
  }, [props?.nftDetails]);

  const location = useLocation();
  const navigate = useNavigate();
  const [collectionData, setCollectionData] = useState([]);
  const [nftFilteredDetails, setNftFilteredDetails] = useState(collectionData);

  useEffect(() => {
    if (props?.nfts !== undefined) {
      let nftListDetails = [];
      props?.nfts?.map((item) => {
        let isListed = false;
        let isSaleListed = false;
        let isOfferListed = false;
        //console.log("useEffect item", item);

        listedNfts[0]?.map((nft) => {
          if (nft?.uriData === item?.uri) {
            //console.log("layout grid nftDetail :", nft);
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
            //console.log("layout grid nftDetail :", nft);
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
        //console.log("useEffect isListed", isListed);
        if (!isListed) {
          //console.log("useEffect isListed false", isListed);
          //console.log("nftDetails", nftDetails);
          const listedDetail = nftDetails?.find((nft) => {
            return nft.uri == item.uri;
          });
          //console.log("listedDetail", listedDetail);
          let data = { ...item, listedDetail, isListed: false };
          nftListDetails.push(data);
          return;
        }
      });
      setCollectionData(nftListDetails);
      setNftFilteredDetails(nftListDetails);
      //console.log("nftListDetails", nftListDetails);
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
        //console.log("false");
        categoriesFilter = true;
      }

      // Filter by currency
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
      <div>
        {/* <div
        className={
          props.flag ? "d-flex align-item-center justify-content-between" : ""
        }
      > */}
        {/* <div className={props.flag ? "my-filter w-25" : "d-none"}>
          <AsideFilter />
        </div> */}

        {/* <div className="artwork-layout"> */}
        {/* <div
          className={` artwork-layout  ${
            props.flag ? "w-75 active d-none" : "d-none"
          }`}
        >
          {artwork.map((item, index) => {
            return (
              <div className="artwork-card ">
                <img
                  src={art1}
                  alt="artwork"
                  className="img-100 artwork-hover"
                />
                <OverlayTrigger placement="top" overlay={tooltip} id="tooltip">
                  <img src={sgb} alt="artwork" className="img-45 sgb" />
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={tooltip1}
                  id="tooltip1"
                >
                  <label className="art-price text-white">
                    <img src={sgb} alt="artwork" className="img-24 " />
                    7.77k
                  </label>
                </OverlayTrigger>
              </div>
            );
          })}
        </div> */}
        {/* ---------------------------------------- */}
      </div>

      <div
        className={
          props.flag ? "d-flex align-item-center justify-content-between" : ""
        }
      >
        <div className={props.flag ? "my-filter w-25" : "d-none"}>
          <AsideFilter onSelectedFilterChange={handleSelectedFilterChange} />
        </div>
        <div
          className={`grid-display layout-artwork  ${
            props.flag ? "w-75 active" : ""
          }`}
        >
          {nftFilteredDetails.map((item, index) => {
            return (
              <div className="collection-grid-card" key={index}>
                <div className="card-body">
                  <div className="art-img">
                    <img
                      src={item?.data?.image}
                      alt="art"
                      className="img-100 artwork-hover"
                    />
                    <img
                      src={item.chainimg}
                      alt="chain"
                      className="chainImage"
                    />
                  </div>
                  {/* <div className="chain-logo ">
                    <OverlayTrigger
                      placement="top"
                      overlay={tooltip}
                      id="tooltip"
                    >
                      <img src={sgb} alt="artwork" className="img-45 " />
                    </OverlayTrigger>
                  </div> */}
                  {/* <OverlayTrigger
                    placement="top"
                    overlay={tooltip1}
                    id="tooltip1"
                  >
                    <div className="sgb">
                      <img src={sgb} alt="sgb" />
                      <p className="body-large text-white ms-1">
                        {item.value}k
                      </p>
                    </div>
                  </OverlayTrigger> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LayoutArtwork;
