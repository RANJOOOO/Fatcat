import React, { useState, useEffect } from "react";
import VisibilitySensor from "react-visibility-sensor";

const CounterComponent = ({ targetValue }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible && count < targetValue) {
      const interval = setInterval(() => {
        setCount((prevCount) => Math.min(prevCount + 1, targetValue));
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isVisible, count, targetValue]);

  return (
    <div>
      <VisibilitySensor
        onChange={(isVisible) => setIsVisible(isVisible)}
        partialVisibility={true}
      >
        <h1>{count}</h1>
      </VisibilitySensor>
    </div>
  );
};

export default CounterComponent;
