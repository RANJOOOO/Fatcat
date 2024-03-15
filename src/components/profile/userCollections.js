import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import Button from "../button";
import NoContent from "../noContent";
import { useNavigate } from "react-router-dom";

import { getCollections } from "../../firebase/firebase";

const UserCollections = (props) => {
  const navigate = useNavigate();
  // getting collections from firebase
  let username = localStorage?.getItem("userName");
  let wallet = localStorage?.getItem("wagmi.store");
  wallet = JSON.parse(wallet);
  console.log("wallet", wallet);
  const [collections, setCollections] = useState([]);
  // const navigate = useNavigate();
  const getUserCollections = async () => {
    const usercollections = await getCollections();
    console.log("user collections", usercollections);
    setCollections(usercollections);
  };
  useEffect(() => {
    getUserCollections();
  }, []);

  useEffect(() => {
    console.log(collections);
  }, [collections]);

  const startCollecting = () => {
    console.log("collect art");
  };

  return (
    <div>
      <div className="collected-arts ">
        {collections < 1 && (
          <div className={` ${props.propFromCollections}`}>
            <NoContent
              buttonText="Start collecting"
              messageSpan={<span>collected</span>}
              onClick={startCollecting}
            />
          </div>
        )}

        {/* User having  arts */}

        <div className="have-arts">
          <div className="d-flex g-4 bg-grey pt-5 align-items-start h-100">
            {collections.map(
              (item, index) =>
                item?.data?.address === wallet?.state?.data?.account && (
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
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCollections;
