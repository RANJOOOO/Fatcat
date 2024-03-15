import React, { useState } from "react";
import Button from "../button";
import ImageUpload from "../imageUpload";
import unchecked from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import Textarea from "../shared/textarea";
import { useNavigate } from "react-router-dom";
import UseWindowResize from "../../customHooks/useWindowResize";
import useScrollToTop from "../../customHooks/scrollToTop";
import InputBox from "../shared/inputBox";
import { useEffect } from "react";
import {
  getAllArtistDetails,
  getAllUsers,
  saveFeaturedUser,
} from "../../firebase/firebase";

const Featured = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [FeaturedImage, setFeaturedImage] = useState("");
  const [ArtistAddress, setArtistAddress] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const navigate = useNavigate();

  // match artistAddress with username and if match found then set SelectedUser

  useEffect(() => {
    if (userData?.length > 0 && ArtistAddress) {
      setSelectedUser("");
      const user = userData?.find((user) => user?.documentId === ArtistAddress);
      console.log("user", user);
      if (user) {
        setSelectedUser(user?.data?.name);
      }
    }
  }, [ArtistAddress, userData]);

  // handle changes made

  useEffect(() => {
    if (ArtistAddress || FeaturedImage) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [ArtistAddress, FeaturedImage]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllArtistDetails();
      console.log("User Data", users);
      setUserData(users);
    };
    fetchData();
  }, []);

  const handleSaveChanges = async () => {
    const data = {
      artistAddress: ArtistAddress,
      featuredImage: FeaturedImage,
    };
    console.log("data", data);
    const res = await saveFeaturedUser(data);
    console.log("res", res);
    if (res) {
      setChangesMade(false);
    }
  };

  // Regular expression for allowing only alphabets, numbers, and underscores
  const validationRegex = /^[a-zA-Z0-9_]+$/;

  // Function to handle input change with validation
  const handleAddressChange = (inputValue) => {
    console.log("artistAddress", ArtistAddress);
    console.log("inputValue", inputValue);
    if (validationRegex.test(inputValue) || inputValue === "") {
      // Update the state only if the input is valid or empty
      setArtistAddress(inputValue);
    }
  };
  UseWindowResize(1024, "/admin");
  useScrollToTop();

  return (
    <div>
      <div className="spotlight-wrapper">
        <div className="admin-content-head v-center justify-content-between header-fixed ">
          <h3 className="fw-bold text-capitalize for-desktop">Featured</h3>
          <h6
            className="fw-bold text-capitalize for-mobile"
            onClick={() => navigate(-1)}
          >
            <img src={leftArrow} alt="back" className="me-3" />
            Featured
          </h6>
          <Button
            width="199px"
            height="47px"
            className={`br-30 ${changesMade ? "btn-primary" : "btn-ternary"}`}
            text="Save changes"
            disabled={false}
            onClick={handleSaveChanges}
          />
        </div>

        <div className="spotlight-wrapper-content">
          <div className="artist-details">
            <p className="body-large fw-bold head">Artist Details</p>
            <div className="spot-input-box">
              <label htmlFor="artistSelect" className="medium text-black">
                Select Artist
              </label>
              <select
                id="artistSelect"
                className="form-select mt-2 br-30 bg-white border-black text-black "
                value={ArtistAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
              >
                <option value="" disabled>
                  Select an artist
                </option>
                {userData?.map((user) => (
                  <option key={user?.documentId} value={user?.data?.name}>
                    {user?.data?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Artist address */}
            {/* <div className="spot-input-box"> */}
            {/* everywhere there is an SGB / FLR address field it should follow
              the same error rules */}

            {/* <InputBox
                label="ARTIST ADDRESS"
                subLabel=" "
                id="inputId"
                type="text"
                placeholder="Add FLR address"
                value={ArtistAddress}
                onChange={(e) => handleAddressChange(e.target.value)} // Validate and update artistAddress on change
                optional={false}
                maxLength={30}
              />
            </div> */}

            {/* artist username */}
            {/* <div className="spot-input-box mt-36"> */}
            {/* the disabled filed will fill automatically with the artists
                username once address is filled and admin has clicked ‘save
                changes” */}

            {/* <InputBox
                label="ARTIST Name"
                subLabel=" "
                id="inputId"
                type="text"
                boxClassName="disabled"
                placeholder="@artistName"
                value={selectedUser}
                disabled={true}
                optional={false}
                maxLength={30}
              />
              <p className="body-medium mt-2">
                The artist username will fill automatically from the artists’
                address and cannot be changed manually here.
              </p>
            </div> */}

            {/* FEATURED IMAGES */}
            <div className="featured-images mt-60 ">
              <label className="medium text-black">FEATURED IMAGES</label>
              <p className="mt-2 pb-1">
                These are displayed on the Right bottom pop-up of the home page.
              </p>
              <ImageUpload
                onChange={(e) => setFeaturedImage(e.target.files[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
