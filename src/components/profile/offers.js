import React, { useState } from "react";
import "../../style/main.scss";
import sad from "../../assets/icon/sad-face.svg";
import metamask from "../../assets/icon/metamask.svg";
import wallet from "../../assets/icon/wallet-connect.svg";
import loader from "../../assets/icon/loader-small-white.svg";
import loaderLarge from "../../assets/icon/loader-large.svg";
import art1 from "../../assets/images/artwork-example-5.png";
import art2 from "../../assets/images/artwork-example-3.png";
import art3 from "../../assets/images/artwork-example-2.png";
import userProfile from "../../assets/images/face-5.png";
import userProfile1 from "../../assets/images/face-2.png";
import userProfile2 from "../../assets/images/face-1.png";
import userProfile3 from "../../assets/images/face.svg";
import wantToKnow from "../../assets/icon/question-tooltip.svg";
import { Modal, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import wFLR from "../../assets/icon/wrapped-FLR.svg";
import sortby from "../../assets/icon/sort-by.svg";
import verified from "../../assets/icon/verified-artist-small.svg";
import dropdown from "../../assets/icon/chevron-down-extra-small.svg";
import close from "../../assets/icon/close.svg";
import tick from "../../assets/icon/tick-large-black.svg";

import Button from "../button";
import ArtistPopUp from "../shared/artistpopup";
import NoContent from "../noContent";

import { handleNotifications } from "../../firebase/firebase";
const Offers = () => {
  const tooltip = <Tooltip id="tooltip">List price: 4900929 FLR</Tooltip>;
  const tipDifference = (
    <Tooltip id="differ">
      The difference between your listed price and the offer
    </Tooltip>
  );
  const [show, setShow] = useState(false);
  // transaction process states
  const [offerAlert, setOfferAllert] = useState(true);
  const [offerApproveAlert, setApproveAlert] = useState(false);
  const [offerProcessAlert, setProcessAlert] = useState(false);
  const [offerConfirmAlert, setConfirmAlert] = useState(false);

  // click handles
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setOfferAllert(true);
    setApproveAlert(false);
    setProcessAlert(false);
    setConfirmAlert(false);
  };
  // getting username from localhost
  let username = localStorage?.getItem("userName");

  const handleOffer = () => {
    // notification for accepting offer
    handleNotifications(
      username,
      `You won this price for price`,
      "successPurchase",
      400
    );
    setOfferAllert(false);
    setApproveAlert(true);

    setTimeout(() => {
      setApproveAlert(false);
      setProcessAlert(true);
    }, 2500);

    setTimeout(() => {
      setApproveAlert(false);
      setProcessAlert(false);
      setConfirmAlert(true);
    }, 7000);
  };

  const offers = [
    {
      artworkImage: art1,
      artworkName: "Artwork Name",
      offer: 87500,
      difference: 4.1,
      date: "Today",
      userImage: userProfile,
      fromOffer: "@buyerName",
      offerStatus: "Accept",
    },
    {
      artworkImage: art2,
      artworkName: "Artwork Name",
      offer: "9500",
      difference: -98.3,
      date: "3 days ago",
      userImage: userProfile1,
      fromOffer: "0xe82..77a5",
      offerStatus: "Accept",
    },
    {
      artworkImage: art3,
      artworkName: "Artwork Name Is Long...",
      offer: 560,
      difference: -10.3,
      date: "1 week ago",
      userImage: userProfile2,
      fromOffer: "@artistNameLong...",
      offerStatus: "Accept",
    },
    {
      artworkImage: art3,
      artworkName: "Artwork Name Is Long...",
      offer: 560,
      difference: -10.3,
      date: "1 week ago",
      userImage: userProfile3,
      fromOffer: "@artistNameLong...",
      offerStatus: "Withdrawn",
    },
  ];
  // ---------------------------------------
  const priceOptions = [
    { value: "currentOffer", label: "Offer" },
    { value: "offerDiffernce", label: "Difference" },
    { value: "offerDate", label: "Date" },
    { value: "offerFrom", label: "From" },
    { value: "offerAction", label: "Action" },
  ];

  const [activeOffer, setActiveOffer] = useState("currentOffer");
  const [activeOfferFilter, setActiveOfferFilter] = useState("All offers");
  const [priceShow, setPriceShow] = useState(false);
  const [offerMobileFilter, setOfferMobileFilter] = useState(false);

  const handleIPriceTick = (tick) => {
    setActiveOffer(tick);
    setPriceShow(false);
  };
  const handleOfferTick = (tick) => {
    setActiveOfferFilter(tick);
    setOfferMobileFilter(false);
  };

  // Offer mobile Filter handle
  const offerHandleShow = () => setPriceShow(true);
  const offerHandleHide = () => setPriceShow(false);
  //------------------

  const offerFilter = [
    { value: "Offers made", label: "Offers made" },
    { value: "Offers received", label: "Offers received" },
    { value: "Expired offers", label: "Expired offers" },
    { value: "All offers", label: "All offers" },
  ];

  const showMobileSortFilter = () => {
    setOfferMobileFilter(true);
    setPriceShow(false);
  };
  const hideMobileSortFilter = () => {
    setOfferMobileFilter(false);
    setPriceShow(false);
  };
  return (
    <div>
      <div className="offers">
        {console.log("f", offers)}
        {offers.length < 1 && (
          <div className="no-content pt-5">
            <img src={sad} alt="sad" />
            <p className="body-large">
              You haven’t received <span>offers </span>
              yet.
            </p>
          </div>
        )}

        <div className="offer-table">
          {/* Sorting filter for mobile */}

          <div
            className="ofr-recieved  d-flex justify-content-end align-items-center
          filter hide-on-desktop"
          >
            <p className="body-medium " onClick={showMobileSortFilter}>
              <span className="me-1">
                {
                  offerFilter.find(
                    (option) => option.value === activeOfferFilter
                  )?.label
                }
              </span>

              <img src={sortby} alt="more" />
            </p>
          </div>

          {/* Sorting filter for destop */}
          <div
            className="ofr-recieved d-flex justify-content-end align-items-center
          filter dropdown hide-on-mobile
          "
          >
            <p
              className="body-medium dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="me-1">
                {
                  offerFilter.find(
                    (option) => option.value === activeOfferFilter
                  )?.label
                }
              </span>

              <img src={sortby} alt="more" />
            </p>
            <ul className="dropdown-menu">
              {offerFilter.map((option) => {
                return (
                  <li
                    className="dropdown-item"
                    key={option.value}
                    onClick={() => handleOfferTick(option.value)}
                  >
                    <img
                      src={tick}
                      alt="tick"
                      className={`${
                        activeOfferFilter === option.value
                          ? "active opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="offer-table-content">
            {/* table heading */}

            <div className="offer-table-head">
              <label className="small v-center c1 ">ITEM</label>
              <label className="small v-center c2 hide-on-mobile">offer</label>

              <OverlayTrigger
                placement="top"
                overlay={tipDifference}
                id="differ"
              >
                <label
                  className="small v-center c3 hide-on-mobile "
                  id="differ"
                >
                  difference{" "}
                  <img src={wantToKnow} alt="question" className="opacity-50" />
                </label>
              </OverlayTrigger>
              <label className="small v-center  c4 hide-on-mobile">date</label>
              <label className="small  v-center c5 hide-on-mobile">from</label>
              <label className="small v-center  c6 hide-on-mobile"></label>

              <label
                className="small  text-black  v-center  hide-on-desktop"
                onClick={offerHandleShow}
              >
                {
                  priceOptions.find((option) => option.value === activeOffer)
                    ?.label
                }

                <img src={dropdown} alt="dropdown" className="ms-1" />
              </label>
            </div>

            <div className="offer-table-body ">
              {offers.map((item, index) => {
                return (
                  <div
                    className={`offer-table-content  ${
                      item.offerStatus === "Accept" ? "" : "offer-expired"
                    }`}
                    key={index}
                  >
                    {/* Item Name */}
                    <div className="c1 art">
                      <div className="art-img">
                        <img
                          src={item.artworkImage}
                          alt="art"
                          className="img-100"
                        />
                      </div>
                      <label className="text-black ">{item.artworkName}</label>
                    </div>

                    {/* Offers */}
                    <div
                      className={`c2 offer d-flex align-items-center
                      ${activeOffer !== "currentOffer" && "item-hide"}`}
                    >
                      <img src={wFLR} alt="flr" />
                      <OverlayTrigger
                        placement="top"
                        overlay={tooltip}
                        id="tooltip"
                      >
                        <label className=" text-black">{item.offer}</label>
                      </OverlayTrigger>
                      <p>WFLR</p>
                    </div>

                    {/* Difference */}
                    <div
                      className={`v-center c3 ${
                        activeOffer !== "offerDiffernce" && " item-hide"
                      }`}
                    >
                      <label
                        className={
                          item.difference > 0 ? "text-success" : "text-error"
                        }
                      >
                        {item.difference}%
                      </label>
                    </div>

                    {/* Date */}
                    <div
                      className={`v-center c4  ${
                        activeOffer !== "offerDate" && " item-hide"
                      }`}
                    >
                      <label className="text-black text-lowercase">
                        {item.date}
                      </label>
                    </div>

                    {/*Offer from  */}

                    <div
                      className={`v-center c5 fromOffer  ${
                        activeOffer !== "offerFrom" && " item-hide"
                      }`}
                    >
                      <div className="art-img">
                        <img
                          src={item.userImage}
                          alt="art"
                          className="img-100"
                        />
                      </div>
                      <p className="text-black fw-semibold cursor-pointer text-lowercase show-artist-popup ">
                        {item.fromOffer}
                        <ArtistPopUp
                          userProfile={userProfile}
                          verified={verified}
                          left="-120px"
                          top="-220px"
                        />
                      </p>
                    </div>

                    {/* Offer Status */}
                    {/* <div className="v-center c6 item-hide"> */}
                    <div
                      className={`v-center c6  ${
                        activeOffer !== "offerAction" && " item-hide"
                      }`}
                    >
                      <Button
                        text={item.offerStatus}
                        className={
                          item.offerStatus == "Accept"
                            ? "btn-prime btn-primary"
                            : "btn-prime btn-ternary "
                        }
                        width="121px"
                        height="36px"
                        onClick={handleShow}
                        disabled={item.offerStatus === "Withdrawn"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
        className="offer-modal "
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {/* offer-accept-alert */}
            {offerAlert ? <label className="medium ">ACCEPT</label> : <></>}

            {/* While approving offer alert */}
            {offerApproveAlert ? (
              <label className="medium">approve</label>
            ) : (
              <></>
            )}

            {/* While Processing... offer alert */}
            {offerProcessAlert ? (
              <label className="medium ">Processing...</label>
            ) : (
              <></>
            )}

            {/* When offer is confirmed */}
            {offerConfirmAlert ? (
              <label className="medium ">confirmed</label>
            ) : (
              <></>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* offer-accept-alert */}
          {offerAlert ? (
            <div className="accept-alert ">
              <div className="offer-modal-top">
                <div className="labels d-flex justify-content-between">
                  <label className="medium text-black ">item</label>
                  <label className="medium text-black ">subtotal</label>
                </div>

                <div className="d-flex justify-content-between align-items-center top-content">
                  <div className="collections d-flex align-items-center">
                    <div className="collection-img me-3">
                      <img src={art1} alt="collection" className="img-100" />
                    </div>
                    <div className="collection-name d-flex flex-column">
                      <label className="">Collection Name</label>
                      <label className="text-black">Artwork Name</label>
                    </div>
                  </div>

                  <div className="value-wrapper">
                    <label htmlFor="" className="text-black">
                      <img src={wFLR} alt="wFLR" className="img-fluid " />
                      7600
                    </label>
                    <p className="body-medium mt-1 text-medium-grey">
                      ($235.96)
                    </p>
                  </div>
                </div>
              </div>
              <div className="offer-fee">
                <label className="medium text-black ">fees</label>
                <div className="fee">
                  <label className="medium text-light-grey text-capitalize w-100">
                    Catalyst Fee
                    <img src={wantToKnow} alt="question" />
                    <div className="divider"></div>
                  </label>
                  <label className="medium text-light-grey">2.5%</label>
                </div>
                <div className="fee">
                  <label className="medium text-light-grey text-capitalize w-100">
                    Creator Royalty
                    <img src={wantToKnow} alt="question" />
                    <div className="divider2"></div>
                  </label>
                  <label className="medium text-light-grey">10.0%</label>
                </div>
              </div>
              <div className="offer-modal-bottom">
                <label className="text-black">Total Earnings</label>
                <p className="body-extra-small text-light-grey">
                  Your earnings after fees
                </p>
                <div className="value-wrapper">
                  <img src={wFLR} alt="wFLR" className="img-fluid " />
                  <label htmlFor="" className="text-black">
                    6650
                  </label>
                  <p className="body-medium mt-1 text-medium-grey">($235.96)</p>
                </div>
                <div className="accept-offer">
                  <Button
                    text="Accept offer"
                    className="btn-prime btn-primary"
                    width="146px"
                    height="36px"
                    onClick={handleOffer}
                  />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* While approving offer alert */}

          {/* ------------------------------------------------------------------------- */}

          {/* This modal should only show if this hasn’t already been confirmed earlier? 
          Need to check with developers how this logic should work and when these approvals 
          should happen. */}

          {/* ------------------------------------------------------------------------- */}

          {offerApproveAlert ? (
            <div className="offer-approve-alert">
              <label htmlFor="" className="medium text-black">
                Approve your WFLR for transfer
              </label>
              <p className="approve-offer-details body-medium">
                To approve The Catalyst to trade this token, you must first
                complete a free (plus gas) transaction. Confirm it in your
                wallet and keep this tab open. You might notice a very large
                number being requested for approval - this is simply the maximum
                amount, meaning you’ll never have to do this approval again. It
                also doesn’t allow The Catalyst to transfer that amount to you -
                the amount you sign in the next step is all that can be traded
                on your behalf.
                <span className="text-medium-grey "> Read more</span>
                <a href="" className="body-medium text-link-blue">
                  {" "}
                  here.
                </a>
              </p>
              <hr />
              <div className="approve-wallets">
                <img src={metamask} alt="metamask" />
                <img src={wallet} alt="wallet" />
              </div>
              <label className="text-black w-100 text-center">
                Waiting for blockchain confirmation…
              </label>
              <Button
                className="btn-prime btn-primary m-auto loader-btn  "
                width="138px"
                height="36px"
                imageSrc={loader}
              />
            </div>
          ) : (
            <></>
          )}

          {/* When offer is in process */}
          {offerProcessAlert ? (
            <div className="offer-processing-alert ">
              <div></div>
              <div className="text-center">
                <img src={loaderLarge} alt="loader" className="rotate-360 " />
              </div>
              <div>
                <p className="text-medium0grey body-medium text-center">
                  Please wait…
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* When offer is confirmed */}
          {offerConfirmAlert ? (
            <div className="offer-confirmed ">
              <p className="text-center">
                Success! You just sold{" "}
                <label className="text-black"> ArtworkName.</label>
              </p>
              <div className="artwork-img">
                <img src={art1} alt="artwork" className="img-100" />
              </div>
              <div className="transaction">
                <p className="body-medium text-center text-link-blue  text-decoration-underline fw-500">
                  View transaction on the blockchain
                </p>
                <p className="body-small text-center text-link-blue fw-500 wallet-address">
                  0x566c…0687
                </p>
                <Button
                  text="Finished"
                  className="btn-prime btn-primary "
                  width="146px"
                  height="36px"
                  onClick={handleClose}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </Modal.Body>
      </Modal>

      {/* List Price menu */}
      <Offcanvas
        show={priceShow}
        onHide={offerHandleHide}
        placement="bottom"
        className="sub-menu-offcanvas"
      >
        <div className="more-menu-sm price-more-menu">
          <div className="menu-head">
            <label className="text-black">change</label>
            <div className="close-btn cursor-pointer">
              <img
                src={close}
                alt="close"
                className="img-24"
                onClick={offerHandleHide}
              />
            </div>
          </div>

          <div className="share">
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className={`no-text-transform h-64 text-black ${
                  activeOffer === option.value ? "fw-bold" : "fw-normal"
                }`}
                onClick={() => handleIPriceTick(option.value)}
              >
                {option.label}
                <img
                  src={tick}
                  alt="tick"
                  className={`${
                    activeOffer === option.value
                      ? "active opacity-100"
                      : "opacity-0"
                  }`}
                />
              </label>
            ))}
          </div>
        </div>
      </Offcanvas>

      {/* Offer Sorting Filter mobile menu */}
      <Offcanvas
        show={offerMobileFilter}
        onHide={hideMobileSortFilter}
        placement="bottom"
        className="sub-menu-offcanvas"
      >
        <div className="more-menu-sm price-more-menu">
          <div className="menu-head">
            <label className="text-black">sort by</label>
            <div className="close-btn cursor-pointer">
              <img
                src={close}
                alt="close"
                className="img-24"
                onClick={hideMobileSortFilter}
              />
            </div>
          </div>

          <div className="share">
            {offerFilter.map((option) => (
              <label
                key={option.value}
                className={`no-text-transform h-64 text-black ${
                  activeOfferFilter === option.value ? "fw-bold" : "fw-normal"
                }`}
                onClick={() => handleOfferTick(option.value)}
              >
                {option.label}
                <img
                  src={tick}
                  alt="tick"
                  className={`${
                    activeOfferFilter === option.value
                      ? "active opacity-100"
                      : "opacity-0"
                  }`}
                />
              </label>
            ))}
          </div>
        </div>
      </Offcanvas>
    </div>
  );
};

export default Offers;
