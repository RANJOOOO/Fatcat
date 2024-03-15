import React from "react";
import Header from "../header";
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
const SelectArtTab = () => {
  return (
    <div>
      <section className="create-artwork">
        <Header head="Create" />

        <div className="create-collection-popup mt-70 flex-column v-center  ">
          <h4 className="medium-head mb-4">Select a collection</h4>
          <p className="mb-50 text-center">
            Choose the collection you’d like to add a new <br /> artwork to or
            create a new one.
          </p>
          <div className="create-new-collection v-center pointer">
            <div className="left">
              <img src={add} alt="add" />
            </div>
            <label className="large text-black no-text-transform fw-bold pointer">
              Create new collection
            </label>
          </div>
          <div className="create-new-collection v-center mt-2 pointer">
            <div className="left">
              <img src={art} alt="add" className="img-100" />
            </div>
            <div>
              <label className="large text-black no-text-transform fw-bold pointer">
                ExistingCollection
              </label>
              <br />
              <label className="small no-text-transform fw-500 pointer">
                NE7CS
              </label>
            </div>
            <span className="small"></span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectArtTab;
