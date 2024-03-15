import React, { useEffect, useState } from "react";
import "../style/main.scss";
import SectionHeader from "./sectionHeader";
import img1 from "../assets/images/face-3.png";
import img2 from "../assets/images/face-4.png";
import img3 from "../assets/images/face-9.png";
import img4 from "../assets/images/face-7.png";
import { getTrendingArtist, getAllArtistDetails } from "../firebase/firebase";

const TrendingArtists = () => {
  const [trendArtist, setTrendArtist] = useState([]);
  const [allArtist, setAllArtist] = useState([]);
  const getTrendingArtists = async () => {
    const artist = await getTrendingArtist();
    console.log("artist: ", artist);
    setTrendArtist(artist);
    const Artist = await getAllArtistDetails();
    console.log("Artist: ", Artist);
    setAllArtist(Artist);
  };
  useEffect(() => {
    getTrendingArtists();
  }, []);

  // // trending artist data
  // const trendArtist = [
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
        <SectionHeader
          title="Trending"
          title2="artists"
          isImage={false}
          link={"/stats"}
        />

        <div className="trending-artist-content">
          {/* using map function to get data of trending artist */}
          {trendArtist.map((item, index) => {
            console.log("item: ", item);
            return (
              <div className="t-artist-card" key={index}>
                <div className="t-artist-card-head">
                  <img
                    src={item?.image ? item?.image : img1}
                    alt="card img"
                    className="img-100"
                  />
                </div>
                <p className="body-large">{item.name}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default TrendingArtists;
