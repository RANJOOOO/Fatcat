import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import { Accordion } from "react-bootstrap";
import Button from "../button";
import unCheck from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import search from "../../assets/icon/search-grey.svg";
import down from "../../assets/icon/chevron-down-small.svg";
import Input from "../inputs";
import CustomCheckBox from "../shared/customTags";
import { set } from "firebase/database";
const AsideFilterExplore = ({ onSelectedFilterChange }) => {
  // multi filters

  // const [multiFilter, setMultiFilter] = useState(false);
  // const [priceCurrency, setPriceCurrency] = useState("USD");

  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    console.log("isChange", isChange);
  }, [isChange]);

  const [selectStatus, setSelectStatus] = useState({
    buyNow: false,
    onOffer: false,
  });
  const [selectCurrency, setSelectCurrency] = useState({
    allChains: false,
    flr: false,
    sgb: false,
  });
  const [selectCategories, setSelectCategories] = useState({
    "3D": false,
    Animation: false,
    Phygital: false,
    Geometric: false,
    Fantasy: false,
  });
  const [selectPrice, setSelectPrice] = useState({
    min: "",
    max: "",
  });

  // State for Status filter
  const handleStatusFilter = (tag) => {
    // setSelectStatus(!selectStatus);
    setSelectStatus((prevSelectedTags) => ({
      ...prevSelectedTags,
      [tag]: !prevSelectedTags[tag],
    }));
    setIsChange(true);
  };

  // handle currency filter

  const handleCurrencyFilter = (tag) => {
    setSelectCurrency((prevSelectedTags) => ({
      ...prevSelectedTags,
      allChains: false, // Deselect all currencies
      flr: false,
      sgb: false,
      [tag]: true, // Select the clicked currency
    }));
    setIsChange(true);
  };

  // State for Price filter
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // const handleCategoriesFilter = (tag) => {
  //   setSelectCategories((prevSelectedCategories) => {
  //     const updatedCategories = [...prevSelectedCategories];
  //     const categoryIndex = updatedCategories.indexOf(tag);

  //     if (categoryIndex !== -1) {
  //       // Category already selected, remove it
  //       updatedCategories.splice(categoryIndex, 1);
  //     } else {
  //       // Category not selected, add it
  //       updatedCategories.push(tag);
  //     }

  //     return updatedCategories;
  //   });
  // };

  const handleCategoriesFilter = (tag) => {
    setSelectCategories((prevSelectedCategories) => {
      const updatedCategories = { ...prevSelectedCategories };

      if (updatedCategories[tag]) {
        // Category already selected, remove it
        delete updatedCategories[tag];
      } else {
        // Category not selected, add it
        updatedCategories[tag] = true;
      }

      return updatedCategories;
    });
    setIsChange(true);
  };

  useEffect(() => {
    console.log("minPrice", minPrice);
    console.log("maxPrice", maxPrice);
    if (minPrice === "" && maxPrice === "") {
      console.log("minPrice === '' && maxPrice === ''");
    } else {
      handlePriceFilter();
    }
  }, [minPrice, maxPrice]);

  const handlePriceFilter = () => {
    setSelectPrice({
      min: minPrice,
      max: maxPrice,
    });
    setIsChange(true);
  };

  const clearAllFilter = () => {
    setSelectStatus({
      buyNow: false,
      onOffer: false,
      // hasOffers: false,
      // primarySale: false,
      // secondarySale: false,
    });
    setSelectCurrency({
      allChains: false,
      flr: false,
      sgb: false,
    });
    setSelectCategories({
      cat_3D: false,
      cat_animation: false,
      cat_phygital: false,
      cat_geometric: false,
      cat_fantasy: false,
    });
    setSelectPrice({
      min: "",
      max: "",
    });
    setIsChange(false);
  };

  const SearchFilter = () => {
    // Call the callback with the selected filters
    onSelectedFilterChange({
      selectStatus,
      selectCurrency,
      selectCategories,
      selectPrice,
    });
    setIsChange(false);
    console.log(selectStatus);
    console.log(selectCurrency);
    console.log(selectCategories);
    console.log(selectPrice);
  };
  return (
    <>
      <div className="collection-multi-filter">
        <div className="multi-filter-options">
          <Accordion>
            {/* status filter */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <label className="h-64 no-text-transform text-black v-center cursor-pointer">
                  Status
                </label>
              </Accordion.Header>
              <Accordion.Body>
                <div className="check-filter collection-status-filter">
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectStatus.buyNow ? "selected" : ""
                    }`}
                    onClick={() => handleStatusFilter("buyNow")}
                  >
                    <img
                      src={selectStatus.buyNow ? checked : unCheck}
                      alt="checkbox"
                    />
                    Buy now
                  </p>
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectStatus.onOffer ? "selected" : ""
                    }`}
                    onClick={() => handleStatusFilter("onOffer")}
                  >
                    <img
                      src={selectStatus.onOffer ? checked : unCheck}
                      alt="checkbox"
                    />
                    On offer
                  </p>
                  {/* <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectStatus.hasOffers ? "selected" : ""
                    }`}
                    onClick={() => handleStatusFilter("hasOffers")}
                  >
                    <img
                      src={selectStatus.hasOffers ? checked : unCheck}
                      alt="checkbox"
                    />
                    Has offers
                  </p>
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectStatus.primarySale ? "selected" : ""
                    }`}
                    onClick={() => handleStatusFilter("primarySale")}
                  >
                    <img
                      src={selectStatus.primarySale ? checked : unCheck}
                      alt="checkbox"
                    />
                    Primary sale
                  </p>
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectStatus.secondarySale ? "selected" : ""
                    }`}
                    onClick={() => handleStatusFilter("secondarySale")}
                  >
                    <img
                      src={selectStatus.secondarySale ? checked : unCheck}
                      alt="checkbox"
                    />
                    Secondary sale
                  </p> */}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Categories filter */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <label className="h-64 no-text-transform text-black v-center cursor-pointer">
                  Categories
                </label>
              </Accordion.Header>
              <Accordion.Body>
                <div className="pb-3 mt-22">
                  <CustomCheckBox
                    values={[
                      "3d",
                      "Animation",
                      "Phygital",
                      "3d",
                      "Geometric",
                      "Fantasy",
                    ]}
                    selectedValues={selectCategories}
                    onChange={(e) => handleCategoriesFilter(e.target.value)}
                    disabled={false}
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Pricing filter */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <label className="h-64 no-text-transform text-black v-center cursor-pointer">
                  Price
                </label>
              </Accordion.Header>
              <Accordion.Body>
                <div className="curreny-filter v-center">
                  {/* <div className="dropdown me-3">
                    <button
                      className=" dropdown-toggle body-large fw-normal"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {priceCurrency}
                      <img src={down} alt="down" className="ms-2" />
                    </button>
                    <ul className="dropdown-menu ">
                      <li onClick={() => setPriceCurrency("USD")}>
                        <label className="text-black fw-normal">USD</label>
                      </li>
                      <li onClick={() => setPriceCurrency("FLR")}>
                        <label className="text-black fw-normal">FLR</label>
                      </li>
                      <li onClick={() => setPriceCurrency("SGB")}>
                        <label className="text-black fw-normal">SGB</label>
                      </li>
                    </ul> *
                  </div> */}
                  <div className="input-val v-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                      }}
                    />
                    <p className="body-large m-2">to</p>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                      }}
                    />
                  </div>
                  {/* <div className="apply-val w-100">
                    <Button
                      text="Apply"
                      className="btn-prime btn-secondary text-medium-grey br-30"
                      width="100%"
                      height="47px"
                      // onClick={apply}
                      onClick={handlePriceFilter}
                    />
                  </div> */}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* curreny filter */}
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <label className="h-64 no-text-transform text-black v-center cursor-pointer">
                  Currency
                </label>
              </Accordion.Header>
              <Accordion.Body>
                <div className="check-filter collection-status-filter">
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectCurrency.allChains ? "active" : ""
                    }`}
                    onClick={() => handleCurrencyFilter("allChains")}
                  >
                    <img
                      src={selectCurrency.allChains ? checked : unCheck}
                      alt="checkbox"
                    />
                    All chains
                  </p>
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectCurrency.flr ? "active" : ""
                    }`}
                    onClick={() => handleCurrencyFilter("flr")}
                  >
                    <img
                      src={selectCurrency.flr ? checked : unCheck}
                      alt="checkbox"
                    />
                    FLR
                  </p>
                  <p
                    className={`body-large h-64 fw-normal v-center cursor-pointer ${
                      selectCurrency.sgb ? "active" : ""
                    }`}
                    onClick={() => handleCurrencyFilter("sgb")}
                  >
                    <img
                      src={selectCurrency.sgb ? checked : unCheck}
                      alt="checkbox"
                    />
                    SGB
                  </p>
                  {/* <p className="body-large h-64 fw-normal v-center cursor-pointer">
                      <img src={unCheck} alt="checkbox" />
                      SGB
                    </p> */}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="multi-filter-footer">
            <Button
              text="Clear all"
              // className="btn-prime btn-secondary"
              className={`btn-prime ${
                isChange ? "btn-secondary" : "btn-ternary"
              } `}
              width="49%"
              height="47px"
              onClick={clearAllFilter}
            />
            <Button
              text="Done"
              // className="btn-prime btn-primary"
              className={`btn-prime ${
                isChange ? "btn-primary" : "btn-ternary"
              } `}
              width="49%"
              height="47px"
              onClick={SearchFilter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AsideFilterExplore;
