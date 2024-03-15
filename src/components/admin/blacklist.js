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
import { set } from "firebase/database";

const Blacklist = () => {
  const navigate = useNavigate();
  const [selectList, setSelectList] = useState("artist");
  const [artistDetails, setArtistDetails] = useState([]);
  const [collectionDetails, setCollectionDetails] = useState([]);
  const [list, setList] = useState([]);
  const [Blacklisted, setBlacklisted] = useState(selectList);
  const [refresh, setRefresh] = useState(false);

  const handleTabClick = (tab) => {
    setSelectList(tab);
  };

  const getArtists = async () => {
    const artist = await getAppliedArtistsFirebase();
    console.log("Artist: ", artist);
    const filterArtist = artist?.filter(
      (item) => item?.approved === false && item?.isBlacklisted === true
    );
    setArtistDetails(filterArtist);
  };

  useEffect(() => {
    console.log("refresh: ", refresh);
    if (refresh === true) {
      getArtists();
      getBlackListCollections();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    getArtists();
    getBlackListCollections();
  }, []);

  const getBlackListCollections = async () => {
    const collecton = await getCollections();
    console.log("collecton: ", collecton);
    const filterCollection = collecton?.filter(
      (item) =>
        item?.data?.isBlackList === true && item?.data?.isWhiteList === false
    );
    setCollectionDetails(filterCollection);
  };
  useEffect(() => {
    if (selectList === "artist") {
      console.log("artist Details: ", artistDetails);
      setList(artistDetails);
      setBlacklisted("Blacklisted Artists");
      // setBlacklisted(artistDetails);
    } else if (selectList === "collection") {
      console.log("Collections Details: ", collectionDetails);
      setList(collectionDetails);
      setBlacklisted("Blacklisted Collections");
    }
  }, [selectList, artistDetails, collectionDetails]);
  UseWindowResize(1024, "/admin");
  return (
    <div>
      <div className="white-list">
        <div className="admin-content-head      v-center justify-content-between flex-row header-fixed ">
          {/* Header for desktop */}
          <h3 className="fw-bold    text-capitalize for-desktop">
            Blacklisting
          </h3>
          {/* Header for mobile */}
          <h6
            className="fw-bold   text-capitalize for-mobile"
            onClick={() => navigate(-1)}
          >
            <img src={leftArrow} alt="back" className="me-3" />
            Blacklisting
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
          list={Blacklisted}
          data={list}
          type={selectList}
          page={"blacklist"}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      </div>
    </div>
  );
};

export default Blacklist;
