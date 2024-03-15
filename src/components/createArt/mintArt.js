import React, { useEffect, useState } from "react";
import Header from "../header";
// import thumbnail from "../assets/icon/artwork.svg";
import del from "../../assets/icon/bin.svg";
import sgb from "../../assets/icon/SGB.svg";
import add from "../../assets/icon/plus.svg";
import createContract from "../../assets/images/createContract.png";
import art from "../../assets/images/artwork-example-1.png";

import Input from "../inputs";
import Button from "../button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../imageUpload";
import CustomCheckBox from "../shared/customTags";
import Textarea from "../shared/textarea";
import useScrollToTop from "../../customHooks/scrollToTop";
import InputBox from "../shared/inputBox";
import { toast } from "react-toastify";
import { handleNotifications } from "../../firebase/firebase";
import {
  getCollections,
  updateArtDataToFirebase,
  getCollectionStats,
  saveCollectionStats,
} from "../../firebase/firebase";
import { useAccount, useWalletClient } from "wagmi";
import { useSwitchNetwork, useNetwork } from "wagmi";
import Web3 from "web3";
// import mintContractABI from "../../abis/NewERC721ABI.json";
import mintContractABI from "../../abis/SafeMint/v2/abi.json";
import { useLocation } from "react-router-dom";
import Loader from "../shared/Loader";
import { Skeleton } from "antd";

const MintArt = () => {
  const Backend_url = process.env.REACT_APP_BACKEND_URL;
  const { address } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const web3 = new Web3(window.ethereum);
  let username = localStorage?.getItem("userName");
  let mintContract;

  // useStates
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createArtWork, setCreateArtWork] = useState(false);
  const [ArtworkData, setArtworkData] = useState({});
  const [artworkDocumentId, setArtworkDocumentId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [NFTDataUrl, setNFTDataUrl] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedBlockchain, setSelectedBlockchain] =
    useState("Select Blockchain");
  const [globalErrors, setGlobalErrors] = useState({
    selectedBlockchain: false,
    selectedCollectionId: false,
    selectedCollection: false,
  });
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  // functions
  useEffect(() => {
    console.log("location.state", location?.state);
    if (location?.state) {
      setArtworkData(location.state?.art);
      setArtworkDocumentId(location.state?.doc);
      handleCreateArtwork();
    }
    console.log("ArtworkData", ArtworkData);
  }, [location?.state]);

  useEffect(() => {
    if (address == undefined || address == null || address == "") {
      toast.error("Please connect wallet");
    } else {
      console.log("address: ", address);
      mintContract = new web3.eth.Contract(mintContractABI, selectedContract);
    }
  }, [selectedContract]);

  useEffect(() => {
    if (createArtWork) {
      window.scrollTo(0, 0);
    }
  }, [createArtWork]);

  useEffect(() => {
    getUserCollections();
  }, []);

  const handleItemSelected = (item, documentId, Address) => {
    setSelectedCollection(item);
    setSelectedCollectionId(documentId);
    setSelectedContract(Address);
  };

  const handleCaptchaModal = () => setShowCaptcha(!showCaptcha);

  const verifyHuman = async () => {
    navigate("/single-artwork");
  };

  const handleCreateArtwork = () => {
    setCreateArtWork(true);
  };

  const getUserCollections = async () => {
    const usercollections = await getCollections();
    console.log(usercollections);
    const filtercolllection = usercollections.filter((item) => {
      if (item.data.isWhiteList == true) {
        return item;
      }
    });
    setCollections(filtercolllection);
  };

  // const blockchains = ["Songbird Network", "Flare Network"]; // Your dynamic blockchains list

  // const handleSelect = (blockchain) => {
  //   setSelectedBlockchain(blockchain);
  // };

  const createArt = async () => {
    // handleCaptchaModal();
    // console.log(selectedBlockchain);
    console.log(selectedCollectionId);
    console.log(selectedCollection);

    let errors = {
      // selectedBlockchain: false,
      selectedCollectionId: false,
      selectedCollection: false,
    };
    // if (selectedBlockchain == "Select Blockchain") {
    //   errors.selectedBlockchain = true;
    // }
    if (!selectedCollectionId) {
      errors.selectedCollectionId = true;
    }
    if (!selectedCollection) {
      errors.selectedCollection = true;
    }

    setGlobalErrors(errors);

    if (Object.values(errors).every((error) => !error)) {
      await uploadNFtToS3({
        artistFee: ArtworkData.artistFee,
        artistAddress: ArtworkData.artistAddress,
        artistName: ArtworkData.username,
        artName: ArtworkData.name,
        image: ArtworkData.image,
        previewImg: ArtworkData.previewImg,
        description: ArtworkData.description,
        traits: ArtworkData.traits,
        selectedTags: ArtworkData.selectedTags,
        mintedBy: username,
        selectedCollection,
        selectedCollectionId,
        selectedBlockchain,
        mintedAt: new Date(),
      });
    }
  };

  const uploadNFtToS3 = async (NFTdata) => {
    // Upload NFT to S3
    try {
      // Make a POST request to your server
      console.log("NFTdata: ", NFTdata);
      const response = await fetch(`${Backend_url}/uploadNFT`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NFTdata,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // You can now use data.nftUrl, which contains the link to the uploaded NFT data
        const nftUrl = data.nftUrl;
        console.log("NFT URL:", data.nftUrl);
        console.log("NFT URL:", nftUrl);
        setNFTDataUrl(nftUrl);
        MintNft(nftUrl);
      } else {
        console.error("Error uploading NFT Data Object:", data.error);
      }
    } catch (error) {
      console.error("Error uploading NFT Data Object:", error);
    }
  };

  const handleSwitchChain = async () => {
    const switchTo = chains.find((c) => c.name === selectedBlockchain);
    if (switchTo) {
      switchNetwork?.(switchTo.id);
    }
    if (selectedCollection == null) {
      alert("please select colletion");
    }
  };

  const mintNFT = async (nftUrl) => {
    console.log("selectedCollectionId: ", selectedCollectionId);
    console.log("selectedContract", selectedContract);
    console.log("NFTDataUrl", nftUrl);
    // Ensure selectedContract and NFTDataUrl are set
    if (selectedContract && nftUrl) {
      try {
        const accounts = await web3.eth.getAccounts();
        console.log("accounts: ", accounts[0]);
        const contract = new web3.eth.Contract(
          mintContractABI,
          selectedContract
        );

        const owner = await contract.methods.owner().call();
        console.log("Contract Owner:", owner);
        // const estimatedGas = await contract.methods.safeMint(nftUrl, accounts[0], selectedCollectionId).estimateGas();
        // console.log(`Estimated gas for safeMint: ${estimatedGas}`);
        const transaction = contract.methods.safeMint(
          nftUrl,
          ArtworkData.artistAddress,
          ArtworkData.artistFee,
          selectedCollectionId
        );
        console.log("transaction: ", transaction);

        const estimatedGasCost = await transaction.estimateGas({
          from: accounts[0],
        });
        console.log(`Estimated gas cost: ${estimatedGasCost}`);
        const gasLimit = estimatedGasCost; // Add a 20% buffer to the estimated gas cost

        console.log(`Gas limit: ${gasLimit}`);
        const result = await transaction.send({
          from: accounts[0],
          gas: gasLimit,
        });
        setLoading(false);
        console.log("NFT Minted:", result);
        updateArtDataToFirebase(
          ArtworkData.artistName,
          ArtworkData.image,
          ArtworkData.previewImg,
          ArtworkData.name,
          ArtworkData.description,
          ArtworkData.traits,
          ArtworkData.selectedTags,
          ArtworkData.artistFee,
          ArtworkData.artistAddress,
          true,
          artworkDocumentId
        );
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    } else {
      console.error("Contract or NFTDataUrl is not set");
    }
  };

  const MintNft = async (nftUrl) => {
    setLoading(true);

    try {
      console.log("Before chain switching");
      // if (chain.name !== selectedBlockchain) {
      //   await handleSwitchChain();
      // }
      console.log("After chain switching, before minting");

      await mintNFT(nftUrl);
      console.log("After minting, before collection stats");

      await handlecollectionStats();
      console.log(
        "After collection stats, before notifications and navigation"
      );

      setLoading(false);
      handleNotifications(username, `Minted by ${username}`, "minted", "");
      navigate(`/drops`);
    } catch (error) {
      console.error("Error during minting process:", error);
      setLoading(false);
    }
  };

  const handlecollectionStats = async () => {
    const accounts = await web3.eth.getAccounts();
    const collectionStats = await getCollectionStats(selectedCollectionId);
    console.log("collectionStats", collectionStats);
    if (collectionStats) {
      let creatorEarning = collectionStats?.creatorEarning;
      console.log("creatorEarning", creatorEarning);
      console.log("ArtworkData.artistFee", ArtworkData.artistFee);
      if (ArtworkData.artistFee > creatorEarning) {
        creatorEarning = ArtworkData.artistFee;
      }
      let owners = collectionStats?.owners;
      if (owners.length > 0) {
        if (!owners.includes(accounts[0])) {
          owners.push(accounts[0]);
        }
      } else {
        owners.push(ArtworkData.artistAddress);
      }

      const data = {
        collectionId: selectedCollectionId,
        artworkCount: collectionStats?.artworkCount + 1,
        createdAt: collectionStats?.createdAt,
        creatorEarning: creatorEarning,
        volume: collectionStats?.volume,
        SGBvolume: collectionStats?.SGBvolume,
        FLRvolume: collectionStats?.FLRvolume,
        USDvolume: collectionStats?.USDvolume,
        floorPrice: collectionStats?.floorPrice,
        listedCount: collectionStats?.listedCount,
        saleCount: collectionStats?.saleCount,
        owners: owners,
      };
      saveCollectionStats(data);
    }
  };

  return (
    <div>
      <section className="create-artwork pt-0">
        <Header head="Create" />
        {createArtWork ? (
          <div className="create-artwork-content  ">
            <h4 className="medium-head">Mint Artwork</h4>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="upload-file mt-40">
                  <p className="body-large fw-bold">Image</p>
                  <img
                    src={ArtworkData.image}
                    alt="art"
                    className="img-fluid mt-3"
                  />
                </div>

                {/* preview of uploaded file */}
                <div className="preview-file upload-file mt-40">
                  <p className="body-large fw-bold">Preview Image*</p>
                  <img
                    src={ArtworkData.previewImg}
                    alt="art"
                    className="img-fluid mt-3"
                  />
                </div>

                {/* art name */}
                <div className="custom-inputBox  mt-30">
                  <label className="text-black ">Artwork Name</label>

                  <div className="input-box mt-3 br-40  custom-class">
                    <input
                      id="inputId"
                      name="name"
                      type="text"
                      value={ArtworkData.name}
                      placeholder="Artwork Name"
                      disabled={true}
                      className="custom-class inputtype1"
                    />
                  </div>
                </div>

                {/* Description */}

                <div className="art-name mt-40 d-flex flex-column">
                  <label className="text-black ">Description</label>
                  <div className="textarea-box ">
                    <textarea
                      id="inputId"
                      name="description"
                      placeholder="Description"
                      className="w-100"
                      value={ArtworkData.description}
                    />
                  </div>
                </div>

                {/* Artist fee */}
                <div className="art-name mt-40 d-flex flex-column">
                  <label className="text-black mb-3">
                    Artist fee
                    <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                      Percentage
                    </span>
                  </label>
                  <div className="input-box br-20 ">
                    <Input
                      type="Number"
                      placeholder="Amount"
                      className="inputtype1"
                      value={ArtworkData.artistFee}
                    />
                  </div>
                </div>

                {/* Traits */}
                <div className="artwork-traits">
                  <p className="body-large fw-bold mt-30 d-flex justify-content-between">
                    <span>Traits</span>
                  </p>
                  <p className="body-small text-medium-grey mt-3 ">
                    A distinguishing quality or characteristic.
                  </p>
                  {ArtworkData?.traits.map((trait, index) => (
                    <div key={index} className="add-traits d-flex flex-column">
                      <div className="d-flex  add-traits-head gap-5">
                        <div className="left">
                          <label className="text-black ">Type</label>
                        </div>
                        <div className=" left">
                          <label className="text-black ">name</label>
                        </div>
                      </div>

                      {/* static */}
                      <div className="d-flex mt-3 gap-5">
                        <div className="left">
                          <div className="input-box br-20 ">
                            <Input
                              type="text"
                              placeholder="Type"
                              value={trait.type}
                              disabled="disabled"
                              className="inputtype1"
                            />
                          </div>
                        </div>
                        <div className="name ">
                          <div className="input-box br-20 ">
                            <Input
                              type="text"
                              placeholder="Type"
                              value={trait?.name}
                              disabled="disabled"
                              className="inputtype1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="artwork-tags">
                  <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                    <span>Tags: </span>
                  </p>
                  <div className="mt-22">
                    <CustomCheckBox
                      values={ArtworkData?.selectedTags}
                      disabled={true}
                    />
                  </div>
                </div>
                {/* Collection */}
                <div className="art-collections">
                  <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                    <span>Collection</span>
                    <span className="fw-normal text-underline pointer">
                      Manage collections
                    </span>
                  </p>
                  <p className="body-small text-medium-grey mt-3 ">
                    This is the collection where your artwork will appear.
                  </p>
                  <Dropdown className="select-collection">
                    <Dropdown.Toggle id="dropdown-basic">
                      {selectedCollection ? selectedCollection : "Collections"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {collections.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => {
                            handleItemSelected(item.data.name, item.documentId);
                            setSelectedBlockchain(item.data.selectedNetwork);
                            console.log(
                              "contractAddess",
                              item.data.contractAddress
                            );
                            setSelectedContract(item.data.contractAddress);
                          }}
                        >
                          {item.data.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {globalErrors.selectedCollection && (
                    <p className="warning">Selected collection is missing</p>
                  )}
                </div>

                {/* Blockchain */}
                {/* <div className="artwork-blockchain">
                  <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                    <span>Blockchain</span>
                  </p>
                  <Dropdown className="select-collection">
                    <Dropdown.Toggle id="dropdown-basic">
                      <span>
                        <img src={sgb} alt="sgb" className="me-2" />
                        {selectedBlockchain}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {blockchains.map((blockchain, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleSelect(blockchain)}
                        >
                          {blockchain}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {globalErrors.selectedBlockchain && (
                    <p className="warning"> Selected blockchain is missing</p>
                  )}
                </div> */}
                <div className="divider"></div>

                {/* Create artwork button */}
                {chain.name === selectedBlockchain ? (
                  <Button
                    text="Mint NFT"
                    className="btn-prime btn-primary br-30 font-18"
                    height="50px"
                    width="100%"
                    onClick={createArt}
                  />
                ) : (
                  <Button
                    text="Switch to selected blockchain"
                    className="btn-prime btn-primary br-30 font-18"
                    height="50px"
                    width="100%"
                    onClick={handleSwitchChain}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <></>
        )}

        <Modal
          show={showCaptcha}
          onHide={handleCaptchaModal}
          className="sign-modal "
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <label htmlFor="" className="medium">
                ALMOST DONE
              </label>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="captcha-content v-center flex-column pb-5">
              <p className="body-medium text-center mb-5">
                Before we create this item, please confirm that you are indeed a
                human by ticking the box below.
              </p>
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={verifyHuman}
              />
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </div>
  );
};

export default MintArt;
