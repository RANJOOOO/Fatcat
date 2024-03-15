import React, { useState, useEffect } from "react";
import Header from "./header";
// import thumbnail from "../assets/icon/artwork.svg";
import FLR from "../assets/icon/FLR.svg";
import sgb from "../assets/icon/SGB.svg";
import add from "../assets/icon/plus.svg";
import checked from "../assets/icon/radio-selected.svg";
import unchecked from "../assets/icon/radio-unselected.svg";

import Input from "./inputs";
import Button from "./button";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./imageUpload";
import { handleNotifications } from "../firebase/firebase";
import { Modal } from "react-bootstrap";
import art from "../assets/images/artwork-example-4.png";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import marketplaceContractABI from "../abis/Marketplace/v3/abi.json";
import {
  getCollectionDetailsFirebase,
  handleCollectionHistory,
  saveCollectionStats,
  getCollectionStats,
} from "../firebase/firebase";
import { useSwitchNetwork, useNetwork } from "wagmi";

const ListforOffer = () => {
  const navigate = useNavigate();
  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;
  const web3 = new Web3(window.ethereum);

  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const [selectSale, setSelectSale] = useState("Offers");
  const [createFinish, setCreateFinish] = useState(false);
  const [nftDetail, setNftDetail] = useState([]);
  const [nftUriData, setNftUriData] = useState([]);
  const [price, setPrice] = useState(0);
  const [artistFee, setArtistFee] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [collectionDetail, setCollectionDetail] = useState([]);

  const location = useLocation();

  const [isNewtworkConnected, setIsNewtworkConnected] = useState(false);

  useEffect(() => {
    if (chain?.name !== location?.state?.chain) {
      setIsNewtworkConnected(false);
    } else {
      setIsNewtworkConnected(true);
    }
  }, [chain, location?.state?.chain]);

  useEffect(() => {
    if (location.state) {
      console.log("LOCATION STATE: ", location.state);
      console.log(
        "artist fee per age: ",
        location?.state?.nftDetails?.artistFeePerAge
      );
      setNftDetail(location?.state?.nftDetails);
      setNftUriData(location?.state?.data);
      setArtistFee(location?.state?.data?.artistFee);
    }
  }, [location]);

  // const handleSaleType = (tag) => {
  //   setSelectSale(tag);
  // };
  // let userData = localStorage?.getItem("CatalystUserData");
  // let username = JSON.parse(userData)?.userName;
  let username = localStorage?.getItem("userName");
  const handleCreate = () => {
    // username = JSON.parse(userData)?.userName;
    console.log("username", username);
    handleNotifications(username, `Listed by ${username}`, "listed", "");
    setCreateFinish(true);
  };

  // useEffect(() => {
  //   console.log("nftUriData", nftUriData);
  //   console.log("nftDetail", nftDetail);
  //   console.log("catalyst User Data", userData);
  //   console.log("username", username);
  //   let user_name = localStorage?.getItem("userName");
  //   console.log("user_name", user_name);
  // }, [userData, username]);

  const handleSwitchChain = async () => {
    const switchTo = chains.find((c) => c.name === location?.state?.chain);
    if (switchTo) {
      switchNetwork?.(switchTo.id);
    }
  };

  const handleFinish = async () => {
    const accounts = await web3.eth.getAccounts();
    setCreateFinish(false);
    console.log("accounts", accounts);
    let MarketplaceAddress;
    if (location?.state?.chain === "Coston") {
      MarketplaceAddress = Marketplace_coston_contractAddress;
    } else if (location?.state?.chain === "Coston2") {
      MarketplaceAddress = Marketplace_coston2_contractAddress;
    }
    console.log("MarketplaceAddress", MarketplaceAddress);
    if (accounts.length === 0) {
      alert("Please connect your wallet");
      return;
    }
    const contract = new web3.eth.Contract(contractABI, MarketplaceAddress);
    console.log("contract", contract);
    console.log("nftDetail", nftDetail);
    console.log("price", price);

    const data = contract.methods.OfferList(
      nftDetail?.listedDetail?.mintContract,
      nftDetail?.listedDetail?.tokenId,
      parseInt(price),
      nftDetail?.listedDetail?.mintArtist,
      nftDetail?.listedDetail?.artistFeePerAge
    );

    console.log("data", data);
    console.log("accounts[0]", accounts[0]);
    const tx = {
      from: accounts[0],
      to: MarketplaceAddress,
      data: data.encodeABI(),
      gaslimit: 3000000,
    };
    console.log("tx", tx);
    web3.eth.sendTransaction(tx, (err, transactionHash) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("transactionHash", transactionHash);
        const historyData = {
          action: "listedOffer",
          user: username,
          artworkUri: nftUriData,
          from: accounts[0],
          to: MarketplaceAddress,
          price: price,
          tokenId: nftDetail?.listedDetail?.tokenId,
        };
        handleCollectionHistory(nftUriData?.selectedCollectionId, historyData);
        handlecollectionStats(nftUriData?.selectedCollectionId, price);
        navigate("/explore");
      }
    });
  };

  const handlecollectionStats = async (collectionId, price) => {
    const collectionStats = await getCollectionStats(collectionId);
    console.log("collectionStats", collectionStats);
    if (collectionStats) {
      let floorprice = collectionStats?.floorPrice;
      if (collectionStats?.floorPrice?.length > 0) {
        if (
          price <
          collectionStats?.floorPrice[
            collectionStats?.floorPrice?.length - 1
          ].spilt("-")[0]
        ) {
          floorprice = [
            ...collectionStats?.floorPrice,
            `${price}-${new Date().getTime()}`,
          ];
        }
      }
      const data = {
        collectionId: collectionId,
        artworkCount: collectionStats?.artworkCount,
        createdAt: collectionStats?.createdAt,
        creatorEarning: collectionStats?.creatorEarning,
        volume: collectionStats?.volume,
        SGBvolume: collectionStats?.SGBvolume,
        FLRvolume: collectionStats?.FLRvolume,
        USDvolume: collectionStats?.USDvolume,
        floorPrice: floorprice,
        listedCount: collectionStats?.listedCount + 1,
        saleCount: collectionStats?.saleCount,
        owners: collectionStats?.owners,
      };
      saveCollectionStats(data);
    }
  };

  useEffect(() => {
    console.log("nftDetail", nftDetail);
    console.log("nftUriData", nftUriData);
    console.log("price", price);
    console.log("artistFee", artistFee);
    console.log("totalEarning", totalEarning);
  }, [nftDetail, nftUriData, price, artistFee, totalEarning]);

  const handlePrice = () => {
    if (parseInt(price) > 0) {
      let platfromFee = (parseInt(price) * 2) / 100;
      let artistFee = (parseInt(price) * nftUriData?.artistFee) / 100;
      let total = parseInt(price) - platfromFee - artistFee;
      setTotalEarning(total);
    } else {
      setTotalEarning(0);
    }
  };
  const handleModalClose = () => {
    setCreateFinish(false);
  };

  useEffect(() => {
    handlePrice();
  }, [price]);

  return (
    <>
      <section className="create-artwork">
        <Header head="Create" />

        <div className="list-forSale">
          <div className="create-artwork-content  ">
            <h4 className="medium-head">List For Offer</h4>

            <div className="listed-preview mt-40  ">
              {/* add following class either content is image video gif or any other */}
              <div className="listed-item-preview">
                <img src={nftUriData?.image} alt="img" />
              </div>
            </div>

            {/* Type of sale */}
            {/* <div className="art-collections">
              <p className="body-large fw-bold mt-40 ">Choose type of sale</p>
              <p
                className={`body-large h-64 fw-normal v-center justify-content-between cursor-pointer ${
                  selectSale === "fixed price" ? "active" : ""
                }`}
                onClick={() => handleSaleType("fixed price")}
              >
                <span>
                  <img
                    src={selectSale === "fixed price" ? checked : unchecked}
                    alt="checkbox"
                    className="me-3"
                  />
                  Fixed Price
                </span>
                <span className="text-medium-grey body-medium">
                  The item is listed at the price you set.
                </span>
              </p>

              <p
                className={`body-large h-64 fw-normal v-center justify-content-between cursor-pointer ${
                  selectSale === "auction" ? "active" : ""
                }`}
                onClick={() => handleSaleType("auction")}
              >
                <span>
                  <img
                    src={selectSale === "auction" ? checked : unchecked}
                    alt="checkbox"
                    className="me-3"
                  />
                  Auction
                </span>
                <span className="text-medium-grey body-medium">
                  The item is listed as a timed auction.
                </span>
              </p>
            </div> */}

            {/* Traits */}
            <div className="artwork-traits">
              <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                <span>Set a Min price</span>
              </p>

              <div className="add-traits mt-3 d-flex flex-column">
                <p className="body-medium text-medium-grey">
                  You will not be able to change the Minimum price after
                  listing. If you'd like to change Minimum price, you will need
                  to create a new listing.
                </p>
                <div className="d-flex mt-4 pt-2 add-traits-content">
                  <div className="type left w-100">
                    <div className="input-box br-20 ">
                      <Input
                        type="Number"
                        placeholder="Amount"
                        className="inputtype1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="delete">
                    <Button
                      width="84px"
                      height="41px"
                      className="br-30 btn-prime  fw-normal border-1  v-center h-center off-border  "
                      imageSrc={location?.state?.chain === "Coston" ? sgb : FLR}
                      text={location?.state?.chain === "Coston" ? "SGB" : "FLR"}
                      imageClassName="me-1"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Summary */}
            <div className="listing-Summary">
              <p className="body-large fw-bold mt-60 d-flex justify-content-between">
                Listing Summary
              </p>
              <p className="body-medium text-medium-grey mt-3 ">
                You will not be able to change the price after listing. If you'd
                like to change the price, you will need to create a new listing.
              </p>

              <div className="summary-box v-center flex-column">
                <div className="box w-100">
                  <p className="body-medium v-center  justify-content-between ">
                    Listing type
                    <span>{selectSale}</span>
                  </p>
                </div>
                <div className="box w-100">
                  <p className="body-medium v-center  justify-content-between ">
                    Approx. Listing price
                    <span>{price}</span>
                  </p>
                </div>
                <div className="box w-100">
                  <p className="body-medium v-center  justify-content-between ">
                    Approx. Creator earnings
                    <span>{artistFee}</span>
                  </p>
                </div>
              </div>

              <div className="summary-box v-center flex-column mt-5">
                <div className="box w-100">
                  <p className="body-medium v-center  justify-content-between ">
                    Catalyst fee
                    <span>2%</span>
                  </p>
                </div>
                <div className="box w-100">
                  <p className="body-medium v-center  justify-content-between fw-bold ">
                    Approx. Total potential earnings
                    <span>{totalEarning}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Create artwork button */}

            <Button
              text="List for Offer"
              className="btn-prime btn-primary br-30 font-18 mt-50"
              height="50px"
              width="100%"
              disabled={price === 0}
              onClick={handleCreate}
            />
          </div>
        </div>
      </section>

      <Modal
        show={createFinish}
        onHide={handleModalClose}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              approve listing
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="newArt-done approve-listing-modal v-center flex-column">
            <div className="listed-item ">
              <div className="left">
                <img src={nftUriData?.image} alt="img" />
              </div>
              <div className="right">
                <label className="larger fw-bold text-black no-text-transform">
                  {nftUriData?.name}
                </label>
                <p className="body-medium">
                  {nftUriData?.selectedCollection} Collection #
                  {nftUriData?.selectedCollectionId}
                </p>
                <h6 className="no-text-transform font-normal fw-bold mt-2 pt-1">
                  {price}{" "}
                  {location?.state?.chain === "Coston" ? "SGB " : "FLR "}
                  {/* <span className="ms-2 body-medium text-medium-grey fw-normal">
                    ($178.6)
                  </span> */}
                </h6>
              </div>
            </div>

            <label className="mt-4 pt-1 no-text-transform text-black">
              Final step…
            </label>
            <p className="body-medium mt-2 pb-4">
              Open your wallet to review and confirm this listing.
            </p>
            {isNewtworkConnected ? (
              <Button
                text="List for Offer"
                className="btn-prime btn-ternary br-30 font-18 mt-50"
                height="50px"
                width="100%"
                disabled={price <= 0}
                onClick={handleFinish}
              />
            ) : (
              <Button
                text={`Switch Network to ${location?.state?.chain}`}
                className="btn-prime btn-ternary br-30 font-18 mt-50"
                height="50px"
                width="100%"
                onClick={handleSwitchChain}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ListforOffer;
