import React, { useEffect, useState } from "react";
import Collected from "../profile/collected";
import "../../style/main.scss";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import star20 from "../../assets/icon/spiked-circle/black/24px.svg";
import profileicon from "../../assets/icon/profile.svg";
import collection from "../../assets/icon/collection.svg";
import noOffer from "../../assets/icon/offers.svg";
import likes from "../../assets/icon/likes.svg";
import eye from "../../assets/icon/eye.svg";
import refresh from "../../assets/icon/refresh-metadata.svg";
import plus from "../../assets/icon/plus-white.svg";
import verified from "../../assets/icon/verified-artist.svg";
import more from "../../assets/icon/chevron-down-small.svg";
import thumb from "../../assets/images/artwork-example-5.png";
import Activity from "./activity";
import DiscriptionCollection from "./discriptionCollection";
import Button from "../button";
import AnalyticsCollection from "./analyticsCollection";
import { useLocation, useNavigate } from "react-router-dom";
import FooterV2 from "../footerV2";
import {
  getCollectionDetailsFirebase,
  getCollectionStats,
  getNftsInCollectionFirebase,
} from "../../firebase/firebase";
// import mintContractABI from "../../abis/NewERC721ABI.json";
import mintContractABI from "../../abis/SafeMint/v2/abi.json";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import { updateCollectionApprovedStatus } from "../../firebase/firebase";
import { useAccount, useWalletClient } from "wagmi";
import { useSwitchNetwork, useNetwork } from "wagmi";
import Web3 from "web3"; // Import the web3 library
// import env from "dotenv";

import Loader from "../shared/Loader";

const ExploreCollections = () => {
  const [key, setKey] = useState("artwork");
  const [collectionDetails, setCollectionDetails] = useState("");
  const [contractAddress, setContractAddress] = useState();
  const [nftUri, setNftUri] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvedNFTData, setApprovedNFTData] = useState([]);
  const [collectionStats, setCollectionStats] = useState([]); // [totalVolume, floorPrice, owners, listed]
  const [createdAt, setCreatedAt] = useState();
  const [listedPercent, setListedPercent] = useState();
  const [owners, setOwners] = useState();
  const [totalVolume, setTotalVolume] = useState();
  const [floorPrice, setFloorPrice] = useState();
  const [artworkCount, setArtworkCount] = useState();
  const [earning, setEarning] = useState();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);

  const [isNewtworkConnected, setIsNewtworkConnected] = useState(false);

  const navigate = useNavigate();

  // //console.log("env: " ,env.BACKEND_URL)
  const Backend_url = process.env.REACT_APP_BACKEND_URL;
  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;

  // const Backend_url = "https://fatcat-server-5a466ba2f3bb.herokuapp.com"

  // Initialize web3 with your Ethereum node URL
  // let web3;
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

  useEffect(() => {
    if (collectionDetails?.selectedNetwork === chain?.name) {
      setIsNewtworkConnected(true);
    } else {
      setIsNewtworkConnected(false);
    }
  }, [chain, collectionDetails]);

  const checkOwner = async () => {
    console.log("checkOwner called ", address);
    // const accounts = await web3.eth.getAccounts();
    const owner = collectionDetails?.address;
    // if (accounts[0] === owner) {
    if (address === owner) {
      setIsOwner(true);
    }
  };

  useEffect(() => {
    if (collectionDetails) {
      checkOwner();
    }
    console.log("isOwner: ", isOwner);
  }, [collectionDetails]);

  const handleSwitchNetwork = () => {
    const chainObj = chains.find(
      (chain) => chain.name === collectionDetails?.selectedNetwork
    );
    switchNetwork?.(chainObj?.id);
  };

  // Replace this with your contract address and ABI
  const contractABI = mintContractABI;

  // Replace this with the function call to get NFTs from your contract
  const getUserNftsFromContract = async () => {
    setLoading(true);

    try {
      // const accounts = await web3.eth.getAccounts();
      //console.log("Accounts", accounts);
      if (web3 !== null) {
        console.log("getUserNftsFromContract called");
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("getUserNftsFromContract called Contract", contract);
        //console.log("Contract", contract);
        const contractOwner = await contract.methods.owner().call();
        //console.log("Contract Owner", contractOwner);
        contract.methods
          .getTokenId(address)
          .call({ from: contractOwner }, (error, result) => {
            if (error) {
              console.error(error);
            } else {
              //console.log("result: ", result);
              if (result?.length > 0) {
                console.log("get nft from contract result: ", result);
                const tokens_uri = result?.map((token) => token?.uri);
                setNftUri(tokens_uri);
                getNftMetadata(tokens_uri);
              } else {
                setNftUri([]);
              }
            }
            setLoading(false);
          });
      }
    } catch (error) {
      setLoading(false);
      //console.log(error);
    }
  };

  const getGuestNftsFromContract = async () => {
    setLoading(true);
    try {
      // const accounts = await web3.eth.getAccounts();
      //console.log("Accounts", accounts);
      if (web3 !== null) {
        console.log("getGuestNftsFromContract called");
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("getGuestNftsFromContract called Contract", contract);
        //console.log("Contract", contract);
        const contractOwner = await contract.methods.owner().call();
        //console.log("Contract Owner", contractOwner);
        contract.methods
          .getTokenIdsByCollection(location.pathname.split("/")[2])
          .call({ from: contractOwner }, (error, result) => {
            if (error) {
              console.error(error);
            } else {
              //console.log("result: ", result);
              if (result?.length > 0) {
                //console.log("get nft from contract result: ", result);
                const tokens_uri = result?.map((token) => token?.uri);
                setNftUri(tokens_uri);
                getNftMetadata(tokens_uri);
              } else {
                setNftUri([]);
              }
            }
            setLoading(false);
          });
      }
    } catch (error) {
      setLoading(false);
      //console.log(error);
    }
  };

  const getNftMetadata = async (tokens_uri) => {
    setLoading(true);
    //console.log("url: " + `${Backend_url}/getNFTMetadata`);
    const nftMetadata = await Promise.all(
      tokens_uri.map(async (uri) => {
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
        return {
          uri: uri, // Include the URI in the result object
          data: json.data.data,
        };
      })
    );
    //console.log("nftMetadata: ", nftMetadata);

    setLoading(false);
    setNfts(nftMetadata);
  };

  const ApproveAllNFT = async () => {
    setLoading(true);
    try {
      console.log("ApproveAllNFT called");
      //console.log("Accounts", accounts);
      const web3_1 = new Web3(window.ethereum);
      const accounts = await web3_1.eth.getAccounts();
      const contract = new web3_1.eth.Contract(contractABI, contractAddress);
      //console.log("Contract", contract);
      const contractOwner = await contract.methods.owner().call();
      //console.log("Contract Owner", contractOwner);
      //console.log("Marketplace_coston_contractAddress", Marketplace_coston_contractAddress);
      //console.log("collectionDetails: ", collectionDetails);
      console.log("contract ", contract);
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
      contract.methods
        .setApprovalForAll(MarketplaceAddress, true)
        .send({ from: accounts[0] }, (error, result) => {
          if (error) {
            console.error(error);
          } else {
            //console.log("result: ", result);
            //console.log("collectionDetails: ", collectionDetails);
            updateCollectionApprovedStatus(
              location.pathname.split("/")[2],
              true
            );
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      //console.log(error);
    }
  };

  // const ApproveNFTData = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   const data = {
  //     "AccountAddress": accounts[0],
  //     "ContractAddress": collectionDetails?.contractAddress,
  //     "approved": true
  // }
  // //console.log("Approved NFT Data", data);
  // setApprovedNFTData(data);
  // }

  useEffect(() => {
    //console.log("contractAddress: ", contractAddress);
    //console.log("collection useEffect called");
    if (contractAddress) {
      if (isOwner) {
        getUserNftsFromContract();
      } else {
        getGuestNftsFromContract();
      }
    }
  }, [collectionDetails, contractAddress, web3]);

  const location = useLocation();
  useEffect(() => {
    //console.log(location.pathname.split("/")[2]);
  }, [location]);

  const getCollectionDetails = async () => {
    const result = await getCollectionDetailsFirebase(
      location.pathname.split("/")[2]
    );
    setCollectionDetails(result);
    setContractAddress(result?.contractAddress);
  };

  useEffect(() => {
    // check wallet is connect or not
    if (window.ethereum) {
      window.ethereum.enable();
    } else {
      alert("Please install MetaMask to use this dApp!");
    }

    getCollectionDetails();
  }, []);

  const getNftsInCollection = async () => {
    const result = await getNftsInCollectionFirebase(
      location.pathname.split("/")[2]
    );
    //console.log(result);
    setNfts(result);
  };

  const getCollectionStatDetails = async () => {
    const result = await getCollectionStats(location.pathname.split("/")[2]);
    //console.log("get Collecyion Stats Details ", result);
    setCollectionStats(result);
    if (result?.volume?.length > 0) {
      setTotalVolume(result?.volume[result?.volume?.length - 1].split("-")[0]);
    } else {
      setTotalVolume(0);
    }
    if (result?.floorPrice?.length > 0) {
      setFloorPrice(
        result?.floorPrice[result?.floorPrice?.length - 1].split("-")[0]
      );
    } else {
      setFloorPrice(0);
    }

    setOwners(result?.owners?.length);
    //console.log("listedCount", result?.listedCount);
    //console.log("artworkCount", result?.artworkCount);
    if (result?.listedCount === 0 || result?.artworkCount === 0) {
      setListedPercent(0);
    } else {
      console.log("listedCount", result?.listedCount);
      console.log("artworkCount", result?.artworkCount);
      console.log("listedPercent", result?.listedCount / result?.artworkCount);
      setListedPercent((result?.listedCount / result?.artworkCount) * 100);
    }
    const date = new Date(result?.createdAt);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateString = `${months[date.getMonth()]} ${date.getFullYear()}`;
    setCreatedAt(dateString);
    setArtworkCount(result?.artworkCount);
    setEarning(result?.creatorEarning);
  };

  useEffect(() => {
    getNftsInCollection();
    getCollectionStatDetails();
  }, []);
  return (
    <div>
      <div className="explore-collections site-container">
        <div className="header">
          <div className="left">
            <div className="artists-name v-center">
              {/* <label className="medium fw-bold text-black no-text-transform v-center">
                Artists Name
                <img
                  src={verified}
                  alt="verify"
                  className="img-18 img-fluid ms-2"
                />
              </label> */}
              <label></label>
              <label className="no-text-transform br-30 ms-0">
                {collectionDetails?.selectedNetwork}
              </label>
              <label className="br-30 ms-2">erc 721</label>
            </div>
            <div className="collection-name d-flex flex-column mt-3">
              {/* <div className="collection-thumbnail me-3">
                <img src={thumb} alt="thumbnail" className="img-100" />
              </div> */}
              <h4>{collectionDetails?.name}</h4>
              <label className="fw-500 medium no-text-transform mb-1 hide-on-desktop">
                Created by
              </label>
              <div className="artists-name v-center flex-row align-items-center off-white-border width-fit  p-1 br-30">
                <img
                  src={
                    collectionDetails?.image ? collectionDetails?.image : thumb
                  }
                  alt="verify"
                  className="img-35 img-fluid  rounded-circle p-br-1"
                />

                {/* either user name and image or wallet address */}

                {collectionDetails?.userName ? (
                  <label className="medium fw-bold ps-1 text-black no-text-transform v-center bg-transparent m-0 pe-0">
                    {"@" + collectionDetails?.userName}
                    <img
                      src={verified}
                      alt="verify"
                      className="img-18 img-fluid ms-2 "
                    />
                  </label>
                ) : (
                  <>
                    <label className="medium fw-bold ps-1 text-black no-text-transform v-center bg-transparent m-0 pe-0">
                      Artists Name
                      <img
                        src={verified}
                        alt="verify"
                        className="img-18 img-fluid ms-2 "
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            <p className="medium text-medium-grey mt-4 fw-500">
              {collectionDetails?.description
                ? collectionDetails.description
                : `CollectionName is a digital art
              collection and global community of …`}
              <img src={more} alt="more" className="img-18" />
            </p>

            {/* If you are a whitelisted artist and YOU own this collection, don’t
            show artist name and profile photo, instead show EDIT COLLECTION and
            CREATE ARTWORK buttons */}
            {collectionDetails?.isWhiteList && isOwner ? (
              <div className="whitelisted-btn v-center gap-3 mt-4">
                <Button
                  text="Edit Collection"
                  className="btn-prime btn-secondary"
                  width="132px"
                  height="36px"
                  onClick={() =>
                    navigate(
                      `/edit-collections/${location.pathname.split("/")[2]}`
                    )
                  }
                />
                <Button
                  text="Create Artwork"
                  className="btn-prime btn-primary"
                  width="150px"
                  height="36px"
                  imageClassName="img-18 me-2"
                  imageSrc={plus}
                  onClick={() =>
                    navigate(`/create-art/${location.pathname.split("/")[2]}`)
                  }
                />

                {/*  Approve All NFt to Marketplace */}
                {isNewtworkConnected ? (
                  <Button
                    text="Approve All NFTs"
                    className={`btn-prime ${
                      !collectionDetails?.Approved
                        ? "btn-primary"
                        : "btn-ternary"
                    }`}
                    width="150px"
                    height="36px"
                    imageClassName="img-18 me-2"
                    disabled={collectionDetails?.Approved}
                    imageSrc={plus}
                    onClick={() => ApproveAllNFT()}
                  />
                ) : (
                  <Button
                    text="Switch Network to Approve NFTs"
                    className={`btn-prime p-1 ${
                      !collectionDetails?.Approved
                        ? "btn-primary"
                        : "btn-ternary"
                    }`}
                    width="260px"
                    height="36px"
                    imageClassName="img-18 me-2"
                    disabled={collectionDetails?.Approved}
                    imageSrc={plus}
                    onClick={() => handleSwitchNetwork()}
                  />
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="right">
            <div className="art-creation v-center">
              <label className="medium">
                <span className="fw-500 no-text-transform">Artwork</span>
                <span className="fw-bold text-black no-text-transform ms-1">
                  {artworkCount}
                </span>
              </label>
              <div className="divider hide-on-mobile"></div>
              <label className="medium hide-on-mobile">
                <span className="fw-500 no-text-transform">Created</span>
                <span className="fw-bold text-black no-text-transform ms-1">
                  {createdAt}
                </span>
              </label>

              <div className="divider"></div>
              <label className="medium">
                <span className="fw-500 no-text-transform">
                  Creator Earnings
                </span>
                <span className="fw-bold text-black no-text-transform ms-1">
                  {earning}%
                </span>
              </label>
            </div>
            <div className="collection-summary v-center">
              <div className="t-volume pr35">
                <p className="fw-bold ">{totalVolume} FLR</p>
                <label htmlFor="" className="medium no-text-transform">
                  Total Volume
                </label>
              </div>

              <div className="divider"></div>

              <div className="t-volume pr35 pl35">
                <p className="fw-bold ">{floorPrice} FLR</p>
                <label htmlFor="" className="medium no-text-transform">
                  Floor Price
                </label>
              </div>

              <div className="divider"></div>

              <div className="t-volume pl35 pr35">
                <p className="fw-bold ">{owners}</p>
                <label htmlFor="" className="medium no-text-transform">
                  Owners
                </label>
              </div>

              <div className="divider"></div>

              <div className="t-volume pl35">
                <p className="fw-bold ">{listedPercent}%</p>
                <label htmlFor="" className="medium no-text-transform">
                  Listed
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs mt-40 ">
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
                    src={key == "artwork" ? star20 : star20}
                    alt="star"
                    className={
                      key == "artwork"
                        ? "hide-on-mobile spikeimg "
                        : "hide-on-mobile opacity-50"
                    }
                  />
                  artwork
                </span>
              }
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <Collected
                    propFromCollections="d-none"
                    nfts={nfts}
                    ApvNFT={collectionDetails}
                    isOwner={isOwner}
                  />
                </>
              )}
            </Tab>

            {/* Activity */}

            <Tab
              eventKey="activity"
              title={
                <span>
                  <img
                    src={key == "activity" ? star20 : refresh}
                    alt="activity"
                    className={
                      key == "activity"
                        ? "hide-on-mobile spikeimg"
                        : "hide-on-mobile opacity-25 img-18"
                    }
                  />
                  activity
                </span>
              }
            >
              <Activity />
            </Tab>

            {/* analytics */}

            <Tab
              eventKey="analytics"
              title={
                <span>
                  <img
                    src={key == "analytics" ? star20 : eye}
                    alt="analytics"
                    className={
                      key == "analytics"
                        ? "hide-on-mobile spikeimg"
                        : "hide-on-mobile opacity-25 img-18"
                    }
                  />
                  analytics
                </span>
              }
            >
              <AnalyticsCollection stats={collectionStats} />
            </Tab>

            {/* Discription */}

            <Tab
              eventKey="description"
              title={
                <span>
                  {/* if no offer */}
                  <img
                    src={key == "description" ? star20 : noOffer}
                    alt="description"
                    className={
                      key == "description"
                        ? "hide-on-mobile spikeimg"
                        : "hide-on-mobile"
                    }
                  />
                  description
                </span>
              }
            >
              <DiscriptionCollection
                hide="d-none"
                description={collectionDetails?.description}
              />
            </Tab>
          </Tabs>

          {/* <div className="mobile-filter">mobile fileter-</div> */}
        </div>
      </div>
      <FooterV2 />
    </div>
  );
};

export default ExploreCollections;
