import React, { useState } from "react";
import error from "../../assets/icon/error.svg";
import close from "../../assets/icon/close-small.svg";
import { useEffect } from "react";

const Textarea = ({
  id,
  name,
  value = "",
  maxLength,
  placeholder,
  onChange,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [characterCount, setCharacterCount] = useState("");
  const [inputValue, setInputValue] = useState("");

  // const handleChange = (event) => {
  //   if (maxLength && event.target.value.length <= maxLength) {
  //     const text = event.target.value;
  //     setCharacterCount(text);
  //     setErrorMessage("");
  //   } else {
  //     setErrorMessage(`Exceeded ${maxLength} characters`);
  //   }
  // };
  const setValueNull = () => {
    setInputValue("");
  };

  useEffect(() => {
    if (inputValue?.length > maxLength) {
      setErrorMessage(true);
    } else {
      setErrorMessage(false);
    }
    setInputValue(value);
  }, [value]);

  return (
    <div>
      <div className="textarea-box ">
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          className="w-100"
          onChange={onChange}
          value={inputValue}
          maxLength={maxLength}
        />
        {inputValue?.length >= maxLength ? (
          <div>
            <img src={error} alt="error" className="abouterror" />
          </div>
        ) : (
          <></>
        )}
        {inputValue?.length > 0 && inputValue?.length < maxLength ? (
          <div>
            <img
              src={close}
              alt="close"
              className="abouterror pointer ps-1"
              onClick={setValueNull}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-between">
        {inputValue?.length >= maxLength ? (
          <p className="warning w-100 ps-1">
            Max. {maxLength} characters for about section
          </p>
        ) : (
          <></>
        )}
        <label
          htmlFor=""
          className="medium word-counter w-100 d-flex justify-content-end"
        >
          {inputValue?.length} / {maxLength}
        </label>
      </div>
    </div>
  );
};

export default Textarea;
