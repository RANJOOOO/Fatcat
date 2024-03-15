import React, { useEffect, useState } from "react";
import searchIcon from "../../assets/icon/search.svg";
import close from "../../assets/icon/close-small.svg";
import dp from "../../assets/images/artwork-example-4.png";
import remove from "../../assets/icon/delete.svg";
import add from "../../assets/icon/plus-white.svg";
import left from "../../assets/icon/arrow-left.svg";
import copy from "../../assets/icon/copy-grey.svg";
import { Modal } from "react-bootstrap";
import Button from "../button";
import {
  getAppliedArtistsFirebase,
  updateAppliedArtistsFirebase,
  updateCollectionStatus,
} from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const ListTable = (props) => {
  const { list, hide, data, page, type } = props;
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [removeCollection, setRemoveCollection] = useState(false);
  const [addCollection, setAddCollection] = useState(false);
  const [mbSearch, setMbSearch] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataList, setDataList] = useState(data);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("props: ", props);
    setDataList(data);
  }, [props]);

  const cleanSearch = () => {
    setInputValue("");
    setDataList(data);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);

    if (type === "collection") {
      // filter data
      const filteredData = data.filter((item) => {
        return item?.data?.name
          ?.toLowerCase()
          .includes(event.target.value.toLowerCase());
      });
      setDataList(filteredData);
    }
    if (type === "artist") {
      // filter data
      const filteredData = data.filter((item) => {
        return item?.name
          ?.toLowerCase()
          .includes(event.target.value.toLowerCase());
      });
      setDataList(filteredData);
    }
  };
  useEffect(() => {
    if (inputValue == "") {
      setShowCloseBtn(false);
    } else {
      setShowCloseBtn(true);
    }

    return () => {};
  }, [inputValue]);

  // blocklist
  const handleCloseRemove = () => setRemoveCollection(false);
  const handleShowRemove = (item) => {
    setSelectedItem(item);
    setRemoveCollection(true);
  };

  const handleRemove = () => {
    console.log("selectedItem: ", selectedItem);
    if (type === "artist" && list === "Whitelisted Artists") {
      updateAppliedArtistsFirebase(selectedItem.id, false, true);
    }
    if (type === "collection" && list === "Whitelisted Collections") {
      // updateAppliedArtistsFirebase(selectedItem.documentId, false, true);
      updateCollectionStatus(selectedItem.documentId, false, true);
    }
    if (type === "artist" && list === "Blacklisted Artists") {
      updateAppliedArtistsFirebase(selectedItem.id, true, false);
    }
    if (type === "collection" && list === "Blacklisted Collections") {
      // updateAppliedArtistsFirebase(selectedItem.documentId, false, true);
      updateCollectionStatus(selectedItem.documentId, true, false);
    }
    props.setRefresh(!props.refresh);
    handleCloseRemove();
  };

  // Add whitelist
  const handleShowAddWhitelist = () => setAddCollection(true);
  const handleCloseAddWhitelist = () => setAddCollection(false);

  // console.log("hi listing", { list });

  const mobileSearch = () => {
    setMbSearch(!mbSearch);
  };

  const handleCopy = (contractAddress) => {
    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.value = contractAddress;

    // Append the input element to the DOM
    document.body.appendChild(tempInput);

    // Select the text inside the input element
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected text
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Set copied status
    setCopied(true);

    // Reset copied status after a short delay
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <div className="admin-listTable">
        <div className="black-list-content  mt-36">
          {/* search bar */}
          <div className="search-blocklist v-center justify-content-between">
            <div className="left">
              {/* Collection names are links to collection page */}

              <p className="body-large fw-bold ">{list}</p>
              <p className="body-small text-medium-grey fw-500 mt-1">
                {data?.length} {list}
              </p>
            </div>
            <div className="right v-center">
              <div className="search-form  bg-white" onClick={mobileSearch}>
                <img src={searchIcon} alt="search" className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={inputValue}
                  style={{ transform: "10px" }}
                  onChange={handleInputChange}
                />

                <span
                  className={`close-button pointer ${
                    showCloseBtn ? "opacity-1" : "opacity-0"
                  }`}
                >
                  <img src={close} alt="close" onClick={cleanSearch} />
                </span>
              </div>

              {/* <div className="img-42  rounded-circle v-center h-center ms-3 pointer bg-black add-Btn">
                <img
                  src={add}
                  alt="add"
                  className="add"
                  onClick={handleShowAddWhitelist}
                />
              </div> */}

              {/* mobile search bar  */}

              {mbSearch ? (
                <div className="search-form-mb hide-on-desktop">
                  <div className="img-42  rounded-circle v-center h-center pointer bg-black">
                    <img
                      src={left}
                      alt="add"
                      className="add invert1"
                      onClick={mobileSearch}
                    />
                  </div>
                  <div className="search-form  bg-white">
                    <img
                      src={searchIcon}
                      alt="search"
                      className="search-icon"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={inputValue}
                      style={{ transform: "10px" }}
                      onChange={handleInputChange}
                    />

                    <span
                      className={`close-button pointer ${
                        showCloseBtn ? "opacity-1" : "opacity-0"
                      }`}
                    >
                      <img src={close} alt="close" onClick={cleanSearch} />
                    </span>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Table */}
          {type === "collection" ? (
            <div className="block-collections mt-4 pt-2">
              <div className="blocktable">
                {/* table head */}
                <div className="table-row table-head">
                  <div className="collection-name ">
                    <label htmlFor="" className="small">
                      collections
                    </label>
                  </div>
                  {/* <div className="date">
                    <label htmlFor="" className="small">
                      added on
                    </label>
                  </div> */}
                  <div className="address  hide-on-mobile">
                    <label htmlFor="" className="small">
                      added by
                    </label>
                  </div>
                  <div className="remove ">
                    <label htmlFor="" className="small"></label>
                  </div>
                </div>

                {/* Table rows data */}
                {dataList?.map((item, index) => (
                  <div className="table-row table-data ">
                    <div className="c1 collection-name v-center">
                      {/* <div className="left">
                      <img
                        src={dp}
                        alt="collection thumbnail"
                        className=" rounded-circle"
                      />
                    </div> */}
                      <div className="whitelist-right">
                        <label
                          htmlFor=""
                          className="medium text-black no-text-transforms text-capitalize"
                        >
                          {item?.data?.name}
                        </label>
                        <p className="body-medium text-medium-grey">
                          {item?.data?.contractAddress?.slice(0, 6)}...
                          {item?.data?.contractAddress?.slice(-6)}
                          <img
                            src={copy}
                            alt="copy"
                            // className="pointer ms-1"
                            className={`pointer ms-1 ${copied ? "copied" : ""}`}
                            onClick={() =>
                              handleCopy(item?.data?.contractAddress)
                            }
                          />
                        </p>
                      </div>
                    </div>

                    <div
                      className="c3 address hide-on-mobile"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <p className="text-medium-grey">
                        {item?.data?.address?.slice(0, 6)}...
                        {item?.data?.address?.slice(-6)}
                      </p>
                      <img
                        src={copy}
                        alt="copy"
                        // className="pointer ms-1"
                        className={`pointer ms-1 ${copied ? "copied" : ""}`}
                        onClick={() => handleCopy(item?.data?.address)}
                      />
                    </div>
                    <div className="c2 date">
                      <p className="text-medium-grey">
                        {/* {item?.data?.createdAt} */}
                      </p>
                    </div>
                    <div className="c4 remove  ">
                      <img
                        src={remove}
                        alt="remove"
                        className="img-24 pointer"
                        onClick={() => handleShowRemove(item)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="block-collections mt-4 pt-2">
              <div className="blocktable">
                {/* table head */}
                <div className="table-row table-head">
                  <div className="collection-name ">
                    <label htmlFor="" className="small">
                      Artists
                    </label>
                  </div>
                  <div className="date">
                    <label htmlFor="" className="small">
                      added on
                    </label>
                  </div>
                  <div className="remove ">
                    <label htmlFor="" className="small"></label>
                  </div>
                </div>

                {/* Table rows data */}
                {dataList?.map((item, index) => (
                  <div className="table-row table-data ">
                    <div className="c1 collection-name v-center">
                      {/* <div className="left">
                        <img
                          src={dp}
                          alt="collection thumbnail"
                          className=" rounded-circle"
                        />
                      </div> */}
                      <div className="whitelist-right">
                        <label
                          htmlFor=""
                          className="medium text-black no-text-transforms text-capitalize"
                        >
                          {item?.name}
                        </label>
                        <p className="body-medium text-medium-grey">
                          {item?.id?.slice(0, 6)}...
                          {item?.id?.slice(-6)}
                          <img
                            src={copy}
                            alt="copy"
                            // className="pointer ms-1"
                            className={`pointer ms-1 ${copied ? "copied" : ""}`}
                            onClick={() => handleCopy(item?.id)}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="c2 date">
                      <p className="text-medium-grey">
                        {new Date(item?.creationTime)?.toDateString()}
                      </p>
                    </div>
                    <div className="c3 address hide-on-mobile">
                      <p className="text-medium-grey"></p>
                    </div>
                    <div className="c4 remove  ">
                      <img
                        src={remove}
                        alt="remove"
                        className="img-24 pointer"
                        onClick={() => handleShowRemove(item)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* remove collection */}
      <Modal
        show={removeCollection}
        onHide={handleCloseRemove}
        className="sign-modal addWhiteListModal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-mb-start">
            <label htmlFor="" className="medium ">
              {list === "Whitelisted Collections" && "remove from whitelist"}
              {list === "Blacklisted Collections" && "remove from blacklist"}
              {list === "Whitelisted Artists" && "remove from whitelist"}
              {list === "Blacklisted Artists" && "remove from blacklist"}
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-5">
          <div>
            <p className="body-large text-center mb-1 mt-4 p-2">
              Are you sure you want to remove this
              <span className="fw-bold"> {type}</span> from the {page}?
            </p>

            <label className="text-black text-center w-100 mt-4">
              {type} Name
            </label>
            {/* <p className="body-medium text-center text-medium-grey mt-1 text-break">
              
            </p> */}
            {type === "collection" ? (
              <p className="body-medium text-center text-medium-grey mt-1 text-break">
                {selectedItem?.data?.contractAddress}
              </p>
            ) : (
              <p className="body-medium text-center text-medium-grey mt-1 text-break">
                {selectedItem?.id}
              </p>
            )}
          </div>
          <div className="btns v-center h-center mt-40 gap-3 mb-5">
            <Button
              text="Cancel"
              className="btn-prime btn-secondary"
              width="126px"
              height="36px"
              onClick={handleCloseRemove}
            />{" "}
            <Button
              text="Confirm"
              className="btn-prime btn-primary"
              width="126px"
              height="36px"
              onClick={handleRemove}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Whitelist */}
      {/* <Modal
        show={addCollection}
        onHide={handleCloseAddWhitelist}
        className="sign-modal addWhiteListModal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-mb-start">
            <label htmlFor="" className="medium ">
              add to whitelist
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-5 ">
          <p className="body-large text-center mb-1 mt-4 p-2 hide-on-mobile">
            Add address to Whitelisted <span className="fw-bold"> Artists</span>
          </p>
          <div className="mb-modal-space">
            <label className="medium text-black  mb-1 mt-4 p-2 ">
              FLR ADDRESS
            </label> */}
      {/* Input Should throw an error if address is not 42 characters long */}

      {/* Should throw an error if address is not 42 characters long */}

      {/* Should throw an error if address is not 42 characters long */}

      {/* Throw an error if user is already whitelisted
              Show success message if user is added to the Whitelisted (“User successfully added to Whitelist” */}
      {/* <div className="search-form  bg-white mb-5 justify-content-between">
              <input
                type="text"
                placeholder="Add address..."
                value={inputValue}
                style={{ transform: "10px" }}
                onChange={handleInputChange}
              />

              <span
                className={`close-button pointer ${
                  showCloseBtn ? "opacity-1" : "opacity-0"
                }`}
              >
                <img src={close} alt="close" onClick={cleanSearch} />
              </span>
            </div>
          </div>

          <div className="btns v-center h-center  gap-3 mb-5">
            <Button
              text="Cancel"
              className="btn-prime btn-secondary"
              width="126px"
              height="36px"
              onClick={handleCloseAddWhitelist}
            />{" "}
            <Button
              text="Confirm"
              className="btn-prime btn-primary"
              width="126px"
              height="36px"
              onClick={handleCloseAddWhitelist}
            />
          </div>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default ListTable;
