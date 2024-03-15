import React, { useEffect, useState } from "react";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import Button from "../button";
import Input from "../inputs";
import "../../style/main.scss";
import unchecked from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import { useNavigate } from "react-router-dom";
import UseWindowResize from "../../customHooks/useWindowResize";
import useScrollToTop from "../../customHooks/scrollToTop";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";
import { useSwitchNetwork, useNetwork } from "wagmi";

const SiteSetting = () => {
  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;

  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const [spotActive, setSpotActive] = useState(false);
  const [buyerCommission, setBuyerCommission] = useState(0);
  const [buyerCoston2Commission, setBuyerCoston2Commission] = useState(0);
  const [inputBuyerValue, setInputBuyerValue] = useState(buyerCommission);
  const [inputBuyerCoston2Value, setInputBuyerCoston2Value] = useState(
    buyerCoston2Commission
  );
  const [sellerCommission, setSellerCommission] = useState(0);
  const [sellerCoston2Commission, setSellerCoston2Commission] = useState(0);
  const [inputSellerValue, setInputSellerValue] = useState(sellerCommission);
  const [inputSellerCoston2Value, setInputSellerCoston2Value] = useState(
    sellerCoston2Commission
  );
  const [isSellerChanged, setIsSellerChanged] = useState(false);
  const [isCoston2SellerChanged, setIsCoston2SellerChanged] = useState(false);
  const [isBuyerChanged, setIsBuyerChanged] = useState(false);
  const [isCoston2BuyerChanged, setIsCoston2BuyerChanged] = useState(false);

  const web3 = new Web3(window.ethereum);

  const handeSwitch = () => {
    if (chain.name === "Coston") {
      const switchTo = chains.find((c) => c.name === "Coston2");
      if (switchTo) {
        switchNetwork?.(switchTo.id);
      }
    } else if (chain.name === "Coston2") {
      const switchTo = chains.find((c) => c.name === "Coston");
      if (switchTo) {
        switchNetwork?.(switchTo.id);
      }
    }
  };

  const navigate = useNavigate();
  UseWindowResize(1024, "/admin");

  const getComissionFee = async () => {
    const web3_1 = new Web3(process.env.REACT_APP_COSTON_RPC_URL);
    const MarketplaceContract = new web3_1.eth.Contract(
      contractABI,
      Marketplace_coston_contractAddress
    );
    const owner = await MarketplaceContract.methods.owner().call();
    console.log("owner: ", owner);
    const commissionBuyerFee = await MarketplaceContract.methods
      .buyerFeePerAge()
      .call();
    const commissionSellerFee = await MarketplaceContract.methods
      .sellerFeePerAge()
      .call();
    console.log("commissionBuyerFee: ", commissionBuyerFee / 10);
    setBuyerCommission(commissionBuyerFee / 10);
    console.log("commissionSellerFee: ", commissionSellerFee / 10);
    setSellerCommission(commissionSellerFee / 10);
  };

  const getCoston2ComissionFee = async () => {
    const web3_1 = new Web3(process.env.REACT_APP_COSTON2_RPC_URL);
    const MarketplaceContract = new web3_1.eth.Contract(
      contractABI,
      Marketplace_coston2_contractAddress
    );
    const owner = await MarketplaceContract.methods.owner().call();
    console.log("owner: ", owner);
    const commissionBuyerFee = await MarketplaceContract.methods
      .buyerFeePerAge()
      .call();
    const commissionSellerFee = await MarketplaceContract.methods
      .sellerFeePerAge()
      .call();
    console.log("commissionCoston3BuyerFee: ", commissionBuyerFee / 10);
    setBuyerCoston2Commission(commissionBuyerFee / 10);
    console.log("commissionCoston2SellerFee: ", commissionSellerFee / 10);
    setSellerCoston2Commission(commissionSellerFee / 10);
  };

  useEffect(() => {
    getComissionFee();
    getCoston2ComissionFee();
  }, []);

  useEffect(() => {
    setInputBuyerValue(buyerCommission);
    setInputSellerValue(sellerCommission);
    setInputBuyerCoston2Value(buyerCoston2Commission);
    setInputSellerCoston2Value(sellerCoston2Commission);
  }, [
    buyerCommission,
    sellerCommission,
    buyerCoston2Commission,
    sellerCoston2Commission,
  ]);

  useEffect(() => {
    if (buyerCommission !== inputBuyerValue) {
      console.log("check buyerCommission: ", buyerCommission);
      console.log("check buyerFee: ", inputBuyerValue);
      setIsBuyerChanged(true);
    }
    if (sellerCommission !== inputSellerValue) {
      console.log("check sellerCommission: ", sellerCommission);
      console.log("check sellerFee: ", inputSellerValue);
      setIsSellerChanged(true);
    }
    if (buyerCoston2Commission !== inputBuyerCoston2Value) {
      console.log("check buyerCoston2Commission: ", buyerCoston2Commission);
      console.log("check buyerCoston2Fee: ", inputBuyerCoston2Value);
      setIsCoston2BuyerChanged(true);
    }
    if (sellerCoston2Commission !== inputSellerCoston2Value) {
      console.log("check sellerCoston2Commission: ", sellerCoston2Commission);
      console.log("check sellerCoston2Fee: ", inputSellerCoston2Value);
      setIsCoston2SellerChanged(true);
    }
  }, [
    inputBuyerValue,
    inputSellerValue,
    inputBuyerCoston2Value,
    inputSellerCoston2Value,
  ]);

  const refreshState = () => {
    setIsBuyerChanged(false);
    setIsSellerChanged(false);
    setIsCoston2BuyerChanged(false);
    setIsCoston2SellerChanged(false);
    setTimeout(() => {
      getComissionFee();
      getCoston2ComissionFee();
    }, 5000);
    setTimeout(() => {
      if (buyerCommission !== inputBuyerValue) {
        console.log("buyerCommission: ", buyerCommission);
        console.log("buyerFee: ", inputBuyerValue);
        setIsBuyerChanged(true);
      }
      if (sellerCommission !== inputSellerValue) {
        console.log("sellerCommission: ", sellerCommission);
        console.log("sellerFee: ", inputSellerValue);
        setIsSellerChanged(true);
      }
      if (buyerCoston2Commission !== inputBuyerCoston2Value) {
        console.log("buyerCoston2Commission: ", buyerCoston2Commission);
        console.log("buyerCoston2Fee: ", inputBuyerCoston2Value);
        setIsCoston2BuyerChanged(true);
      }
      if (sellerCoston2Commission !== inputSellerCoston2Value) {
        console.log("sellerCoston2Commission: ", sellerCoston2Commission);
        console.log("sellerCoston2Fee: ", inputSellerCoston2Value);
        setIsCoston2SellerChanged(true);
      }
    }, 6000);
  };

  const handleBuyerSaveChanges = async () => {
    const accounts = await web3.eth.getAccounts();
    const MarketplaceContract = new web3.eth.Contract(
      contractABI,
      Marketplace_coston_contractAddress
    );
    const buyerFee = inputBuyerValue * 10;
    console.log("buyerFee: ", buyerFee);
    const setBuyerFee = await MarketplaceContract.methods
      .setBuyerFee(buyerFee)
      .send({ from: accounts[0] });
    console.log("setBuyerFee: ", setBuyerFee);
    refreshState();
  };

  const handleBuyerCoston2SaveChanges = async () => {
    const accounts = await web3.eth.getAccounts();
    const MarketplaceContract = new web3.eth.Contract(
      contractABI,
      Marketplace_coston2_contractAddress
    );
    const buyerFee = inputBuyerCoston2Value * 10;
    console.log("buyerFee: ", buyerFee);
    const setBuyerFee = await MarketplaceContract.methods
      .setBuyerFee(buyerFee)
      .send({ from: accounts[0] });
    console.log("setBuyerFee: ", setBuyerFee);
    refreshState();
  };

  const handleSellerSaveChanges = async () => {
    const accounts = await web3.eth.getAccounts();
    const MarketplaceContract = new web3.eth.Contract(
      contractABI,
      Marketplace_coston_contractAddress
    );
    const sellerFee = inputSellerValue * 10;
    console.log("sellerFee: ", sellerFee);
    const setSellerFee = await MarketplaceContract.methods
      .setSellerFee(sellerFee)
      .send({ from: accounts[0] });
    console.log("setSellerFee: ", setSellerFee);
    refreshState();
  };

  const handleSellerCoston2SaveChanges = async () => {
    const accounts = await web3.eth.getAccounts();
    const MarketplaceContract = new web3.eth.Contract(
      contractABI,
      Marketplace_coston2_contractAddress
    );
    const sellerFee = inputSellerCoston2Value * 10;
    console.log("sellerFee: ", sellerFee);
    const setSellerFee = await MarketplaceContract.methods
      .setSellerFee(sellerFee)
      .send({ from: accounts[0] });
    console.log("setSellerFee: ", setSellerFee);
    refreshState();
  };

  useScrollToTop();
  return (
    <div>
      <div className="siteSetting">
        <div className="admin-content-head v-center justify-content-between header-fixed ">
          {/* Header for desktop */}
          <h3 className="fw-bold text-capitalize for-desktop">Site Settings</h3>
          {/* Header for mobile */}
          <h6
            className="fw-bold text-capitalize for-mobile"
            onClick={() => navigate(-1)}
          >
            <img src={leftArrow} alt="back" className="me-3" />
            Site Settings
          </h6>

          {/* when some data is changed or entered in form fields then save changes button btn-ternary class will replace with btn-primary  */}
          {/* <Button
            width="170px"
            height="47px"
            className={`br-30 ${isChanged ? "btn-primary" : "btn-ternary"}`}
            text="Save changes"
            disabled={!isChanged}
            onClick={handleSaveChanges}
          /> */}
        </div>

        <div className="siteSetting-content mt-36">
          <p className="body-large fw-bold ">Our Fees (%)</p>
          <p className="body-medium  mt-3">
            These fees apply to regular users of the site.
          </p>
          {/* Commission */}
          {/* These fees apply to regular users of the site. here we can set the
          BUYER commission and the SELLER commission separately */}
          <div className="input-boxs commission v-center justify-content-between mt-4 pt-2 gap-5 pb-40 ">
            <div className="left w-100">
              <label className="medium text-black">
                Coston SELLER COMMISSION
              </label>
              <div className="input-box br-30 ps-3 mt-3">
                <Input
                  placeholder="2.5"
                  value={inputSellerValue}
                  onChange={(e) => setInputSellerValue(e.target.value)}
                />
              </div>
              {chain.name === "Coston" ? (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4 ${
                    isSellerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text="Save changes"
                  disabled={!isSellerChanged}
                  onClick={handleSellerSaveChanges}
                />
              ) : (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4 ${
                    isCoston2SellerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text=" Switch to Coston"
                  // disabled={!isCoston2SellerChanged}
                  onClick={handeSwitch}
                />
              )}
            </div>
            <div className="w-100">
              <label className="medium text-black">
                Coston BUYER COMMISSION
              </label>
              <div className="input-box br-30 ps-3 mt-3">
                <Input
                  placeholder="2.5"
                  value={inputBuyerValue}
                  onChange={(e) => setInputBuyerValue(e.target.value)}
                />
              </div>
              {chain.name === "Coston" ? (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4  ${
                    isBuyerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text="Save changes"
                  disabled={!isBuyerChanged}
                  onClick={handleBuyerSaveChanges}
                />
              ) : (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4 ${
                    isCoston2BuyerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text=" Switch to Coston"
                  // disabled={!isCoston2BuyerChanged}
                  onClick={handeSwitch}
                />
              )}
            </div>
          </div>
          <div className="input-boxs commission v-center justify-content-between mt-4 pt-2 gap-5 pb-40 ">
            <div className="left w-100">
              <label className="medium text-black">
                Coston2 SELLER COMMISSION
              </label>
              <div className="input-box br-30 ps-3 mt-3">
                <Input
                  placeholder="2.5"
                  value={inputSellerCoston2Value}
                  onChange={(e) => setInputSellerCoston2Value(e.target.value)}
                />
              </div>
              {chain.name === "Coston2" ? (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4 ${
                    isCoston2SellerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text="Save changes"
                  disabled={!isCoston2SellerChanged}
                  onClick={handleSellerCoston2SaveChanges}
                />
              ) : (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4 ${
                    isCoston2SellerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text=" Switch to Coston2"
                  // disabled={!isCoston2SellerChanged}
                  onClick={handeSwitch}
                />
              )}
            </div>
            <div className="w-100">
              <label className="medium text-black">
                Coston2 BUYER COMMISSION
              </label>
              <div className="input-box br-30 ps-3 mt-3">
                <Input
                  placeholder="2.5"
                  value={inputBuyerCoston2Value}
                  onChange={(e) => setInputBuyerCoston2Value(e.target.value)}
                />
              </div>
              {chain.name === "Coston2" ? (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4  ${
                    isCoston2BuyerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text="Save changes"
                  disabled={!isCoston2BuyerChanged}
                  onClick={handleBuyerCoston2SaveChanges}
                />
              ) : (
                <Button
                  width="170px"
                  height="47px"
                  className={`br-30 mt-4 ${
                    isCoston2BuyerChanged ? "btn-primary" : "btn-ternary"
                  }`}
                  text=" Switch to Coston2"
                  // disabled={!isCoston2BuyerChanged}
                  onClick={handeSwitch}
                />
              )}
            </div>
          </div>

          {/* Membership Fees (%) */}

          {/* These fees apply to Fat Cats members only. If a user holds a cat,
          leopard, tiger and a kitten (Gold membership) they will pay these
          buyer and seller fees */}

          {/* Fees vary depending on which membership you have to The Fat Cats Club
          - Gold Membership (Fat Cat, Fat Leopard, Fat Tiger, Fat Kitten) -
          Silver Membership (Fat Leopard, Fat Tiger, Fat Kitten) - Bronze
          Membership (Fat Tiger, Fat Kitten) - Standard Membership (Fat Kitten) */}

          {/* <div className="membership mt-40">
            <p className="body-large fw-bold ">Our Fees (%)</p>
            <p className="body-medium  mt-3">
              These fees apply to regular users of the site.
            </p> */}

          {/* gold membership */}
          {/* <div className="input-boxs v-center justify-content-between mt-4 pt-2 gap-5">
              <div className="left w-100">
                <label className="medium text-black">
                  BUYER COMMISSION - GOLD MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
              <div className="right w-100">
                <label className="medium text-black">
                  SELLER COMMISSION - GOLD MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
            </div> */}

          {/* silver membership */}
          {/* <div className="input-boxs v-center justify-content-between mt-4 pt-2 gap-5">
              <div className="left w-100">
                <label className="medium text-black">
                  BUYER COMMISSION - SILVER MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
              <div className="right w-100">
                <label className="medium text-black">
                  SELLER COMMISSION - SILVER MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
            </div> */}

          {/* BRONZE membership */}
          {/* <div className="input-boxs v-center justify-content-between mt-4 pt-2 gap-5">
              <div className="left w-100">
                <label className="medium text-black">
                  BUYER COMMISSION - BRONZE MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
              <div className="right w-100">
                <label className="medium text-black">
                  SELLER COMMISSION - BRONZE MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
            </div> */}

          {/* STANDARD membership */}
          {/* <div className="input-boxs v-center justify-content-between mt-4 pt-2 gap-5">
              <div className="left w-100">
                <label className="medium text-black">
                  BUYER COMMISSION - STANDARD MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
              <div className="right w-100">
                <label className="medium text-black">
                  SELLER COMMISSION - STANDARD MEMBERSHIP
                </label>
                <div className="input-box br-30 ps-3 mt-3">
                  <Input placeholder="2.5" />
                </div>
              </div>
            </div>
          </div> */}

          {/* site maintenance */}
          <div className="site-maintenance mt-40">
            <p className="body-large fw-bold ">Site Maintenance</p>
            <p className="body-medium  mt-3">
              Enabling maintenance mode temporarily makes the site inaccessible
              to regular users.
            </p>

            <div className="enable mt-4 mb-5 ms-3">
              <label
                className="text-black no-text-transform v-center pointer"
                onClick={(e) => setSpotActive(!spotActive)}
              >
                <img
                  src={spotActive ? checked : unchecked}
                  alt="checkbox"
                  className="me-3"
                />
                Enable maintenance mode
              </label>
            </div>

            <div className="left w-100">
              <label className="medium text-black">Maintenance message</label>
              <div className="input-box br-30 ps-3 mt-3">
                <Input placeholder="Add maintenance message..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSetting;
