import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// we need custom window width from multiple places thats why we made a hook for it
// it does not effect the optimization because when user visits a website the window size does not vay and thus it will not fire
const UseWindowResize = (width, path) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= width) {
        navigate(path);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, path]);
};

export default UseWindowResize;
