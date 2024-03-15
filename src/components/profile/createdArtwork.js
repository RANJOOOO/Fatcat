import React from "react";
import sad from "../../assets/icon/sad-face.svg";
import Button from "../button";
import "../../style/main.scss";
import { useNavigate } from "react-router-dom";
const CreatedArtwork = ({ userDataByUserName }) => {
  const navigate = useNavigate();
  const createArtwork = () => {
    navigate("/create-art/");
  };
  return (
    <>
      <div className="created-artwork">
        <div className="no-content ">
          <img src={sad} alt="sad" />
          <p className="body-large">
            {userDataByUserName
              ? `${userDataByUserName?.documentData?.userName} `
              : "You "}
            haven’t <span>created </span>
            any artwork yet.
          </p>
          {userDataByUserName ? (
            <></>
          ) : (
            <Button
              text="Create Artwork"
              width="166px"
              height="36px"
              className="btn-prime btn-primary"
              onClick={createArtwork}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CreatedArtwork;
