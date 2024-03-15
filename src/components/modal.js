import React, { useEffect, useState } from "react";
import "../style/main.scss";

import Modal from "react-bootstrap/Modal";
import metamask from "../assets/icon/metamask.svg";
import walletImg from "../assets/icon/wallet-connect.svg";
import created from "../assets/icon/created.svg";
import sad from "../assets/icon/sad-face.svg";
import logo from "../assets/icon/logo.svg";
import emailIcon from "../assets/icon/email.svg";
import { formatBalance } from "../utils";
import detectEthereumProvider from "@metamask/detect-provider";
// import { useAccount } from "wagmi";
import Button from "./button";
import { useAccount, useConnect, useWalletClient } from "wagmi";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  auth,
  firestoredb,
  getUserData,
  updateUserEmailAndVerified,
} from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { collection, getDoc } from "firebase/firestore";
import { query, set } from "firebase/database";
import Input from "./inputs";

const WallatModal = ({ show, handleModal, handleEmail, handleEmailSet }) => {
  //  States for handles and wallet data
  // const { address } = useAccount();
  // const address = window.ethereum.selectedAddress;
  // const address = "1x0000b..5xb4";
  // console.log(handleEmail);
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { data: signer } = useWalletClient();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [hasProvider, setHasProvider] = useState(null);
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [selectedWallet, setSelectedWallet] = useState(null);
  // const [isConnecting, setIsConnecting] = useState(false);
  const [errors, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [Last, setLast] = useState(false);
  const [email, setEmail] = useState("");
  const { connect, connectors, error, pendingConnector, isLoading } =
    useConnect();
  const [uniqueConnector, setUniqueConnector] = useState([]);
  // Handles for all pop ups

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => {
    if (wallet?.accounts?.length > 0) {
      setShow2(true);
    }
  };
  const handleClose3 = () => setShow3(false);

  const handleShow3 = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Invalid email address");
      return;
    } else {
      updateUserEmailAndVerified(address, email);
      setShow2(false);
      setShow3(true);
    }
  };
  // It gets connect account of refresh

  useEffect(() => {
    console.log("connectors", connectors);
    setUniqueConnector(connectors);

    // // Map and get unique connector objects based on their 'id'
    // const uniqueWallets = connectors.reduce((uniqueConnectors, connector) => {
    //   // Check if the connector with the same 'id' is already in the array
    //   const existingConnector = uniqueConnectors.find(
    //     (c) => c.id === connector.id
    //   );

    //   // If not found, add the connector to the array
    //   if (!existingConnector) {
    //     uniqueConnectors.push(connector);
    //   }

    //   return uniqueConnectors;
    // }, []);

    // setUniqueConnector(uniqueWallets);
    // console.log("uniqueWallets", uniqueWallets);

    // Set selected wallet or perform other actions as needed
  }, [connectors]);

  const handleshow3maybelater = () => {
    setShow2(false);
    setShow3(true);
  };

  useEffect(() => {
    console.log(handleEmail);
    if (handleEmail) {
      setShow2(true);
    }
    if (!show2) {
      handleEmailSet(false)
    }
  }, [handleEmail])

  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts?.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  // It updates connected wallet

  const updateWallet = async (accounts) => {
    // console.log("Update WAllet ", accounts);
    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, balance, chainId });
  };

  // HandleConnect handles connection of metamask wallet

  const handleConnect = async () => {
    handleShow2();
    // setIsConnecting(true);
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setError(false);
        updateWallet(accounts);
        setShow2(true);
        localStorage.removeItem("fatcatdisconnect");
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
      });
    // setIsConnecting(false);
  };

  const navigate = useNavigate();

  const handleAcceptSigner = async () => {
    try {
      const res = await signer.signMessage({
        address,
        message: `Welcome to Catalyst!

Click to sign in and accept the Catalyst Terms of Service  and Privacy Policy .
        
This request will not trigger a blockchain transaction or cost any gas fees.
          
Your authentication status will reset after 24 hours.
          `,
      });

      if (res) {
        setShow3(false);
        localStorage.setItem("catalystSigner", "true");

        const userData = await getUserData(address);
        console.log(userData);
        if (userData != null) {
          signInWithEmailAndPassword(auth, userData?.userMail, address)
            .then((res) => {
              console.log(res);
              navigate("/profile");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("email not found");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("User Rejected Signing", { toastId: "signError" });
    }
  };

  //  const [userData, setUserData] = useState("");
  const getfirebasedata = async () => {
    if (address) {
      const data = await getUserData(address);
      console.log(data);
      //  setUserData(data);
      if (data?.userMail) {
        setShow2(false);
        setShow3(true);
      } else {
        setShow2(true);
      }
    }
  };

  const call = () => {
    if (isConnected) {
      setShow1(false);
      getfirebasedata();
    }
  };

  const handleClick = (connector) => {
    console.log("connector", connector);
    connect({ connector });
    call();
    handleClose1();
    // handleClose3();
  };
  return (
    <>
      {/* Modal to select wallet */}
      <Modal
        show={show}
        onHide={handleModal}
        // backdrop="static"
        keyboard={false}
        className="wallet-connect-modal sign-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label className="medium">Connect a Wallet</label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="connect-wallet-btn">


            {
              uniqueConnector.map((connector) => {
                // console.log("connector", connector.id);
                // if (index == 3) {
                if (
                  connector.options.showQrModal
                ) {
                  return (
                    <div>
                      {/* <Button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => {
                          handleClick(connector);
                        }}
                        className="btn-prime btn-primary text-white"
                        text="Open your wallet 2"
                      >
                        {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </Button> */}

                      <div
                        className="wallet"
                        // onClick={() => {
                        //   handleShow1();
                        //   setSelectedWallet("walletConnect");
                        //   handleModal();
                        // }}
                        key={connector.id}
                        onClick={() => {
                          handleClick(connector);
                        }}
                      >
                        <img src={walletImg} alt="metamask" />
                        <p className="body-large">WalletConnect</p>
                      </div>
                      {/* {error && <div>{error.message}</div>} */}
                    </div>
                  );

                } else if (

                  connector.id === "metaMask"
                ) {
                  return (
                    <div>
                      {/* <Button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => {
                          handleClick(connector);
                        }}
                        className="btn-prime btn-primary text-white"
                        text="Open your wallet 1"
                      >
                        {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </Button> */}

                      <div
                        className="wallet"
                        // onClick={() => {
                        //   handleShow1();
                        //   setSelectedWallet("metaMask");
                        //   handleModal();
                        // }}
                        key={connector.id}
                        onClick={() => {
                          handleClick(connector);
                        }}
                      >
                        <img src={metamask} alt="metamask" />
                        <p className="body-large">MetaMask</p>
                      </div>
                      {/* {error && <div>{error.message}</div>} */}
                    </div>
                  );
                }
              })
            }

            {/* <div
              className="wallet"
              onClick={() => {
                handleShow1();
                setSelectedWallet("metaMask");
                handleModal();
              }}
            >
              <img src={metamask} alt="metamask" />
              <p className="body-large">MetaMask</p>
            </div> */}
            {/* <div
              className="wallet"
              onClick={() => {
                handleShow1();
                setSelectedWallet("walletConnect");
                handleModal();
              }}
            >
              <img src={walletImg} alt="metamask" />
              <p className="body-large">WalletConnect</p>
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="top-footer">
            <div className="left-content">
              <label className="medium footer-head">WHAT IS A WALLET</label>
              <p className="body-medium ">
                Wallets are used to send, receive, store, and display digital
                assets like Flare and NFTs. Instead of creating new accounts and
                passwords on every website, just connect your wallet.
              </p>
            </div>
            <div className="right-content">
              <div>
                <label className="medium footer-head">WHAT IS A WALLET</label>
                <p className="body-medium ">Don’t have a wallet yet?</p>
              </div>
              <div className="r-btm">
                <div className="get-metamask">
                  <img src={metamask} alt="metamask" />
                  <a
                    href="https://metamask.io/"
                    target="_blank"
                    className="body-medium "
                  >
                    Get a MetaMask wallet
                  </a>
                </div>
                <div className="get-metamask">
                  <img src={walletImg} alt="safe wallet" />
                  <a
                    href="https://walletconnect.com/"
                    className="body-medium "
                    target="_blank"
                  >
                    Get a WalletConnect wallet
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="btm-footer">
            <p className="body-extra-small">
              By connecting your wallet you agree to our{" "}
              <a href="#">Terms of Service</a>
              <br />
              and <a href="#">Privacy Notice.</a>
            </p>
          </div>
        </Modal.Footer>
      </Modal>
      {/* Sign in OPEN wallet */}
      <Modal
        show={show1}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
        className="wallet-signIn-modal sign-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {/* When you try loging */}

            <label className="medium">SIGN YOUR WALLET</label>

            {/* if you face error */}

            {/* <p className="body-medium">SIGN-IN ERROR</p> */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* When you try signin wallet uncomment following code */}

          <>
            <img src={created} alt="create" />
            <p className="body-large">
              Please sign your <span>wallet</span> to continue
            </p>

            {isConnecting ? (
              // close model and open wallet
              <Button
                text="Signing your wallet..."
                // onClick={handleConnect}
                className="btn-prime btn-primary disable sign-your-wallet"
              />
            ) : (
              uniqueConnector.map((connector) => {
                // console.log("connector", connector.id);
                // if (index == 3) {
                if (
                  selectedWallet === "walletConnect" &&
                  connector.options.showQrModal
                ) {
                  return (
                    <div>
                      <Button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => {
                          handleClick(connector);
                        }}
                        className="btn-prime btn-primary text-white"
                        text="Open your wallet"
                      >
                        {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </Button>
                      {/* {error && <div>{error.message}</div>} */}
                    </div>
                  );
                } else if (
                  selectedWallet === "metaMask" &&
                  connector.id === "metaMask"
                ) {
                  console.log("metaMask");
                  console.log("connector", connector);
                  return (
                    <div>
                      <Button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => {
                          handleClick(connector);
                        }}
                        className="btn-prime btn-primary text-white"
                        text="Open your wallet"
                      >
                        {connector.name}
                        {!connector.ready && " (unsupported)"}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </Button>
                      {/* {error && <div>{error.message}</div>} */}
                    </div>
                  );
                }
              })
              // <Button
              //   text="Open your wallet"
              //   onClick={handleConnect}
              //   className="btn-prime btn-primary"
              // />
            )}
          </>

          {/* if signin failed */}
          {/* <img src={sad} alt="create" />
          <p className="body-large">
            <span>Sorry,</span> we couldn't sign you in.
          </p>
          <button className="btn-primary">Try Again</button> */}
        </Modal.Body>
        <Modal.Footer>
          {/* while signing */}

          <p className="body-medium">NEED HELP?</p>
          <p className="body-medium text-center">
            If you are having trouble signing in, please check the latest
            instructions for <br />
            <a href="#"> MetaMask </a>
            or
            <a href="#"> WalletConnect.</a>
          </p>
          <div className="body-extra-small trouble">
            Still having trouble singing in? Contact us on{" "}
            <a href="#">Twitter</a> or <a href="#">Discord.</a>
          </div>

          {/* If sign in failed */}
          {/* <div className="sign-in-failed">
            <p className="body-medium">PLEASE TRY AGAIN</p>
            <p className="body-medium text-center">
              Please try again by closing this window and click on{" "}
              <span>Sign In</span>
              again. Don’t
              <br />
              forget to <a href="#"> sign your wallet </a> if needed.
            </p>
            <div className="body-extra-small trouble">
              Still having trouble singing in? Contact us on{" "}
              <a href="#">Twitter</a> or <a href="#">Discord.</a>
            </div>
          </div> */}
        </Modal.Footer>
      </Modal>
      {/* Email Sign in wallet */}
      {/* This will be for only new users if they want to register their emails*/}
      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
        className="wallet-signIn-modal sign-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label className="medium">EMAIL</label>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {
            //<img src={email} alt="create" />
          }
          <p className="body-large">
            Want to add an <span>email address?</span>
            <span className="optional">(Optional)</span>
          </p>
          <Input
            placeholder="emailaddress@gmail.com"
            type="email"
            className="add-email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <p className="body-medium email-detail text-center">
            Add an email address if you want to stay notified of any relevant
            sales, <br /> auctions, bids etc. You can add or remove this later
            in your profile settings.
          </p>
          <div className="mail-btns">
            <Button
              text="Maybe later"
              onClick={handleshow3maybelater}
              className="btn-prime btn-secondary"
            />
            <Button
              text="Add email"
              onClick={handleShow3}
              className="btn-prime btn-primary ms-3"
            />
          </div>
          {/* +
          <div
            className="body-extra-small text-decoration-underline skip-step pointer"
            onClick={() => {
              handleshow3maybelater
            }}
          >
            Skip this step
          </div> */}
        </Modal.Body>
      </Modal>
      {/* accept terms and condition */}
      <Modal
        show={show3}
        onHide={handleClose3}
        backdrop="static"
        keyboard={false}
        className="terms-modal sign-modal"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <label className="medium">WELCOME</label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={logo} alt="logo" />
          <p>Explore. Collect. Create.</p>

          <p className="body-small terms-detail">
            By connecting your wallet you agree to our <br />
            <span>Terms of Service</span> and <span>Privacy Notice.</span>
          </p>
          <div className="btns">
            <Button
              onClick={() => {
                handleClose3();
                handleClose1();
                handleClose2();
                setLast(true);
                localStorage.removeItem("catalystSigner");
              }}
              text="Cancel"
              className="btn-prime btn-secondary"
            />

            <Button
              onClick={() => {
                // handleClose3();
                handleClose1();
                handleClose2();
                setLast(true);
                handleAcceptSigner();
              }}
              text="Accept"
              className="btn-prime btn-primary ms-5"
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WallatModal;
