import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import leftArrow from "../../assets/icon/chevron-left-small.svg";
import Notifications from "../notifications";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import UseWindowResize from "../../customHooks/useWindowResize";
import useScrollToTop from "../../customHooks/scrollToTop";
import {
  getSalesAndWhitelistedStats,
  getAdminStats,
} from "../../firebase/firebase";
import { useAccount } from "wagmi";
import marketplaceContractABI from "../../abis/Marketplace/v3/abi.json";
import Web3 from "web3";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("All");
  const [metrics, setMetrics] = useState(dateRange);
  const [sale, setSale] = useState(0);
  const [whiteListedArtist, setWhiteListedArtist] = useState(0);
  const [volumeSGB, setVolumeSGB] = useState(0);
  const [volumeFLR, setVolumeFLR] = useState(0);
  const [volumeUSD, setVolumeUSD] = useState(0);
  const [commissionUSD, setCommissionUSD] = useState(0);
  const [commisionSGB, setCommissionSGB] = useState(0);
  const [commisionFLR, setCommissionFLR] = useState(0);

  const Marketplace_coston_contractAddress =
    process.env.REACT_APP_COSTON_MARKEPLACE_CONTRACTADDRESS;
  const Marketplace_coston2_contractAddress =
    process.env.REACT_APP_COSTON2_MARKEPLACE_CONTRACTADDRESS;
  const contractABI = marketplaceContractABI;

  const web3_coston = new Web3(process.env.REACT_APP_COSTON_RPC_URL);
  const web3_coston2 = new Web3(process.env.REACT_APP_COSTON2_RPC_URL);

  const getSaleFromContracts = async () => {
    const contract = new web3_coston.eth.Contract(
      contractABI,
      Marketplace_coston_contractAddress
    );
    const contract2 = new web3_coston2.eth.Contract(
      contractABI,
      Marketplace_coston2_contractAddress
    );
    console.log("contract: ", contract);
    console.log("contract2: ", contract2);
    const sales = await contract.methods.totalSales().call();
    const sales2 = await contract2.methods.totalSales().call();
    console.log("sales: ", sales);
    console.log("sales2: ", sales2);
    setSale(parseInt(sales) + parseInt(sales2));
    const commision = await contract.methods.commission().call();
    // const buyerCommision = await contract.methods.totalBuyerFee().call();
    const commision2 = await contract2.methods.commission().call();
    // const buyerCommision2 = await contract2.methods.totalBuyerFee().call();
    // setCommissionUSD(commision + commision2)
    setCommissionSGB(commision);
    setCommissionFLR(commision2);
    const sgbVolume = await contract.methods.totalVolume().call();
    const flrVolume = await contract2.methods.totalVolume().call();
    setVolumeSGB(sgbVolume);
    setVolumeFLR(flrVolume);
    console.log("sgbVolume: ", sgbVolume);
    console.log("flrVolume: ", flrVolume);
    console.log("commissionUSD: ", commissionUSD);
    console.log("sales: ", sales);
  };

  useEffect(() => {
    getSaleFromContracts();
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (dateRange === "All") {
      setMetrics("All-time ");
    } else if (dateRange === "24h") {
      setMetrics("Last 24 hours  ");
    } else if (dateRange === "7d") {
      setMetrics("Last 7 days ");
    } else if (dateRange === "30d") {
      setMetrics("Last 30 days  ");
    }
  }, [dateRange]);

  useEffect(() => {
    getSalesAndWhitelisted();
    getStats();
  }, []);

  const getStats = async () => {
    const stats = await getAdminStats();
    console.log("stats: ", stats);
  };

  const getSalesAndWhitelisted = async () => {
    const stats = await getSalesAndWhitelistedStats();
    console.log("stats: ", stats);
    // setSale(stats?.sales);
    setWhiteListedArtist(stats?.whitelistedArtists);
  };

  const handleTabClick = (tab) => {
    setDateRange(tab);
  };
  const state = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };

  UseWindowResize(1024, "/admin");
  useScrollToTop();
  return (
    <div>
      <div className="admin-content-head  v-center justify-content-between flex-row header-fixed ">
        {/* Header for desktop */}
        <h3 className="fw-bold text-capitalize for-desktop">Dashboard</h3>
        {/* Header for mobile */}
        <h6
          className="fw-bold text-capitalize for-mobile"
          onClick={() => navigate(-1)}
        >
          <img src={leftArrow} alt="back" className="me-3" />
          Dashboard
        </h6>

        {/* Toggle between date range */}
        {/* <div className="white-labels v-center gap-2 hide-on-mobile">
          <label
            className={` ${dateRange === "24h" ? "active" : ""}`}
            onClick={() => handleTabClick("24h")}
          >
            24h
          </label>
          <label
            className={` ${dateRange === "7d" ? "active" : ""}`}
            onClick={() => handleTabClick("7d")}
          >
            7d
          </label>
          <label
            className={` ${dateRange === "30d" ? "active" : ""}`}
            onClick={() => handleTabClick("30d")}
          >
            30d
          </label>
          <label
            className={` ${dateRange === "All" ? "active" : ""}`}
            onClick={() => handleTabClick("All")}
          >
            All
          </label>
        </div>

        <div className="date-range-mb hide-on-desktop">
          <Dropdown>
            <Dropdown.Toggle>
              <p className="body-large">{dateRange}</p>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleTabClick("24h")}>
                <p className="body-large">24h</p>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("7d")}>
                <p className="body-large">7d</p>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("30d")}>
                <p className="body-large">30d</p>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTabClick("All")}>
                <p className="body-large">All</p>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> */}
      </div>

      <div className="dashboard-wrapper">
        <div className="toggle-spotlight">
          <p className="body-large fw-bold mt-5 pt-2">
            Overview Metrics
            <span className="fw-normal ms-3 ps-1">{metrics}</span>
          </p>
        </div>

        <div className="data-boxes mt-36">
          <div className="data-box">
            <label className="fw-bold text-black">{sale}</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">Sales</p>
          </div>

          <div className="data-box">
            <label className="fw-bold text-black">{volumeSGB}</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">
              Volume (SGB)
            </p>
          </div>

          <div className="data-box">
            <label className="fw-bold text-black">{volumeFLR}</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">
              Volume (FLR)
            </p>
          </div>

          {/* <div className="data-box">
            <label className="fw-bold text-black">$104,022</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">
              Volume (USD)
            </p>
          </div> */}
          <div className="data-box">
            <label className="fw-bold text-black">{commisionSGB}</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">
              Commission (SGB)
            </p>
          </div>
          <div className="data-box">
            <label className="fw-bold text-black">{commisionFLR}</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">
              Commission (FLR)
            </p>
          </div>

          <div className="data-box">
            <label className="fw-bold text-black">{whiteListedArtist}</label>
            <p className="body-small fw-bold  pt-2 text-medium-grey">
              Whitelisted Artists
            </p>
          </div>
        </div>

        <div className="volume">
          <p className="body-large fw-bold">Volume</p>
          <div id="chart_div" className="overflow-hidden">
            <Chart
              options={state.options}
              series={state.series}
              type="line"
              className="volume-chart"
            />
          </div>
        </div>

        <div className="notification">
          <Notifications
            activeClass="active"
            hide="hide-content"
            noBorder="border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
