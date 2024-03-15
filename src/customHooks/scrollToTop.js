import { useEffect } from "react";

const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the window to the top
  }, []);
};

export default useScrollToTop;
