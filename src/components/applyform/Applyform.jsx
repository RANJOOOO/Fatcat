import React, { useState } from "react";
import "./Applyform.scss";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  auth,
  firestoredb,
  saveApplyDatatofirebase,
  uploadImageToFirebase,
} from "../../firebase/firebase";

import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import Input from "../inputs";
import InputBox from "../shared/inputBox";
import Textarea from "../shared/textarea";
import successWhite from "../../assets/icon/tick-white.svg";
import unchecked from "../../assets/icon/checkbox.svg";
import checked from "../../assets/icon/checkbox-selected.svg";
import { useAccount } from "wagmi";
import Button from "../button";
import { set } from "firebase/database";

function Applyform() {
  const [user, loading, error] = useAuthState(auth);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    portfolio: "",
    instagram: "",
    twitter: "",
    allLinks: "",
    email: "",
    videoLink: "",
    selectionOfArtwork: "",
    storyBehind: "",
    howDidYouHear: "",
  });

  //Main Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [successAlert, setsuccessAlert] = useState("");

  const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let navigate = useNavigate();
  const handleClose = () => {
    setShow(false);
    navigate("/");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const fetchUserArtistDetail = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(firestoredb, "artistsDetail"),
        where(documentId(), "==", user.uid)
      );
      const doc = await getDocs(q);
      setIsLoading(false);
      if (!doc.empty) {
        const data = doc.docs[0].data();
        toast.warning("You already registered as Artist", {
          toastId: "alreadyArtist",
        });
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      // alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      setIsLoading(true);
      return;
    }
    if (user) {
      setIsLoading(false);
      fetchUserArtistDetail();
    } 
    setIsLoading(false);
    // else {
    //   navigate("/");
    // }
  }, [user, loading]);
  //Create NFT Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log();
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const { address } = useAccount();
  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };



  const validateInstagram = (instagram) => {
    
    const instagramRegex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_]+)(?:\/\?.*)?$/;

    const isValid = instagramRegex.test(instagram);
    console.log("checking validation of instagrame",isValid);
    return isValid;
};



const validateTwitter = (twitter) => {
  const twitterRegex = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)(?:\/)?$/;
  const isValid = twitterRegex.test(twitter);
  return isValid;
};


const validateAdditionalLinks = (links) => {
  
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/; 
  const linkArray = links.split(",").map(link => link.trim());
  const isValid = linkArray.every(link => urlRegex.test(link));
  return isValid;
};


const validateName = (name) => {
  // Regular expression to match only characters (alphabets) without spaces
  const nameRegex = /^[A-Za-z]+$/;

  // Test the input against the regular expression
  const isValid = nameRegex.test(name);

  return isValid;
};



  const [errors, setErrors] = useState({});

  const validationOfForm = () => {
    let errorsobj = {
      name: false,
      portfolio: false,
      instagram: false,
      twitter: false,
      allLinks: false,
      email: false,
      validEmail: false,
      validName:false,
      validInstagram:false,
      validTwitter:false,
      validAdditionalLinks:false,
      videoLink: false,
      selectionOfArtwork: false,
      storyBehind: false,
      howDidYouHear: false,
      check1: false,
      check2: false,
    };

    if (formData.name == "") {
      errorsobj["name"] = true;
    }
    else{

      let usernameTest = formData.name.trim();
// console.log("Username test", usernameTest);
if (!usernameTest || !validateName(usernameTest)) {
    errorsobj["validName"] = true;
}     

    }

    if (formData.portfolio == "") {
      errorsobj["portfolio"] = true;
    }


    else{
      let additionalLinksTest = validateAdditionalLinks(formData.portfolio);
      // console.log("Portfolio test", additionalLinksTest);
      if (!additionalLinksTest) 
      {
      errorsobj["validAdditionalLinks"] = true;
      }
    }
    if (formData.instagram === "") {
      errorsobj["instagram"] = true;
      console.log("this is the instagrame");
    }  
else

{
  let instagramTest=validateInstagram(formData.instagram);
  
  if(!instagramTest){
    errorsobj["validInstagram"]=true;
    console.log("Insta test",instagramTest);
  }
}

    if (formData.twitter == "") {
      errorsobj["twitter"] = true;
    }
    else{
      let twitterTest = validateTwitter(formData.twitter);
      // console.log("Twitter test", twitterTest);
      if (!twitterTest) {
          errorsobj["validTwitter"] = true;
      }
      



    }
    if (formData.allLinks == "") {
      errorsobj["allLinks"] = true;
    }
    else{

      let additionalLinksTest = validateAdditionalLinks(formData.allLinks);
      // console.log("Additional links test", additionalLinksTest);
      if (!additionalLinksTest) 
      {
      errorsobj["validAdditionalLinks"] = true;
      }




    }
    if (formData.email == "") {
      errorsobj["email"] = true;
    } else {
      let test = validateEmail(formData.email);
      // console.log(test);
      if (!test) {
        errorsobj["validEmail"] = true;
      }
    }

    if (formData.videoLink == "") {
      errorsobj["videoLink"] = true;
    }
    if (formData.selectionOfArtwork == "") {
      errorsobj["selectionOfArtwork"] = true;
    }
    if (formData.storyBehind == "") {
      errorsobj["storyBehind"] = true;
    }
    if (formData.howDidYouHear == "") {
      errorsobj["howDidYouHear"] = true;
    }
    if (check1 == false) {
      errorsobj["check1"] = true;
    }
    if (check2 == false) {
      errorsobj["check2"] = true;
    }

    setErrors(errorsobj);
    return errorsobj;
  };

  const handleSubmit = () => {
    const isValid = validationOfForm();

    if (
      isValid.name ||
      isValid.portfolio ||
      isValid.instagram ||
      isValid.twitter ||
      isValid.allLinks ||
      isValid.email ||
      isValid.validEmail ||
      isValid.videoLink ||
      isValid.selectionOfArtwork ||
      isValid.storyBehind ||
      isValid.howDidYouHear ||
      isValid.check1 ||
      isValid.check2
    ) {
      toast.error("Please fill all the required fields");
    } else {
      console.log(formData);
      console.log("address",address);
      if (address) {
        saveApplyDatatofirebase(formData, address);
        console.log("success");
        navigate("/");
      } else {
        toast.error("PLease connect wallet");
      }  
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <section className="Applyform">
      <div className="top mb-5">
        <h4>Submit Your Artist Profile</h4>
        <p>
          {" "}
          we’re currently in early access mode, only onboarding a small number
          of artists eachmonth .
        </p>
        <p>
          However we’re hard at work scaling up our platform to meet the high
          demand we’re experiencing.
        </p>
        <p>
          This form is to submit your artist profile so you’re on our radar
          ahead of our full launch next year.{" "}
        </p>
        <p>
          You may not get a response in the near term-please understand that
          we’re overloaded in the short term but are doing everything we can to
          accommodate higher capacity in the future.
        </p>
        ​<h6 style={{
          fontWeight: "bold",
          lineHeight: "24px",
          marginBottom: "10px",
        }}> Submitted art work guidlines:</h6>
        <ul>
          <li>Must be original and created by you</li>
          <li>Created digitally </li>
          <li>
            Must not be tokenized available for digital purchase elsewhere on
            the internet
          </li>
          <li>You consider this to be some of your best work</li>
          <li>No illegal stuff,please</li>
        </ul>
        <span>Thank you for getting in touch!</span>
      </div>

      {isLoading && (
        <>
          <div className="loader">
            <span className="customLoadingText">Loading...</span>
          </div>
        </>
      )}
      <div className="profile-form">
        {/*  name  */}
        <div className="mb-14">
          <InputBox
            label="First and last name"
            subLabel="Required *"
            placeholder="First and last name"
            type="text"
            name="name"
            value={formData?.name}
            onChange={handleChange}
          />
          <p className="text-error ps-2">
            {errors.name ? "Please enter name" : ""}
            {errors.validName ? "Please enter valid name here" : ""}
          </p>
        </div>

        <div className="divider "></div>

        {/*portfolio */}

        <div className="  margin-bottom-lg mt-50 ">
          <InputBox
            label="Your artist website / portfolio"
            subLabel="Required *"
            placeholder={`Your artist website / portfolio `}
            type="text"
            name="portfolio" // Add name attribute for identification
            value={formData.portfolio}
            onChange={handleChange}
          />
          <p className="text-error ps-2">
            {errors.portfolio ? "Please enter portfolio url" : ""}
            {errors.validAdditionalLinks ? "Please enter valid portfolio url" : ""}
          </p>
        </div>
        {/*Instagram (include entire URL) */}

        <div className="  margin-bottom-lg mt-50 ">
          <InputBox
            label="Instagram (include entire URL)"
            placeholder={`Instagram (include entire URL) `}
            type="text"
            name="instagram" // Add name attribute for identification
            value={formData.instagram}
            onChange={handleChange}
          />
          <p className="text-error ps-2">
            {errors.instagram ? "Please enter instagram url" : ""}
            {errors.validInstagram ? "Please enter valid Instagram link here" : ""}
          </p>
          <div className="v-center justify-content-between"></div>
        </div>

        {/* twitter */}
        <div className="  margin-bottom-lg mt-40 ">
          <InputBox
            label="Twitter (include entire URL)"
            placeholder="Twitter (include entire URL)"
            type="url"
            name="twitter" // Add name attribute for identification
            value={formData.twitter}
            onChange={handleChange}
          />
        </div>
        <p className="text-error ps-2">
          {errors.twitter ? "Please enter twitter url" : ""}
          {errors.validTwitter ? "Please enter valid twitter link here" : ""}
        </p>

        {/* Additional websites/social links (include entire URLs) */}
        <div className="  margin-bottom-lg mt-40 ">
          <InputBox
            label="Additional websites/social links (include entire URLs)"
            placeholder="Additional websites/social links (include entire URLs)"
            type="url"
            name="allLinks" // Add name attribute for identification
            value={formData.allLinks}
            onChange={handleChange}
          />
        </div>
        <p className="text-error ps-2">
          {errors.allLinks ? "Please enter all Links here" : ""}
          {errors.validAdditionalLinks ? "Please enter valid link here" : ""}

        </p>
        {/* Email */}
        <div className="  margin-bottom-lg mt-40 ">
          <InputBox
            label="Email"
            subLabel="Required *"
            placeholder="Email
            "
            type="email"
            name="email" // Add name attribute for identification
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <p className="text-error ps-2">
          {errors.email ? "Please enter email here" : ""}
          {errors.validEmail ? "Please enter valid email here" : ""}
        </p>
        {/* divider */}

        <div className="divider mt-50 mb-50"></div>

        {/* videoLink */}
        <div className=" margin-bottom-lg mt-40 ">
          <InputBox
            label="
            Application video
            Please record a short (~1 minute) video on your phone introducing yourself and your art, and anything else you'd like to share. Upload to a shared Google Drive folder (make sure it's open/accessible!) or a video hosting site (e.g YouTube, Vimeo), and paste link below. English is not required– feel free to speak in another language if more comfortable.
            "
            placeholder=""
            subLabel="Required *"
            type="url"
            name="videoLink" // Add name attribute for identification
            value={formData.videoLink}
            onChange={handleChange}
            warningMessage="Please enter a valid Twitter URL"
          />
        </div>
        <p className="text-error ps-2">
          {errors.videoLink ? "Please enter videoLink here" : ""}
        </p>

        {/* Link to a selection of your artworks*/}
        <div className=" margin-bottom-lg mt-40 ">
          <InputBox
            label="
            Link to a selection of your artworks  Please submit 3-5 individual works using a Google Drive folder, making sure folder is open/accessible. (IMPORTANT– double check that our team will have access to view the folder –  If the link is password protected or not open you likely won't get a reply. "
            placeholder=""
            subLabel="Required *"
            type="url"
            name="selectionOfArtwork" // Add name attribute for identification
            value={formData.selectionOfArtwork}
            onChange={handleChange}
            warningMessage="Please enter a valid Twitter URL"
          />
        </div>
        <p className="text-error ps-2">
          {errors.selectionOfArtwork
            ? "Please enter selectionOfArtwork here"
            : ""}
        </p>
        {/* What is the story behind these pieces? Why do you think they should be on Catalyst?*/}
        <div className=" margin-bottom-lg mt-40 ">
          <InputBox
            label="
            What is the story behind these pieces? Why do you think they should be on Catalyst?
            "
            placeholder=""
            subLabel="Required *"
            type="url"
            name="storyBehind" // Add name attribute for identification
            value={formData.storyBehind}
            onChange={handleChange}
            warningMessage="Please enter a valid Twitter URL"
          />
        </div>
        <p className="text-error ps-2">
          {errors.storyBehind ? "Please enter storyBehind here" : ""}
        </p>
        {/* How did you hear about Catalyst?*/}
        <div className=" margin-bottom-lg mt-40 ">
          <InputBox
            label="
            How did you hear about Catalyst?
            "
            placeholder=""
            subLabel="Required *"
            type="url"
            name="howDidYouHear" // Add name attribute for identification
            value={formData.howDidYouHear}
            onChange={handleChange}
            warningMessage="Please enter a valid Twitter URL"
          />
        </div>
        <p className="text-error ps-2">
          {errors.howDidYouHear ? "Please enter howDidYouHear here" : ""}
        </p>
        {/*Check here to confirm that none of your submitted works containing any infringing, unauthorized, or unoriginal intellectual property*/}

        <div className="enable-banner mt-4 mb-5 ms-3">
          <label
            className="text-black no-text-transform v-center pointer"
            onClick={(e) => setCheck1(!check1)}
          >
            <img
              src={check1 ? checked : unchecked}
              alt="checkbox"
              className="me-3"
            />
            CHECK HERE TO CONFIRM THAT NONE OF YOUR SUBMITTED WORKS CONTAINING
            ANY INFRINGING, UNAUTHORIZED, OR UNORIGINAL INTELLECTUAL PROPERTY
            Required *
          </label>
        </div>
        <p className="text-error ps-2">
          {errors.check1 ? "Please check here" : ""}
        </p>

        <div className="enable-banner mt-4 mb-5 ms-3">
          <label
            className="text-black no-text-transform v-center pointer"
            onClick={(e) => setCheck2(!check2)}
          >
            <img
              src={check2 ? checked : unchecked}
              alt="checkbox"
              className="me-3"
            />
            CHECK HERE TO CONFIRM THAT NONE OF YOUR SUBMITTED WORKS CONTAINING
            ANY INFRINGING, UNAUTHORIZED, OR UNORIGINAL INTELLECTUAL PROPERTY
            Required *
          </label>
        </div>
        <p className="text-error ps-2">
          {errors.check2 ? "Please check here" : ""}
        </p>
      </div>

      <div>
        <Button
          text="Submit"
          className="btn-prime btn-primary br-30 mt-3"
          height="40px"
          width="200px"
          onClick={handleSubmit}
        ></Button>
      </div>

      {/* alerts */}
      {/* if there is any error */}

      {/* {errorMessage ? (
              <div className="error-alert cursor-pointer">
                <img src={errorWhite} alt="error" />
                <p className="body-medium ">
                  Display relevant error notification here
                </p>
              </div>
            ) : (
              <div className="success-alert ">
                <img src={successWhite} alt="success" />
                <p className="body-medium ">Your profile has been updated</p>
              </div>
            )} */}
      {successAlert ? (
        <div className="success-alert ">
          <img src={successWhite} alt="success" />
          <p className="body-medium ">Your profile has been updated</p>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

export default Applyform;
