import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import Button from "../button";
import Accordion from "react-bootstrap/Accordion";
import userProfile from "../../assets/images/face-3.png";
import art1 from "../../assets/images/artwork-example-5.png";
import art from "../../assets/images/artwork-example-4.png";
import Esc from "../../assets/images/Esc.png";
import like from "../../assets/icon/likes-large.svg";
import FLR from "../../assets/icon/FLR.svg";
import songbird from "../../assets/icon/SGB.svg";
import option from "../../assets/icon/more-horizontal.svg";
import offer from "../../assets/icon/sold.svg";
import offerMade from "../../assets/icon/offer-made.svg";
import listed from "../../assets/icon/list-for-sale.svg";
import minted from "../../assets/icon/favicon-24px.svg";
import arrow from "../../assets/icon/arrow-angle-right-grey.svg";
import verified from "../../assets/icon/verified-artist.svg";
import wallet from "../../assets/icon/wallet.svg";
import error from "../../assets/icon/close-small.svg";
import loader from "../../assets/icon/loader-small-white.svg";
import refresh from "../../assets/icon/refresh-metadata-white.svg";
import tick from "../../assets/icon/tick-small-white.svg";
import Modal from "react-bootstrap/Modal";
import Input from "../inputs";
import { toast } from "react-toastify";
import Dropdown from "../shared/dropdown";
import ArtistPopUp from "../shared/artistpopup";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../customHooks/scrollToTop";
import UserProfile from "../shared/userProfile";

const SingleArt = () => {
  useScrollToTop();
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

  const [activeCollection, setActiveCollection] =
    useState("Recently collected");
  const [offerPrice, setOfferPrice] = useState(null);

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

  return (
    <div>
      <div className="single-artwork site-container hide-on-mobile">
        <div className="left-content">
          {/* <p className="total-likes body-medium">
            <img src={like} alt="like" />
            352
          </p> */}

          <div className="collection-name v-center">
            <label
              className="medium fw-bold text-black no-text-transform v-center pointer hover-underline "
              onClick={() => navigate("/explore-collections")}
            >
              Collection Name
              <img
                src={verified}
                alt="verify"
                className="img-18 img-fluid ms-2"
              />
            </label>

            <label className="no-text-transform br-30">Flare</label>
            {/* <label>erce 1155</label> */}
          </div>
          <h4>This Is Much Longer Artwork Name Test</h4>

          <div className="artist-owner">
            <UserProfile status={"artist"} />
            <UserProfile status={"owner"} />
          </div>

          <div className="divider"></div>

          <div className="list-price">
            <label className="medium text-grey no-text-transform fw-normal pb-2">
              List price
            </label>
            <div className="value v-end ">
              <span className="v-center">
                <img src={FLR} alt="flr" />
                <h6 className="font-normal">320,000</h6>
              </span>
              <p className="body-medium mb--2">
                FLR
                <span className="text-medium-grey ms-1">($230)</span>
              </p>
            </div>
            {/* If not listed for sale, remove ‘buy now’ button and show full width ‘Make an offer’ button: */}

            <div className="art-btns d-flex justify-content-between">
              <Button
                text="Buy now"
                className="btn-prime btn-primary"
                width="176px"
                height="36px"
                onClick={handleBuyArtModal}
              />
              <Button
                text="Make an offer"
                className="btn-prime btn-secodary bg-white"
                width="176px"
                height="36px"
                // onClick={handleArtTransfer}
                onClick={handleOfferModal}
              />
              <div className="more-opt cursor-pointer dropdown ">
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
            <div className="art-btns d-flex gap-3">
              <Button
                text="List for sale"
                className="btn-prime btn-primary"
                width="176px"
                height="36px"
                onClick={handleBuyArtModal}
              />
              <div className="more-opt cursor-pointer dropdown ">
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
            <div className="art-btns d-flex gap-3">
              <Button
                text="Edit listing"
                className="btn-prime btn-primary"
                width="176px"
                height="36px"
                onClick={handleEditListModal}
              />
              <div className="more-opt cursor-pointer dropdown ">
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

            {/* If item is listed as Live Auction: */}
            {/* <div className="live-auctions mt-5  ">
              <p className="fw-regular text-uppercase body-medium bg-black text-white px-2 py-1 br-30">
                reserve met
              </p>
              <label className="fw-normal medium">Auction ends in</label>
              <div className="timer">
                <h4 className="mt-2">00:11:19:41</h4>
                <div className="d-flex flex-end mt-2 ">
                  <img
                    src={art1}
                    alt=""
                    className="img-35 rounded-circle me-4 mt-1"
                  />
                  <div>
                    <div className="input-box2 v-center">
                      <input type="text" placeholder="0.275" />
                      <Button
                        text="Submit bid"
                        className="btn-prime border-0 btn-ternery"
                        width="90px"
                        height="36px"
                        onClick={handleBidModal}
                      />
                    </div>
                    <label className="small fw-normal">Your Balance</label>
                    <br />
                    <label className="small fw-normal no-text-transform">
                      You don't have enough ETH to bid
                      <br />
                      <span>Learn how auctions work</span>
                    </label>
                    <br />
                    <label className="text-black no-text-transform fw-500">
                      Minimum Bid 0.275
                    </label>
                  </div>
                </div>
                <div className="d-flex flex-end mt-5 ">
                  <img
                    src={art1}
                    alt=""
                    className="img-35 rounded-circle me-4 mt-1"
                  />
                  <div>
                    <label className="small no-text-transform fw-normal">
                      <span className="fw-500 text-black">@User4 </span>
                      met the reserve price with a bid of 0.250, 24 hour auction
                      started
                    </label>
                    <label className="small fw-normal">
                          JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                      <img src={arrow} alt="arrow" className="ms-2 img-9" />
                    </label>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="history ">
            <h5 className="fw-bold no-text-transform">History</h5>
            <div className="history-content">
              {/* sold */}
              <div className="histrory-list">
                <div className="left img-24 v-center justify-content-center">
                  <img src={offer} alt="offer" className="img-14" />
                </div>
                <div className="right">
                  <p className="body-medium ">
                    <span className="position-relative show-artist-popup">
                      @user4
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                      />
                    </span>{" "}
                    sold this item to{" "}
                    <span className="position-relative show-artist-popup">
                      @user4
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
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
              </div>

              {/* offer */}
              <div className="histrory-list">
                <div className="left img-24 v-center justify-content-center">
                  <img src={offerMade} alt="offer" className="img-14" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    <span className="position-relative show-artist-popup">
                      @user4
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                      />
                    </span>{" "}
                    made an offer of 2300 FLR
                  </p>
                  <label className="small pointer hover-underline pointer hover-underline">
                    JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                  </label>
                </div>
              </div>

              {/* listed */}
              <div className="histrory-list ">
                <div className="left img-24 v-center justify-content-center">
                  <img src={listed} alt="offer" className="img-14" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    Listed by{" "}
                    <span className="position-relative show-artist-popup">
                      @user4
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
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

              {/* mindted */}
              <div className="histrory-list active">
                <div className="left ">
                  <img src={minted} alt="offer" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    Minted by{" "}
                    <span className="position-relative show-artist-popup">
                      @user4
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
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
            </div>
          </div>
        </div>

        <div className="right-content">
          <div className="art-banner no-border">
            <img
              src={art1}
              alt="artwork"
              className="img-100 pointer"
              onClick={toggleFullScreen}
            />
            <img src={like} alt="artwork" className="like-btn" />
          </div>
          <div className="artwork-details ">
            <Accordion defaultActiveKey={["0", "1", "2", "3"]} alwaysOpen>
              {/* Description  */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <p className="h-64 body-medium text-uppercase  fw-bold text-se  v-center cursor-pointer">
                    Description
                  </p>
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    A vibrant burst of scarlet hues dominates this abstract
                    artwork, its fiery intensity igniting the canvas.
                    Intersecting strokes create a chaotic dance, evoking raw
                    emotion and passion. The piece radiates an untamed energy,
                    blurring the line between chaos and beauty.
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
                    </div>
                    <div className="trait-box">
                      <label className="small">trait name</label>
                      <p className="body-medium fw-bold">Trait valuee…</p>
                    </div>
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
                    <label className="medium">contract address</label>
                    <label className="medium text-black text-underline no-text-transform">
                      0x0e52…f93b
                    </label>
                  </div>
                  <div className="details">
                    <label className="medium">token standard </label>
                    <label className="medium text-black   ">Erc-721</label>
                  </div>
                  <div className="details">
                    <label className="medium">BLOCKCHAIN </label>
                    <label className="medium text-black no-text-transform">
                      Flare Network
                    </label>
                  </div>
                  <div className="details">
                    <label className="medium">Creator Earnings </label>
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
                  <div className="tags">
                    <div className="tag-box">#trippy</div>
                    <div className="tag-box">#abstract</div>
                    <div className="tag-box">#art</div>{" "}
                    <div className="tag-box">#trippy</div>
                    <div className="tag-box">#abstract</div>
                    <div className="tag-box">#art</div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        <p></p>
      </div>

      <div className="single-artwork site-container hide-on-desktop">
        <div className="right-content">
          <div className="art-banner">
            <img src={art1} alt="artwork" className="img-100" />
            <img src={like} alt="artwork" className="like-btn" />
          </div>
        </div>

        <div className="left-content">
          {/* <p className="total-likes body-medium">
            <img src={like} alt="like" />
            352
          </p> */}

          <div className="collection-name v-center">
            <label
              className="medium fw-bold text-black no-text-transform v-center pointer hover-underline"
              onClick={() => navigate("/explore-collections")}
            >
              Collection Name
              <img
                src={verified}
                alt="verify"
                className="img-18 img-fluid ms-2"
              />
            </label>

            <label className="no-text-transform br-30">Flare</label>
            {/* <label>erce 1155</label> */}
          </div>
          <h4>artwork name</h4>

          <div className="artist-owner">
            <div className="v-center me-5">
              <div className="user-img ">
                <img
                  src={userProfile}
                  alt="profile image"
                  className="img-100"
                />
              </div>

              <div className="user-name d-flex flex-column">
                <label className="medium fw-normal text-capitalize">
                  Artist
                </label>
                <label className="small text-black no-text-transform">
                  @artistsName
                </label>
              </div>
            </div>

            <div className="v-center">
              <div className="user-img ">
                <img
                  src={userProfile}
                  alt="profile image"
                  className="img-100"
                />
              </div>

              <div className="user-name d-flex flex-column">
                <label className="medium fw-normal text-capitalize">
                  Owner
                </label>
                <label className="small text-black no-text-transform">
                  @artistsOwner
                </label>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="list-price">
            <label className="medium text-grey no-text-transform fw-normal pb-2">
              List price
            </label>
            <div className="value v-center">
              <img src={FLR} alt="flr" />
              <h6 className="font-normal">320,000</h6>
              <p className="body-medium">
                FLR
                <span className="text-medium-grey ms-1">($230)</span>
              </p>
            </div>
            {/* If not listed for sale, remove ‘buy now’ button and show full width ‘Make an offer’ button: */}

            <div className="art-btns d-flex justify-content-between">
              <Button
                text="Buy now"
                className="btn-prime btn-primary"
                width="176px"
                height="36px"
                onClick={handleBuyArtModal}
              />
              <Button
                text="Make an offer"
                className="btn-prime btn-secodary bg-white"
                width="176px"
                height="36px"
                // onClick={handleArtTransfer}
                onClick={handleOfferModal}
              />
              <div className="more-opt cursor-pointer dropdown ">
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
            <div className="art-btns d-flex gap-3">
              <Button
                text="List for sale"
                className="btn-prime btn-primary"
                width="176px"
                height="36px"
                onClick={handleBuyArtModal}
              />
              <div className="more-opt cursor-pointer dropdown ">
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
            <div className="art-btns d-flex gap-3">
              <Button
                text="Edit listing"
                className="btn-prime btn-primary"
                width="176px"
                height="36px"
                onClick={handleEditListModal}
              />
              <div className="more-opt cursor-pointer dropdown ">
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

            {/* If item is listed as Live Auction: */}
            {/* <div className="live-auctions mt-5">
              <p className="fw-regular text-uppercase body-medium bg-black text-white px-2 py-1 br-30">
                reserve met
              </p>
              <label className="fw-normal medium">Auction ends in</label>
              <div className="timer">
                <h4 className="mt-2">00:11:19:41</h4>
                <div className="d-flex flex-end mt-2 ">
                  <img
                    src={art1}
                    alt=""
                    className="img-35 rounded-circle me-4 mt-1"
                  />
                  <div>
                    <div className="input-box2 v-center">
                      <input type="text" placeholder="0.275" />
                      <Button
                        text="Submit bid"
                        className="btn-prime border-0 btn-ternery"
                        width="90px"
                        height="36px"
                        onClick={handleBidModal}
                      />
                    </div>
                    <label className="small fw-normal">Your Balance</label>
                    <br />
                    <label className="small fw-normal no-text-transform">
                      You don't have enough ETH to bid
                      <br />
                      <span>Learn how auctions work</span>
                    </label>
                    <br />
                    <label className="text-black no-text-transform fw-500">
                      Minimum Bid 0.275
                    </label>
                  </div>
                </div>
                <div className="d-flex flex-end mt-5 ">
                  <img
                    src={art1}
                    alt=""
                    className="img-35 rounded-circle me-4 mt-1"
                  />
                  <div>
                    <label className="small no-text-transform fw-normal">
                      <span className="fw-500 text-black">@User4 </span>
                      met the reserve price with a bid of 0.250, 24 hour auction
                      started
                    </label>
                    <label className="small fw-normal">
                          JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                      <img src={arrow} alt="arrow" className="ms-2 img-9" />
                    </label>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="right-content">
          <div className="artwork-details">
            <Accordion defaultActiveKey={["0", "1", "2", "3"]} alwaysOpen>
              {/* Description  */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <p className="h-64 body-medium text-uppercase  fw-bold text-se  v-center cursor-pointer">
                    Description
                  </p>
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    A vibrant burst of scarlet hues dominates this abstract
                    artwork, its fiery intensity igniting the canvas.
                    Intersecting strokes create a chaotic dance, evoking raw
                    emotion and passion. The piece radiates an untamed energy,
                    blurring the line between chaos and beauty.
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
                    </div>
                    <div className="trait-box">
                      <label className="small">trait name</label>
                      <p className="body-medium fw-bold">Trait valuee…</p>
                    </div>
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
                    <label className="medium text-black ">Flare Network</label>
                  </div>
                  <div className="details">
                    <label className="small">Creator Earnings </label>
                    <label className="medium text-black text-underline">
                      5%
                    </label>
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
                  <div className="tags">
                    <div className="tag-box">#trippy</div>
                    <div className="tag-box">#abstract</div>
                    <div className="tag-box">#art</div>{" "}
                    <div className="tag-box">#trippy</div>
                    <div className="tag-box">#abstract</div>
                    <div className="tag-box">#art</div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="more-collections site-container pb-sm-0">
        <h5 className="fw-bold text-center no-text-transform hide-on-mobile">
          More from this collection
        </h5>
        <h6 className="fw-bold text-center no-text-transform hide-on-desktop text-normal font-normal">
          More from this collection
        </h6>
        <div className="collection-cards">
          {collections.map((item, index) => {
            return (
              <div className="collection-card">
                <div className="head">
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
      </div>
      <div className="single-artwork site-container hide-on-desktop">
        <div className="left-content">
          <div className="history ">
            <h5 className="fw-bold no-text-transform">History</h5>
            <div className="history-content">
              {/* sold */}
              <div className="histrory-list">
                <div className="left img-24 v-center justify-content-center">
                  <img src={offer} alt="offer" className="img-14" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    <span>@user4</span> sold this item to <span>@user4</span>{" "}
                    for 2300 FLR
                  </p>
                  <label className="small pointer hover-underline">
                    {" "}
                    JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                  </label>
                </div>
              </div>

              {/* offer */}
              <div className="histrory-list">
                <div className="left img-24 v-center justify-content-center">
                  <img src={offerMade} alt="offer" className="img-14" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    <span>@user4</span> made an offer of 2300 FLR
                  </p>
                  <label className="small pointer hover-underline">
                    {" "}
                    JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                  </label>
                </div>
              </div>

              {/* listed */}
              <div className="histrory-list ">
                <div className="left img-24 v-center justify-content-center">
                  <img src={listed} alt="offer" className="img-14" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    Listed by <span>@user4</span>
                  </p>
                  <label className="small pointer hover-underline">
                    {" "}
                    JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                  </label>
                </div>
              </div>

              {/* minted */}
              <div className="histrory-list active">
                <div className="left ">
                  <img src={minted} alt="offer" />
                </div>
                <div className="right">
                  <p className="body-medium">
                    Minted by <span>@user4</span>
                  </p>
                  <label className="small pointer hover-underline">
                    JULY 6, 2023 9:31 PM
                    <img src={arrow} alt="" className="img-12 ms-1" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <img src={art} alt="img" />
              </div>
              <div className="right ms-3">
                <label className="larger fw-bold text-black no-text-transform">
                  Arwork Name
                </label>
                <p className="body-medium">Untitled Collection #7156351271</p>
              </div>
            </div>
            <label className="mt-4 pt-1  text-black">Price</label>

            <div className="pricing  body-medium fw-bold mt-2 br-30 v-center w-100 justify-content-between ">
              <Input
                className="body-medium fw-bold text-black  br-30  w-100 ps-1 "
                disabled="disabled"
                placeholder="Price"
                value="5520"
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
              text="Buy now"
              className="btn-prime btn-primary mt-50"
              width="100%"
              height="36px"
              onClick={() =>
                toast.success(
                  "   Congratulations! You've successfully purchased this item."
                )
              }
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
                <img src={art} alt="img" />
              </div>
              <div className="right ms-3">
                <label className="larger fw-bold text-black no-text-transform">
                  Arwork Name
                </label>
                <p className="body-medium">Untitled Collection #7156351271</p>
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
              <span>WFLR</span>
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
                  <span className="fw-bold"> 3721 WFLR</span>
                </span>
              </p>
            </div>
            {/* available balance needs to be greater than price before ‘buy now’
            button becomes primary. */}
            <Button
              text="Buy now"
              className="btn-prime btn-primary mt-50"
              width="100%"
              height="36px"
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
            <div className="screen-alert">
              <img src={Esc} alt="Esc" className="Esc img-fluid" />
            </div>
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
const collectionSortFilter = [
  { value: "Recently collected", label: "Recently collected" },
  { value: "Recently received", label: "Recently received" },
  { value: "Lowest price", label: "Lowest price" },
  { value: "Highest price", label: "Highest price" },
  { value: "Recently Listed", label: "Recently Listed" },
  { value: "Highest last sale", label: "Highest last sale" },
  { value: "Oldest", label: "Oldest" },
];

export default SingleArt;
