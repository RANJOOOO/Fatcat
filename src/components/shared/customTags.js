import React from "react";
import "../../style/main.scss";

const CustomCheckBox = ({ values, disabled, onChange }) => {
  return (
    <div>
      <div className="tag-check-boxes v-center">
        {values ? (
          values.map((value, index) => (
            <div className="tag-box" key={index}>
              <label className="pointer">
                <input
                  type="checkbox"
                  className="d-none"
                  disabled={disabled}
                  value={value}
                  onChange={onChange}
                />
                <p className="fw-500 body-medium">{value}</p>
              </label>
            </div>
          ))
        ) : (
          <p>No values available</p>
        )}
      </div>
    </div>
  );
};


export default CustomCheckBox;
