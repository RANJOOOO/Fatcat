import React from "react";
import { Dropdown } from "react-bootstrap";
import "../../style/main.scss";
import { useEffect, useState } from "react";
// import Chart from "react-google-charts";
import Chart from "react-apexcharts";

const AnalyticsCollection = (props) => {
  const [collectionData, setCollectionData] = useState([]);
  const [volume, setVolume] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [saleCount, setSaleCount] = useState(0);
  const [floorPriceData, setFloorPriceData] = useState({
    date: [],
    price: [],
  });
  const [volumeData, setVolumeData] = useState({
    date: [],
    price: [],
  });

  useEffect(() => {
    console.log("analytics props", props);
    if (props.stats) {
      setCollectionData(props?.stats);
      setSaleCount(props?.stats?.saleCount);
      if (props?.stats?.volume?.length > 0) {
        setVolume(
          props?.stats?.volume[props?.stats?.volume?.length - 1].split("-")[0]
        );
        // Creating an array of objects with date and price properties
        const volumeFilter = props?.stats?.volume.map((item) => {
          const [price, timestamp] = item.split("-");
          const date = new Date(parseInt(timestamp))
            .toISOString()
            .split("T")[0]; // Convert milliseconds to Date and get YYYY-MM-DD format
          console.log("Date item", date);
          return { date, price };
        });

        console.log("volumeFilter", volumeFilter);

        setVolumeData({
          date: volumeFilter.map((item) => item.date),
          price: volumeFilter.map((item) => item.price),
        });
      }
      if (props?.stats?.floorPrice?.length > 0) {
        setFloorPrice(
          props?.stats?.floorPrice[props?.stats?.floorPrice?.length - 1].split(
            "-"
          )[0] || "0"
        );

        const floorPriceFilter = props?.stats?.floorPrice.map((item) => {
          const [price, timestamp] = item.split("-");
          const date = new Date(parseInt(timestamp))
            .toISOString()
            .split("T")[0]; // Convert milliseconds to Date and get YYYY-MM-DD format
          console.log("Date item", date);
          return { date, price };
        });

        console.log("floorPriceFilter", floorPriceFilter);

        setFloorPriceData({
          date: floorPriceFilter.map((item) => item.date),
          price: floorPriceFilter.map((item) => item.price),
        });
      }
    }
  }, [props?.stats]);

  const floorPriceState = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        categories: floorPriceData.date,
      },
    },
    series: [
      {
        name: "series-1",
        // data: [30, 40, 45, 50, 49, 60, 70, 91],
        data: floorPriceData.price,
      },
    ],
  };

  const volumeState = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        categories: volumeData.date,
      },
    },
    series: [
      {
        name: "series-1",
        // data: [30, 40, 45, 50, 49, 60, 70, 91],
        data: volumeData.price,
      },
    ],
  };

  return (
    <div>
      <div className="analytics ">
        {/* <div className="create-artwork pt-2">
          <Dropdown className="select-collection">
            <Dropdown.Toggle id="dropdown-basic">
              My Special Collection
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <Dropdown.Item>Action</Dropdown.Item>
              <Dropdown.Item>Another action</Dropdown.Item>
              <Dropdown.Item>Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> */}

        <div className="valueBox-wrapper mt-30 d-flex">
          <div className="value-box">
            <p className="body-medium">Floor Price</p>
            <h5 className="font-26 fw-bold no-text-transform">
              {floorPrice} FLR
            </h5>
          </div>

          <div className="value-box">
            <p className="body-medium">Volume</p>
            <h5 className="font-26 fw-bold no-text-transform">{volume} FLR</h5>
          </div>

          <div className="value-box">
            <p className="body-medium">Sales</p>
            <h5 className="font-26 fw-bold no-text-transform">
              {collectionData?.saleCount}
            </h5>
          </div>
        </div>

        <div className="analysis-chart v-center   ">
          <div className="analysis  ">
            <div id="chart_div" className="overflow-hidden">
              <Chart
                options={volumeState.options}
                series={volumeState.series}
                type="line"
                width="400px"
                className="volume-chart mt-5"
              />
            </div>
            <label htmlFor="" className="text-black no-text-transform">
              Volume
            </label>
          </div>
          <div className="analysis">
            <div id="chart_div" className="overflow-hidden">
              <Chart
                options={floorPriceState.options}
                series={floorPriceState.series}
                type="line"
                width="400px"
                className="volume-chart mt-5"
              />
            </div>
            <label htmlFor="" className="text-black no-text-transform">
              Floor Price
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCollection;
