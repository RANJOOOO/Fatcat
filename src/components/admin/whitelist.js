import React, { useEffect, useState } from "react";
import ListTable from "./listTable";
import "../../style/main.scss";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UseWindowResize from "../../customHooks/useWindowResize";
import {
  getAppliedArtistsFirebase,
  updateAppliedArtistsFirebase,
  getCollections,
} from "../../firebase/firebase";
const Whitelist = () => {
  const navigate = useNavigate();

  const [selectList, setSelectList] = useState("artist");
  const [artistDetails, setArtistDetails] = useState([]);
  const [collectionDetails, setCollectionDetails] = useState([]);
  const [list, setList] = useState([]);
  const [Whitelisted, setWhitelisted] = useState(selectList);
  const [refresh, setRefresh] = useState(false);

  const handleTabClick = (tab) => {
    setSelectList(tab);
  };

  const getArtists = async () => {
    const artist = await getAppliedArtistsFirebase();
    console.log("Artist: ", artist);
    const filterArtist = artist?.filter(
      (item) => item?.approved === true && item?.isBlacklisted === false
    );
    setArtistDetails(filterArtist);
  };
  useEffect(() => {
    console.log("refresh: ", refresh);
    if (refresh === true) {
      getArtists();
      getWhiteListCollections();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    getArtists();
    getWhiteListCollections();
  }, []);

  const getWhiteListCollections = async () => {
    const collecton = await getCollections();
    console.log("white list collecton: ", collecton);
    const filterCollection = collecton?.filter(
      (item) =>
        item?.data?.isWhiteList === true && item?.data?.isBlackList === false
    );
    setCollectionDetails(filterCollection);
  };
  useEffect(() => {
    if (selectList === "artist") {
      console.log("artist Details: ", artistDetails);
      setList(artistDetails);
      setWhitelisted("Whitelisted Artists");
      // setWhitelisted(artistDetails);
    } else if (selectList === "collection") {
      console.log("Collections Details: ", collectionDetails);
      setList(collectionDetails);
      setWhitelisted("Whitelisted Collections");
    }
  }, [selectList, artistDetails, collectionDetails]);
  UseWindowResize(1024, "/admin");
  return (
    <div>
      <div className="white-list">
        <div className="admin-content-head      v-center justify-content-between flex-row header-fixed ">
          {/* Header for desktop */}
          <h3 className="fw-bold    text-capitalize for-desktop">
            Whitelisting
          </h3>
          {/* Header for mobile */}
          <h6
            className="fw-bold   text-capitalize for-mobile"
            onClick={() => navigate(-1)}
          >
            <img src={leftArrow} alt="back" className="me-3" />
            Whitelisting
          </h6>

          {/* Toggle between Artist and Collections */}
          <div className="white-labels v-center gap-2 hide-on-mobile">
            <label
              className={` ${selectList === "artist" ? "active" : ""}`}
              onClick={() => handleTabClick("artist")}
            >
              Artists
            </label>
            <label
              className={` ${selectList === "collection" ? "active" : ""}`}
              onClick={() => handleTabClick("collection")}
            >
              Collections
            </label>
          </div>

          <div className="date-range-mb hide-on-desktop">
            <Dropdown>
              <Dropdown.Toggle>
                <p className="body-large">{selectList}</p>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleTabClick("artist")}>
                  <p className="body-large">artist</p>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTabClick("collection")}>
                  <p className="body-large">Collections</p>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <ListTable
          hide=""
          list={Whitelisted}
          data={list}
          type={selectList}
          page={"whitelist"}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      </div>
    </div>
  );
};

export default Whitelist;
