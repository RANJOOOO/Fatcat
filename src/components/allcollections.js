import React, { useEffect, useState } from "react";
import { getCollections } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Button from "./button";
import LayoutGrid from "./profile/layoutGrid";
import ArtistPopUp from "./shared/artistpopup";
import verified from "../assets/icon/verified-artist-small.svg";
import profile from "../assets/icon/profile-picture.svg";
import userProfile from "../assets/images/face-3.png";
import collection from "../assets/images/artwork-preview-2.png";
import Footer from "./footer";
import { useAccount } from "wagmi";
import { getAllUsers, getCollectionStats } from "../firebase/firebase";
import { useLocation } from "react-router-dom";

function AllCollections() {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();
  const getUserCollections = async () => {
    const usercollections = await getCollections();
    const filterCollection = usercollections?.filter(
      (item) => item?.data?.isWhiteList === true
    );
    console.log(filterCollection);
    setCollections(filterCollection);
  };
  useEffect(() => {
    getUserCollections();
  }, []);

  useEffect(() => {
    console.log("collection", collections);
  }, [collections]);

  const [userData, setUserData] = useState([]);
  const [collectionDetails, setCollectionDetails] = useState([]);

  const [collectionArray, setCollectionArray] = useState([]);

  useEffect(() => {
    collections.map(async (collection) => {
      const collectionData = await getCollectionStats(collection?.documentId);
      console.log("collectionDetails", collectionDetails);
      setCollectionArray((prev) => [...prev, collectionData]);
    });
    console.log("collectionDetail 111222333", collectionArray);
    setCollectionDetails(collectionArray);
  }, [collections]);

  useEffect(() => {
    console.log("collectionArray", collectionArray);
  }, [collectionArray]);

  useEffect(() => {
    const fetchUserData = async () => {
      const users = await getAllUsers();
      console.log("users", users);
      setUserData(users);
    };
    fetchUserData();
  }, []);

  const getArtistNamebyAdress = (ArtistAddress) => {
    let artistName = "";
    if (address === ArtistAddress) {
      return "You";
    }

    console.log("users", userData);
    userData?.map((user) => {
      if (user?.id === ArtistAddress) {
        artistName = user?.userName;
      }
    });

    console.log("artist name", artistName, "address", ArtistAddress);
    return artistName;
  };

  return (
    <>
      <div className="d-flex g-4 bg-grey pt-5 align-items-start h-100 d-none">
        {collections.map((item, index) => {
          return (
            <div key={index} className="card p-2 m-2">
              <label className="text-black">{item.data.name}</label>
              <div>{item.data.symbol}</div>
              <Button
                onClick={() =>
                  navigate(`/explore-collections/${item.documentId}`)
                }
                text="Explore Collection"
                className="btn-prime btn-primary br-30 mt-3"
                height="40px"
                width="200px"
              ></Button>
            </div>
          );
        })}
        {/* <LayoutGrid nfts={collections} /> */}
        <br />
      </div>
      <div className="p-3">
        <div className="grid-display">
          {collections.map((item, index) => {
            console.log("item", item);
            let artCount = "---";
            let collectorCount = "---";
            collectionArray.map((collection) => {
              if (collection?.collectionId === item?.documentId) {
                artCount = collection?.artworkCount;
                collectorCount = collection?.owners?.length || 1;
              }
            });
            return (
              <div
                className="collection-grid-card"
                key={index}
                onClick={() =>
                  navigate(`/explore-collections/${item.documentId}/`)
                }
              >
                <div className="card-head  ">
                  <div className="user-img">
                    <img
                      src={item.data?.image ? item.data?.image : userProfile}
                      alt="profile image"
                      className="img-100 rounded-circle"
                    />
                  </div>

                  <div className="user-name">
                    <p className="body-large hover-underline pointer">
                      {item.data.name}
                    </p>
                    <p className="fw-bold text-medium-grey hoverBlack show-artist-popup ">
                      @{getArtistNamebyAdress(item.data.address)}
                      <img
                        src={verified}
                        alt="verified"
                        className="img-18 ms-1"
                      />
                      <ArtistPopUp
                        userProfile={userProfile}
                        verified={verified}
                        artistName={getArtistNamebyAdress(item.data.address)} // passing artist as prop
                        left="-60px"
                        top="-215px"
                      />
                    </p>
                  </div>
                </div>

                <div className="card-body">
                  <div className="art-img">
                    <img
                      src={
                        item.data?.featureImage
                          ? item.data?.featureImage
                          : collection
                      }
                      alt="art"
                      className="img-100 artwork-hover"
                    />
                  </div>
                </div>

                <div className="card-footer">
                  <div className="owner" style={{ maxWidth: "200px" }}>
                    <p className="body-medium text-medium-grey ">
                      Collection Size
                    </p>
                    <p className="body-medium text-black fw-semibold ">
                      {artCount} Artworks
                    </p>
                  </div>

                  <div className="offer">
                    <p className="body-medium text-medium-grey ">Collectors</p>
                    <label className="medium text-black ">
                      {collectorCount} Collectors
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-5">
        <Footer />
      </div>
    </>
  );
}

export default AllCollections;
