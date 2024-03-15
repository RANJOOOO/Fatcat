import React, { useEffect, useRef, useState } from "react";
import "../style/main.scss";
import Offcanvas from "react-bootstrap/Offcanvas";
import WallatModal from "./modal";
import logo from "../assets/icon/logo.svg";
import searchIcon from "../assets/icon/search.svg";
import hamburger from "../assets/icon/hamburger-menu.svg";
import loader from "../assets/icon/loader-medium.svg";
import arrowRightSmall from "../assets/icon/arrow-right-small.svg";
import copy from "../assets/icon/copy.svg";
import sadface from "../assets/icon/sad-face.svg";
import close from "../assets/icon/close-small.svg";
import profileImg from "../assets/images/profile-img.png";
import placeholder from "../assets/icon/profile-picture.svg";
import resultcard from "../assets/images/artwork-example-3.png";
import resultcard2 from "../assets/images/artwork-example-5.png";
import art1 from "../assets/images/artwork-example-3.png";
import art2 from "../assets/images/artwork-example-3.png";
import art3 from "../assets/images/artwork-example-5.png";
import art4 from "../assets/images/artwork-example-6.png";
import people1 from "../assets/images/face-6.png";
import people2 from "../assets/images/face-7.png";
import people3 from "../assets/images/face-8.png";
import people4 from "../assets/images/face-9.png";
import collection1 from "../assets/images/artwork-preview-1.png";
import collection2 from "../assets/images/artwork-preview-2.png";
import collection3 from "../assets/images/artwork-preview-3.png";
import collection4 from "../assets/images/artwork-preview-4.png";
import FLR from "../assets/icon/FLR.svg";
import songbird from "../assets/icon/SGB.svg";
import circleRed from "../assets/icon/circleRed.svg";
import backarrow from "../assets/icon/arrow-left-white.svg";
import star from "../assets/icon/spiked-circle/black/35px.svg";
import Button from "./button";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useNetwork } from "wagmi";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import {
  checkBalance,
  checkWSgbBalance,
} from "../contractInteraction/interaction";
import CustomCheckBox from "./shared/customTags";
import { useConnect } from "wagmi";
import { useDisconnect } from "wagmi";

import { useSwitchNetwork } from "wagmi";
import {
  getUserData,
  getAllArts,
  getCollections,
  getAllUsers,
} from "../firebase/firebase";
import { set } from "firebase/database";

const Navbar = (props) => {
  const [userData, setUserData] = useState("");
  const { address, isConnecting, isDisconnected } = useAccount();
  const getfirebasedata = async () => {
    if (address) {
      const data = await getUserData(address);
      console.log(data);
      setUserData(data);
    }
  };
  useEffect(() => {
    getfirebasedata();
  }, [address]);

  const { data, isError } = useBalance({
    address: address,
  });
  const { connect, connectors, error, pendingConnector, isLoading } =
    useConnect();
  const { disconnect } = useDisconnect();

  const { chain } = useNetwork();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();

  const [wflrs, setwflr] = useState("");
  const [wsgbs, setwsgb] = useState("");
  useEffect(() => {
    console.log(chain);
  }, [chain]);
  const checkWrappedBalance = async () => {
    if (address) {
      const wflr = await checkBalance(address);
      console.log(wflr);
      setwflr(wflr);
    }
  };
  const checkWrappedsgbBalance = async () => {
    if (address) {
      const wsgb = await checkWSgbBalance(address);
      console.log(wsgb);
      setwsgb(wsgb);
    }
  };

  useEffect(() => {
    checkWrappedBalance();
  }, [address]);
  useEffect(() => {
    checkWrappedsgbBalance();
  }, [address]);

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  // to handle search bar at small screens
  const [isVisible, setIsVisible] = useState(true);

  // handle navbar postion on scroll
  const [scrolled, setScrolled] = useState(false);

  // Handle search input values
  const [inputValue, setInputValue] = useState("");

  // handle focus of search input
  const [focused, setFocused] = useState(false);
  const [DisplayResult, setDisplayResult] = useState(false);

  // show aside-menu
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [Address, setAddress] = useState("");

  // close search bar close btn
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [networkModal, setNetworkModal] = useState(false);

  const handleNetworkModal = () => setNetworkModal(!networkModal);
  // handle asidebar menu
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // windows width
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setMobileWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [emailModal, setEmailModal] = useState(false)
  const showEmailModal = () => {
    // console.log("Test");
    setEmailModal(true)
  }


  useEffect(() => {
    if (mobileWidth < 1023) {
      setIsVisible(false);

      setFocused(true);
    } else {
      setIsVisible(true);
      console.log("not mobile");
      setFocused(false);
    }
  }, [mobileWidth]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    });
  }, []);

  useEffect(() => {
    // if (inputValue == "abstract" || inputValue == "Abstract") {
    console.log("search");
    if (inputValue) {
      setSearchResults(true);
      // setDisplayResult(true);
      setTimeout(() => {
        setDisplayResult(true);
        setSearchResults(false);
      }, 3000);
    } else {
      console.log("no search");
      setDisplayResult(false);
    }

    if (inputValue == "") {
      console.log("no search");
      setShowCloseBtn(false);
    } else {
      console.log("search");
      setShowCloseBtn(true);
    }
  }, [inputValue]);

  const cleanSearch = () => {
    console.log("clean search");
    setInputValue("");
  };
  const hideSearchBar = () => {
    console.log("hide search bar");
    setIsVisible(!isVisible);
  };

  const handleBidModal = () => {
    setShowBidModal((prev) => !prev);
  };

  const currentValues = [
    {
      token: "FLR",
      tokenVal: 101.1,
      usdVal: 3293.2,
    },
    {
      token: "WFLR",
      tokenVal: 5.67,
      usdVal: 598.4,
    },
    {
      token: "SGB",
      tokenVal: 0.0,
      usdVal: 0.0,
    },
    {
      token: "WSGB",
      tokenVal: 1.14,
      usdVal: 25102.2,
    },
  ];
  const dataA = {
    ARTWORK: [
      {
        image: art1,
        artistName: "Abstract Thoughts",
        artist: "Artist Abstract",
      },
      {
        image: art2,
        artistName: "Abstract Landscape",
        artist: "Creative Abstract",
      },
      {
        image: art3,
        artistName: "Abstract Harmony",
        artist: "Abstract Visionary",
      },
      {
        image: art4,
        artistName: "Abstract Dream",
        artist: "Abstract Explorer",
      },
    ],
    PEOPLE: [
      {
        profileImage: people1,
        username: "AbstractLover",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      },
      {
        profileImage: people2,
        username: "AbstractCreator",
        walletAddress: "0x234567890abcdef1234567890abcdef12345679",
      },
      {
        profileImage: people3,
        username: "AbstractArtisan",
        walletAddress: "0x34567890abcdef1234567890abcdef12345680",
      },
      {
        profileImage: people4,
        username: "AbstractEnthusiast",
        walletAddress: "0x4567890abcdef1234567890abcdef12345681",
      },
    ],
    COLLECTION: [
      {
        featureImage: collection1,
        name: "Abstract Expressions",
        artist: "Artist Abstract",
      },
      {
        featureImage: collection2,
        name: "Abstract Landscapes Collection",
        artist: "Creative Abstract",
      },
      {
        featureImage: collection3,
        name: "Abstract Dreams",
        artist: "Abstract Visionary",
      },
      {
        featureImage: collection4,
        name: "Abstract Harmony Collection",
        artist: "Abstract Explorer",
      },
    ],
  };

  // -------------------------------------------------
  // seacrh effects
  const [searchResults, setSearchResults] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      // Perform the search with the search term
      performSearch();
    }, 500);
    setTimeoutId(newTimeoutId);
    return () => {
      clearTimeout(newTimeoutId);
    };
  }, [inputValue]);
  const performSearch = () => {
    if (inputValue) {
      setSearchResults(true);
    } else {
      setSearchResults(false);
    }
  };

  let addressWallet = "0x873sk … 6a28aB";

  const handleCopyClick = () => {
    // Copy text to clipboard
    navigator.clipboard.writeText(address);

    // Optional: Provide user feedback
    // alert("Text copied to clipboard!");
    toast.success("Address Copied");
  };

  const navigate = useNavigate();
  const location = useLocation();
  const pathsToHideNavBar = [
    "/create-art",
    "/create-artworks",
    "/list-forSale",
    "/edit-collections",
  ];

  const shouldHideNavBar = pathsToHideNavBar.includes(location.pathname);
  const handleNavigation = (link) => {
    console.log("link", link);
    navigate(link);
    setShow(false);
    setShow2(false);
  };

  const [status, setStatus] = useState("");

  useEffect(() => {
    const test = localStorage?.getItem("catalystSigner");
    console.log("catalystSigner", test);
    setStatus(test);
  }, [localStorage?.getItem("catalystSigner")]);

  // return (
  //   <>
  //     <header
  //       className={`catalyst-navbar ${props.hide}`}
  //       style={{
  //         position: scrolled ? "sticky" : "sticky",
  //         display: shouldHideNavBar ? "none" : "",
  //       }}
  //     >
  //       {/* Navbar */}
  //       <nav
  //         className="navbar desktop-nav"
  //         style={{
  //           paddingTop: scrolled ? "16px" : "24px",
  //           paddingBottom: scrolled ? "16px" : "24px",
  //         }}
  //       >

  const [collectedArts, setCollectedArts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredArts, setFilteredArts] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // setFilteredArts(collectedArts);
    setFilteredCollections(collections);
    setFilteredUsers(users);
  }, [collectedArts, collections, users]);

  const fetchData = async () => {
    const userslist = await getAllUsers();
    console.log("Users Data: ", userslist);
    console.log("Users Data length: ", userslist?.length);
    setUsers(userslist);
  };

  const getUserCollections = async () => {
    const usercollections = await getCollections();
    const filterCollection = usercollections?.filter(
      (item) => item?.data?.isWhiteList === true
    );
    console.log("All Collection: ", filterCollection);
    setCollections(filterCollection);
  };

  const fetchAllArt = async () => {
    const allArts = await getAllArts();
    console.log("All Arts", allArts);
    const filterArts = allArts?.filter(
      (item) => item?.data?.isMinted === false
    );
    setCollectedArts(filterArts);
  };

  useEffect(() => {
    fetchData();
    getUserCollections();
    fetchAllArt();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const inputRef = useRef(null);
  // const otherElementRef = useRef(null);

  // const handleInputChange = (e) => {
  //   setInputValue(e.target.value);
  //   console.log("inputValue", inputValue);
  //   setFocused(true);
  // };

  // const handleClickOutside1 = (e) => {
  //   if (
  //     otherElementRef.current &&
  //     !otherElementRef.current.contains(e.target)
  //   ) {
  //     console.log("You clicked outside of me! 1");
  //     // setFocused(false);
  //   }
  // };
  // const handleClickOutside2 = (e) => {
  //   if (inputRef.current && !inputRef.current.contains(e.target)) {
  //     console.log("You clicked outside of me! 2");
  //     setFocused(false);
  //   }
  // };

  // // useEffect(() => {
  // //   document.addEventListener("click", handleClickOutside1);

  // //   return () => {
  // //     document.removeEventListener("click", handleClickOutside1);
  // //   };
  // // }, []);
  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside2);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside2);
  //   };
  // }, []);

  useEffect(() => {
    if (users) searchFilter();
  }, [inputValue, users]);

  const searchFilter = () => {
    console.log("inputValue", inputValue);
    console.log("collectedArts", collectedArts);
    console.log("collections", collections);
    console.log("users", users);
    if (inputValue) {
      const filteredArts = collectedArts?.filter(
        (item) =>
          item?.data?.name?.toLowerCase().includes(inputValue?.toLowerCase()) ||
          item?.data?.artistName
            ?.toLowerCase()
            .includes(inputValue?.toLowerCase())
      );
      const filteredCollections = collections?.filter(
        (item) =>
          item?.data?.name?.toLowerCase().includes(inputValue?.toLowerCase()) ||
          item?.documentId === inputValue
      );
      const filteredUsers = users?.filter(
        (item) =>
          item?.userName?.toLowerCase().includes(inputValue?.toLowerCase()) ||
          item?.id === inputValue
      );
      console.log("filteredArts", filteredArts);
      console.log("filteredCollections", filteredCollections);
      console.log("filteredUsers", filteredUsers);
      setFilteredArts(filteredArts);
      setFilteredCollections(filteredCollections);
      setFilteredUsers(filteredUsers);
    } else {
      setFilteredArts(collectedArts);
      setFilteredCollections(collections);
      setFilteredUsers(users);
    }
  };

  const initialTags = [
    "3D",
    "Abstract",
    "Generative",
    "Animation",
    "Surreal",
    "Illustration",
    "Surrealism",
    "AI",
    "Painting",
    "Photography",
    "Portrait",
    "Psychedelic",
    "Digital Art",
    "Fantasy",
    "Landscape",
    "Audio",
    "Nature",
    "Drawing",
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

  const searchCategoryFilter = () => {
    console.log("category", selectedTags);

    if (selectedTags.length > 0) {
      // Check if the item belongs to any selected category
      const filteredArts = collectedArts?.filter((item) => {
        const categories = item?.data?.selectedTags || [];
        const categoryMatches = selectedTags?.every((searchCategory) =>
          categories.includes(searchCategory)
        );
        return categoryMatches;
      });
      console.log("filteredArts", filteredArts);
      setFilteredArts(filteredArts);
    } else {
      // If no tags are selected, show all arts
      setFilteredArts(collectedArts);
    }
  };

  useEffect(() => {
    searchCategoryFilter();
  }, [selectedTags]);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const inputRef = useRef(null);
  const otherElementRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setFocused(true);
  };

  const handleClickOutside = (e) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      otherElementRef.current &&
      !otherElementRef.current.contains(e.target)
    ) {
      setFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (dropdownVisible) {
      setInputValue("");
    }
    setDropdownVisible(!dropdownVisible);
    setFocused(!focused);
  };

  useEffect(() => {
    console.log("dropdownVisible", dropdownVisible);
    console.log("filteredArts", filteredArts);
    console.log("filteredCollections", filteredCollections);
    console.log("filteredUsers", filteredUsers);
  }, [dropdownVisible, filteredArts, filteredCollections, filteredUsers]);

  return (
    <>
      <header
        className={`catalyst-navbar ${props.hide}`}
        style={{
          position: scrolled ? "fixed" : "relative", // Change to "fixed" or "relative" based on your requirements
          display: shouldHideNavBar ? "none" : "",
          top: 0, // Add top property for fixed position
          left: 0, // Add left property for fixed position
          width: "100%", // Add width property for fixed position
          // zIndex: 1000, // Add zIndex property for fixed position
        }}
      >
        {/* Navbar */}
        <nav
          className="navbar desktop-nav"
          style={{
            paddingTop: scrolled ? "16px" : "24px",
            paddingBottom: scrolled ? "16px" : "24px",
          }}
        >
          <div
            className={
              focused ? " back-layers show-layer" : "back-layers hide-layer"
            }
          ></div>
          <div
            className="mobile-search-icon icon-shadow"
            onClick={hideSearchBar}
          >
            <img src={searchIcon} alt="search" />
          </div>
          <div className="left d-flex">
            {/* site logo */}

            <Link to="/" className="site-logo">
              <img src={logo} alt="fat cats logo" />
            </Link>

            <div
              // className=" site-search "
              className="site-search"
              style={{
                // display: isVisible ? "flex" : "none",
                transform: `translateX(${isVisible ? "0" : "-1200px"})`,
              }}
            >
              {/* arrow to hide search bar for mobile */}

              <div className="back-search" onClick={hideSearchBar}>
                <img src={backarrow} alt="back" />
              </div>

              {/* Search bar */}
              <div className="search-form">
                <img src={searchIcon} alt="search" className="search-icon" />
                {/* <input
                  type="text"
                  placeholder="Search art, artists & categories…"
                  style={{ transform: "10px" }}
                  value={inputValue}
                  maxLength="26"
                  onChange={handleInputChange}
                  onFocus={() => {
                    setFocused(true);
                  }}
                  
                  // onBlur={() => {
                  //   setFocused(false);
                  // }}
                /> */}

                <input
                  type="text"
                  placeholder="Search art, artists & categories…"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => {
                    toggleDropdown();
                  }}
                  ref={inputRef}
                />
                {showCloseBtn ? (
                  <span
                    className="close-button cursor-pointer"
                    onClick={() => cleanSearch}
                  >
                    <img
                      src={close}
                      alt="close"
                      onClick={() => toggleDropdown()}
                    />
                  </span>
                ) : (
                  <></>
                )}
                {/* Search-bar Categories */}

                {/* When you focus search-bar */}

                <div
                  // className="search-catergories"
                  className={
                    "search-catergories " +
                    (focused ? "scrollable-container" : "")
                  }
                  id="myDropdown"
                  style={{ display: focused ? "block" : "none" }}
                  ref={otherElementRef}
                >
                  {/* Firstly categories will be shown static */}
                  {inputValue.length > 0 ? (
                    <>
                      {/* When user search something */}
                      {dropdownVisible &&
                        (filteredArts?.length !== 0 ||
                          filteredCollections?.length !== 0 ||
                          filteredUsers?.length !== 0) ? (
                        <>
                          {/* Search Result If found */}
                          {/* artwork */}
                          <div className="searchbar-result artwork ">
                            <div className="result-box">
                              <div className="result-box-head">
                                <p className="body-medium">
                                  <span>
                                    Artwork ({filteredArts?.length} results)
                                  </span>
                                  <span>
                                    <button
                                      className="button"
                                      onClick={() => {
                                        navigate("/drops", {
                                          state: { tab: "drops" },
                                        });
                                        toggleDropdown();
                                      }}
                                    >
                                      See more
                                      <img src={arrowRightSmall} alt="right" />
                                    </button>
                                  </span>
                                </p>
                              </div>
                              <div className="result-box-content">
                                {filteredArts?.map((item, index) => {
                                  return (
                                    <div
                                      className="result-card"
                                      key={index}
                                      onClick={() => {
                                        navigate("/drops");
                                        toggleDropdown();
                                      }}
                                    >
                                      <div className="left">
                                        <img
                                          src={item?.data?.image}
                                          alt=""
                                          className="img-63"
                                        />
                                      </div>
                                      <div
                                        // className="right"
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <p
                                          // className="body-medium text-grey"
                                          className="body-medium"
                                          style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            width: "60%",
                                            display: "block",
                                          }}
                                        >
                                          {item?.data?.name}
                                        </p>
                                        <p
                                          // className="text-grey"
                                          className="body-medium"
                                          style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            width: "100%",
                                            display: "block",
                                          }}
                                        >
                                          @{item?.data?.artistName}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* people */}
                          <div className="searchbar-result people ">
                            <div className="result-box">
                              <div className="result-box-head">
                                <p className="body-medium">
                                  <span>
                                    People ({filteredUsers?.length} results)
                                  </span>

                                  <span>
                                    {/* See more
                                    <img src={arrowRightSmall} alt="right" /> */}
                                  </span>
                                </p>
                              </div>
                              <div className="result-box-content">
                                {filteredUsers?.map((item, index) => {
                                  return (
                                    <div
                                      className="result-card"
                                      key={index}
                                      onClick={() => {
                                        navigate(`/profile/${item?.userName}`);
                                        toggleDropdown();
                                      }}
                                    >
                                      <div className="left">
                                        <img
                                          src={
                                            item?.image ? item?.image : people1
                                          }
                                          alt=""
                                          className="img-63"
                                        />
                                      </div>
                                      <div
                                        // className="right"
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <p className="body-medium">
                                          {item?.userName}
                                        </p>
                                        {/* <p>{item.walletAddress}</p> */}
                                        <p>
                                          {item?.id?.slice(0, 4)}...
                                          {item?.id?.slice(-4)}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Collection */}
                          <div className="searchbar-result collection ">
                            <div className="result-box">
                              <div className="result-box-head">
                                <p className="body-medium">
                                  <span>
                                    Collection ({filteredCollections?.length}{" "}
                                    results)
                                  </span>
                                  <span>
                                    <button
                                      className="button"
                                      onClick={() => {
                                        navigate("/allcollections");
                                        toggleDropdown();
                                      }}
                                    >
                                      See more
                                      <img src={arrowRightSmall} alt="right" />
                                    </button>
                                  </span>
                                </p>
                              </div>
                              <div className="result-box-content">
                                {filteredCollections?.map((item, index) => {
                                  return (
                                    <div
                                      className="result-card"
                                      key={index}
                                      onClick={() => {
                                        navigate(
                                          `/explore-collections/${item?.documentId}`
                                        );
                                        toggleDropdown();
                                      }}
                                    >
                                      <div className="left">
                                        <img
                                          src={
                                            item?.data?.image
                                              ? item?.data?.image
                                              : collection1
                                          }
                                          alt=""
                                          className="img-63"
                                        />
                                      </div>
                                      <div
                                        // className="right"
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <p className="body-medium">
                                          {item?.data?.name}
                                        </p>
                                        {/* <p>@{item.artist}</p> */}
                                        <p>
                                          {item?.data?.contractAddress?.slice(
                                            0,
                                            4
                                          )}
                                          ...
                                          {item?.data?.contractAddress?.slice(
                                            -4
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="browsing-category">
                          {/* When we type some thing in search bar ite, browsing will be shown */}

                          <>
                            {/* {searchResults ? (
                              <div className="Searching">
                                <img
                                  src={loader}
                                  alt="loading"
                                  className="rotate-360"
                                />
                                <p className="medium-body">
                                  Searching for <span>" {inputValue} "</span>
                                </p>
                              </div>
                            ) : ( */}
                            {/* // if nothing found */}
                            {/* {(!searchResults || */}
                            {filteredArts?.length === 0 &&
                              filteredCollections?.length === 0 &&
                              filteredUsers?.length === 0 && (
                                <div className="noResults">
                                  <img src={sadface} alt="loading" />
                                  <p className="medium-body">
                                    Sorry, no results for
                                    <span>" {inputValue} "</span>
                                  </p>
                                </div>
                              )}
                          </>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className={
                          focused ? "category-opt" : "category-opt d-nones"
                        }
                      >
                        <CustomCheckBox
                          values={initialTags}
                          selectedTags={selectedTags}
                          onChange={toggleTag}
                        />
                      </div>
                      {/* <div
                        className="searchbar-result artwork "
                        style={{
                          paddingTop: "5px",
                        }}
                      >
                        <div className="result-box">
                          <div className="result-box-head">
                            <p className="body-medium">
                              <span>
                                Artwork ({filteredArts?.length} results)
                              </span>
                              <span>
                                <button
                                  className="button"
                                  onClick={() => {
                                    navigate("/drops");
                                    toggleDropdown();
                                  }}
                                >
                                  See more
                                  <img src={arrowRightSmall} alt="right" />
                                </button>
                              </span>
                            </p>
                          </div>
                          <div className="result-box-content">
                            {filteredArts?.map((item, index) => {
                              return (
                                <div
                                  className="result-card"
                                  key={index}
                                  onClick={() => {
                                    navigate("/drops");
                                    toggleDropdown();
                                  }}
                                >
                                  <div className="left">
                                    <img
                                      src={item?.data?.image}
                                      alt=""
                                      className="img-63"
                                    />
                                  </div>
                                  <div
                                    // className="right"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <p
                                      // className="body-medium text-grey"
                                      className="body-medium"
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        width: "60%",
                                        display: "block",
                                      }}
                                    >
                                      {item?.data?.name}
                                    </p>
                                    <p
                                      // className="text-grey"
                                      className="body-medium"
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        width: "100%",
                                        display: "block",
                                      }}
                                    >
                                      @{item?.data?.artistName}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div> */}
                    </>
                    // <div
                    //   className={
                    //     focused ? "category-opt" : "category-opt d-nones"
                    //   }
                    // ></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="right">
            {/* Nav Links */}

            <ul className="navbar-nav ">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="explore"
                >
                  Art
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="explore"
                  state={{ tab: "drops" }}
                >
                  Drops
                </Link>
              </li>
              <li className="nav-item">
                {/* <Link className="nav-link" to="/allcollections">
                  PFPs
                </Link> */}
                <Link className="nav-link" to="/">
                  Gallery
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link " to="/blogs">
                  Spotlight
                </Link>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link " href="#">
                  Gallery
                </a>
              </li> */}

              {/* if login, show img profile else Sign In btn */}

              <div className="logins ">
                <div
                  className="mobile-menu-btn icon-shadow"
                  onClick={handleShow}
                >
                  <img src={hamburger} alt="hamburger" />
                </div>

                {address && status ? (
                  // remove className "no-after" when there is no notifications
                  <div
                    className="login-profile icon-shadow no-after"
                    // data-bs-toggle="offcanvas"
                    // data-bs-target="#offcanvasRight"
                    // aria-controls="offcanvasRight"
                    onClick={handleShow2}
                  >
                    <img
                      src={userData?.image ? userData?.image : placeholder}
                      alt="profile-img"
                    />
                  </div>
                ) : (
                  address ? <div className="sign-btn">
                    <Button
                      text="Sign In"
                      className="btn-prime btn-primary btn-primaryA nav-btn hide-on-768"
                      onClick={showEmailModal}
                    />
                  </div> :
                    <div className="sign-btn">
                      <Button
                        text="Sign In"
                        className="btn-prime btn-primary btn-primaryA nav-btn hide-on-768"
                        onClick={handleBidModal}
                      />
                    </div>
                )}

                {/* or */}
              </div>
            </ul>
          </div>
          {/*Profile Asidebar menu offcanvas if user is connected  */}

          {/* Navbar navlinks offcanvas */}
          <Offcanvas
            show={show2}
            onHide={handleClose2}
            className="catalyst-sidebar "
            placement="end"
          >
            <Offcanvas.Header>
              <div className="hide-desktop"></div>
              <label id="offcanvasRightLabel" className="medium">
                ACCOUNT
              </label>
              <button
                type="button"
                className="btn-close text-reset"
                onClick={handleClose2}
              ></button>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ul>
                <li className="pointer">
                  <a onClick={() => handleNavigation("/profile")}>Profile</a>
                </li>
                <li className="pointer">
                  <a onClick={() => handleNavigation("/Create-collections")}>
                    Create Collection
                  </a>
                </li>
                {/* <li className="pointer">
                  <a onClick={() => handleNavigation("/allcollections")}>
                    All Collections
                  </a>
                </li> */}
                <li className="pointer">
                  <a onClick={() => handleNavigation("/notification")}>
                    Notifications
                  </a>
                </li>
                <li className="pointer">
                  <a onClick={() => handleNavigation("/account-settings")}>
                    Settings
                  </a>
                </li>
                <li className="pointer">
                  <a
                    // onClick={() => {
                    //   // setDisconnect(true);
                    //   // setShow(false);
                    //   // setShow2(false);
                    //   // localStorage.setItem("fatcatdisconnect", "true");
                    //   // setAddress("");
                    //   disconnect();
                    // }}
                    onClick={() => {
                      disconnect();
                      setShow(false);
                      setShow2(false);
                      localStorage.removeItem("catalystSigner");
                    }}
                  >
                    Sign out
                  </a>
                </li>
              </ul>

              {/* Connected wallet address */}

              <div className="wallet-address">
                <p className="body-medium">
                  WALLET
                  <span>
                    <img src={copy} alt="copy" onClick={handleCopyClick} />
                    {/* {addressWallet} */}
                    {address &&
                      address?.slice(0, 5) +
                      "..." +
                      address?.slice(address?.length - 6, address?.length)}
                  </span>
                </p>
              </div>
              <div className="network-message">
                {/* {chain && <div>Connected to {chain?.name}</div>} */}
                <label
                  className="wrong-network br-30 text-black fw-normal medium v-center pointer "
                  onClick={() => {
                    if (chain?.name == "Flare Mainnet") {
                      handleNetworkModal();
                    } else if (chain?.name == "Songbird Mainnet") {
                      handleNetworkModal();
                    } else {
                      handleNetworkModal();
                    }
                  }}
                >
                  {chain?.unsupported ? (
                    <>
                      <img src={circleRed} alt="error" className="me-2" />
                      Wrong Network
                    </>
                  ) : (
                    chain?.name
                  )}
                </label>
              </div>

              {/* token values */}
              <div className="t-values">
                <div className="cur-val">
                  <div className="left">
                    <p className="body-medium">
                      {/* {item.token} */}
                      {data?.symbol}
                      <span>{data?.formatted}</span>
                    </p>
                  </div>
                  <div className="center"></div>
                  <div className="right">
                    <p className="body-medium">
                      USD
                      <span>$0</span>
                    </p>
                  </div>
                </div>
                <div className="cur-val">
                  <div className="left">
                    <p className="body-medium text-uppercase">
                      {/* {item.token} */}
                      wflr
                      <span>{wflrs}</span>
                    </p>
                  </div>
                  <div className="center"></div>
                  <div className="right">
                    <p className="body-medium">
                      USD
                      <span>$0</span>
                    </p>
                  </div>
                </div>
                <div className="cur-val">
                  <div className="left">
                    <p className="body-medium text-uppercase">
                      {/* {item.token} */}
                      wsgb
                      <span>{wsgbs}</span>
                    </p>
                  </div>
                  <div className="center"></div>
                  <div className="right">
                    <p className="body-medium">
                      USD
                      <span>$0</span>
                    </p>
                  </div>
                </div>

                {/* {currentValues.map((item, index) => {
                  return (
                    <div className="cur-val" key={index}>
                      <div className="left">
                        <p className="body-medium">
                          {item.token}
                          <span>{item.tokenVal}k</span>
                        </p>
                      </div>
                      <div className="center"></div>
                      <div className="right">
                        <p className="body-medium">
                          USD
                          <span>${item.usdVal}</span>
                        </p>
                      </div>
                    </div>
                  );
                })} */}
              </div>
            </Offcanvas.Body>
          </Offcanvas>

          <Offcanvas
            show={show}
            onHide={handleClose}
            className="mobile-navcanvas"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <label className="medium w-100 text-center">MENU</label>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="site-logo text-center">
                <img src={logo} alt="logo" onClick={() => navigate("/")} />
                <img src={star} alt="star" />
              </div>

              <div className="mobile-nav-links">
                <ul>
                  <li>
                    <a onClick={() => handleNavigation("/explore")}>
                      Explore Art
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handleNavigation("/drops")}>
                      Explore Drops
                    </a>
                  </li>

                  <li>
                    <a onClick={() => handleNavigation("/explore")}>
                      Explore PFPs
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handleNavigation("/blogs")}>Spotlight</a>
                  </li>
                  {/* <li>
                    <a href="#">Gallery</a>
                  </li> */}
                </ul>

                <ul>
                  <li>
                    <a onClick={() => handleNavigation("/stats")}>
                      Trending Artists
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handleNavigation("/stats")}>
                      New Artists
                    </a>
                  </li>
                  <li>
                    <a href="#">Live Auctions</a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <a href="#">Discord</a>
                  </li>
                  <li>
                    <a href="#">Twitter</a>
                  </li>
                </ul>
              </div>

              {address ? (
                <></>
              ) : (
                <div
                  className="sign-btn hide-after-mobile768"
                  onClick={handleBidModal}
                  text="Sign In"
                />
              )}
            </Offcanvas.Body>
          </Offcanvas>
        </nav >
      </header >
      <WallatModal
        show={showBidModal}
        handleModal={handleBidModal}
        handleEmail={emailModal}
        handleEmailSet={setEmailModal}
      // disconnect={disconnect}
      />
      {/* switch network */}
      <Modal
        show={networkModal}
        onHide={handleNetworkModal}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              switch network
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="buy-now-modal w-431 m-auto  ">
            <p className="mt-5 text-center">
              This app does not support the current connected network.
              <strong> Switch </strong>
              networks or <strong> disconnect</strong> to continue.
            </p>
            <div className="network-btns v-center h-center gap-4 mt-5">
              {chains.map((x, index) => (
                <Button
                  disabled={!switchNetwork || x.id === chain?.id}
                  key={x.id}
                  onClick={() => switchNetwork?.(x.id)}
                  text={x?.name}
                  className="btn-prime rounded border-0"
                  width="156px"
                  height="63px"
                  imageSrc={index % 2 == 0 ? FLR : songbird}
                  imageClassName="me-2"
                >
                  {isLoading && pendingChainId === x.id && " (switching)"}
                </Button>
              ))}

              <div>{error && error.message}</div>
              {/* <Button
                text="Flare"
                className="btn-prime rounded border-0"
                width="156px"
                height="63px"
                onClick={(e) => toast("Flare network Selected")}
                imageSrc={FLR}
                imageClassName="me-2"
              />
              <Button
                text="Songbird"
                className="btn-prime rounded border-0"
                width="156px"
                height="63px"
                onClick={(e) => toast("Songbird network Selected")}
                imageSrc={songbird}
                imageClassName="me-2"
              /> */}
            </div>
            <div className="v-center h-center gap-3 mt-5 w-100">
              <Button
                text="Disconnect"
                className="btn-prime btn-secondary"
                width="156px"
                height="36px"
                onClick={() => {
                  disconnect();
                  handleNetworkModal();
                  setShow2(false);
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
