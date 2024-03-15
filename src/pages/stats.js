import React, { useEffect } from "react";
import StatTabs from "../components/stats/statTabs";

const Stats = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <StatTabs />
    </>
  );
};

export default Stats;
