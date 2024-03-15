import React from "react";
import { useLocation } from "react-router-dom";
import sale from "../../assets/icon/list-for-sale.svg";
import transfer from "../../assets/icon/transfer.svg";
import copyLink from "../../assets/icon/link.svg";
import view from "../../assets/icon/eye.svg";
import edit from "../../assets/icon/edit.svg";
import share from "../../assets/icon/share.svg";
import report from "../../assets/icon/report.svg";
import refresh from "../../assets/icon/refresh-metadata.svg";
const Dropdown = () => {
  const location = useLocation();
  const pathToHideDiv = "/single-artwork";
  const shouldHideDiv = location.pathname === pathToHideDiv;

  return (
    <div>
      {shouldHideDiv ? (
        <div className="collection-option">
          <div className="collection-item">
            <img src={report} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              Report
            </label>
          </div>
          <div className="collection-item">
            <img src={transfer} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              Transfer
            </label>
          </div>
          <div className="collection-item">
            <img src={share} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              Share
            </label>
          </div>
          <div className="collection-item  ">
            <img src={refresh} alt="sale" className="img-18" />
            <label className="text-black no-text-transform ms-2 pointer">
              Refresh Metadata
            </label>
          </div>
        </div>
      ) : (
        <div className="collection-option">
          <div className="collection-item">
            <img src={sale} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              List for sale
            </label>
          </div>
          <div className="collection-item">
            <img src={transfer} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              Transfer
            </label>
          </div>
          <div className="collection-item">
            <img src={copyLink} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              Copy link
            </label>
          </div>
          <div className="collection-item">
            <img src={view} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              View item
            </label>
          </div>
          <div className="collection-item">
            <img src={edit} alt="sale" />
            <label className="text-black no-text-transform ms-2 pointer">
              Edit item
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
