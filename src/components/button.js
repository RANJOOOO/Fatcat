import React from "react";
import loaderWhite from "../../src/assets/icon/loader-small-white.svg";
import loaderBlack from "../../src/assets/icon/loader-small-black.svg";
import "../style/main.scss";
const Button = ({
  text,
  imageSrc,
  className,
  onClick,
  height,
  width,
  disabled,
  imageClassName,
  loading = false,
}) => {
  const buttonClassName = className || "";
  const buttonStyle = {
    minHeight: height,
    minWidth: width,
  };
  const isDisabled = loading ? true : disabled;

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      className={buttonClassName}
      style={buttonStyle}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {imageSrc && (
        <img src={imageSrc} alt="Button Image" className={imageClassName} />
      )}
      {loading ? (
        <>
          <img
            src={
              buttonClassName.includes("btn-primary")
                ? loaderWhite
                : loaderBlack
            }
            alt=""
            className="rotate-360"
          />
        </>
      ) : (
        <>{text}</>
      )}
    </button>
  );
};

export default Button;
