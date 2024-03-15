import { useNavigate } from "react-router-dom";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  getAppliedArtistsFirebase,
  updateAppliedArtistsFirebase,
} from "../../firebase/firebase";
const ArtistApllied = () => {
  const [artistDetails, setArtistDetails] = useState([]);

  const getArtists = async () => {
    const artist = await getAppliedArtistsFirebase();
    console.log("Artist: ", artist);
    const filterArtist = artist?.filter(
      (item) => item?.approved === false && item?.isBlacklisted === false
    );
    setArtistDetails(filterArtist);
  };

  const handleApprove = async (id) => {
    console.log("id: ", id);
    updateAppliedArtistsFirebase(id, true, false);
    getArtists();
  };

  const handleReject = async (id) => {
    console.log("id: ", id);
    updateAppliedArtistsFirebase(id, false, true);
    getArtists();
  };

  useEffect(() => {
    getArtists();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <div className="admin-content-head flex-row v-center justify-content-between header-fixed ">
        {/* Header for desktop */}
        <h3 className="fw-bold text-capitalize for-desktop">Artist Applied</h3>
        {/* Header for mobile */}
        <h6
          className="fw-bold text-capitalize for-mobile"
          onClick={() => navigate(-1)}
        >
          <img src={leftArrow} alt="back" className="me-3" />
          Artist Applied
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
            <th>Email</th>
            <th>Creation Time</th>
            <th>All Links</th>
            <th>How Did You Hear</th>
            <th>Instagram</th>
            <th>Name</th>
            <th>Portfolio</th>
            <th>Selection Of Artwork</th>
            <th>Story Behind</th>
            <th>Twitter</th>
            <th>Video Link</th>
            <th>Action </th>
          </thead>
          <tbody>
            {artistDetails?.map((artist) => (
              <tr>
                <td>{artist?.email}</td>
                <td>{new Date(artist?.creationTime).toLocaleString()}</td>
                <td>{artist?.allLinks}</td>
                <td>{artist?.howDidYouHear}</td>
                <td>{artist?.instagram}</td>
                <td>{artist?.name}</td>
                <td>{artist?.portfolio}</td>
                <td>{artist?.selectionOfArtwork}</td>
                <td>{artist?.storyBehind}</td>
                <td>{artist?.twitter}</td>
                <td>{artist?.videoLink}</td>
                <td>
                  <button
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                    }}
                    onClick={() => handleApprove(artist?.id)}
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
                    onClick={() => handleReject(artist?.id)}
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
export default ArtistApllied;
