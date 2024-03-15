import React, { useEffect, useState } from "react";
import Input from "../inputs";
import close from "../../assets/icon/close-small.svg";
import error from "../../assets/icon/error.svg";
import email from "../../assets/icon/email.svg";
import verifiedIco from "../../assets/icon/tick.svg";

import "../../style/main.scss";
const InputBox = ({
  label,
  subLabel,
  labelClass,
  id,
  name,
  type,
  maxLength,
  className,
  boxClassName,
  placeholder,
  disabled,
  optional,
  warningMessage,
  value = "",
  onChange,
  pending,
  verifiedUser,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [characterCount, setCharacterCount] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const setValueNull = () => {
    setInputValue("");
  };

  useEffect(() => {
    if (inputValue?.length > maxLength) {
      setErrorMessage(true);
    }
    setInputValue(value);
  }, [value]);

  return (
    <div>
      <div className={` custom-inputBox   `}>
        <div className="input-label v-center justify-content-between">
          <label className={`text-black medium  ${labelClass}`}>
            {label}
            <span className="body-medium text-capitalize fw-500 text-medium-grey ms-2">
              {subLabel}
            </span>
          </label>
          {optional ? (
            <label className="body-medium no-text-transform fw-500 text-medium-grey ms-2 me-2">
              {optional}
            </label>
          ) : (
            <></>
          )}
        </div>
        <div className={` input-box mt-3  ${boxClassName}`}>
          <input
            id={id}
            name={name}
            type={type}
            value={inputValue}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={className}
          />

          {inputValue.length > 0 ? (
            disabled == "disabled" ? (
              <></>
            ) : (
              <img
                src={close}
                alt="close"
                className="cls-btn pointer"
                onClick={setValueNull}
              />
            )
          ) : (
            <></>
          )}
          {errorMessage ? (
            <img src={error} alt="error" className="cls-btn " />
          ) : (
            <></>
          )}

          {pending ? (
            <label className=" small pending-btn text-black v-center h-center cls-btn">
              pending
            </label>
          ) : (
            <></>
          )}

          {verifiedUser ? (
            <img src={verifiedIco} alt="error" className="cls-btn " />
          ) : (
            <></>
          )}
        </div>
        <div>
          {errorMessage ? <p className="warning">{warningMessage}</p> : <></>}
        </div>

        {maxLength ? (
          <div className="d-flex ps-2 align-items-center justify-content-between">
            {inputValue.length >= maxLength ? (
              <p className="warning w-100">
                Max. {maxLength} characters for this section
              </p>
            ) : (
              <></>
            )}
            <label
              htmlFor=""
              className="medium word-counter w-100 d-flex justify-content-end mt-2"
            >
              {inputValue.length} / {maxLength}
            </label>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default InputBox;
