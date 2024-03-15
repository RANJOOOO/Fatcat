import React, { useEffect } from "react";
import "../style/main.scss";
import SectionHeader from "./sectionHeader";
import img1 from "../assets/images/face-3.png";
import img2 from "../assets/images/face-4.png";
import img3 from "../assets/images/face-9.png";
import img4 from "../assets/images/face-7.png";
import img5 from "../assets/icon/circleSuccess.svg";
import arrowAnglrRight from "../assets/icon/arrow-angle-right.svg";
import star from "../assets/icon/spiked-circle/black/45px.svg";
import { getNewArtists } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const NewArtists = () => {
  const navigate = useNavigate();
  const [newArtist, setNewArtist] = React.useState([]);

  useEffect(() => {
    getNewArtists().then((data) => {
      setNewArtist(data);
    });
  }, []);

  // New artist data
  // const newArtist = [
  //   {
  //     img: img1,
  //     name: " @bottoproject",
  //   },
  //   {
  //     img: img2,
  //     name: " @bottoproject",
  //   },
  //   {
  //     img: img3,
  //     name: " @bottoproject",
  //   },
  //   {
  //     img: img4,
  //     name: " @bottoproject",
  //   },
  // ];

  return (
    <>
      <section className="trending-artist site-container">
        {/* <SectionHeader title="new" title2="artists" isImage={true} img={img5} /> */}
        <div>
          <div className="section-header">
            <div className="head-img">
              <img src={star} alt="star" className="img-45" />
            </div>
            <h5 className="section-head">
              <img src={img5} alt="circle" />
              <span>new</span>
              artists
            </h5>
            <div className="view-more"></div>
          </div>
        </div>
        <div className="trending-artist-content">
          {/* Using map function to get new artist data */}
          {newArtist.map((item, index) => {
            return (
              <div
                className="t-artist-card"
                key={index}
                onClick={() => navigate(`/profile/${item?.name}`)}
              >
                <div className="t-artist-card-head">
                  <img
                    src={item?.image ? item?.image : img1}
                    alt="card img"
                    className="img-100"
                  />
                </div>
                <p className="body-large">
                  {item?.name}
                  <span>new</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default NewArtists;
