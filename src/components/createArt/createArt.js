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
  saveNftDataToFirebase,
  saveArtDataToFirebase,
} from "../../firebase/firebase";
import { Timestamp } from "firebase/firestore";
import { useAccount, useWalletClient } from "wagmi";
import Web3 from "web3";
// import mintContractABI from "../../abis/NewERC721ABI.json";
import mintContractABI from "../../abis/SafeMint/v2/abi.json";
import { useLocation } from "react-router-dom";
import Loader from "../shared/Loader";

const Backend_url = process.env.REACT_APP_BACKEND_URL;

const CreateArt = () => {
  // Varibales
  // const [selectedImage, setSelectedImage] = useState(null);
  const { data: signer } = useWalletClient(); // Get the signer from the wallet client
  const { address } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  // useStates
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createArtWork, setCreateArtWork] = useState(false);

  // functions
  let username = localStorage?.getItem("userName");

  const [previewImage, setPreviewImage] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [artistFee, setArtistFee] = useState(0);

  // functions

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [NFTDataUrl, setNFTDataUrl] = useState(null);

  const web3 = new Web3(window.ethereum);

  let mintContract;
  useEffect(() => {
    if (address == undefined || address == null || address == "") {
      toast.error("Please connect wallet");
    } else {
      console.log("address: ", address);
      mintContract = new web3.eth.Contract(mintContractABI, selectedContract);
    }
  }, [selectedContract]);

  // const mintNFT = async (nftUrl) => {
  //     console.log("selectedCollectionId: ",selectedCollectionId);
  //     console.log("selectedContract", selectedContract);
  //     console.log("NFTDataUrl", nftUrl);
  //     // Ensure selectedContract and NFTDataUrl are set
  //     if (selectedContract && nftUrl) {
  //       // try {
  //         const accounts = await web3.eth.getAccounts();
  //         console.log("accounts: ",accounts[0]);
  //         const contract = new web3.eth.Contract(mintContractABI, selectedContract);
  //         console.log("contracts: ", contract);
  //         const methods = contract.methods;
  //         console.log("methods: ", methods);
  //         const transaction = contract.methods.safeMint("121123123", "0xfB2ADE4bd8261A7B4f685c6d800283fD7EAFe330", "pgSO09CFuW6ut9SUia29");
  //         console.log("transaction: ",transaction);
  //         signer
  //         .sendTransaction({
  //           to: selectedContract,
  //           from: accounts[0],
  //           data: transaction
  //         })
  //         .then(async (hash) => {
  //           console.log("hash: ",hash);
  //             for (let index = 0; index > -1; index++) {
  //                 var receipt = await web3.eth.getTransactionReceipt(hash);
  //                 console.log("receipt: ",receipt);
  //                 if (receipt != null) {
  //                     toast("NFT Minted successfully", { toastId: "donotDuplicate" });
  //                     // await addDoc(collection(firestoredb, "NFTs"), userData)
  //                     //     .then((nftid) => {
  //                     //         setisLoading(false);
  //                     //         window.location.reload();
  //                     //     })
  //                     //     .catch((error) => {
  //                     //         console.error("Error adding document: ", error);
  //                     //     });

  //                     break;
  //                 }
  //             }
  //         })
  //         .catch((error) => {
  //             console.log("error: ",error);
  //             setLoading(false);
  //             if (error.code == 4001) {
  //                 toast.warning("Transaction Rejected!", {
  //                     toastId: "buyError",
  //                 });
  //             } else {
  //                 toast.error("Something went wrong while Buying", {
  //                     toastId: "buyError",
  //                 });
  //             }
  //         });
  // } else {
  // console.error('Contract or NFTDataUrl is not set');
  // }
  // };

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

  // const handleImageChange = (image) => {
  //   setSelectedImage(image);
  // };
  useEffect(() => {
    if (createArtWork) {
      window.scrollTo(0, 0);
    }
  }, [createArtWork]);
  const [collections, setCollections] = useState([]);
  const getUserCollections = async () => {
    const usercollections = await getCollections();
    console.log(usercollections);
    setCollections(usercollections);
  };
  useEffect(() => {
    getUserCollections();
  }, []);

  // Check if location.pathname.split("/")[2] is available
  const shouldShowDropdownFirst = !location.pathname.split("/")[2];
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log(
      "location.pathname.split(/)[2]",
      location.pathname.split("/")[2]
    );
    if (location.pathname.split("/")[2]) {
      setShowDropdown(true);
    }
  }, [location.pathname.split("/")[2]]);

  useEffect(() => {
    console.log("collectionsDocumentId ", location.pathname.split("/")[2]);
    console.log("collection", collections);

    // Filter collections based on the condition
    const filteredCollections = collections.find(
      (collection) => collection.documentId === location.pathname.split("/")[2]
    );

    console.log("filteredCollections", filteredCollections);
    handleItemSelected(
      filteredCollections?.data?.name,
      filteredCollections?.documentId,
      filteredCollections?.data?.contractAddress
    );
  }, [collections]);

  const [traits, setTraits] = useState([{ type: "", name: "" }]);

  const handleAddTrait = () => {
    setTraits([...traits, { type: "", name: "" }]);
  };

  const handleDeleteTrait = (index) => {
    const updatedTraits = [...traits];
    updatedTraits.splice(index, 1);
    setTraits(updatedTraits);
  };

  const handleTraitChange = (index, key, value) => {
    const updatedTraits = [...traits];
    updatedTraits[index][key] = value;
    setTraits(updatedTraits);
  };

  const initialTags = [
    "3D",
    "Animation",
    "Physical", // Corrected spelling for "Phygital"
  ];

  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (e) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  const [selectedBlockchain, setSelectedBlockchain] =
    useState("Select Blockchain"); // Rename the state variable

  const blockchains = ["Songbird Network", "Flare Network"]; // Your dynamic blockchains list

  const handleSelect = (blockchain) => {
    setSelectedBlockchain(blockchain);
  };

  const [globalErrors, setGlobalErrors] = useState({
    selectedTags: false,
    // selectedBlockchain: false,
    traits: false,
    name: false,
    description: false,
    // selectedCollectionId: false,
    // selectedCollection: false,
    previewImage: false,
    image: false,
    artistFee: false,
  });

  const createArt = async () => {
    // handleCaptchaModal();
    console.log(selectedTags);
    console.log(selectedBlockchain);
    console.log(traits);
    console.log(name);
    console.log(description);
    console.log(selectedCollectionId);
    console.log(selectedCollection);
    console.log(previewImage);
    console.log(image);

    let errors = {
      selectedTags: false,
      // selectedBlockchain: false,
      traits: false,
      name: false,
      description: false,
      // selectedCollectionId: false,
      // selectedCollection: false,
      previewImage: false,
      image: false,
      artistFee: false,
    };

    // Check for validation errors and set the error flag to true when an error is found
    if (selectedTags.length == 0) {
      errors.selectedTags = true;
    }

    //   if (selectedBlockchain == "Select Blockchain") {
    //     errors.selectedBlockchain = true;
    // }
    console.log(traits[0]?.type);

    if (
      traits[0]?.type == undefined ||
      traits[0]?.type == "" ||
      traits[0]?.name == undefined ||
      traits[0]?.name == ""
    ) {
      errors.traits = true;
    }

    if (!name) {
      errors.name = true;
    }

    if (!description) {
      errors.description = true;
    }

    if (!artistFee) {
      errors.artistFee = true;
    }

    // if (!selectedCollectionId) {
    //   errors.selectedCollectionId = true;
    // }

    // if (!selectedCollection) {
    //   errors.selectedCollection = true;
    // }

    if (!previewImage) {
      errors.previewImage = true;
    }

    if (!image) {
      errors.image = true;
    }

    setGlobalErrors(errors);

    if (Object.values(errors).every((error) => !error)) {
      // Call your function here
      // Example: yourFunction();
      handleNotifications(username, `Minted by ${username}`, "minted", "");

      // console.log("selectedCollectionId: ",selectedCollectionId);
      setLoading(true);
      // const data = {
      //   username,
      //   image,
      //   previewImage,
      //   name,
      //   description,
      //   // selectedCollection,
      //   // selectedCollectionId,
      //   traits,
      //   // selectedBlockchain,
      //   selectedTags,
      // }
      // const response = await saveNftDataToFirebase(
      let artistAddress = await web3.eth.getAccounts();
      artistAddress = artistAddress[0];
      console.log("before Saving");
      console.log("username: ", username);
      console.log("name: ", name);
      console.log("description: ", description);
      console.log("traits: ", traits);
      console.log("selectedTags: ", selectedTags);
      console.log("artistFee: ", artistFee);
      console.log("artistAddress: ", artistAddress);

      const response = await saveArtDataToFirebase(
        username,
        image,
        previewImage,
        name,
        description,
        traits,
        selectedTags,
        artistFee,
        artistAddress,
        false
      );

      console.log("response: ", response);
      setLoading(false);
      navigate(`/Drops`);
      // const ImageUrl = response.data.Image;
      // const PreviewImageUrl = response.data.PreviewImage;
      // await uploadNFtToS3({
      //   username,
      //   image: ImageUrl,
      //   previewImg: PreviewImageUrl,
      //   name,
      //   description,
      //   selectedCollection,
      //   selectedCollectionId,
      //   traits,
      //   selectedBlockchain,
      //   selectedTags
      // });
    }
  };

  // const uploadNFtToS3 = async (NFTdata) => {
  //   // Upload NFT to S3
  //   try {
  //     // Make a POST request to your server
  //     console.log("NFTdata: ",NFTdata);
  //     const response = await fetch(`${Backend_url}/uploadNFT`, {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           NFTdata,
  //         }),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //         // You can now use data.nftUrl, which contains the link to the uploaded NFT data
  //         const nftUrl = data.nftUrl;
  //         console.log('NFT URL:', data.nftUrl);
  //         console.log('NFT URL:', nftUrl);
  //         setNFTDataUrl(nftUrl);
  //         MintNft(nftUrl);
  //     } else {
  //         console.error('Error uploading NFT Data Object:', data.error);
  //     }
  // } catch (error) {
  //     console.error('Error uploading NFT Data Object:', error);
  // }
  // }

  // const mintNFT = async (nftUrl) => {
  //   console.log("selectedCollectionId: ",selectedCollectionId);
  //   console.log("selectedContract", selectedContract);
  //   console.log("NFTDataUrl", nftUrl);
  //   // Ensure selectedContract and NFTDataUrl are set
  //   if (selectedContract && nftUrl) {
  //     try {
  //       const accounts = await web3.eth.getAccounts();
  //       console.log("accounts: ",accounts[0]);
  //       const contract = new web3.eth.Contract(mintContractABI, selectedContract);

  //       const owner = await contract.methods.owner().call();
  //       console.log("Contract Owner:", owner);
  //       const artistFee = 12;
  //       // const estimatedGas = await contract.methods.safeMint(nftUrl, accounts[0], selectedCollectionId).estimateGas();
  //       // console.log(`Estimated gas for safeMint: ${estimatedGas}`);
  //       const transaction = contract.methods.safeMint(nftUrl, accounts[1], artistFee ,selectedCollectionId);
  //       console.log("transaction: ",transaction);

  //       const estimatedGasCost = await transaction.estimateGas(
  //         {
  //           from: accounts[0],
  //         }

  //       );
  //       console.log(`Estimated gas cost: ${estimatedGasCost}`);
  //       const gasLimit = estimatedGasCost // Add a 20% buffer to the estimated gas cost

  //       console.log(`Gas limit: ${gasLimit}`);
  //       const result = await transaction.send({
  //         from: accounts[0],
  //         gas: gasLimit, });
  //       console.log("result: ",result);

  //       setLoading(false);
  //       console.log('NFT Minted:', result);
  //     } catch (error) {
  //       console.error('Error minting NFT:', error);
  //     }
  //   } else {
  //     console.error('Contract or NFTDataUrl is not set');
  //   }
  // };

  // const MintNft = async (nftUrl) => {
  //   await mintNFT(nftUrl);
  //   // Any other actions after minting
  //   navigate(`/explore-collections/${selectedCollectionId}`);
  // };

  return (
    <div>
      <section className="create-artwork">
        <Header head="Create" />

        {/* this section will only be show if smart contract is not connected */}

        {/* {createArtWork ? (
          <></>
        ) : (
          <div className="create-art-popup  ">
            <h4 className="medium-head mb-4">Create New Artwork</h4>
            <p className="mb-50 text-center">
              To create a new artwork, you first need to deploy a smart
              contract.
            </p>
            <img
              src={createContract}
              alt=" createContract"
              className="img-fluid"
            />
            <p className="text-center mt-60 pt-3">
              Deploy a smart contract that you own, giving you the flexbility to
              use it anywhere across all of web3.
            </p>

            <Button
              text="Create"
              className="btn-prime text-medium-grey btn-ternary br-30 font-18 mt-60"
              width="100%"
              height="50px"
              onClick={handleCreateArtwork}
            />
          </div>
        )}
        {createArtWork ? ( */}
        {/* Loader component */}

        {showDropdown ? (
          <div className="create-artwork-content  ">
            <h4 className="medium-head">Create New Artwork</h4>

            {/* Upload file */}
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="upload-file mt-40">
                  <p className="body-large fw-bold">
                    Upload your file*
                    <span className="body-medium ms-2 text-medium-grey fw-500">
                      Required
                    </span>
                  </p>
                  <p className="body-small mt-3 text-medium-grey">
                    JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max
                    size: 75mb
                  </p>

                  {/* <ImageUpload onImageChange={handleImageChange} /> */}
                  <ImageUpload
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setImage(e.target.files[0]);
                    }}
                    name="logo"
                    value={image}
                  />

                  {/* {image && (
                <label className="medium text-black no-text-transform v-center h-center pointer change-btn">
                  Change file
                </label>
              )} */}

                  {globalErrors.image && (
                    <p
                      className="warning"
                      style={{
                        color: "red",
                      }}
                    >
                      Image is missing
                    </p>
                  )}
                </div>

                {/* preview of uploaded file */}
                <div className="preview-file upload-file mt-40">
                  <p className="body-large fw-bold">
                    Preview Image*
                    <span className="body-medium ms-2 text-medium-grey fw-500">
                      Required
                    </span>
                  </p>
                  <p className="body-small mt-3 text-medium-grey">
                    Since you've added multimedia, please provide an image (PNG,
                    JPG, or GIF) for your item's card display. Max size: 1mb
                  </p>
                  <ImageUpload
                    onChange={(e) => {
                      console.log(e.target.files[0].size / 1024 / 1024);
                      setPreviewImage(e.target.files[0]);
                    }}
                    name="featured"
                    value={previewImage}
                  />
                  {globalErrors.previewImage && (
                    <p
                      className="warning"
                      style={{
                        color: "red",
                      }}
                    >
                      Preview Image is missing
                    </p>
                  )}
                </div>

                {/* art name */}
                <div className="mt-30">
                  <InputBox
                    label="Name*"
                    subLabel="required"
                    id="inputId"
                    type="text"
                    className="custom-class"
                    placeholder="Artwork Name"
                    disabled={false}
                    optional={false}
                    maxLength={30}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                  {globalErrors.name && (
                    <p
                      className="warning"
                      style={{
                        zIndex: 1, // Set the z-index to bring it to the front
                        marginTop: "-1rem", // Adjust the position to align it properly
                        color: "red",
                      }}
                    >
                      Name is missing
                    </p>
                  )}
                </div>

                {/* Description */}

                <div className="art-name mt-40 d-flex flex-column ">
                  <label className="text-black ">
                    Description
                    {/* <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                    Required
                    </span> */}
                  </label>
                  <Textarea
                    maxLength={300}
                    placeholder="About Artwork"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setDescription(e.target.value);
                    }}
                    value={description}
                  />
                  {globalErrors.description && (
                    <p
                      className="warning"
                      style={{
                        zIndex: 1, // Set the z-index to bring it to the front
                        marginTop: "-1.5rem", // Adjust the position to align it properly
                        color: "red",
                      }}
                    >
                      Description is missing
                    </p>
                  )}
                </div>

                {/* Artist fee */}
                <div className="art-name mt-40 d-flex flex-column">
                  <label className="text-black ">Artist fee</label>
                  <div className="input-box br-20 ">
                    <Input
                      type="Number"
                      placeholder="Amount"
                      className="inputtype1"
                      value={artistFee}
                      onChange={(e) => setArtistFee(e.target.value)}
                    />
                  </div>
                  {globalErrors.artistFee && (
                    <p
                      className="warning"
                      style={{
                        color: "red",
                      }}
                    >
                      Artist fee is missing
                    </p>
                  )}
                </div>

                {/* Collection */}
                {/* <div className="art-collections">
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
                      onClick={() =>
                        {handleItemSelected(item.data.name, item.documentId)
                        console.log("contractAddess",item.data.contractAddress)
                        setSelectedContract(item.data.contractAddress)}
                      }
                    >
                      {item.data.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {globalErrors.selectedCollection && <p className="warning">Selected collection is missing</p>}
              
            </div> */}

                {/* Traits */}
                <div className="artwork-traits">
                  <p className="body-large fw-bold mt-30 d-flex justify-content-between">
                    <span>Traits</span>
                    {/* <span className="fw-normal text-underline pointer">
                Manage collections
              </span> */}
                  </p>
                  <p className="body-small text-medium-grey mt-3 ">
                    A distinguishing quality or characteristic.
                  </p>

                  <div className="add-traits d-flex flex-column">
                    {/* <div className="d-flex  add-traits-head">
                  <div className="left">
                    <label className="text-black ">Type</label>
                  </div>
                  <div className="left">
                    <label className="text-black ">name</label>
                  </div>
                </div> */}

                    {/* static */}

                    {/* <div className="d-flex mt-3 add-traits-content">
                  <div className="type left">
                    <InputBox
                      label="Type"
                      subLabel=" "
                      id="inputId"
                      type="text"
                      className="custom-class"
                      placeholder="Artwork Type"
                      disabled={false}
                      optional={false}
                      maxLength={30}
                    />
                  </div>
                  <div className="name ">
                    <InputBox
                      label="name"
                      subLabel=" "
                      id="inputId"
                      type="text"
                      className="custom-class"
                      placeholder="Artwork name"
                      disabled={false}
                      optional={false}
                      maxLength={30}
                    />
                  </div>
                  <div className="delete v-end">
                    <Button
                      width="41px"
                      height="41px"
                      className="rounded-circle btn-prime bg-white v-center h-center"
                      imageSrc={del}
                    />
                  </div>
                </div>

                <Button
                  text="Add a trait +"
                  className="btn-prime btn-secondary add-btn"
                  height="36px"
                  width="100%"
                /> */}

                    <div>
                      {traits.map((trait, index) => (
                        <div
                          key={index}
                          className="d-flex mt-3 add-traits-content"
                        >
                          <div className="type left">
                            <InputBox
                              label="Type"
                              subLabel=" "
                              id={`inputId-${index}`}
                              type="text"
                              className="custom-class"
                              placeholder="Artwork Type"
                              disabled={false}
                              optional={false}
                              maxLength={30}
                              value={trait.type}
                              onChange={(e) =>
                                handleTraitChange(index, "type", e.target.value)
                              }
                            />
                          </div>
                          <div className="name">
                            <InputBox
                              label="Name"
                              subLabel=" "
                              id={`inputId-${index}`}
                              type="text"
                              className="custom-class"
                              placeholder="Artwork Name"
                              disabled={false}
                              optional={false}
                              maxLength={30}
                              value={trait.name}
                              onChange={(e) =>
                                handleTraitChange(index, "name", e.target.value)
                              }
                            />
                          </div>
                          <div className="delete v-center">
                            <Button
                              width="41px"
                              height="41px"
                              className="rounded-circle btn-prime bg-white v-center h-center"
                              imageSrc={del}
                              onClick={() => handleDeleteTrait(index)}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        text="Add a trait +"
                        className="btn-prime btn-secondary add-btn"
                        height="36px"
                        width="100%"
                        onClick={handleAddTrait}
                      />
                    </div>
                  </div>
                  {globalErrors.traits && (
                    <p
                      className="warning"
                      style={{
                        color: "red",
                      }}
                    >
                      {" "}
                      Traits are missing
                    </p>
                  )}
                </div>

                {/* tags */}
                {/* <div className="artwork-tags">
              <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                <span>Tags</span>
              </p>
              <p className="body-small text-medium-grey mt-3 ">
                Select any number of tags that best describe your work.
              </p>
              <div className="mt-22">
                <CustomCheckBox
                  values={[
                    "3d",
                    "Animation",
                    "Phygital",
                    "3d",
                    "Animation",
                    "Phygital",
                    "3d",
                    "Animation",
                    "Phygital",
                  ]}
                  disabled={false}
                  onChange={(e) => {
                    console.log(e.target.value);
                    console.log(e.target.checked);
                  }}
                />
              </div>
            </div> */}

                <div className="artwork-tags">
                  <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                    <span>Tags</span>
                  </p>
                  <p className="body-small text-medium-grey mt-3">
                    Select any number of tags that best describe your work.
                  </p>
                  <div className="mt-22">
                    <CustomCheckBox
                      values={initialTags}
                      selectedTags={selectedTags}
                      onChange={toggleTag}
                    />
                  </div>
                  <p className="mt-4">
                    Selected Tags: {selectedTags.join(", ")}
                  </p>
                  {globalErrors.selectedTags && (
                    <p
                      className="warning"
                      style={{
                        color: "red",
                      }}
                    >
                      Selected Tags are missing
                    </p>
                  )}
                </div>

                {/* Blockchain */}
                {/* <div className="artwork-blockchain">
              <p className="body-large fw-bold mt-40 d-flex justify-content-between">
                <span>Blockchain</span>
              </p> */}
                {/* <Dropdown className="select-collection  ">
                <Dropdown.Toggle id="dropdown-basic">
                  <span>
                    <img src={sgb} alt="sgb" className="me-2" />
                    Songbird Network
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item>Solana</Dropdown.Item>
                  <Dropdown.Item>Ether</Dropdown.Item>
                  <Dropdown.Item>Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}
                {/* <Dropdown className="select-collection">
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
              {globalErrors.selectedBlockchain && <p className="warning"> Selected blockchain is missing</p>}
              
            </div> */}
                <div className="divider"></div>

                {/* Create artwork button */}

                <Button
                  text="Create ART"
                  className="btn-prime btn-primary br-30 font-18"
                  height="50px"
                  width="100%"
                  onClick={createArt}
                />
              </>
            )}
          </div>
        ) : (
          <div className="create-artwork-content  ">
            <div className="art-collections">
              <p className="body-large fw-bold mt-40 ">
                <span>Collection</span>
                <span></span>
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
                        console.log(
                          "contractAddess",
                          item.data.contractAddress
                        );
                        setSelectedContract(item.data.contractAddress);
                        location.pathname = `/create-art/${item.documentId}`;
                      }}
                    >
                      {item.data.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {globalErrors.selectedCollection && (
                <p
                  className="warning"
                  style={{
                    color: "red",
                  }}
                >
                  Selected collection is missing
                </p>
              )}
            </div>
          </div>
        )}

        {/* ) : (
          <></>
        )} */}

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

export default CreateArt;
