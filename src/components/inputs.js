import React from "react";

const Input = ({
  id,
  type,
  value,
  onChange,
  className,
  placeholder,
  disabled,
}) => {
  return (
    <>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
      />
    </>
  );
};

export default Input;
