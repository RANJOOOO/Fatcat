import React from "react";

import Button from "./button";
import Header from "./header";
const ReportIssue = () => {
  const navToDiscord = () => {
    window.open("https://discord.com", "_blank"); // This will open the link in a new tab
  };
  const navToTwitter = () => {
    window.open("https://twitter.com", "_blank"); // This will open the link in a new tab
  };
  return (
    <div>
      <div className="report-issue ">
        <Header head="Report an Issue" />
        <div className="report-content ">
          <h4 className="fw-bold">Report an Issue</h4>
          <p>
            Want to report an issue with something? The best way to reach us is
            to head to{" "}
            <span
              className="text-link-blue pointer text-underline"
              onClick={navToDiscord}
            >
              Discord
            </span>{" "}
            and create a <strong>#support-ticket. </strong>
            Alternatively, you can contact us on Twitter but please note
            response times may be longer.
          </p>
          <Button
            text="Go to Discord"
            className="btn-prime btn-primary br-30"
            width="100%"
            height="36px"
            onClick={navToDiscord}
          ></Button>{" "}
          <Button
            text="Go to Twitter"
            className="btn-prime btn-secondary br-30 mt-3"
            width="100%"
            height="36px"
            onClick={navToTwitter}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
