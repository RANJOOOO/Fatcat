import React from "react";
import { useEffect, useState } from "react";
import "../style/main.scss";
import SectionHeader from "./sectionHeader";
import Button from "./button";
import { emailToNewsLetter } from "../firebase/firebase";
import { toast } from "react-toastify";

const StayInformed = () => {
  // newsletter stay informed by subscribing you email

  const [email, setEmail] = React.useState("");

  const handleEmailToNewsLetter = () => {
    emailToNewsLetter(email);
    toast.success("Email added to newsletter");
  };

  return (
    <div>
      <section className="contact">
        <h5 className="section-head">
          <span>Stay</span>
          Informed
        </h5>

        <div className="contact-form">
          <label htmlFor="mail" className="medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name=""
            id="mail"
            placeholder="Add your email..."
          />
          <Button
            text="Add email"
            className=" btn-contact "
            onClick={handleEmailToNewsLetter}
          />
        </div>
      </section>
    </div>
  );
};

export default StayInformed;
