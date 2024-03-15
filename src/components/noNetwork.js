import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "./button";
import refresh from "../assets/icon/refresh-metadata.svg";

const NoNetwork = () => {
  const [fetchError, setFetchError] = useState(true);

  const handleFetchError = () => setFetchError(!fetchError);
  const windowReload = () => {
    window.location.reload();
  };

  return (
    <div>
      <Modal
        show={fetchError}
        onHide={handleFetchError}
        className="sign-modal "
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label htmlFor="" className="medium">
              cannot fetch data
            </label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="captcha-content v-center flex-column pb-5">
            <p className="body-medium text-center mb-4">
              There has been an issue fetching this data. Try to refresh.
            </p>
            <label className="text-black mb-5">Try to refresh</label>

            <Button
              text="Refresh"
              width="146px"
              height="36px"
              className="btn-prime btn-primary"
              imageSrc={refresh}
              imageClassName="img-18 me-3  invert1"
              onClick={windowReload}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NoNetwork;
