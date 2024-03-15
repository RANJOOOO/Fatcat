import React from "react";
import userProfile from "../../assets/images/face-3.png";
import verified from "../../assets/icon/verified-artist-small.svg";
import ArtistPopUp from "./artistpopup";

const UserProfile = (props) => {
  return (
    <div>
      {/* <div className="v-center me-5 userProfile"> */}
      <div className="v-center userProfile">
        <div className="user-img ">
          <img src={userProfile} alt="profile image" className="img-100" />
        </div>

        <div className="user-name d-flex flex-column">
          <label className="medium fw-normal text-capitalize">
            {props.status}
          </label>
          <p className="body-small fw-bold text-black no-text-transform show-artist-popup pointer hover-underline">
            @artistsName
            <ArtistPopUp
              userProfile={userProfile}
              verified={verified}
              left="-60px"
              top="-215px"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
