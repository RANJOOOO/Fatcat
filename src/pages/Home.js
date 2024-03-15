import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import LatestNews from "../components/latestNews";
import TrendingArtists from "../components/trendingArtists";
import LiveAuction from "../components/liveAuction";
import Application from "../components/application";
import NewArtists from "../components/newArtists";
import Follow from "../components/follow";
import Footer from "../components/footer";
import StayInformed from "../components/stayInformed";
import StartCollecting from "../components/startCollecting";
import NoNetwork from "../components/noNetwork";
import CounterComponent from "./CounterComponent";
import useScrollToTop from "../customHooks/scrollToTop";

const Home = (valueInView) => {
  useScrollToTop();
  return (
    <div>
      <Hero />
      <StartCollecting />
      {/* related to the auction functionality */}
      {/* <LatestNews /> */}
      <TrendingArtists />
      {/* related to the auction functionality */}
      {/* <LiveAuction /> */}
      <Application />
      <NewArtists />
      <Follow />
      <StayInformed />
      <Footer />
    </div>
  );
};

export default Home;
