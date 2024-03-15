import React, { useState, useEffect } from "react";
import "../../style/main.scss";
import { Accordion } from "react-bootstrap";
import Button from "../button";
import unCheck from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import search from "../../assets/icon/search-grey.svg";
import down from "../../assets/icon/chevron-down-small.svg";
import Input from "../inputs";
import { useLocation } from "react-router-dom";
import CustomCheckBox from "../shared/customTags";
const AsideFilter = ({ onSelectedFilterChange }) => {
  // const { propFromCollections, propFromProfileTabs } = props;
  // console.log("my console OF aside cc", props.hide);

  // const [multiFilter, setMultiFilter] = useState(false);
  // const [priceCurrency, setPriceCurrency] = useState("USD");

  // // status checkbox states
  // const [selectStatus, setSelectStatus] = useState({
  //   Listed: false,
  //   Auction: false,
  //   New: false,
  //   Offers: false,
  // });

  // // currency check states
  // const [selectCurrency, setSelectCurrency] = useState({
  //   allChains: false,
  //   flr: false,
  //   sgb: false,
  // });
  // // collection check states
  // const [selectCollection, setSelectCollection] = useState({
  //   allCollections: false,
  //   collection1: false,
  //   collection2: false,
  //   collection3: false,
  //   collection4: false,
  //   collection5: false,
  // });

  // // Traits
  // const [selectTrait5, setSelectTrait5] = useState({
  //   Brown: false,
  //   Yellow: false,
  //   Blue: false,
  // });
  // // handle status filter

  // const handleStatusFilter = (tag) => {
  //   // setSelectStatus(!selectStatus);
  //   setSelectStatus((prevSelectedTags) => ({
  //     ...prevSelectedTags,
  //     [tag]: !prevSelectedTags[tag],
  //   }));
  // };

  // handle currency filter

  // const handleCurrencyFilter = (tag) => {
  //   setSelectCurrency((prevSelectedTags) => ({
  //     ...prevSelectedTags,
  //     [tag]: !prevSelectedTags[tag],
  //   }));
  // };
  // const handleCurrencyFilter = (tag) => {
  //   setSelectCurrency((prevSelectedTags) => ({
  //     ...prevSelectedTags,
  //     allChains: false, // Deselect all currencies
  //     flr: false,
  //     sgb: false,
  //     [tag]: true, // Select the clicked currency
  //   }));
  // };

  const [selectStatus, setSelectStatus] = useState({
    buyNow: false,
    onOffer: false,
    new: false,
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
  };

  // State for Price filter
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
  };

  // handle collection filter
  // const handleCollectionFilter = (tag) => {
  //   setSelectCollection((prevSelectedTag) => ({
  //     ...prevSelectedTag,
  //     [tag]: !prevSelectedTag[tag],
  //   }));
  // };
  // const handleTrait5 = (tag) => {
  //   setSelectTrait5((prevSelectedTag) => ({
  //     ...prevSelectedTag,
  //     [tag]: !prevSelectedTag[tag],
  //   }));
  // };

  useEffect(() => {
    console.log("minPrice", minPrice);
    console.log("maxPrice", maxPrice);
    handlePriceFilter();
  }, [minPrice, maxPrice]);

  const handlePriceFilter = () => {
    setSelectPrice({
      min: minPrice,
      max: maxPrice,
    });
  };

  const clearAllFilter = () => {
    setSelectStatus({
      buyNow: false,
      onOffer: false,
      new: false,
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
  };
  const SearchFilter = () => {
    // Call the callback with the selected filters
    onSelectedFilterChange({
      selectStatus,
      selectCurrency,
      selectCategories,
      selectPrice,
    });
    console.log(selectStatus);
    console.log(selectCurrency);
    console.log(selectCategories);
    console.log(selectPrice);
  };

  const location = useLocation();

  // const pathsToHideAsideTraits = location.pathname === "/profile";
  const pathsToHideFilters = location.pathname === "/explore-collections";

  return (
    <>
      <div className="collection-multi-filter">
        <div className="multi-filter-options">
          <div
            style={{
              display: pathsToHideFilters ? "none" : "",
            }}
          >
            <Accordion>
              {/* status filter */}
              <div>
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
                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectStatus.new ? "selected" : ""
                        }`}
                        onClick={() => handleStatusFilter("new")}
                      >
                        <img
                          src={selectStatus.new ? checked : unCheck}
                          alt="checkbox"
                        />
                        New
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
                {/* owner filter */}
                {/* <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <label className="h-64 no-text-transform text-black v-center cursor-pointer">
                      Owner
                    </label>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div>Pleas provide Owner Content </div>
                  </Accordion.Body>
                </Accordion.Item> */}
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
                      {/*  <div className="dropdown me-3">
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
                        </ul>
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
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Collection filter */}
                {/* <Accordion.Item eventKey="5">
                  <Accordion.Header>
                    <label className="h-64 no-text-transform text-black v-center cursor-pointer">
                      Collection
                    </label>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="check-filter ">
                      <div className="collection-search-filter h-64 v-center">
                        <div className="inbox-box ">
                          <img src={search} alt="search" />
                          <Input
                            type="text"
                            placeholder="Search collections..."
                          />
                        </div>
                      </div>
                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectCollection.allCollections ? "active" : ""
                        }`}
                        onClick={() => handleCollectionFilter("allCollections")}
                      >
                        <img
                          src={
                            selectCollection.allCollections ? checked : unCheck
                          }
                          alt="checkbox"
                        />
                        All collections
                      </p>
                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectCollection.collection1 ? "active" : ""
                        }`}
                        onClick={() => handleCollectionFilter("collection1")}
                      >
                        <img
                          src={selectCollection.collection1 ? checked : unCheck}
                          alt="checkbox"
                        />
                        Collection 1
                      </p>

                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectCollection.collection2 ? "active" : ""
                        }`}
                        onClick={() => handleCollectionFilter("collection2")}
                      >
                        <img
                          src={selectCollection.collection2 ? checked : unCheck}
                          alt="checkbox"
                        />
                        Collection 2
                      </p>

                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectCollection.collection3 ? "active" : ""
                        }`}
                        onClick={() => handleCollectionFilter("collection3")}
                      >
                        <img
                          src={selectCollection.collection3 ? checked : unCheck}
                          alt="checkbox"
                        />
                        Collection 3
                      </p>

                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectCollection.collection4 ? "active" : ""
                        }`}
                        onClick={() => handleCollectionFilter("collection4")}
                      >
                        <img
                          src={selectCollection.collection4 ? checked : unCheck}
                          alt="checkbox"
                        />
                        Collection 4
                      </p>

                      <p
                        className={`body-large h-64 fw-normal v-center cursor-pointer ${
                          selectCollection.collection5 ? "active" : ""
                        }`}
                        onClick={() => handleCollectionFilter("collection5")}
                      >
                        <img
                          src={selectCollection.collection5 ? checked : unCheck}
                          alt="checkbox"
                        />
                        Collection 5
                      </p>
                    </div>
                  </Accordion.Body>
                </Accordion.Item> */}
              </div>
              {/* Collection filter */}
            </Accordion>
          </div>

          {/* For Collection */}
          {/* <div
            style={{
              display: pathsToHideAsideTraits ? "none" : "",
            }}
          >
            <div className="explore-collection-filter">
              <div className="collection-attributes">
                <div className="head">
                  <label className="d-flex align-items-end h-64 pb-3 ps-2 bb-lightest-grey ">
                    attributes
                  </label>
                </div>
                <Accordion>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <label className="h-64 no-text-transform text-black v-center justify-content-between w-100 cursor-pointer">
                        Trait Name 1 <span className="fw-normal me-3">23</span>
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="check-filter ">
                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Brown ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Brown")}
                        >
                          <img
                            src={selectTrait5.Brown ? checked : unCheck}
                            alt="checkbox"
                          />
                          Brown
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Yellow ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Yellow")}
                        >
                          <img
                            src={selectTrait5.Yellow ? checked : unCheck}
                            alt="checkbox"
                          />
                          Yellow
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Blue ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Blue")}
                        >
                          <img
                            src={selectTrait5.Blue ? checked : unCheck}
                            alt="checkbox"
                          />
                          Blue
                        </p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <label className="h-64 no-text-transform text-black v-center justify-content-between w-100 cursor-pointer">
                        Trait Name 2 <span className="fw-normal me-3">13</span>
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="check-filter ">
                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Brown ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Brown")}
                        >
                          <img
                            src={selectTrait5.Brown ? checked : unCheck}
                            alt="checkbox"
                          />
                          Brown
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Yellow ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Yellow")}
                        >
                          <img
                            src={selectTrait5.Yellow ? checked : unCheck}
                            alt="checkbox"
                          />
                          Yellow
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Blue ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Blue")}
                        >
                          <img
                            src={selectTrait5.Blue ? checked : unCheck}
                            alt="checkbox"
                          />
                          Blue
                        </p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header>
                      <label className="h-64 no-text-transform text-black v-center justify-content-between w-100 cursor-pointer">
                        Trait Name 3 <span className="fw-normal me-3">43</span>
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="check-filter ">
                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Brown ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Brown")}
                        >
                          <img
                            src={selectTrait5.Brown ? checked : unCheck}
                            alt="checkbox"
                          />
                          Brown
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Yellow ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Yellow")}
                        >
                          <img
                            src={selectTrait5.Yellow ? checked : unCheck}
                            alt="checkbox"
                          />
                          Yellow
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Blue ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Blue")}
                        >
                          <img
                            src={selectTrait5.Blue ? checked : unCheck}
                            alt="checkbox"
                          />
                          Blue
                        </p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4">
                    <Accordion.Header>
                      <label className="h-64 no-text-transform text-black v-center justify-content-between w-100 cursor-pointer">
                        Trait Name 4 <span className="fw-normal me-3">63</span>
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="check-filter ">
                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Brown ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Brown")}
                        >
                          <img
                            src={selectTrait5.Brown ? checked : unCheck}
                            alt="checkbox"
                          />
                          Brown
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Yellow ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Yellow")}
                        >
                          <img
                            src={selectTrait5.Yellow ? checked : unCheck}
                            alt="checkbox"
                          />
                          Yellow
                        </p>

                        <p
                          className={`body-large h-64 fw-normal v-center cursor-pointer ${
                            selectTrait5.Blue ? "active" : ""
                          }`}
                          onClick={() => handleTrait5("Blue")}
                        >
                          <img
                            src={selectTrait5.Blue ? checked : unCheck}
                            alt="checkbox"
                          />
                          Blue
                        </p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div> */}
          <div className="multi-filter-footer">
            <Button
              text="Clear all"
              className="btn-prime btn-secondary"
              width="49%"
              height="47px"
              onClick={clearAllFilter}
            />
            <Button
              text="Done"
              className="btn-prime btn-primary"
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

export default AsideFilter;
