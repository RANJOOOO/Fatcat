import React, { useEffect, useState } from "react";
import "../../style/main.scss";
import { Tab, Tabs } from "react-bootstrap";
// icons
import star20 from "../../assets/icon/spiked-circle/black/24px.svg";
import grid from "../../assets/icon/display-grid.svg";
import artwork from "../../assets/icon/display-artwork.svg";
import collection from "../../assets/icon/collection.svg";
import ExploreArt from "./exploreArt";
import useScrollToTop from "../../customHooks/scrollToTop";
import AllCollections from "../allcollections";
import LayoutDropGrid from "./layoutDropGrid";
import { useLocation } from "react-router-dom";

const Explore = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setKey(location?.state?.tab);
    }
  }, [location]);

  const [key, setKey] = useState("artwork");
  useScrollToTop();
  return (
    <div>
      <div className="explore-art  explore-art-wrapper ">
        <div className="explore-art-content">
          <h4 className="fw-bold ">Search</h4>
          <p className="body-large ">The Catalyst gallery of artwork.</p>
          <div className="profile-tabs">
            <Tabs
              defaultActiveKey="artwork"
              id="uncontrolled-tab-example"
              className="mb-3 profile-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab
                eventKey="artwork"
                title={
                  <span>
                    <img
                      src={key == "artwork" ? star20 : artwork}
                      alt="star"
                      className={
                        key == "artwork"
                          ? "hide-on-mobile spikeimg"
                          : "hide-on-mobile"
                      }
                    />
                    artwork
                  </span>
                }
              >
                <ExploreArt />
              </Tab>
              {/* series */}
              <Tab
                eventKey="drops"
                title={
                  <span className="pointer">
                    <img
                      src={key == "series" ? star20 : collection}
                      alt="star"
                      className={
                        key == "drops"
                          ? "hide-on-mobile spikeimg "
                          : "hide-on-mobile"
                      }
                    />
                    Drops
                  </span>
                }
              >
                <LayoutDropGrid />
                {/* <SingleArt /> */}
              </Tab>
              {/* collections */}
              <Tab
                eventKey="collections"
                // disabled
                title={
                  <span className="pointer">
                    <img
                      src={key == "collections" ? star20 : grid}
                      alt="star"
                      className={
                        key == "collections"
                          ? "hide-on-mobile spikeimg"
                          : "hide-on-mobile"
                      }
                    />
                    collections
                  </span>
                }
              >
                <AllCollections />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
