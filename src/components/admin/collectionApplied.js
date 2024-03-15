import { useNavigate } from "react-router-dom";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  getCollections,
  updateCollectionStatus,
} from "../../firebase/firebase";
const CollectionApllied = () => {
  const [collectionDetails, setCollectiontDetails] = useState([]);

  const getCollection = async () => {
    const collection = await getCollections();
    console.log("Collection: ", collection);
    const filterCollection = collection?.filter(
      (item) =>
        item?.data?.isWhiteList === false && item?.data?.isBlackList === false
    );
    setCollectiontDetails(filterCollection);
  };

  const handleApprove = async (id) => {
    console.log("id: ", id);
    updateCollectionStatus(id, true, false);
    getCollection();
  };

  const handleReject = async (id) => {
    console.log("id: ", id);
    updateCollectionStatus(id, false, true);
    getCollection();
  };

  useEffect(() => {
    getCollection();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <div className="admin-content-head flex-row v-center justify-content-between header-fixed ">
        {/* Header for desktop */}
        <h3 className="fw-bold text-capitalize for-desktop">
          Collection Apllied
        </h3>
        {/* Header for mobile */}
        <h6
          className="fw-bold text-capitalize for-mobile"
          onClick={() => navigate(-1)}
        >
          <img src={leftArrow} alt="back" className="me-3" />
          Collection Applied
        </h6>

        {/* button is disabled until some state has changed on the page */}
        {/* when some data is changed or entered in form fields then save changes button btn-ternary class will replace with btn-primary  */}
        {/* <Button
            width="170px"
            height="47px"
            className=" br-30 btn-prime btn-ternary "
            text="Save changes"
            disabled="disabled"
          /> */}
      </div>
      <div className="appliedFormWrapper">
        <table className="appliedForm">
          <thead>
            <th>Creator</th>
            <th>Contract Address</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Action </th>
          </thead>
          <tbody>
            {collectionDetails?.map((collection) => (
              <tr>
                <td>{collection?.data?.address}</td>
                <td>{collection?.data?.contractAddress}</td>
                <td>{collection?.data?.name}</td>
                <td>{collection?.data?.symbol}</td>

                <td>
                  <button
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                    }}
                    onClick={() => handleApprove(collection?.documentId)}
                  >
                    Approve
                  </button>
                  <span> </span>
                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                    }}
                    onClick={() => handleReject(collection?.documentId)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default CollectionApllied;
