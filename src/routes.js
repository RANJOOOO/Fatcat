import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Error from "./components/error";

const AllRoutes = () => {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/");
  };
  const navigateToDiscord = () => {
    navigate("/sign-in");
  };
  return (
    <div>
      <Routes>
        {/* --------------- */}
        <Route
          path="*"
          element={
            <Error
              heading="Error 404"
              errorMessage="Whoops! Looks like the page you're looking for doesn’t exist. Please
          double check the URL."
              buttonText="Go home"
              onClick={navigateToHome}
            />
          }
        />
        {/* ------------Discord----------- */}
        <Route
          path="/something-went-wrong"
          element={
            <Error
              heading="Oops.."
              errorMessage="Something went wrong on our end. Please reach out to our team on Discord if the issue persists."
              buttonText="Go to Discord"
              onClick={navigateToDiscord}
            />
          }
        />

        {/* ----------------down for maintenance-------------- */}
        <Route
          path="/down-for-maintenance"
          element={
            <Error
              heading="Sorry."
              errorMessage="We’re currently down for maintenance. Check out our Discord channel for updates."
              buttonText="Go to Discord"
              onClick={navigateToDiscord}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default AllRoutes;
