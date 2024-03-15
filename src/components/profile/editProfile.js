import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import "../../style/main.scss";
import arrowLeft from "../../assets/icon/arrow-left.svg";
import Button from "../button";
import dummyProfile from "../../assets/images/profile-1.svg";
import add from "../../assets/icon/plus-small.svg";
import minus from "../../assets/icon/minus.svg";
import question from "../../assets/icon/question-tooltip.svg";
import error from "../../assets/icon/error.svg";
import errorWhite from "../../assets/icon/error-white.svg";
import close from "../../assets/icon/close-small.svg";
import success from "../../assets/icon/tick.svg";
import successWhite from "../../assets/icon/tick-white.svg";
import email from "../../assets/icon/email.svg";
import emailLarge from "../../assets/icon/email-large.svg";
import editpen from "../../assets/icon/edit-white.svg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Input from "../inputs";
import Textarea from "../shared/textarea";
import InputBox from "../shared/inputBox";
import { toast } from "react-toastify";
import {
  // auth,
  firestoredb,
  getUserData,
  setUsername,
  unlinkemail,
  uploadImg,
  // updateemail,
} from "../../firebase/firebase";
// import { element } from "@rainbow-me/rainbowkit/dist/css/reset.css";
import { useAccount, useConnect } from "wagmi";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   sendEmailVerification,
//   signInAnonymously,
//   signOut,
//   updateProfile,
// } from "firebase/auth";
import { encode } from "base-64";

const EditProfile = ({ show, handleModal }) => {
  // Form states
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    userMail: "",
    userHeadline: "",
    userAbout: "",
    userLocation: "",
    userTwiter: "",
  });

  // const [userName, setuserName] = useState();
  // const [userMail, setuserMail] = useState();
  // const [userHeadline, setuserHeadline] = useState();
  // const [userAbout, setuserAbout] = useState();
  // const [userLocation, setuserLocation] = useState();
  // const [userTwiter, setuserTwiter] = useState();

  // button states
  // const [cleanValue, setCleanValue] = useState(false);

  // modal handle
  const [imgErrorMessage, setImgErrorMessage] = useState(false);
  const [show1, setShow] = useState(false);
  const [userData, setUserData] = useState("");




  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
  };

  const tooltip = <Tooltip id="tooltip">Recommended 350x350px</Tooltip>;

  // image upload
  const handleImageChange = (e) => {
    console.log(e.target.files[0].size / 1000000);
    if (e.target.files[0].size < 5000000) {
      setSelectedImage(e.target.files[0]);
      // setFormData((prevData) => ({
      //   ...prevData,
      //   userImg: e.target.files[0],
      // }));
      setImgErrorMessage(false);
    } else {
      // console.log("errr");
      setImgErrorMessage(true);
    }
  };
  const [twitterUrlError, setTwitterUrlError] = useState("");

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("This is twitter", value);
  
    const twitterUrlPattern = /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/;
  
    if (name === "userTwiter") {
      if (twitterUrlPattern.test(value)) {
        setTwitterUrlError("Valid");
      } else {
        setTwitterUrlError("Invalid UrlET");
      }
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  


  
 

 

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));

  //   // Check if the entered Twitter URL is valid
    
  // };






  const checkValidation = () => {
    const error = {
      userMail: false,
      userName: false,
      userAbout: false,
      userHeadline: false,
      userLocation: false,
      userTwiter: false,
    };
    if (formData.userMail == "") {
      error["userMail"] = true;
    }
    if (formData.userName == "") {
      error["userName"] = true;
    }
    // if userName have Spaces then it will be invalid
    if (
      formData.userName.length > 0 &&
      formData.userName.split(" ").length > 1
    ) {
      error["userName"] = true;
    }
    if (formData.userAbout == "") {
      error["userAbout"] = true;
    }
    if (formData.userHeadline == "") {
      error["userHeadline"] = true;
    }
    if (formData.userLocation == "") {
      error["userLocation"] = true;
    }
    if (formData.userTwiter == "") {
      error["userTwiter"] = true;
    }

    return error;
  };
  const [errorFlags, setErrorFlags] = useState({
    userMail: false,
    userName: false,
    userAbout: false,
    userHeadline: false,
    userLocation: false,
    userTwitter: false, // Note the correct spelling 'userTwitter'
  });
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  const navigate = useNavigate();

  useEffect(() => {
    const test = localStorage?.getItem("catalystSigner");
    //console.log(test);
    if (test) {
    } else {
      navigate("/");
    }
  }, []);

  const getfirebasedata = async () => {
    if (address) {
      const data = await getUserData(address);
      console.log(data);
      setUserData(data);

      setFormData({
        userName: data?.userName,
        userAbout: data?.userAbout,
        userHeadline: data?.userHeadline,
        userLocation: data?.userLocation,
        userTwiter: data?.userTwiter,
        userMail: data?.userMail,
      });
      localStorage.setItem("CatalystUserData", JSON.stringify(data));

      setSelectedImage(data?.image);
    }
  };

  useEffect(() => {
    getfirebasedata();
  }, [address]);
  useEffect(() => {
    // console.log(typeof selectedImage);
  }, [selectedImage]);
  const [successAlert, setsuccessAlert] = useState("");
  const [userNameError, setUserNameError] = useState(false);

  const saveChanges = async () => {
    // e.preventDefault();

    // console.log(typeof selectedImage);
    console.log(selectedImage);
    setLoading(true);
    if (typeof selectedImage == "string") {
      console.log("already from firebase");
    } else {
      console.log(selectedImage);
      if (typeof selectedImage == "object") {
        const success = await uploadImg(selectedImage, address);
      } else {
        console.log("empy image");
      }
    }
    const error = checkValidation();
    //console.log(error);
    setErrorFlags(error);
    if (userData?.userName?.length > 0) {
      console.log("username already done");
    } else if (
      formData.userName === "" ||
      formData.userName === " " ||
      formData.userName === undefined ||
      formData.userName === null ||
      formData.userName.split(" ").length > 1
    ) {
      console.log("username empty or has space");
    } else {
      if (
        formData.userName == "" ||
        formData.userName == undefined ||
        formData.userName == null
      ) {
        console.log("username empty");
      } else {
        const data = await setUsername(formData.userName, address);
        console.log(data);
        if (data == "success") {
          getfirebasedata();
        } else {
          setUserNameError(true);
        }
      }
    }

    setDoc(
      doc(firestoredb, "Users", address),
      {
        userHeadline: formData?.userHeadline ? formData.userHeadline : "",
        userName: formData?.userName ? formData.userName : "",
        userAbout: formData?.userAbout ? formData.userAbout : "",
        userLocation: formData?.userLocation ? formData.userLocation : "",
        userTwiter: formData?.userTwiter ? formData.userTwiter : "",
      },
      { merge: true }
    )
      .then(() => {
        setsuccessAlert(true);
        getfirebasedata();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => {
      setsuccessAlert(false);
    }, 5000);
  };

  // const handleConfirmEmail = async () => {
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!emailPattern.test(formData.userMail)) {
  //     alert("Invalid email address");
  //     return;
  //   }

  //   if (formData.userMail && formData.userMail != "") {
  //     console.log("eamil updated", address, formData.userMail, auth);
  //     try {
  //       await createUserWithEmailAndPassword(auth, formData.userMail, address)
  //         .then(async (res) => {
  //           const { user } = res;
  //           updateProfile(auth.currentUser, {
  //             displayName: "test",
  //           })
  //             .then(async () => {
  //               await setDoc(
  //                 doc(firestoredb, "Users", address),
  //                 {
  //                   userMail: formData.userMail,
  //                   verified: userisLogged.emailVerified,
  //                   isuserMailSend: true,
  //                 },
  //                 { merge: true }
  //               )
  //                 .then((res1) => {
  //                   console.log("create email and confirm  ", res1);
  //                   const userData = {
  //                     email: user.email,
  //                     name: user.displayName,
  //                     uid: user.uid,
  //                   };
  //                   const jsonString = JSON.stringify(userData);
  //                   localStorage.setItem("catalystUser", jsonString);
  //                   toast("Signup success", { toastId: "userloggedin" });
  //                   sendEmailVerification(auth.currentUser)
  //                     .then((res) => {
  //                       console.log(res);
  //                     })
  //                     .catch((err) => {
  //                       console.log(err);
  //                     });
  //                 })
  //                 .catch((error) => {
  //                   console.log(error);
  //                   return false;
  //                 });
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //               return false;
  //             });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           if (
  //             error ==
  //             "FirebaseError: Firebase: Error (auth/email-already-in-use)."
  //           ) {
  //             toast("This email is already Registered", {
  //               toastId: "alreadyRegistered",
  //             });

  //             //  save as eamil is already verified

  //             setDoc(
  //               doc(firestoredb, "Users", address),
  //               {
  //                 userMail: formData.userMail,
  //                 verified: true,
  //                 isuserMailSend: true,
  //               },
  //               { merge: true }
  //             );
  //             // check
  //           }
  //           return false;
  //         });
  //     } catch (err) {
  //       console.error(err);
  //       alert(err.message);
  //       return false;
  //     }
  //   } else {
  //     toast("error in email");
  //   }
  // };

  const Backend_url = process.env.REACT_APP_BACKEND_URL;
  const verificationEndpoint = `${Backend_url}/send-verification-email`; // Update with your server endpoint
  const handleConfirmEmail = async () => {
    console.log("backend url: ", verificationEndpoint);
    console.log("domain name: ", window.location.origin);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.userMail)) {
      alert("Invalid email address");
      return;
    }

    if (formData.userMail && formData.userMail !== "") {
      try {
        console.log("address: ", address);
        // Encode the user ID using Base64
        const encodedUserId = encode(address);

        console.log("encodedUserId: ", encodedUserId);

        const response = await fetch(verificationEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.userMail,
            userId: encodedUserId, // Assuming this is the user's ID
            // current domain name is used as the redirect URL
            // and add a route to handle the redirect
            redirectUrl: window.location.origin,
          }),
        });

        if (response.ok) {
          console.log("response: ", response);
          console.log("formData: ", formData.userMail);
          await setDoc(
            doc(firestoredb, "Users", address),
            {
              userMail: formData.userMail,
              verified: false,
              isuserMailSend: true,
            },
            { merge: true }
          ).then((res1) => {
            const userData = {
              email: formData.userMail,
              name: formData.userName,
              uid: address,
            };
            const jsonString = JSON.stringify(userData);
            localStorage.setItem("catalystUser", jsonString);
            toast("Signup success", { toastId: "userloggedin" });
            toast("Verification email sent successfully", {
              toastId: "verificationSent",
            });
          });
        }
      } catch (error) {
        console.error(error);
        toast("Error sending verification email", {
          toastId: "verificationError",
        });
      }
    } else {
      toast("Error in email");
    }
  };

  const [userisLogged, setUserisLogged] = useState(false);

  // useEffect(() => {
  //   //console.log(auth,"hi how are tou");
  //   // console.log("current user", auth);
  //   // const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //   //   //console.log(auth.currentUser,"qwert")
  //   //   if (currentUser) {
  //   //     const { uid } = currentUser;
  //   //     setUserisLogged(currentUser);
  //   //     //console.log("user logged in True" +userisLogged)
  //   //   } else {
  //   //     setUserisLogged(currentUser);
  //   //     // console.log("user logged in False"+userisLogged)
  //   //   }
  //   // });
  //   // return () => unsubscribe();
  // });

  const handleEmailunlink = async () => {
    // var user = auth.currentUser;
    // console.log(user)
    // Set the email property to null
    unlinkemail(address);
    // update states
    setTimeout(() => {
      getfirebasedata();
    }, 1000);

    toast("This email is unlinked", {
      toastId: "unlinkedEmail",
    });
  };

  const handleEditEmail = async () => {
    // var user = auth.currentUser;
    // console.log(user, "hi how are you")
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(newEmail)) {
      alert("Invalid email address");
      return;
    }

    // updateemail(user, newEmail, address);

    if (newEmail && newEmail !== "") {
      try {
        console.log("address: ", address);
        // Encode the user ID using Base64
        const encodedUserId = encode(address);

        console.log("encodedUserId: ", encodedUserId);

        const response = await fetch(verificationEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newEmail,
            userId: encodedUserId, // Assuming this is the user's ID
            // current domain name is used as the redirect URL
            // and add a route to handle the redirect
            redirectUrl: window.location.origin,
          }),
        });

        if (response.ok) {
          console.log("response: ", response);
          console.log("formData: ", newEmail);
          await setDoc(
            doc(firestoredb, "Users", address),
            {
              userMail: newEmail,
              verified: false,
              isuserMailSend: true,
            },
            { merge: true }
          ).then((res1) => {
            const userData = {
              email: newEmail,
              name: formData.name,
              uid: address,
            };
            const jsonString = JSON.stringify(userData);
            localStorage.setItem("catalystUser", jsonString);
            toast("Email Update success", { toastId: "userloggedin" });
            toast("Verification email sent successfully", {
              toastId: "verificationSent",
            });
          });
        }
      } catch (error) {
        console.error(error);
        toast("Error sending verification email", {
          toastId: "verificationError",
        });
      }
    } else {
      toast("Error in email");
    }

    setTimeout(() => {
      getfirebasedata();
    }, 1000);

    setShow(false);
  };

  return (
    <div>
      <Modal
        show={show}
        hide
        onHide={handleModal}
        fullscreen={true}
        className="edit-profile-modal"
        setHide
      >
        <Modal.Header>
          <div className="modal-back">
            <img
              src={arrowLeft}
              alt="arrowLeft"
              className="cursor-pointer"
              role="button"
              onClick={handleModal}
            />

            <h6>Edit profile</h6>
          </div>
          <Button
            text="Save Changes"
            className="btn-prime btn-primary"
            width="126px"
            height="36px"
            loading={loading}
            onClick={saveChanges}
          />
        </Modal.Header>

        <Modal.Body>
          <div className="body-content">
            <div className="add-profile-img">
              <label className="profile-img " htmlFor="dp">
                {selectedImage ? (
                  <img
                    src={
                      typeof selectedImage == "object"
                        ? URL.createObjectURL(selectedImage)
                        : selectedImage
                    }
                    alt="Uploaded"
                    className="img-100 rounded-circle"
                  />
                ) : (
                  <img
                    src={dummyProfile}
                    alt="profile"
                    className="img-100 rounded-circle"
                  />
                )}
                <img src={editpen} alt="edit" className="editpen" />
              </label>
              <div className="d-flex flex-column">
                <label className=" medium add-pp">
                  <label className="medium text-black the-first-div">
                    {selectedImage ? (
                      <img src={minus} alt="minus" />
                    ) : (
                      <img src={add} alt="add" />
                    )}
                    {selectedImage ? " profile picture" : " profile picture"}
                  </label>

                  <div className="v-center ">
                    <span>(Max file size: 5mb)</span>
                    <OverlayTrigger
                      placement="top"
                      overlay={tooltip}
                      id="tooltip"
                      disabled
                    >
                      <img src={question} alt="question" />
                    </OverlayTrigger>
                  </div>
                </label>
                <Input
                  type="file"
                  id="dp"
                  className="d-none"
                  onChange={handleImageChange}
                  accept=".jpg, .jpeg, .png"
                />
                {imgErrorMessage ? (
                  <p className="body-medium  warning  w-190 ">
                    <img src={error} alt="error" />
                    Image file size too big. Max 5mb.
                  </p>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="profile-form">
              {/* user name  */}
              <div className="mb-14">
                <InputBox
                  label="username"
                  // subLabel="Required *"
                  placeholder="MyUsername_"
                  type="text"
                  name="userName" // Add name attribute for identification
                  value={formData?.userName}
                  onChange={handleChange}
                  // disabled={userData?.userName ? "disabled" : ""}
                />
                <p className="warning ps-2">
                  {errorFlags?.userName
                    ? "Username is Empty or has spaces. Please enter a valid username."
                    : ""}
                  {userNameError ? "Username Already exists" : ""}
                </p>
              </div>

              {/* Email Address */}

              <div className="  margin-bottom-lg ">
                <div className="mb-14">
                  <InputBox
                    label="EMAIL ADDRESS"
                    optional="Notifications, sales, bids etc."
                    placeholder="notvalid@gmail.xyz"
                    type="mail"
                    name="userMail" // Add name attribute for identification
                    value={formData.userMail}
                    
                    onChange={handleChange}
                    disabled={userData?.userMail ? "disabled" : ""}
                    pending={
                      userData?.userMail
                        ? userData?.verified == false
                          ? true
                          : false
                        : console.log("hi how are the man ", userData?.userMail)
                    }
                    verifiedUser={
                      userData?.userMail
                        ? userData?.verified == true
                          ? true
                          : false
                        : console.log("hi how are the man ", userData?.verified)
                    }
                  />

                  <div className="d-flex ps-2 align-items-center justify-content-between">
                    {userData?.verified == false ? (
                      <p className="body-medium mt-3">
                        Please confirm your new email address using the link we
                        set to <br />'{userData?.userMail}'
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="mail-confirm-btns">
                  {userisLogged?.emailVerified == true ? (
                    <>
                      {/* 
                      <Button
                        text="verified"
                        width="165px"
                        height="36px"
                        className="btn-prime btn-primary"
                        onClick={() => {}}
                      />
                      <Button
                            text="Unlink email"
                            width="120px"
                            height="36px"
                            className="btn-prime btn-secondary"
                            onClick={handleShow}
                          />
                          <Button
                            text="Change email"
                            width="120px"
                            height="36px"
                            className="btn-prime btn-primary"
                            onClick={handleShow}
                          /> */}
                    </>
                  ) : (
                    <></>
                  )}

                  {userData?.isuserMailSend ? (
                    <></>
                  ) : formData?.userMail?.length > 0 ? (
                    <Button
                      text="Confirm email"
                      width="165px"
                      height="36px"
                      className="btn-prime btn-primary"
                      onClick={handleConfirmEmail}
                    />
                  ) : (
                    <></>
                  )}

                  {userData?.userMail ? (
                    <>
                      <Button
                        text="Unlink email"
                        width="120px"
                        height="36px"
                        className="btn-prime btn-secondary"
                        //     onClick={handleShow}
                        onClick={handleEmailunlink}
                      />
                      <Button
                        text="Change email"
                        width="120px"
                        height="36px"
                        className="btn-prime btn-primary"
                        onClick={handleShow}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {/* {errorMessage ? (
                  <p className="warning">Please enter a valid email address</p>
                ) : (
                  <></>
                )} */}
              </div>

              <div className="divider "></div>

              {/* headline for profile */}

              <div className="  margin-bottom-lg mt-50 ">
                <InputBox
                  label="HEADLINE"
                  placeholder={`This headline is more than 40 characters long.`}
                  type="text"
                  maxLength={40}
                  name="userHeadline" // Add name attribute for identification
                  value={formData.userHeadline}
                  onChange={handleChange}
                  optional="A short headline about you"
                />
                <p className="warning ps-2">
                  {/* {errorFlags.userName ? "Please put some headling" : ""} */}
                </p>
                <div className="v-center justify-content-between">
                  {/* {errorMessage ? (
                    <p className="warning w-100">
                      Max. 40 characters for headline
                    </p>
                  ) : (
                    <></>
                  )} */}
                </div>
              </div>

              {/* about profile */}
              <div className="input-form margin-bottom-lg mt-40 ">
                <div className="input-label">
                  <label htmlFor="" className="medium">
                    About
                  </label>
                  <label htmlFor="" className="medium">
                    Tell people about yourself
                  </label>
                </div>

                <Textarea
                  maxLength={500}
                  placeholder="About yourself"
                  onChange={handleChange}
                  name="userAbout"
                  value={formData.userAbout}
                />
              </div>

              {/* location */}
              <div className="  margin-bottom-lg mt-40 ">
                <InputBox
                  label="LOCATION"
                  placeholder="Add location"
                  type="url"
                  name="userLocation" // Add name attribute for identification
                  value={formData.userLocation}
                  onChange={handleChange}
                />
              </div>

              {/* divider */}

              <div className="divider mt-50 mb-50"></div>

              {/* Social media link */}
              <div className=" margin-bottom-lg mt-40 ">
                <InputBox
                  label="twitter"
                  placeholder="https://twitter.com/username"
                  type="url"
                  name="userTwiter" // Add name attribute for identification
                  value={formData.userTwiter}
                  onChange={handleChange}
                  warningMessage="Please enter a valid Twitter URL" 
                />
                {twitterUrlError && <p className="warning ps-2">{twitterUrlError}</p>}
               
             

              </div>
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
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={show1}
        onHide={handleClose}
        centered
        // backdrop="static"
        className="email-confirm-modal"
        backdropClassName="modal-backdrop"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <label>change email</label>

            {/* if email is linked then following will show */}

            {/* <label>unlink email</label> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={emailLarge} alt="email" className="mail" />
          <p className="body-large">
            Add your new <span>email address</span>
          </p>
          {/* if email is linked following will show */}

          {/* <p className="body-large">
            Unlink your <span>email address</span>
          </p> */}

          <div className="input-form input-border ">
            <Input
              type="email"
              placeholder={userData?.userMail ? userData?.userMail : ""}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <img src={close} alt="close" />
          </div>
          <p className="body-medium">
            Your old email address will be unlinked.
          </p>

          {/* if email is linked following will show */}

          {/* <p className="body-medium">
            Remember, you can always{" "}
            <span className="text-link-blue cursor-pointer">
              change your email settings.
            </span>
          </p> */}

          <div className="c-mail-btns">
            <Button
              text="Cancel"
              width="156px"
              height="36px"
              className="btn-prime btn-secondary"
              onClick={handleClose}
            />
            <Button
              text="Confirm email"
              width="156px"
              height="36px"
              className="btn-prime btn-primary"
              onClick={handleEditEmail}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditProfile;
