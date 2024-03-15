import React from "react";
import Button from "./button";
import sad from "../assets/icon/sad-face.svg";

const NoContent = (props) => {
  const { buttonText, messageSpan, showButton } = props;

  return (
    <div>
      <div className="no-content ">
        <img src={sad} alt="sad" />
        <p className="body-large">
          You haven’t <span>{messageSpan} </span>
          any artwork yet.
        </p>
        {showButton && (
          <Button
            text={buttonText}
            width="166px"
            height="36px"
            className="btn-prime btn-primary"
            onClick={props.onClick}
          />
        )}
      </div>
    </div>
  );
};

export default NoContent;
