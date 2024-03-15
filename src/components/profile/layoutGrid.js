import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import verified from "../../assets/icon/verified-artist-small.svg";
import sgb from "../../assets/icon/SGB.svg";
import FLR from "../../assets/icon//FLR.svg";
import profile from "../../assets/icon/profile-picture.svg";
import videoArt from "../../assets/icon/video-fill.svg";
import loader from "../../assets/icon/loader-medium.svg";
import chainImage from "../../assets/icon/SGB.svg";
import live from "../../assets/icon/website-white.svg";
import userProfile from "../../assets/images/face-3.png";
import cardImg from "../../assets/images/artwork-preview-6.png";
import cardImg1 from "../../assets/images/artwork-preview-7.png";
import cardImg2 from "../../assets/images/artwork-preview-5.png";
import Button from "../button";
import ArtistPopUp from "../shared/artistpopup";
import AsideFilter from "./asideFilter";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";
import { getAllUsers } from "../../firebase/firebase";
import { useAccount } from "wagmi";

const LayoutGrid = (props) => {
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
  const [web3, setWeb3] = useState(null);
  const { address } = useAccount();

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

  // const getListNFTData = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   if (collectionDetails?.Approved) {
  //     // getting nft records from Marketplace contract
  //     //console.log("Marketplace_coston_contractAddress", Marketplace_coston_contractAddress);
  //     const contract = new web3.eth.Contract(
  //       contractABI,
  //       Marketplace_coston_contractAddress
  //     );
  //     //console.log("contract", contract);
  //     const data = await contract.methods
  //       .getNFTDetail(accounts[0], [`${collectionDetails.contractAddress}`])
  //       .call({ from: accounts[0] });
  //     //console.log("nft contract data", data);
  //     setNftDetails(data[0]);
  //   }
  // };

  const getAllListNFTData = async () => {
    // const accounts = await web3.eth.getAccounts();
    if (collectionDetails?.Approved && web3 !== null) {
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
  const getNFTMetaData = async (uri) => {
    const response = await fetch(`${Backend_url}/getNFTMetadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uri: uri,
      }),
    });
    const json = await response.json();
    return json.data.data;
  };

  useEffect(() => {
    // getListNFTData();
    setNftDetails(props?.nftDetails);
    getAllListNFTData();
    //console.log("nftDetails", nftDetails);
  }, [props?.nftDetails, web3]);

  const location = useLocation();
  useEffect(() => {
    //console.log("location Layout Grid", location.pathname.split("/")[2]);
    //console.log("Props: ", props);
    //console.log("userPrp", userProfile);
  }, [userProfile]);
  useEffect(() => {
    //console.log("verified", verified);
  }, [verified]);
  // const tooltip1 = <Tooltip id="tooltip1"> </Tooltip>;

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
    //console.log("handleSelectedFilterChange", newFilter);
    //console.log("collectionData", collectionData);

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
    //console.log("newFilter", newFilter);
    let filteredData = [];
    collectionData.filter((item) => {
      //console.log("filter item", item);
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

  const navigateToSingleArtwork = (item) => {
    //console.log("navigateToSingleArtwork", item);
    if (item.isListed) {
      const formatData = {
        ...item,
        meta: {
          data: item.data,
        },
      };
      //console.log("formatData", formatData);
      if (item.isSaleListed) {
        navigate(`/single-artwork`, {
          state: { page: "collection", data: formatData, listType: "listed" },
        });
      }
      if (item.isOfferListed) {
        navigate(`/single-artwork`, {
          state: { page: "collection", data: formatData, listType: "offer" },
        });
      }
    }
  };

  const [userData, setUserData] = useState([]);

  // const getAccount = async () => {
  //   console.log("account", account);
  //   return account;
  // };

  const checkUser = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log("Curent user", user);
    if (user) {
      setUserData(user);
    }
  };

  useEffect(() => {
    checkUser();
    const fetchUserData = async () => {
      const users = await getAllUsers();
      console.log("users", users);
      setUserData(users);
    };
    fetchUserData();
  }, []);

  const getArtistNamebyAdress = (accountAddress) => {
    let artistName = "";
    console.log("address", address);
    console.log("current user", accountAddress);
    if (address === accountAddress) {
      return "You";
    } else {
      console.log("users", userData);
      userData?.forEach((user) => {
        if (user?.id === address) {
          artistName = user?.userName;
        }
      });
    }

    console.log("artist name", artistName, "address", address);
    return artistName;
  };

  const tooltip1 = (artPrice) => {
    return <Tooltip id="tooltip1">{artPrice}</Tooltip>;
  };

  const tooltip2 = (chainName) => {
    return <Tooltip id="tooltip2">Chain: {chainName}</Tooltip>;
  };

  const getArtistImage = (accountAddress) => {
    let artistImage = userProfile;
    console.log("users", userData);
    userData?.forEach((user) => {
      if (user?.id === accountAddress) {
        if (user?.image) {
          artistImage = user?.image;
        } else {
          artistImage = userProfile;
        }
      }
    });

    console.log("artist image", artistImage);
    return artistImage;
  };

  return (
    <div>
      <div
        className={
          props.flag ? "d-flex align-item-center justify-content-between" : ""
        }
      >
        <div className={props.flag ? "my-filter w-25" : "d-none"}>
          <AsideFilter onSelectedFilterChange={handleSelectedFilterChange} />
        </div>
        <div
          className={`grid-display artworkGrid  ${
            props.flag ? "w-75 active" : ""
          }`}
        >
          {props?.nfts == undefined ? (
            <></>
          ) : (
            nftFilteredDetails.map((item, index) => {
              console.log("layout grid item", item);
              return (
                <div className="collection-grid-card" key={index}>
                  <div className="card-head ">
                    <div className="user-img">
                      <img
                        src={getArtistImage(item?.data?.artistAddress)}
                        alt="profile image"
                        className="img-100"
                      />
                    </div>

                    <div className="user-name">
                      <p className="body-large pointer hover-underline">
                        {item?.data?.artName}
                      </p>
                      <p className="body-medium fw-bold v-center text-black show-artist-popup hover-underline pointer">
                        @{getArtistNamebyAdress(item?.data?.artistAddress)}
                        <img
                          src={verified}
                          alt="verified"
                          className="img-18 ms-1"
                        />
                        {/* artsit pop up here */}
                        <ArtistPopUp
                          userProfile={getArtistImage(
                            item?.data?.artistAddress
                          )}
                          verified={verified}
                          artistName={getArtistNamebyAdress(
                            item?.data?.artistAddress
                          )} // passing artist as prop
                          left="-60px"
                          top="-215px"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="card-body">
                    <div
                      className="art-img"
                      // onClick={() =>
                      //   navigate(`/single-artwork/${item.uri}`)
                      // }
                      // onClick={() =>
                      //   navigate(`/single-artwork`, {
                      //     state: { page: "collection", data: item },
                      //   })
                      // }
                      onClick={() => navigateToSingleArtwork(item)}
                    >
                      <img
                        src={item?.data?.image}
                        alt="art"
                        className="img-100 artwork-hover"
                      />
                      <img
                        src={chainImage}
                        alt="chain"
                        className="chainImage"
                      />
                    </div>

                    {/* if songbird */}
                    {item.data.selectedBlockchain === "Coston" ? (
                      <>
                        <div className="chain-logo ">
                          <OverlayTrigger
                            placement="top"
                            overlay={tooltip2(item?.data?.selectedBlockchain)}
                            id="tooltip1"
                          >
                            <img src={sgb} alt="chain logo" />
                          </OverlayTrigger>
                        </div>
                        <OverlayTrigger
                          placement="top"
                          overlay={tooltip1(
                            (item.isSaleListed && item?.listedData?.price) ||
                              (item.isOfferListed &&
                                item?.listedData?.minimumBid)
                          )}
                          id="tooltip1"
                        >
                          <div className="sgb">
                            <img src={sgb} alt="sgb" />
                            <p className="body-large text-white ms-1">
                              {(item.isSaleListed && item?.listedData?.price) ||
                                (item.isOfferListed &&
                                  item?.listedData?.minimumBid)}
                            </p>
                          </div>
                        </OverlayTrigger>
                      </>
                    ) : // ) : item.pricing === "usd" ? (
                    //   <div className="sgb">
                    //     <p className="body-large text-white ms-1">$1,200</p>
                    //   </div>
                    item.data.selectedBlockchain === "Coston2" ? (
                      <>
                        <div className="chain-logo ">
                          <OverlayTrigger
                            placement="top"
                            overlay={tooltip2(item?.data?.selectedBlockchain)}
                            id="tooltip1"
                          >
                            <img src={FLR} alt="chain logo" />
                          </OverlayTrigger>
                        </div>
                        <OverlayTrigger
                          placement="top"
                          overlay={tooltip1(
                            (item.isSaleListed && item?.listedData?.price) ||
                              (item.isOfferListed &&
                                item?.listedData?.minimumBid)
                          )}
                          id="tooltip1"
                        >
                          <div className="sgb">
                            <img src={FLR} alt="FLR" />
                            <p className="body-large text-white ms-1">
                              {(item.isSaleListed && item?.listedData?.price) ||
                                (item.isOfferListed &&
                                  item?.listedData?.minimumBid)}
                            </p>
                          </div>
                        </OverlayTrigger>
                      </>
                    ) : (
                      // ) : item.pricing === "liveAuction" ? (
                      //   <div className="sgb">
                      //     {/* <img src={live} alt="sgb" /> */}
                      //     <p className="body-large text-white ms-1">
                      //       Live Auction
                      //     </p>
                      //   </div>
                      <></>
                    )}
                  </div>
                  {/* List NFT Button for Popup */}
                  {/* {isListed !== undefined && isOfferListed !== undefined && ( */}
                  {props.isOwner &&
                  collectionDetails?.Approved &&
                  !item.isListed ? (
                    <div className="card-footer">
                      <div>
                        <Button
                          text="List for Sale"
                          className="btn-prime btn-primary br-30 font-16 px-4"
                          height="50px"
                          width="100%"
                          onClick={() => {
                            // //console.log("ListDetial", ListDetail);
                            navigate(`/list-forSale`, {
                              state: {
                                data: item?.data,
                                nftDetails: item,
                                chain: collectionDetails?.selectedNetwork,
                              },
                            });
                          }}
                        />
                      </div>
                      <span className="or text-medium-Black body-large text-align-center mt-3">
                        or
                      </span>
                      {/* List NFT Offer Button for Popup */}
                      <div>
                        <Button
                          text="List for Offer"
                          className="btn-prime btn-primary br-30 font-16 px-2 mx-2"
                          height="50px"
                          width="100%"
                          onClick={() => {
                            // //console.log("ListDetial", ListDetail);
                            navigate(`/list-forOffer`, {
                              state: {
                                data: item?.data,
                                nftDetails: item,
                                chain: collectionDetails?.selectedNetwork,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    // <center>
                    //   <div className="offer my-4 mt-5">
                    //     {item?.isSaleListed && (
                    //       <p className="body-large text-bold-black  ">
                    //         Listed For Sale
                    //       </p>
                    //     )}
                    //     {item?.isOfferListed && (
                    //       <p className="body-large text-bold-black  ">
                    //         Listed For Offer
                    //       </p>
                    //     )}
                    //   </div>
                    // </center>
                    <></>
                  )}
                  {/* )} */}

                  <div className="card-footer">
                    <div className="owner show-artist-popup">
                      <p className="body-medium text-medium-grey ">Owner</p>
                      <p className="body-medium fw-bold v-center text-black">
                        <img src={profile} alt="profile" />
                        You{/* artsit pop up here */}
                        <ArtistPopUp
                          userProfile={getArtistImage(
                            item?.data?.artistAddress
                          )}
                          verified={verified}
                          artistName={getArtistNamebyAdress(
                            item?.data?.artistAddress
                          )} // passing artist as prop
                          left="0px"
                          top="-200px"
                        />
                      </p>
                    </div>
                    {item.isListed && (
                      <>
                        <div className="divider"></div>
                        <div className="offer">
                          {item?.isSaleListed && (
                            <>
                              <p className="body-medium text-medium-grey ">
                                List Price
                              </p>
                              <label className="medium text-black">
                                {item.isSaleListed && item?.listedData?.price}
                              </label>
                            </>
                          )}
                          {item?.isOfferListed && (
                            <>
                              <p className="body-medium text-medium-grey ">
                                Best Offer
                              </p>
                              <label className="medium text-black">---</label>
                            </>
                          )}
                          {/* <label className="medium text-black">
                            {/* <img src={sgb} alt="profile" /> 
                            {item.isSaleListed && item?.listedData?.price}
                            {item.isOfferListed && item?.listedData?.minimumBid}
                          </label> */}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="content-loader rotate-360 d-none">
        <img src={loader} alt="loader" />
      </div>
    </div>
  );
};
export default LayoutGrid;
