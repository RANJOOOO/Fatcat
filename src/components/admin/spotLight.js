import React, { useState, useEffect } from "react";
import Button from "../button";
import Input from "../inputs";
import ImageUpload from "../imageUpload";
import unchecked from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import { useNavigate } from "react-router-dom";
import UseWindowResize from "../../customHooks/useWindowResize";
import Textarea from "../shared/textarea";
import useScrollToTop from "../../customHooks/scrollToTop";
import InputBox from "../shared/inputBox";
import {
  SaveSpotlight,
  getSpotlightUser,
  getAllUsers,
} from "../../firebase/firebase";
import { set } from "firebase/database";

const SpotLight = () => {
  const [spotActive, setSpotActive] = useState(false);
  const [spotAddress, setSpotAddress] = useState("");
  const [spotUsername, setSpotUsername] = useState("");
  const [spotTwitter, setSpotTwitter] = useState("");
  const [spotWebsite, setSpotWebsite] = useState("");
  const [spotFeaturedImage1, setSpotFeaturedImage1] = useState("");
  const [spotFeaturedName1, setSpotFeaturedName1] = useState("");
  const [spotFeaturedImage2, setSpotFeaturedImage2] = useState("");
  const [spotFeaturedName2, setSpotFeaturedName2] = useState("");
  const [spotFeaturedImage3, setSpotFeaturedImage3] = useState("");
  const [spotFeaturedName3, setSpotFeaturedName3] = useState("");
  const [spotBio, setSpotBio] = useState("");
  const [spotHeader1, setSpotHeader1] = useState("");
  const [spotSection1image, setSpotSection1image] = useState("");
  const [spotSection1, setSpotSection1] = useState("");
  const [spotHeader2, setSpotHeader2] = useState("");
  const [spotSection2, setSpotSection2] = useState("");
  const [spotSection2image, setSpotSection2image] = useState("");
  const [spotHeader3, setSpotHeader3] = useState("");
  const [spotSection3, setSpotSection3] = useState("");
  const [spotSection3image1, setSpotSection3image1] = useState("");
  const [spotSection3image2, setSpotSection3image2] = useState("");
  const [userData, setUserData] = useState({});
  const [spotlight, setSpotlight] = useState({});
  const [changesMade, setChangesMade] = useState(false);

  // match artistAddress with username and if match found then set SelectedUser

  useEffect(() => {
    if (userData.length > 0 && spotAddress) {
      const user = userData.find((user) => user.id === spotAddress);
      console.log("user", user);
      if (user) {
        setSpotUsername(user?.userName);
      }
    }
  }, [spotAddress, userData]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers();
      console.log("User Data", users);
      setUserData(users);
    };
    fetchData();
  }, []);

  const handleSaveChanges = () => {
    const data = {
      spotActive,
      spotAddress,
      spotUsername,
      spotTwitter,
      spotWebsite,
      spotFeaturedImage1,
      spotFeaturedName1,
      spotFeaturedImage2,
      spotFeaturedName2,
      spotFeaturedImage3,
      spotFeaturedName3,
      spotBio,
      spotHeader1,
      spotSection1image,
      spotSection1,
      spotHeader2,
      spotSection2,
      spotSection2image,
      spotHeader3,
      spotSection3,
      spotSection3image1,
      spotSection3image2,
    };
    console.log("data", data);
    SaveSpotlight(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSpotlightUser();
      const user = response[0];
      setSpotlight(user);
      console.log("User Data", user);
      if (user) {
        setSpotActive(user.spotActive);
        setSpotAddress(user.spotAddress);
        setSpotUsername(user.spotUsername);
        setSpotTwitter(user.spotTwitter);
        setSpotWebsite(user.spotWebsite);
        setSpotFeaturedImage1(user.spotFeaturedImage1);
        setSpotFeaturedName1(user.spotFeaturedName1);
        setSpotFeaturedImage2(user.spotFeaturedImage2);
        setSpotFeaturedName2(user.spotFeaturedName2);
        setSpotFeaturedImage3(user.spotFeaturedImage3);
        setSpotFeaturedName3(user.spotFeaturedName3);
        setSpotBio(user.spotBio);
        setSpotHeader1(user.spotHeader1);
        setSpotSection1image(user.spotSection1image);
        setSpotSection1(user.spotSection1);
        setSpotHeader2(user.spotHeader2);
        setSpotSection2(user.spotSection2);
        setSpotSection2image(user.spotSection2image);
        setSpotHeader3(user.spotHeader3);
        setSpotSection3(user.spotSection3);
        setSpotSection3image1(user.spotSection3image1);
        setSpotSection3image2(user.spotSection3image2);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (spotlight) {
      if (
        spotlight.spotActive !== spotActive ||
        spotlight.spotAddress !== spotAddress ||
        spotlight.spotUsername !== spotUsername ||
        spotlight.spotTwitter !== spotTwitter ||
        spotlight.spotWebsite !== spotWebsite ||
        spotlight.spotFeaturedImage1 !== spotFeaturedImage1 ||
        spotlight.spotFeaturedName1 !== spotFeaturedName1 ||
        spotlight.spotFeaturedImage2 !== spotFeaturedImage2 ||
        spotlight.spotFeaturedName2 !== spotFeaturedName2 ||
        spotlight.spotFeaturedImage3 !== spotFeaturedImage3 ||
        spotlight.spotFeaturedName3 !== spotFeaturedName3 ||
        spotlight.spotBio !== spotBio ||
        spotlight.spotHeader1 !== spotHeader1 ||
        spotlight.spotSection1image !== spotSection1image ||
        spotlight.spotSection1 !== spotSection1 ||
        spotlight.spotHeader2 !== spotHeader2 ||
        spotlight.spotSection2 !== spotSection2 ||
        spotlight.spotSection2image !== spotSection2image ||
        spotlight.spotHeader3 !== spotHeader3 ||
        spotlight.spotSection3 !== spotSection3 ||
        spotlight.spotSection3image1 !== spotSection3image1 ||
        spotlight.spotSection3image2 !== spotSection3image2
      ) {
        setChangesMade(true);
      } else {
        setChangesMade(false);
      }
    }
  }, [
    spotlight,
    spotActive,
    spotAddress,
    spotUsername,
    spotTwitter,
    spotWebsite,
    spotFeaturedImage1,
    spotFeaturedName1,
    spotFeaturedImage2,
    spotFeaturedName2,
    spotFeaturedImage3,
    spotFeaturedName3,
    spotBio,
    spotHeader1,
    spotSection1image,
    spotSection1,
    spotHeader2,
    spotSection2,
    spotSection2image,
    spotHeader3,
    spotSection3,
    spotSection3image1,
    spotSection3image2,
  ]);

  const navigate = useNavigate();
  UseWindowResize(1024, "/admin");
  useScrollToTop();
  return (
    <div>
      <div className="spotlight-wrapper">
        <div className="admin-content-head v-center justify-content-between header-fixed ">
          {/* Header for desktop */}
          <h3 className="fw-bold text-capitalize for-desktop">Spotlight</h3>
          {/* Header for mobile */}
          <h6
            className="fw-bold text-capitalize for-mobile"
            onClick={() => navigate(-1)}
          >
            <img src={leftArrow} alt="back" className="me-3" />
            Spotlight
          </h6>

          {/* button is disabled until some state has changed on the page */}
          {/* when some data is changed or entered in form fields then save changes button btn-ternary class will replace with btn-primary  */}
          <Button
            width="199px"
            height="47px"
            className={`br-30 ${changesMade ? "btn-primary" : "btn-ternary"}`}
            text="Save changes"
            onClick={handleSaveChanges}
            disabled={false}
          />
        </div>

        <div className="spotlight-wrapper-content">
          {/* toggle spotlight */}
          <div className="toggle-spotlight">
            <p className="body-large fw-bold mt-3 pt-2">Toggle Spotlight</p>
            <p className="mt-3 pt-1">
              If this is on, the Spotlight Artist will be shown on the front
              page.
            </p>

            {/* If this checkbox is set to active, the Spotlight Artist will be
            shown on the LANDING page and on the SPOTLIGHT page. the details on
            this page will ‘fill’ those pages where applicable. */}

            <div className="spotlight-active-box mt-4 mb-5 ms-3">
              <label
                className="text-black no-text-transform v-center pointer"
                onClick={(e) => setSpotActive(!spotActive)}
              >
                <img
                  src={spotActive ? checked : unchecked}
                  alt="checkbox"
                  className="me-3"
                />
                Spotlight Active
              </label>
            </div>
          </div>

          {/* artist details */}
          <div className="artist-details">
            <p className="body-large fw-bold head">Artist Details</p>

            {/* Artist address */}
            <div className="spot-input-box">
              {/* everywhere there is an SGB / FLR address field it should follow
              the same error rules */}

              <InputBox
                label="ARTIST ADDRESS"
                subLabel=" "
                id="inputId"
                type="url"
                value={spotAddress}
                onChange={(e) => setSpotAddress(e.target.value)}
                placeholder="Add FLR address"
                disabled={false}
                optional={false}
                maxLength={42}
              />
            </div>

            {/* artist username */}
            <div className="spot-input-box mt-36">
              {/* the disabled filed will fill automatically with the artists
                username once address is filled and admin has clicked ‘save
                changes” */}

              <InputBox
                label="ARTIST Name"
                subLabel=" "
                id="inputId"
                type="text"
                boxClassName="disabled"
                value={spotUsername}
                onChange={(e) => setSpotUsername(e.target.value)}
                placeholder="@artistName"
                disabled={true}
                optional={false}
                maxLength={30}
              />
              <p className="body-medium mt-2">
                The artist username will fill automatically from the artists’
                address and cannot be changed manually here.
              </p>
            </div>

            {/* Artist twitter handle */}
            <div className="spot-input-box mt-36">
              <InputBox
                label="ARTIST twitter"
                subLabel=" "
                id="inputId"
                type="url"
                value={spotTwitter}
                onChange={(e) => setSpotTwitter(e.target.value)}
                placeholder="https://twitter.com/handle1234"
                disabled={false}
                optional={false}
                maxLength={30}
              />
            </div>

            {/* Artist twitter handle */}
            <div className="spot-input-box mt-36">
              <InputBox
                label="ARTIST website"
                subLabel=" "
                id="inputId"
                type="url"
                value={spotWebsite}
                onChange={(e) => setSpotWebsite(e.target.value)}
                placeholder="https://website.com/"
                disabled={false}
                optional={false}
                maxLength={30}
              />
            </div>

            {/* FEATURED IMAGES */}
            <div className="featured-images mt-60 ">
              <label className="medium text-black">FEATURED IMAGES</label>
              <p className="mt-2 pb-1">
                These are displayed on the homepage, and transition between each
                other.
              </p>
              <ImageUpload
                value={spotFeaturedImage1}
                onChange={(e) => setSpotFeaturedImage1(e.target.files[0])}
              />
              <div className="spot-input-box">
                <InputBox
                  // label="Artwork#1 Name"
                  // subLabel=" "
                  id="inputId"
                  type="url"
                  value={spotFeaturedName1}
                  onChange={(e) => setSpotFeaturedName1(e.target.value)}
                  placeholder="Artwork#1 Name"
                  disabled={false}
                  optional={false}
                  maxLength={42}
                />
              </div>
              <ImageUpload
                value={spotFeaturedImage2}
                onChange={(e) => setSpotFeaturedImage2(e.target.files[0])}
              />
              <div className="spot-input-box">
                <InputBox
                  // label="Artwork#2 Name"
                  // subLabel=" "
                  id="inputId"
                  type="url"
                  value={spotFeaturedName2}
                  onChange={(e) => setSpotFeaturedName2(e.target.value)}
                  placeholder="Artwork#2 Name"
                  disabled={false}
                  optional={false}
                  maxLength={42}
                />
              </div>
              <ImageUpload
                value={spotFeaturedImage3}
                onChange={(e) => setSpotFeaturedImage3(e.target.files[0])}
              />
              <div className="spot-input-box">
                <InputBox
                  // label="Artwork#3 Name"
                  // subLabel="Artwork#3 Name"
                  id="inputId"
                  type="url"
                  value={spotFeaturedName3}
                  onChange={(e) => setSpotFeaturedName3(e.target.value)}
                  placeholder="Artwork#3 Name"
                  disabled={false}
                  optional={false}
                  maxLength={42}
                />
              </div>
            </div>

            {/* Short Bio */}
            <div className="short-bio mt-60 d-flex flex-column">
              <label className="medium text-black">short bio</label>
              {/* <textarea
                className="mt-3 br-20 pt-2 ps-3"
                placeholder="@artistName"
              ></textarea>
              <label className="medium text-end pt-2 pe-2 ">0 / 40</label> */}

              <Textarea
                maxLength={40}
                placeholder="@artistName"
                value={spotBio}
                onChange={(e) => setSpotBio(e.target.value)}
              />
            </div>

            {/*   header 1 */}
            <div className="spot-input-box mt-36">
              <InputBox
                label="header 1"
                subLabel=" "
                id="inputId"
                type="text"
                placeholder=" "
                value={spotHeader1}
                onChange={(e) => setSpotHeader1(e.target.value)}
                disabled={false}
                optional={false}
                maxLength={30}
              />
            </div>

            {/* Section 1 discription */}

            <div className="bio-section mt-60 d-flex flex-column">
              <label className="medium text-black">section 1</label>
              {/* <textarea
                className="mt-3 br-20 pt-2 ps-3"
                placeholder="Add bio section 1..."
              ></textarea> */}
              <Textarea
                maxLength={200}
                placeholder="Add bio section 1..."
                value={spotSection1}
                onChange={(e) => setSpotSection1(e.target.value)}
              />

              <ImageUpload
                value={spotSection1image}
                onChange={(e) => setSpotSection1image(e.target.files[0])}
              />
            </div>

            {/*   header 2 */}

            <div className="spot-input-box mt-36">
              <InputBox
                label="header 2"
                subLabel=" "
                id="inputId"
                type="text"
                placeholder=" "
                value={spotHeader2}
                onChange={(e) => setSpotHeader2(e.target.value)}
                disabled={false}
                optional={false}
                maxLength={30}
              />
            </div>

            {/* Section 2 discription */}

            <div className="bio-section mt-60  d-flex flex-column">
              <label className="medium text-black">section 2</label>
              {/* <textarea
                className="mt-3 br-20 pt-2 ps-3"
                placeholder="Add bio section 2..."
              ></textarea>
              <label className="medium text-end pt-2 pe-2 ">0 / 200</label> */}
              <Textarea
                maxLength={200}
                placeholder="Add bio section 2..."
                value={spotSection2}
                onChange={(e) => setSpotSection2(e.target.value)}
              />

              <ImageUpload
                value={spotSection2image}
                onChange={(e) => setSpotSection2image(e.target.files[0])}
              />
            </div>

            {/*   header 3 */}

            <div className="spot-input-box mt-36">
              <InputBox
                label="header 3"
                subLabel=" "
                id="inputId"
                type="text"
                placeholder=" "
                value={spotHeader3}
                onChange={(e) => setSpotHeader3(e.target.value)}
                disabled={false}
                optional={false}
                maxLength={30}
              />
            </div>

            {/* Section 3 discription */}

            <div className="bio-section mt-60  d-flex flex-column">
              <label className="medium text-black">section 3</label>
              {/* <textarea
                className="mt-3 br-20 pt-2 ps-3"
                placeholder="Add bio section 3..."
              />
              <label className="medium text-end pt-2 pe-2">0 / 200</label> */}

              <Textarea
                maxLength={200}
                placeholder="Add bio section 3..."
                value={spotSection3}
                onChange={(e) => setSpotSection3(e.target.value)}
              />

              <ImageUpload
                value={spotSection3image1}
                onChange={(e) => setSpotSection3image1(e.target.files[0])}
              />
              <ImageUpload
                value={spotSection3image2}
                onChange={(e) => setSpotSection3image2(e.target.files[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotLight;
