import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import Esc from "../../assets/images/Esc.png";

import Button from "../button";
import Accordion from "react-bootstrap/Accordion";
import tick from "../../assets/icon/tick-small-white.svg";
import wallet from "../../assets/icon/wallet.svg";
import error from "../../assets/icon/close-small.svg";
import loader from "../../assets/icon/loader-small-white.svg";
import refresh from "../../assets/icon/refresh-metadata-white.svg";
import userProfile from "../../assets/images/face-3.png";
import art from "../../assets/images/artwork2.png";
import art1 from "../../assets/images/artwork.jpg";
import like from "../../assets/icon/likes-large.svg";
import liked from "../../assets/icon/liked.svg";
import FLR from "../../assets/icon/FLR.svg";
import option from "../../assets/icon/more-horizontal.svg";
import offer from "../../assets/icon/sold.svg";
import offerMade from "../../assets/icon/offer-made.svg";
import listed from "../../assets/icon/list-for-sale.svg";
import minted from "../../assets/icon/favicon-24px.svg";
import arrow from "../../assets/icon/arrow-angle-right-grey.svg";
import verified from "../../assets/icon/verified-artist.svg";
import Modal from "react-bootstrap/Modal";
import Input from "../inputs";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../shared/userProfile";
import Dropdown from "../shared/dropdown";
import ArtistPopUp from "../shared/artistpopup";
import CustomCheckBox from "../shared/customTags";
import useScrollToTop from "../../customHooks/scrollToTop";
import { useLocation } from "react-router-dom";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";

import {
  getNftDetailsFirebase,
  handleFavorite,
  handleNotifications,
  handleCollectionHistory,
  getCollectionStats,
  saveCollectionStats,
  saveLikedArtwork,
  getAllLikedArtwork,
  saveArtistStats,
} from "../../firebase/firebase";
import { useSwitchNetwork, useNetwork } from "wagmi";
import { useAccount } from "wagmi";
const SingleArt2 = () => {
  const location = useLocation();
  const { address } = useAccount();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const data = location.state.data;
  const page = location.state.page;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [createFinish, setCreateFinish] = useState(false);
  const [artTransfer, setArtTransfer] = useState(false);
  const [buyArtModal, setBuyArtModal] = useState(false);
  const [makeOfferModal, setMakeOfferModal] = useState(false);
  const [bidModal, setBidModal] = useState(false);
  const [editListModal, setEditListModal] = useState(false);
  const handleCreateFinish = () => setCreateFinish(!createFinish);
  const handleArtTransfer = () => setArtTransfer(!artTransfer);
  const handleBuyArtModal = () => setBuyArtModal(!buyArtModal);
  const handleOfferModal = () => setMakeOfferModal(!makeOfferModal);
  const handleBidModal = () => setBidModal(!bidModal);
  const handleEditListModal = () => setEditListModal(!editListModal);
  const [connectedAccount, setConnectedAccount] = useState(false);
  const [offerHistory, setOfferHistory] = useState([]);
  const [listedType, setListedType] = useState(0);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectUserAddress, setSelectUserAddress] = useState(null);
  const [isClaimUser, setIsClaimUser] = useState(false);
  const [selectedbid, setSelectedBid] = useState(null);
  const [activeCollection, setActiveCollection] =
    useState("Recently collected");
  const [offerPrice, setOfferPrice] = useState(
    data?.listedData?.minimumBid || 0
  );
  const [isNewtworkConnected, setIsNewtworkConnected] = useState(false);

  useEffect(() => {
    const tokenData = location.state.data;
    console.log("netwrok UseEffect");
    if (tokenData.meta.data.selectedBlockchain === chain.name) {
      setIsNewtworkConnected(true);
    } else {
      setIsNewtworkConnected(false);
    }
  }, [chain, data]);

  const handleSwitchChain = async () => {
    const tokenData = location.state.data;
    console.log("token Data", tokenData);
    const switchTo = chains.find(
      (c) => c.name === tokenData.meta.data.selectedBlockchain
    );
    if (switchTo) {
      switchNetwork?.(switchTo.id);
    }
  };

  const Backend_url = process.env.REACT_APP_BACKEND_URL;
  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;
  // const web3 = new Web3(window.ethereum);
  // let account;

  const [web3, setWeb3] = useState(null);
  const web3_1 = new Web3(window.ethereum);

  useEffect(() => {
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      setWeb3(new Web3(process.env.REACT_APP_COSTON_RPC_URL));
      console.log("connected to coston explorer collection");
    }
    if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      setWeb3(new Web3(process.env.REACT_APP_COSTON2_RPC_URL));
      console.log("connected to coston2 explorer collection");
    }
  }, [location.state.data]);

  useEffect(() => {
    // const getaccount = async () => {
    //   account = await web3.eth.getAccounts();
    //   setConnectedAccount(account[0]);
    // };
    // getaccount();
    setConnectedAccount(address);
    console.log("location data", data);
  }, []);

  const handlePriceChange = (e) => {
    setOfferPrice(e.target.value);
  };

  const navigate = useNavigate();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  const toggleFullScreen = () => {
    if (windowWidth >= 1024) {
      setIsFullScreen(!isFullScreen);
    } else setIsFullScreen(false);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBuyNow = () => {
    if (BuyNow()) {
      handleNotifications(
        username,
        `${username} sold this item to test`,
        "itemSold",
        300
      );
      toast.success(
        "   Congratulations! You've successfully purchased this item."
      );
      navigate("/explore");
    }
  };

  const handleMakeAnOffer = () => {
    if (makeOffer()) {
      handleNotifications(
        username,
        `${username} made an offer of ${offerPrice}`,
        "bidActivity",
        offerPrice
      );
      toast.success("Offer made successfully");
      // window.location.reload();
    }
  };

  useScrollToTop();

  const { id } = useParams();
  const username = localStorage?.getItem("userName");
  const [isLiked, setIsLiked] = useState(false);

  const getAllLikes = async () => {
    const result = await getAllLikedArtwork(username);
    console.log("all  likeresult", result);
  };

  useEffect(() => {
    getAllLikes();
    const checkLike = async () => {
      if (username) {
        const result = await getAllLikedArtwork(username);
        console.log("result", result);
        if (result?.likedArtworks?.includes(data?.uriData)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    };
    checkLike();
  }, [username]);

  const handleLikeClick = async () => {
    try {
      // const result = await handleFavorite(username, id);
      console.log("nft", nftDetails);
      console.log("username", username);
      console.log("nftDetails", data?.uriData);

      const result = await saveLikedArtwork(username, data?.uriData);
      console.log("result", result);
      if (result) {
        getAllLikes();
        toast.success(
          "Congratulations! You've successfully added item to favorite."
        );
        setIsLiked(true);
      } else {
        getAllLikes();
        toast.error("Removed from favorite!");
        setIsLiked(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request.");
    }
  };

  const [nftDetails, setNftDetails] = useState(null);

  const getNftMetadata = async (tokens_uri) => {
    console.log("url: " + `${Backend_url}/getNFTMetadata`);
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
      data: json?.data?.data,
    };
  };

  const getOfferHistory = async () => {
    if (web3 !== null) {
      let MarketplaceAddress;
      const tokenData = location.state.data;
      if (tokenData.meta.data.selectedBlockchain === "Coston") {
        MarketplaceAddress = Marketplace_coston_contractAddress;
      } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
        MarketplaceAddress = Marketplace_coston2_contractAddress;
      }
      console.log("MarketplaceAddress", MarketplaceAddress);
      const contract = new web3.eth.Contract(contractABI, MarketplaceAddress);
      const auctionListId = data?.listCount;
      const result = await contract.methods
        .getBiddingHistory(auctionListId)
        .call();
      console.log("offer result", result);
      setOfferHistory(result);
      return result;
    }
  };

  const getNftDetails = async () => {
    // const result = await getNftDetailsFirebase(id);
    console.log("state data: ", data);
    let uri;
    if (page === "explore") {
      setNftDetails(data?.meta?.data);
      console.log("list state: ", location.state?.listType);
      if (location.state?.listType === "listed") {
        setListedType(1);
      }
      if (location.state?.listType === "offer") {
        setListedType(2);
        getOfferHistory();
      }
      console.log("listed type: ", listedType);
    } else {
      uri = data;
      const result = await getNftMetadata(uri);
      console.log(result);
      setNftDetails(result?.data);
    }
  };

  useEffect(() => {
    if (location.state?.listType === "offer") {
      if (getOfferHistory() !== undefined) {
        console.log("offerHistory useEffect", offerHistory);
        getNftDetails();
        getSelectedUser();
      }
    } else {
      getNftDetails();
    }
  }, [web3]);

  const handleSaveArtistStats = async (artistAddress, sale) => {
    console.log("artistAddress", artistAddress);
    console.log("sale", sale);
    const artistStats = await saveArtistStats(artistAddress, sale);
    console.log("result", artistStats);
  };

  const BuyNow = async () => {
    const accounts = await web3_1.eth.getAccounts();
    let MarketplaceAddress;
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    const contract = new web3_1.eth.Contract(contractABI, MarketplaceAddress);
    const contractOwner = await contract.methods.owner().call();
    console.log("accounts", accounts);
    console.log("contractOwner", contractOwner);
    console.log("contract", contract);
    const priceToEther = data?.listedData?.price;
    const royality = 2;
    console.log("pricetoether", priceToEther);
    if (data?.listedData?.count || priceToEther) {
      const transaction = contract.methods.buyNft(
        data?.listedData?.count,
        priceToEther
        // royality,
        // contractOwner
      );
      console.log("data", transaction.encodeABI());
      // web3.eth
      //   .estimateGas({
      //     from: accounts[0],
      //     data: transaction.encodeABI(),
      //     value: web3.utils.toWei(priceToEther, "ether"),
      //   })
      //   .then((gasEstimate) => {
      //     console.log("Gas Estimate:", gasEstimate);
      //   })
      //   .catch((error) => {
      //     console.error("Error estimating gas:", error);
      //   });
      // const gas = await transaction.estimateGas({
      //   from: accounts[0],
      // });
      // console.log("gas", gas);
      const result = await transaction.send({
        from: accounts[0],
        value: web3_1.utils.toWei(priceToEther, "ether"),
        // gasLimit: 3000000,
      });
      console.log("result", result);
      const historyData = {
        action: "sold",
        user: username,
        artworkUri: nftDetails,
        from: data?.listedData?.owner,
        to: accounts[0],
        price: priceToEther,
        tokenId: data?.listedData?.tokenId,
      };
      handleCollectionHistory(nftDetails?.selectedCollectionId, historyData);
      handlecollectionStats(accounts[0], priceToEther);
      handleSaveArtistStats(data?.listedData?.artist, priceToEther);
      setBuyArtModal(false);
      return true;
    }
  };

  const ClaimNft = async () => {
    const accounts = await web3_1.eth.getAccounts();
    let MarketplaceAddress;
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    const contract = new web3_1.eth.Contract(contractABI, MarketplaceAddress);
    const contractOwner = await contract.methods.owner().call();
    console.log("accounts", accounts);
    console.log("contractOwner", contractOwner);
    console.log("contract", contract);
    const priceToEther = selectedbid?.price;
    const royality = 2;
    let balance = await web3_1.eth.getBalance(accounts[0]);
    balance = parseFloat(await web3_1.eth.getBalance(accounts[0]));
    console.log("balance", balance);
    if (balance < parseFloat(priceToEther)) {
      alert(
        `Insufficient balance, you need ${priceToEther} FLR to claim this NFT`
      );
      return;
    }
    const auctionListId = data?.listCount;
    console.log("pricetoether", priceToEther);
    console.log("auctionListId", auctionListId);
    console.log("royality", royality);
    console.log("contractOwner", contractOwner);
    const transaction = contract.methods.ClaimNFT(
      auctionListId
      // royality,
      // contractOwner
    );

    console.log("data", transaction.encodeABI());
    const result = await transaction.send({
      from: accounts[0],
      value: web3_1.utils.toWei(priceToEther, "ether"),
      gasLimit: 300000,
    });
    console.log("result", result);
    setBidModal(false);
    const historyData = {
      action: "tranfer",
      user: username,
      artworkUri: nftDetails,
      from: data?.listedData?.owner,
      to: accounts[0],
      price: priceToEther,
      tokenId: data?.listedData?.tokenId,
    };
    handleCollectionHistory(nftDetails?.selectedCollectionId, historyData);
    handlecollectionStats(accounts[0], priceToEther);
    handleSaveArtistStats(data?.listedData?.artist, priceToEther);
    getOfferHistory();
    getSelectedUser();
    navigate("/explore");
  };

  const handlecollectionStats = async (owner, offerPrice) => {
    const collectionId = nftDetails?.selectedCollectionId;
    const collectionStats = await getCollectionStats(collectionId);
    console.log("collectionStats", collectionStats);
    if (collectionStats) {
      let volume = [];
      if (collectionStats?.volume.length > 0) {
        volume = collectionStats?.volume;
        volume.push(`${offerPrice}-${new Date().getTime()}`);
      } else {
        volume.push(`${offerPrice}-${new Date().getTime()}`);
      }

      let owners = collectionStats?.owners;
      if (owners.length > 0) {
        if (!owners.includes(owner)) {
          owners.push(owner);
        }
      } else {
        owners.push(owner);
      }
      const data = {
        collectionId: collectionId,
        artworkCount: collectionStats?.artworkCount,
        createdAt: collectionStats?.createdAt,
        creatorEarning: collectionStats?.creatorEarning,
        volume: volume,
        SGBvolume: collectionStats?.SGBvolume,
        FLRvolume: collectionStats?.FLRvolume,
        USDvolume: collectionStats?.USDvolume,
        floorPrice: collectionStats?.floorPrice,
        listedCount: collectionStats?.listedCount - 1,
        saleCount: collectionStats?.saleCount + 1,
        owners: owners,
      };
      saveCollectionStats(data);
    }
  };

  const makeOffer = async () => {
    const accounts = await web3_1.eth.getAccounts();
    let MarketplaceAddress;
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    const contract = new web3_1.eth.Contract(contractABI, MarketplaceAddress);
    const contractOwner = await contract.methods.owner().call();
    if (contractOwner === accounts[0]) {
      alert("You are the owner of this NFT");
      return;
    }
    console.log("accounts", accounts);
    console.log("contractOwner", contractOwner);
    console.log("contract", contract);
    const auctionListId = data?.listCount;
    // const priceToEther = web3.utils.toWei(offerPrice, "ether");
    const priceToEther = offerPrice;
    console.log("pricetoether", priceToEther);
    const username = localStorage?.getItem("userName") || "user1";
    const transaction = contract.methods.NftOffers(
      auctionListId,
      username,
      priceToEther
    );
    console.log("data", transaction?.encodeABI());
    // web3.eth
    //   .estimateGas({
    //     from: accounts[0],
    //     data: transaction.encodeABI(),
    //     value: web3.utils.toWei(priceToEther, "ether"),
    //   })
    //   .then((gasEstimate) => {
    //     console.log("Gas Estimate:", gasEstimate);
    //   })
    //   .catch((error) => {
    //     console.error("Error estimating gas:", error);
    //   });
    // const gas = await transaction.estimateGas({
    //   from: accounts[0],
    // });
    // console.log("gas", gas);
    const result = await transaction?.send({
      from: accounts[0],
      // value: web3.utils.toWei(priceToEther, "ether"),
      gasLimit: 3000000,
    });
    console.log("result", result);
    const historyData = {
      action: "offer",
      user: username,
      artworkUri: nftDetails,
      from: accounts[0],
      to: data?.listedData?.owner,
      price: priceToEther,
      tokenId: data?.listedData?.tokenId,
    };
    handleCollectionHistory(nftDetails?.selectedCollectionId, historyData);
    setMakeOfferModal(false);
    getOfferHistory();

    return true;
  };

  const handleAcceptOffer = async (bidCount) => {
    const accounts = await web3_1.eth.getAccounts();
    let MarketplaceAddress;
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    const contract = new web3_1.eth.Contract(contractABI, MarketplaceAddress);
    console.log("contract", contract);
    // let balance = await web3.eth.getBalance(accounts[0]);
    // balance = web3.utils.fromWei(balance, "ether");
    // console.log("balance", balance);
    // if (balance < offerPrice) {
    //   alert("Insufficient balance");
    //   return;
    // }
    const auctionListId = data?.listCount;
    const transaction = contract.methods.selectUser(auctionListId, bidCount);
    console.log("data", transaction.encodeABI());
    const result = await transaction.send({
      from: accounts[0],
    });
    console.log("result", result);
    setBidModal(false);
    getOfferHistory();
    getSelectedUser();
  };

  const getSelectedUser = async () => {
    if (web3 !== null) {
      let MarketplaceAddress;
      const tokenData = location.state.data;
      if (tokenData.meta.data.selectedBlockchain === "Coston") {
        MarketplaceAddress = Marketplace_coston_contractAddress;
      } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
        MarketplaceAddress = Marketplace_coston2_contractAddress;
      }
      console.log("MarketplaceAddress", MarketplaceAddress);
      const contract = new web3.eth.Contract(contractABI, MarketplaceAddress);
      const auctionListId = data?.listCount;
      console.log("auctionListId", auctionListId);
      const result = await contract.methods.SelectedUser(auctionListId).call();
      console.log("result", result);
      setSelectedUser(result);
      if (result !== 0) {
        console.log("offerHistory", offerHistory[result - 1]?.user);
        console.log("connectedAccount", connectedAccount);
        setSelectedBid(offerHistory[result - 1]);
        setSelectUserAddress(offerHistory[result - 1]?.user);
      }
      if (offerHistory[result - 1]?.user === connectedAccount) {
        setIsClaimUser(true);
      }
    }
  };

  useEffect(() => {
    getSelectedUser();
    // if (selectUserAddress == connectedAccount) {
    //   setIsClaimUser(true);
    // }
    console.log("is claim ", isClaimUser);
  }, [offerHistory, address]);

  const handleCancelList = async () => {
    const accounts = await web3_1.eth.getAccounts();
    let MarketplaceAddress;
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    const contract = new web3_1.eth.Contract(contractABI, MarketplaceAddress);
    const auctionListId = data?.listCount;
    const transaction = contract.methods.CancelOffer(auctionListId);
    console.log("data", transaction.encodeABI());
    const result = await transaction.send({
      from: accounts[0],
    });
    console.log("result", result);
    setEditListModal(false);
    navigate("/explore");
  };

  const handleCancelOfferList = async () => {
    const accounts = await web3_1.eth.getAccounts();
    let MarketplaceAddress;
    const tokenData = location.state.data;
    if (tokenData.meta.data.selectedBlockchain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (tokenData.meta.data.selectedBlockchain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    const contract = new web3_1.eth.Contract(contractABI, MarketplaceAddress);
    const auctionListId = data?.listCount;
    const transaction = contract.methods.cancelOfferList(auctionListId);
    console.log("data", transaction.encodeABI());
    const result = await transaction.send({
      from: accounts[0],
    });
    console.log("result", result);
    setEditListModal(false);
    navigate("/explore");
  };

  return (
    <div>
      <div className="artwork-details">
        <div className="artwork-banner site-containers v-center  ">
          <div className="left ">
            <div className="banner-img">
              <img
                src={nftDetails?.image}
                alt=""
                className="art-banner img-fluid pointer w-100"
                onClick={toggleFullScreen}
              />
              {isLiked ? (
                <img
                  src={liked}
                  alt="like"
                  className={`like-icon img-24 pointer ${isLiked ? "" : ""}`}
                  onClick={handleLikeClick}
                />
              ) : (
                <img
                  src={like}
                  alt="like"
                  className={`like-icon img-24 pointer ${
                    isLiked ? "invert1" : ""
                  }`}
                  onClick={handleLikeClick}
                />
              )}
            </div>
          </div>
          <div className="">
            <div className="artwork-user-wrapper  ">
              <div className="collection-name v-center">
                <p
                  className="body-medium fw-bold text-black no-text-transform v-center pointer hover-underline "
                  onClick={() => navigate("/explore-collections")}
                >
                  {nftDetails?.selectedCollection}
                  <img
                    src={verified}
                    alt="verify"
                    className="img-18 img-fluid ms-2"
                  />
                </p>

                <label className="no-text-transform br-30">
                  {nftDetails?.selectedBlockchain}
                </label>
              </div>
              <h3 className="fw-bold">{nftDetails?.name}</h3>

              <div className="artist-owner v-center gap-5 mt-30">
                <UserProfile status={"artist"} />
                <UserProfile status={"owner"} />
              </div>
            </div>
            {listedType !== 0 && (
              <div className="pricing-wrapper">
                <div className="list-price mt-40">
                  <label className="medium text-grey no-text-transform fw-normal pb-2">
                    List price
                  </label>
                  <div className="price-value v-end">
                    <span className="v-center">
                      <img src={FLR} alt="flr" />
                      {listedType === 1 ? (
                        <h6 className="font-normal">
                          {data?.listedData?.price}
                        </h6>
                      ) : (
                        <h6 className="font-normal">
                          {data?.listedData?.minimumBid}
                        </h6>
                      )}
                    </span>
                    <p className="body-medium mb--2 ms-1">
                      FLR
                      <span className="text-medium-grey ms-1">($230)</span>
                    </p>
                  </div>

                  {/* btns */}
                  <div className="artwork-btns  v-center gap-10 mt-30 ">
                    {listedType === 1 &&
                      (data?.listedData?.seller === connectedAccount ? (
                        isNewtworkConnected ? (
                          <Button
                            text="Cancel listing"
                            className="btn-prime btn-primary"
                            width="176px"
                            height="36px"
                            onClick={handleCancelList}
                          />
                        ) : (
                          <Button
                            text="Switch Network To Cancel Listing"
                            className="btn-prime btn-primary"
                            width="100%"
                            height="36px"
                            onClick={handleSwitchChain}
                          />
                        )
                      ) : (
                        <Button
                          text="Buy now"
                          className="btn-prime btn-primary"
                          width="176px"
                          height="36px"
                          onClick={handleBuyArtModal}
                        />
                      ))}
                    {listedType === 2 &&
                      (isClaimUser ? (
                        isNewtworkConnected ? (
                          <Button
                            text="Claim NFT"
                            className="btn-prime btn-secodary bg-white"
                            width="176px"
                            height="36px"
                            onClick={ClaimNft}
                            // onClick={handleClaimNft}
                          />
                        ) : (
                          <Button
                            text="Switch Network To Claim"
                            className="btn-prime btn-primary"
                            width="190px"
                            height="36px"
                            onClick={handleSwitchChain}
                          />
                        )
                      ) : data?.listedData?.owner === connectedAccount ? (
                        // (console.log("connectedAccount", connectedAccount),
                        // console.log(
                        //   "data?.listedData?.owner",
                        //   data?.listedData?.owner
                        // ),
                        isNewtworkConnected ? (
                          <Button
                            text="Cancel Offer listing"
                            className="btn-prime btn-primary"
                            width="176px"
                            height="36px"
                            onClick={handleCancelOfferList}
                          />
                        ) : (
                          <Button
                            text="Switch Network To Cancel Offer"
                            className="btn-prime btn-primary"
                            width="190px"
                            height="36px"
                            onClick={handleSwitchChain}
                          />
                        )
                      ) : (
                        <Button
                          text="Make an offer"
                          className="btn-prime btn-secodary bg-white"
                          width="176px"
                          height="36px"
                          // onClick={handleArtTransfer}
                          onClick={handleOfferModal}
                        />
                      ))}
                    <div className="more-opt cursor-pointer dropdown rounded-circle option-btn img-35">
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

                  {/* If artwork is owned by you and not yet listed, show LIST FOR SALE
                button instead of BUY NOW and MAKE OFFER buttons. */}
                  {/* List for sale */}
                  <div className="artwork-btns  v-center gap-10 d-none">
                    <Button
                      text="List for sale"
                      className="btn-prime btn-primary"
                      width="176px"
                      height="36px"
                      onClick={handleBuyArtModal}
                    />
                    <div className="more-opt cursor-pointer dropdown rounded-circle option-btn img-35">
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

                  {/* If artwork is owned by you and LISTED, show EDIT LISTING button and
                instead of BUY NOW and MAKE OFFER buttons. */}
                  {/* Edit Listing */}
                  <div className="artwork-btns  v-center gap-10 d-none">
                    <Button
                      text="Edit listing"
                      className="btn-prime btn-primary"
                      width="176px"
                      height="36px"
                      onClick={handleEditListModal}
                    />
                    <div className="more-opt cursor-pointer dropdown rounded-circle option-btn img-35">
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
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="artwork-details-content mt-60">
          <div className="left-content">
            <div className="history ">
              <h5 className="fw-bold no-text-transform">Offer History</h5>
              <div className="history-content">
                {/* sold */}
                {/* <div className="histrory-list">
                  <div className="left img-24 v-center justify-content-center">
                    <img src={offer} alt="offer" className="img-14" />
                  </div>
                  <div className="right">
                    <p className="body-medium ">
                      <span className="position-relative pointer hover-underline show-artist-popup">
                        @user4
                        <ArtistPopUp
                          userProfile={userProfile}
                          verified={verified}
                          left="10px"
                          top="-215px"
                        />
                      </span>{" "}
                      sold this item to{" "}
                      <span className="position-relative show-artist-popup pointer hover-underline">
                        @user4
                        <ArtistPopUp
                          userProfile={userProfile}
                          verified={verified}
                          left="10px"
                          top="-215px"
                        />
                      </span>{" "}
                      for 2300 FLR
                    </p>
                    <label className="small pointer hover-underline">
                      {" "}
                      JULY 6, 2023 9:31 PM
                      <img src={arrow} alt="" className="img-12 ms-1" />
                    </label>
                  </div>
                </div> */}

                {/* offer */}
                {offerHistory.length > 0 &&
                  offerHistory.map((item, index) => {
                    // console.log("item", item);
                    return (
                      <div className="histrory-list">
                        <div className="left img-24 v-center justify-content-center">
                          <img src={offerMade} alt="offer" className="img-14" />
                        </div>
                        <div className="right">
                          <p className="body-medium">
                            <span className="position-relative show-artist-popup pointer hover-underline">
                              @{item?.userName}
                              <ArtistPopUp
                                userProfile={userProfile}
                                verified={verified}
                                left="10px"
                                top="-215px"
                              />
                            </span>{" "}
                            made an offer of {item?.price} FLR
                          </p>
                          <label className="small     pointer hover-underline">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }).format(new Date(item?.biddingTime * 1000))}
                            {/* JULY 6, 2023 9:31 PM */}
                            <img src={arrow} alt="" className="img-12 ms-1" />
                          </label>
                          {/* {
                            (console.log(
                              "data?.listedData?.owner",
                              data?.listedData?.owner
                            ),
                            console.log("web3.eth.accounts[0]", account))
                          } */}

                          {data?.listedData?.owner === connectedAccount &&
                            (isNewtworkConnected ? (
                              <Button
                                text="Accept offer"
                                className={`btn-prime ${
                                  selectedUser === 0
                                    ? "btn-ternary mt-2"
                                    : "btn-primary mt-2"
                                }`}
                                // className={`btn-prime btn-primary mt-2`}
                                width="100px"
                                height="30px"
                                disabled={selectedUser === 0}
                                onClick={() =>
                                  handleAcceptOffer(item?.bidCount)
                                }
                              />
                            ) : (
                              <Button
                                text="Switch Network To Accept Offer"
                                className="btn-prime btn-primary"
                                width="190px"
                                height="36px"
                                onClick={handleSwitchChain}
                              />
                            ))}
                        </div>
                      </div>
                    );
                  })}

                {/* listed */}
                {/* <div className="histrory-list ">
                  <div className="left img-24 v-center justify-content-center">
                    <img src={listed} alt="offer" className="img-14" />
                  </div>
                  <div className="right">
                    <p className="body-medium">
                      Listed by{" "}
                      <span className="position-relative show-artist-popup pointer hover-underline">
                        @user4
                        <ArtistPopUp
                          userProfile={userProfile}
                          verified={verified}
                          left="10px"
                          top="-215px"
                        />
                      </span>{" "}
                    </p>
                    <label className="small pointer hover-underline">
                      {" "}
                      JULY 6, 2023 9:31 PM
                      <img src={arrow} alt="" className="img-12 ms-1" />
                    </label>
                  </div>
                </div> */}

                {/* mindted */}
                {/* <div className="histrory-list active">
                  <div className="left ">
                    <img src={minted} alt="offer" />
                  </div>
                  <div className="right">
                    <p className="body-medium">
                      Minted by{" "}
                      <span className="position-relative show-artist-popup pointer hover-underline">
                        @user4
                        <ArtistPopUp
                          userProfile={userProfile}
                          verified={verified}
                          left="10px"
                          top="-215px"
                        />
                      </span>{" "}
                    </p>
                    <label className="small pointer hover-underline">
                      {" "}
                      JULY 6, 2023 9:31 PM
                      <img src={arrow} alt="" className="img-12 ms-1" />
                    </label>
                  </div>
                </div>
                */}
              </div>
            </div>
          </div>
          <div className="right-content">
            <div className="artwork-accord">
              <Accordion defaultActiveKey={["0", "1", "2", "3"]} alwaysOpen>
                {/* Description  */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <p className="h-64 body-medium text-uppercase  fw-bold text-se  v-center cursor-pointer">
                      Description
                    </p>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="body-small">
                      {/* A vibrant burst of scarlet hues dominates this abstract
                      artwork, its fiery intensity igniting the canvas.
                      Intersecting strokes create a chaotic dance, evoking raw
                      emotion and passion. The piece radiates an untamed energy,
                      blurring the line between chaos and beauty. */}
                      {nftDetails?.description}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                {/* traits */}
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <p className="h-64 body-medium fw-bold text-uppercase  v-center cursor-pointer">
                      traits
                    </p>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="traits">
                      <div className="trait-box">
                        <label className="small">trait name</label>
                        <p className="body-medium fw-bold">
                          {nftDetails?.traits &&
                          nftDetails.traits.length > 0 ? (
                            <ul>
                              {nftDetails.traits.map((trait, index) => (
                                <li key={index}>{trait.name}</li>
                              ))}
                            </ul>
                          ) : (
                            "No traits found"
                          )}
                        </p>
                      </div>
                      {/* <div className="trait-box">
                        <label className="small">trait name</label>
                        <p className="body-medium fw-bold">Trait valuee…</p>
                      </div>
                      <div className="trait-box">
                        <label className="small">trait name</label>
                        <p className="body-medium fw-bold">Trait valuee…</p>
                      </div>
                      <div className="trait-box">
                        <label className="small">trait name</label>
                        <p className="body-medium fw-bold">Trait valuee…</p>
                      </div>
                      <div className="trait-box">
                        <label className="small">trait name</label>
                        <p className="body-medium fw-bold">Trait valuee…</p>
                      </div>
                      <div className="trait-box">
                        <label className="small">trait name</label>
                        <p className="body-medium fw-bold">Trait valuee…</p>
                      </div> */}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* details */}
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <p className="h-64 body-medium fw-bold text-uppercase  v-center cursor-pointer">
                      details
                    </p>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="details">
                      <label className="small">contract address</label>
                      <label className="medium text-black text-underline no-text-transform">
                        0x0e52…f93b
                      </label>
                    </div>
                    <div className="details">
                      <label className="small">token standard </label>
                      <label className="medium text-black   ">Erc-721</label>
                    </div>
                    <div className="details">
                      <label className="small">BLOCKCHAIN </label>
                      <label className="medium text-black no-text-transform">
                        Flare Network
                      </label>
                    </div>
                    <div className="details">
                      <label className="small">Creator Earnings </label>
                      <label className="medium text-black  ">5%</label>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* tags */}
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <p className="h-64 body-medium fw-bold text-uppercase  v-center cursor-pointer">
                      tags
                    </p>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="mt-22">
                      <CustomCheckBox
                        values={nftDetails?.selectedTags}
                        disabled={true}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="more-collections site-container pb-sm-0">
        <h5 className="fw-bold text-center no-text-transform hide-on-mobile ">
          More from this collection
        </h5>
        <h6 className="fw-bold text-center no-text-transform hide-on-desktop  text-normal font-normal">
          More from this collection
        </h6>
        <div className="collection-cards">
          {collections.map((item, index) => {
            return (
              <div className="collection-card">
                <div className="head pointer">
                  <img src={art} alt="" />
                </div>
                <label className="fw-bold medium text-black no-text-transform ">
                  Artwork Name
                </label>

                <label className="fw-bold small  v-center pointer hover-underline">
                  VIEW ARTWORK
                  <img src={arrow} alt="" className="img-12 ms-2" />
                </label>
              </div>
            );
          })}
        </div>
      </div> */}

      <Modal
        show={createFinish}
        onHide={handleCreateFinish}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              finished
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="newArt-done v-center flex-column">
            <h5 className="italic-head mb-3">All Done</h5>

            <p className="body-medium">
              You created <span className="fw-500">ArtworkName</span>
            </p>
            <img src={art} alt="img" />
            <Button
              text="Done"
              className="btn-prime btn-primary"
              width="131px"
              height="36px"
              onClick={handleCreateFinish}
            />
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={artTransfer}
        onHide={handleArtTransfer}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              Transfer
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="art-transfer v-center flex-column pt-5 mt-2">
            <img src={art} alt="img" />
            <p className="body-medium mt-40 mb-3 pb-3">
              Transfer <span className="fw-bold">“Artwork Name” </span> to
            </p>
            <div className="input-box br-20 ">
              <Input
                type="text"
                placeholder="Address e.g 0x1H3a..."
                className="inputtype1 ps-1"
              />
            </div>
            <div className="h-center gap-3 mt-5 mb-70">
              <Button
                text="Cancel"
                className="btn-prime btn-primary"
                width="131px"
                height="36px"
                onClick={handleArtTransfer}
              />{" "}
              <Button
                text="Transfer"
                className="btn-prime btn-ternery border-0"
                width="131px"
                height="36px"
                onClick={handleArtTransfer}
                disabled="disabled"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Buy now modal */}

      <Modal
        show={buyArtModal}
        onHide={handleBuyArtModal}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              buy now
              {/* while confirmation… */}
              {/* confirm */}
              {/* if error */}
              {/* error */}
              {/* on success */}
              {/* success */}
            </label>

            {/* While Confirm this transaction in your wallet. 
            BUT NOW will be replaced with CONFIRM*/}

            {/* ----------------------------- */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="buy-now-modal w-431 m-auto ">
            <div className="listed-item  v-center">
              <div className="left">
                <img src={nftDetails?.image} alt="img" />
              </div>
              <div className="right ms-3">
                <label className="larger fw-bold text-black no-text-transform">
                  Arwork Name
                </label>
                <p className="body-medium">{`${nftDetails?.selectedCollection} #${nftDetails?.selectedCollectionId}`}</p>
              </div>
            </div>
            <label className="mt-4 pt-1  text-black">Price</label>

            <div className="pricing  body-medium fw-bold mt-2 br-30 v-center w-100 justify-content-between ">
              <Input
                className="body-medium fw-bold text-black  br-30  w-100 ps-1 "
                disabled="disabled"
                placeholder="Price"
                value={data?.listedData?.price}
              />
              <span>FLR</span>
            </div>

            {/* <div className="avail-blnc mt-2 pt-1">
              <p className="body-medium v-center justify-content-between">
                ~ $40.52
                <span>
                  Available balance:
                  <span className="fw-bold"> 3721 FLR</span>
                </span>
              </p>
            </div> */}
            {/* available balance needs to be greater than price before ‘buy now’
            button becomes primary. */}
            {isNewtworkConnected ? (
              <Button
                text="Buy now"
                className="btn-prime btn-primary mt-50"
                width="100%"
                height="36px"
                onClick={handleBuyNow}
              />
            ) : (
              <Button
                text="Switch Network To Buy"
                className="btn-prime btn-primary mt-50"
                width="100%"
                height="36px"
                onClick={handleSwitchChain}
              />
            )}
          </div>

          {/* Waiting for blockchain wallet confirmation… */}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={wallet} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Confirm this transaction in your wallet.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Waiting for blockchain confirmation…
            </p>

            <Button
              text=""
              className="btn-prime btn-primary mt-50"
              width="138px"
              height="36px"
              imageSrc={loader}
              imageClassName="rotate-360"
            />
          </div>

          {/* if error*/}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={error} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Sorry, we couldn't complete this request.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Please try again
            </p>

            <Button
              text="Try again"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              imageSrc={refresh}
              imageClassName="me-2 img-18"
            />
          </div>

          {/* on success */}

          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none ">
            <div className="wallet h-center m-auto">
              <img src={tick} alt="tick" className="img-100 invert1" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Congratulations! You've successfully purchased this item.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Purchase successful!
            </p>

            <Button
              text="Done"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Make an offer */}

      <Modal
        show={makeOfferModal}
        onHide={handleOfferModal}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              MAKE AN OFFER
              {/* while confirmation… */}
              {/* confirm */}
              {/* if error */}
              {/* error */}
              {/* on success */}
              {/* success */}
            </label>

            {/* While Confirm this transaction in your wallet. 
            BUT NOW will be replaced with CONFIRM*/}

            {/* ----------------------------- */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="buy-now-modal w-431 m-auto ">
            <div className="listed-item  v-center">
              <div className="left">
                <img src={nftDetails?.image} alt="img" />
              </div>
              <div className="right ms-3">
                <label className="larger fw-bold text-black no-text-transform">
                  Arwork Name
                </label>
                {/* <p className="body-medium">
                  {nftDetails?.selectedCollection} #
                  {nftDetails?.selectedCollectionId}
                </p> */}
                <p className="body-medium">{`${nftDetails?.selectedCollection} #${nftDetails?.selectedCollectionId}`}</p>
              </div>
            </div>
            <label className="mt-4 pt-1  text-black">Price</label>

            <div className="pricing border-solid-lightGrey body-medium fw-bold mt-2 br-30 v-center w-100 justify-content-between bg-transparent">
              <Input
                className="body-medium fw-bold text-black   br-30  w-100 bg-transparent ps-1"
                placeholder="Price"
                type="number"
                value={offerPrice}
                onChange={handlePriceChange}
              />
              <span>FLR</span>
            </div>

            <div className="avail-blnc mt-2 pt-1">
              <p className="body-medium v-center justify-content-between">
                {offerPrice > 0 ? (
                  <span>~ ${offerPrice * 1.2}</span>
                ) : (
                  <span></span>
                )}
                <span>
                  Available balance:
                  <span className="fw-bold"> 3721 FLR</span>
                </span>
              </p>
            </div>
            {/* available balance needs to be greater than price before ‘buy now’
            button becomes primary. */}
            {isNewtworkConnected ? (
              <Button
                text="Make a bid"
                className="btn-prime btn-primary mt-50"
                width="100%"
                height="36px"
                onClick={handleMakeAnOffer}
                // {()=>{

                //   alert("offer made successfully");
                // }}
              />
            ) : (
              <Button
                text="Switch Network To make an offer"
                className="btn-prime btn-primary mt-50"
                width="100%"
                height="36px"
                onClick={handleSwitchChain}
              />
            )}
          </div>

          {/* Waiting for blockchain wallet confirmation… */}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={wallet} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Confirm this transaction in your wallet.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Waiting for blockchain confirmation…
            </p>

            <Button
              text=""
              className="btn-prime btn-primary mt-50"
              width="138px"
              height="36px"
              imageSrc={loader}
              imageClassName="rotate-360"
            />
          </div>

          {/* if error*/}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={error} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Sorry, we couldn't complete this request.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Please try again
            </p>

            <Button
              text="Try again"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              imageSrc={refresh}
              imageClassName="me-2 img-18"
            />
          </div>

          {/* on success */}

          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none ">
            <div className="wallet h-center m-auto">
              <img src={tick} alt="tick" className="img-100 invert1" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Your offer has been sent. Keep an eye on your notifications!
            </p>

            <p className="body-medium fw-bold text-center mt-30">Offer sent</p>

            <Button
              text="Done"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              onClick={handleOfferModal}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/*  EDIT LISTING*/}

      <Modal
        show={editListModal}
        onHide={handleEditListModal}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              {/*  -----  Edit Listing   ----- */}
              EDIT LISTING
              {/*  -----  Edit Auction Listing   ----- */}
              {/* EDIT Auction LISTING */}
              {/*  -----  while confirmation…   ----- */}
              {/* change price*/}
              {/* ----- on canceling listing----- */}
              {/* cancel Listing */}
              {/*  ----- if error   ----- */}
              {/* error */}
              {/*  -----  on success   ----- */}
              {/* success */}
            </label>

            {/* While Confirm this transaction in your wallet. 
            BUT NOW will be replaced with CONFIRM*/}

            {/* ----------------------------- */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="buy-now-modal w-431 m-auto  ">
            <div className="listed-item  ">
              <div className="v-center">
                <div className="left">
                  <img src={art} alt="img" className="img-100px" />
                </div>
                <div className="right ms-3">
                  <label className="larger fw-bold text-black no-text-transform">
                    Arwork Name
                  </label>
                  <p className="body-medium">Untitled Collection #7156351271</p>
                  <h6 className="fw-bold fst-normal mt-2">7.51k FLR</h6>
                </div>
              </div>
            </div>

            <p className="mt-30 text-center">
              Would you like to change the price of the listing or cancel the
              listing and remove it from sale?
            </p>
            {/* User has the option to CHANGE PRICE or CANCEL LISTING	 */}
            <div className="v-center h-center gap-3 mt-5 w-100">
              <Button
                text="Change price"
                className="btn-prime btn-primary"
                width="156px"
                height="36px"
                onClick={(e) => toast("Change price")}
              />
              <Button
                text="Cancel listing"
                className="btn-prime btn-secondary"
                width="156px"
                height="36px"
                onClick={(e) => toast("Cancel listhg")}
              />
            </div>
          </div>

          {/* Cancel Listing */}

          <div className="buy-now-modal w-431 m-auto d-none">
            <div className="h-center ">
              <img
                src={art}
                alt="img"
                className="img-65 border-solid-black pad-2"
              />
            </div>
            <p className="mt-40 text-center">
              Cancel listing:
              <strong> Artwork</strong>
            </p>
            <p className="mt-30 text-center">
              Are you sure you want to cancel this listing?
            </p>

            {/*  listing	cancelantion warinng */}
            <div className="v-center h-center gap-3 mt-5 w-100 ">
              <Button
                text="Go back"
                className="btn-prime btn-primary"
                width="156px"
                height="36px"
                onClick={(e) => toast("Go Back")}
              />
              <Button
                text="Yes, cancel listing"
                className="btn-prime btn-secondary text-error bg-error-20 border-0"
                width="156px"
                height="36px"
                onClick={(e) => toast("Yes, cancel listing")}
              />
            </div>
          </div>

          {/* Changing price */}

          <div className="buy-now-modal w-431 m-auto d-none">
            <div className="h-center ">
              <img
                src={art}
                alt="img"
                className="img-65 border-solid-black pad-2"
              />
            </div>
            <p className="mt-40 text-center">
              Set new price for <strong> “Artwork Name”:</strong>
            </p>
            {/* price should only be displayed once the user has inputed a numerical
            value into the field */}
            <div className="pricing bg-transparent border-solid-lightGrey body-medium fw-bold mt-2 br-30 v-center w-100 justify-content-between ">
              <Input
                className="body-medium  ps-2 text-black bg-transparent br-30  w-100  "
                placeholder="Price"
                type="number"
              />
              <span>FLR</span>
            </div>
            <p className="mt-2 body-medium text-medium-grey">~ $187.52</p>
            {/* User has the option to CHANGE PRICE or CANCEL LISTING	 */}
            <div className="v-center h-center gap-3 mt-5 w-100">
              <Button
                text="Continue"
                className="btn-prime btn-primary"
                width="156px"
                height="36px"
                onClick={(e) => toast("Change price")}
              />
            </div>
          </div>

          {/* Waiting for blockchain wallet confirmation… */}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={wallet} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Confirm this transaction in your wallet.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Waiting for blockchain confirmation…
            </p>

            <Button
              text=""
              className="btn-prime btn-primary mt-50"
              width="138px"
              height="36px"
              imageSrc={loader}
              imageClassName="rotate-360"
            />
          </div>

          {/* if error*/}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={error} alt="wallet" className="img-100" />
            </div>

            {/* onChanging price */}
            <p className=" text-center body-medium  mt-3 pt-1 ">
              Sorry, we could change the price for{" "}
              <span className="fw-bold"> "Artwork Name"</span>
            </p>
            {/* on caneling listing error */}
            <p className=" text-center body-medium  mt-3 pt-1 ">
              Sorry, we couldnt couldn't cancel your listing
              <span className="fw-bold"> "Artwork Name"</span>
              at this time.
            </p>
            <Button
              text="Try again"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              imageSrc={refresh}
              imageClassName="me-2 img-18"
              onClick={() => toast("Trying Again")}
            />
          </div>

          {/* on success */}

          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none ">
            <div className="wallet h-center m-auto">
              <img src={tick} alt="tick" className="img-100 invert1" />
            </div>
            {/* on updateing price */}
            <p className=" text-center body-medium  mt-3 pt-1 ">
              Successfully updated price for
              <span className="fw-bold"> "Artwork Name"! </span>
            </p>

            {/* on Canceling price */}
            <p className=" text-center body-medium  mt-3 pt-1 ">
              Successfully cancelled your listing
              <span className="fw-bold"> "Artwork Name"! </span>
            </p>
            <Button
              text="Done"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              onClick={handleEditListModal}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Make a  bid*/}

      <Modal
        show={bidModal}
        onHide={handleBidModal}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              Place a bid
              {/* while confirmation… */}
              {/* confirm */}
              {/* if error */}
              {/* error */}
              {/* on success */}
              {/* success */}
            </label>

            {/* While Confirm this transaction in your wallet. 
            BUT NOW will be replaced with CONFIRM*/}

            {/* ----------------------------- */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="buy-now-modal w-431 m-auto ">
            {/* if auction is live add classname "auction-live" to make bg-color
            black and text=-white */}
            <div className="listed-item auction-live ">
              <div className="v-center">
                <div className="left">
                  <img src={art} alt="img" className="border-0" />
                </div>
                <div className="right ms-3">
                  <label className="larger fw-bold text-black no-text-transform">
                    Arwork Name
                  </label>
                  <p className="body-medium">Untitled Collection #7156351271</p>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-between">
                <p className="h-center flex-column">
                  <span className="text-light-grey  fw-500 body-medium">
                    Reserve not met
                  </span>
                  <span className="fw-bold body-medium mt-2">-</span>
                </p>
                <p className="d-flex flex-column align-items-end">
                  <span className="text-light-grey  fw-500 body-medium">
                    Reserve price
                  </span>
                  <span className="fw-semibold mt-2">
                    <img src={FLR} alt="FLR" />
                    330,000 FLR
                  </span>
                </p>
              </div>
            </div>
            <label className="mt-4 pt-1  text-black">Price</label>
            <div className="pricing border-solid-lightGrey body-medium fw-bold mt-2 br-30 v-center w-100 justify-content-between bg-transparent">
              <Input
                className="body-medium fw-bold text-black   br-30  w-100 bg-transparent ps-1"
                placeholder="Price"
                type="number"
              />
              <span>WFLR</span>
            </div>
            <div className="avail-blnc mt-2 pt-1">
              <p className="body-medium v-center justify-content-between">
                ~ $40.52
                <span>
                  Available balance:
                  <span className="fw-bold"> 3721 WFLR</span>
                </span>
              </p>
            </div>
            {/* available balance needs to be greater than price before ‘buy now’
            button becomes primary. */}
            <Button
              text="Place bid"
              className="btn-prime btn-ternary mt-50"
              width="100%"
              height="36px"
              onClick={(e) => toast("bid placed")}
              disabled="disabled"
            />
          </div>

          {/* Waiting for blockchain wallet confirmation… */}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={wallet} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Confirm this transaction in your wallet.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Waiting for blockchain confirmation…
            </p>

            <Button
              text=""
              className="btn-prime btn-primary mt-50"
              width="138px"
              height="36px"
              imageSrc={loader}
              imageClassName="rotate-360"
            />
          </div>

          {/* if error*/}
          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none">
            <div className="wallet h-center m-auto">
              <img src={error} alt="wallet" className="img-100" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Sorry, we couldn't complete this request.
            </p>

            <p className="body-medium fw-bold text-center mt-30">
              Please try again
            </p>

            <Button
              text="Try again"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              imageSrc={refresh}
              imageClassName="me-2 img-18"
            />
          </div>

          {/* on success */}

          <div className="buy-now-modal w-431 m-auto h-center flex-column v-center d-none ">
            <div className="wallet h-center m-auto">
              <img src={tick} alt="tick" className="img-100 invert1" />
            </div>

            <p className=" text-center body-medium  mt-3 pt-1 ">
              Your offer has been sent. Keep an eye on your notifications!
            </p>

            <p className="body-medium fw-bold text-center mt-30">Offer sent</p>

            <Button
              text="Done"
              className="btn-prime btn-primary mt-50"
              width="145px"
              height="36px"
              onClick={handleOfferModal}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Make a  bid*/}

      <Modal
        show={isFullScreen}
        onHide={toggleFullScreen}
        className="fullScreen-modal "
        centered
      >
        <Modal.Body className="p-0">
          <div className="full-screen-art">
            {/* <div className="screen-alert">
              <img src={Esc} alt="Esc" className="Esc img-fluid" />
            </div> */}
            <img src={art1} alt="art" className="art" />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const collections = [
  {
    img: art1,
    artName: "Artwork Name",
    viewLink: "View Artwork ",
  },
  {
    img: art1,
    artName: "Artwork Name",
    viewLink: "View Artwork ",
  },
  {
    img: art1,
    artName: "Artwork Name",
    viewLink: "View Artwork ",
  },
  {
    img: art1,
    artName: "Artwork Name",
    viewLink: "View Artwork ",
  },
  {
    img: art1,
    artName: "Artwork Name",
    viewLink: "View Artwork ",
  },
];

export default SingleArt2;
