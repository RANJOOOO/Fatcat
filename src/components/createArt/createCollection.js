import React, { useState } from "react";
import Header from "../header";
import Input from "../inputs";
import Button from "../button";
import { Modal } from "react-bootstrap";
import loading from "../../assets/icon/loader-small-white.svg";
import { useNavigate } from "react-router-dom";
import {
  getAllArtistDetails,
  getAllUsers,
  getCollections,
  saveCollection,
  saveCollectionStats,
} from "../../firebase/firebase";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";
import { useEffect } from "react";
import CreateContract from "../../contractInteraction/contractcreation";
import { useAccount, useWalletClient } from "wagmi";
import { connectStorageEmulator } from "firebase/storage";
import { useSwitchNetwork, useNetwork } from "wagmi";

const CreateCollection = () => {
  const [createFinish, setCreateFinish] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [symbolName, setSymbolName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const { address } = useAccount();
  const { data: signer } = useWalletClient(); // Get the signer from the wallet client
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState("Coston");
  const [registerArtistError, setRegisterArtistError] = useState(false);
  const [profileApproved, setProfileApproved] = useState(false);

  useEffect(() => {
    console.log("address", address);
    const getAllArtists = async () => {
      const artists = await getAllArtistDetails();
      console.log("artists", artists);
      if (artists?.length > 0) {
        const artist = artists?.find(
          (artist) => artist?.documentId === address
        );
        console.log("artist", artist);
        if (artist === undefined || artist === null || artist === "") {
          setRegisterArtistError(true);
        } else {
          if (artist?.data?.approved === false) {
            setProfileApproved(false);
          } else {
            setProfileApproved(true);
          }
        }
      }
    };
    const getUsers = async () => {
      const users = await getAllUsers();
      console.log("users", users);
      if (users?.length > 0) {
        const user = users?.find((user) => user?.id === address);
        console.log("user", user);
        if (user?.userName === "" || user?.userName === undefined) {
          setUserNameError(true);
        }
      }
    };
    getUsers();
    getAllArtists();
  }, [address]);

  const handleCreateFinish = async () => {
    const user = JSON.parse(localStorage?.getItem("CatalystUserData"));
    if (address == undefined || address == null || address == "") {
      toast.error("Please connect wallet");
    } else {
      if (collectionName == "" || symbolName == "") {
        toast.error("Please fill all the fields", {
          toastId: "applyError",
        });
      } else {
        // setCreateFinish(true);
        try {
          const res = await CreateContract(signer);
          console.log("create Contract response", res);
          if (res.success) {
            const resp = await saveCollection(
              collectionName,
              symbolName,
              address,
              selectedNetwork,
              res.contractAddress
            );
            console.log("save collection response", resp);
            if (resp) {
              CreateCollectionStats();
              toast.success("Submitted For Approval", {
                toastId: "applySuccess",
              });

              // setCreateFinish(true);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const CreateCollectionStats = async () => {
    const collectionId = await getLastCollectionId();
    console.log("collectionId", collectionId);
    const data = {
      collectionId: collectionId,
      artworkCount: 0,
      createdAt: new Date().getTime(),
      creatorEarning: 0,
      volume: [],
      SGBvolume: [],
      FLRvolume: [],
      USDvolume: [],
      floorPrice: [],
      listedCount: 0,
      saleCount: 0,
      owners: [],
    };
    saveCollectionStats(data);
  };

  const getLastCollectionId = async () => {
    const collectionId = await getCollections();
    console.log("collectionIds", collectionId);
    if (collectionId?.length > 0) {
      // Sort the collection by timestamp in descending order
      const collectionSorted = collectionId.sort((a, b) => {
        const timeA = a?.data?.timestamp?.seconds;
        const timeB = b?.data?.timestamp?.seconds;
        return timeB - timeA;
      });
      console.log("sorted collectionIds", collectionSorted);
      const lastCollectionId = collectionSorted[0].documentId;
      console.log("lastCollectionId", lastCollectionId);
      return lastCollectionId;
    }
  };

  useEffect(() => {
    setSelectedNetwork(chain?.name);
  }, [chain]);

  const handleSwtichNetwork = (chain) => {
    switchNetwork?.(chain.id);
    setSelectedNetwork(chain?.name);
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="create-collections create-artwork">
        {/* <Header head="Create" /> */}
        <div className="create-artwork-content  ">
          <h4 className="medium-head">Create New Collection</h4>

          {/* collection-name */}
          <div className="art-name mt-40 d-flex flex-column">
            <label className="text-black v-center justify-content-between">
              Collection Name *
              <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                Required
              </span>
            </label>
            <div className="input-box br-20 mt-3">
              <Input
                type="text"
                placeholder="My Collection Name.."
                className="inputtype1"
                onChange={(e) => {
                  setCollectionName(e.target.value);
                }}
              />
            </div>
          </div>

          {/* symbol name */}
          <div className="art-name mt-40 d-flex flex-column">
            <label className="text-black v-center justify-content-between">
              Collection Symbol *
              <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                Required
              </span>
            </label>
            <div className="input-box br-20 mt-3">
              <Input
                type="text"
                placeholder="MCN"
                className="inputtype1"
                name="collectionName"
                onChange={(e) => {
                  setSymbolName(e.target.value);
                }}
              />
            </div>
          </div>

          {/* select Network */}
          <div className="art-name mt-40 d-flex flex-column">
            <label className="text-black v-center justify-content-between">
              Select Network *
              <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                Required
              </span>
            </label>
            <Dropdown className="select-collection">
              <Dropdown.Toggle id="dropdown-basic">
                {selectedNetwork}
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                {chains.map((chain) => (
                  <Dropdown.Item
                    key={chain.chainId}
                    value={chain.chainId}
                    selected={chain.chainId === pendingChainId}
                    onClick={() => handleSwtichNetwork(chain)}
                  >
                    {chain.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* <div className="art-name mt-40 d-flex flex-column">
            <label className="text-black v-center justify-content-between">
              Select Network *
              <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                Required
              </span>
            </label>
            <div className="input-box br-20 mt-3">
              <select
                className="inputtype1"
                onChange={(e) => {
                  switchNetwork(e.target.value);
                }}
              >
                {chains.map((chain) => (
                  <option
                    key={chain.chainId}
                    value={chain.chainId}
                    selected={chain.chainId === pendingChainId}
                  >
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* {userNameError ? (
            <p className="text-error">Please set your user name first</p>
          ) : (
            <></>
          )} */}

          {registerArtistError ? (
            <Button
              text="Apply for Artist"
              className="btn-prime btn-primary mt-60 br-30 font-18"
              height="50px"
              width="100%"
              onClick={() => navigate("/apply")}
            />
          ) : !profileApproved ? (
            <Button
              text="Profile is not approved"
              className="btn-prime btn-primary mt-60 br-30 font-18"
              height="50px"
              width="100%"
              disabled={true}
            />
          ) : userNameError ? (
            <Button
              text="Complete your profile first"
              className="btn-prime btn-primary mt-30 br-30 font-18"
              height="50px"
              width="100%"
              onClick={() => navigate("/profile")}
            />
          ) : (
            <Button
              text="Create"
              className="btn-prime btn-primary mt-60 br-30 font-18"
              height="50px"
              width="100%"
              onClick={handleCreateFinish}
            />
          )}

          <Button
            text="All Collections"
            className="btn-prime btn-primary mt-30 br-30 font-18"
            height="50px"
            width="100%"
            onClick={() => navigate("/allcollections")}
          />
        </div>

        <Modal
          show={createFinish}
          onHide={handleCreateFinish}
          className="sign-modal create-collection-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <label htmlFor="" className="medium">
                confirm
                {/* error */}
              </label>{" "}
              {/* if we get error while creating smart contract  REPLACE confirm with ERROR*/}
              <label htmlFor="" className="medium d-none">
                error
              </label>
              {/* if success while creating smart contract  REPLACE   with success*/}
              <label htmlFor="" className="medium d-none">
                success
              </label>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="create-collection-modal ">
              <div className=" pb-5  v-center flex-column  top-content ">
                {/* waiting confirming */}
                <div className="w-100">
                  <p className="body-medium text-center  mt-5 pt-1 ">
                    Confirm this transaction in your wallet.
                  </p>

                  <label className="mt-30 pt-1 no-text-transform text-black text-center  w-100">
                    Waiting for blockchain confirmation…
                  </label>
                </div>

                {/* smart contract being created */}
                <div className="w-100  d-none ">
                  <p className="body-medium text-center  mt-5 pt-1 ">
                    Please wait
                  </p>

                  <label className="mt-30 pt-1 no-text-transform text-black text-center">
                    Your smart contract is being created...
                  </label>
                </div>

                {/* if error while create contract */}
                <div className=" w-100 d-none">
                  <p className="body-medium text-center  mt-5 pt-1 ">
                    Sorry, we couldn't create this smart contract for you.
                  </p>

                  <label className="mt-30 pt-1 no-text-transform text-black text-center">
                    Please try again...
                  </label>
                </div>

                {/* if collection creation success */}
                <div className="w-100 ">
                  <p className="body-medium text-center  mt-5 pt-1 text-center">
                    Your smart contract has been deployed to the Flare Network!
                  </p>

                  <label className="mt-30 pt-1 no-text-transform text-black text-center w-100">
                    Congratulations!
                  </label>
                </div>
              </div>
              {/* if error occur then btn text will be "Try again" */}
              <div className="h-center">
                <Button
                  // text="Open your wallet"
                  className="btn-prime btn-primary   mt-5 d-none"
                  width="138px"
                  height="36px"
                  onClick={handleCreateFinish}
                  imageSrc={loading}
                  imageClassName="img-18"
                />
              </div>

              {/* if success btns */}

              <div className="on-success mt-5 v-center gap-4 h-center">
                <Button
                  text="View Collection"
                  className="btn-prime btn-secondary "
                  width="175px"
                  height="36px"
                  onClick={() => navigate("/explore-collections")}
                />

                <Button
                  text="Create new Artwork"
                  className="btn-prime btn-primary "
                  width="175px"
                  height="36px"
                  onClick={handleCreateFinish}
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default CreateCollection;
