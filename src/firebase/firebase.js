import { initializeApp } from "firebase/app";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { get, getDatabase, remove } from "firebase/database";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getFirestore,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  deleteField,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const secondaryAuth = getAuth(app);
const storage = getStorage(app);
const firestoredb = getFirestore(app);

//the function uploads the image to firebase storage and get its url and save it in the firebase
//collections Users and document will be its wallet address.

export const uploadImg = async (image, address) => {
  try {
    //this is image reference which includes image name and storage reference of firebase storage
    const imageRef = ref(storage, Date.now() + "image");
    //upload image to firestore storage
    const snapshot = await uploadBytes(imageRef, image);
    //get url of the
    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl);

    await setDoc(
      doc(firestoredb, "Users", address),
      {
        image: imageUrl,
      },
      { merge: true }
    );
    console.log("Image upload successful");

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getAdminUser = async () => {
  try {
    const docRef = doc(firestoredb, "Users", "adminUser");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Function to set the username in the profile section it will first check if the username exists
// it will through error
export const setUsername = async (username, address) => {
  try {
    const docRef = doc(firestoredb, "UserNames", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Username already exists");
      return "username already exists";
    } else {
      console.log("Username successfully updated");
      await setDoc(doc(firestoredb, "UserNames", username), {
        username: username,
      });

      await setDoc(
        doc(firestoredb, "Users", address),
        {
          userName: username,
        },
        { merge: true }
      );
      console.log("Username update successful");
      return "success";
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
};

// email to new Letter function

export const emailToNewsLetter = async (email) => {
  try {
    await setDoc(doc(firestoredb, "NewsLetter", email), {
      email: email,
    });
    console.log("Email added to newsletter successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Add or Update Top banner Text

export const addOrUpdateTopBannerText = async (text, enable) => {
  try {
    await setDoc(doc(firestoredb, "TopBannerText", "text"), {
      text: text,
      enable: enable,
    });
    console.log("Top banner text updated successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get Top banner Text

export const getTopBannerText = async () => {
  try {
    const docRef = doc(firestoredb, "TopBannerText", "text");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

// function to get Applied artists

export const getAppliedArtistsFirebase = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "artistsDetails")
    );
    const artists = [];
    // document id need to be added in the array

    querySnapshot.forEach((doc) => {
      artists.push({ id: doc.id, ...doc.data() });
    });

    // querySnapshot.forEach((doc) => {
    //   artists.push(doc.data());
    // });
    return artists;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// function to update Applied artists
export const updateAppliedArtistsFirebase = async (
  address,
  approved,
  isBlacklisted
) => {
  try {
    await setDoc(
      doc(firestoredb, "artistsDetails", address),
      {
        approved: approved,
        isBlacklisted: isBlacklisted,
      },
      { merge: true }
    );
    console.log("Artist update successful");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get all artists from firebase and return last added artists

export const getNewArtists = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "artistsDetails")
    );
    const artists = [];
    querySnapshot.forEach((doc) => {
      artists.push({
        id: doc.id, // Document ID (name)
        ...doc.data(), // Get all the other fields
      });
    });
    artists.sort((a, b) => b.creationTime - a.creationTime); // Sort by creationTime in descending order
    return artists;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// save and apply data to firebase

export const saveApplyDatatofirebase = async (formData, address) => {
  const docRef = doc(firestoredb, "artistsDetails", address);
  try {
    console.log("formdata: ", formData);
    const result = await setDoc(
      docRef,
      {
        name: formData.name,
        portfolio: formData.portfolio,
        instagram: formData.instagram,
        twitter: formData.twitter,
        allLinks: formData.allLinks,
        email: formData.email,
        videoLink: formData.videoLink,
        selectionOfArtwork: formData.selectionOfArtwork,
        storyBehind: formData.storyBehind,
        howDidYouHear: formData.howDidYouHear,
        creationTime: Date.now(),
        approved: false,
        isBlacklisted: false,
      },
      { merge: true }
    );
    console.log(result);
    if (result == undefined) {
      toast("Successfully form submission");
    }
  } catch (error) {
    console.log("upload error:", error);
    toast.error("Something went wrong while applying", {
      toastId: "applyError",
    });
  }
};

// Retrieve user profile data to use in the edit profile section
export const getUserData = async (address) => {
  try {
    const docRef = doc(firestoredb, "Users", address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
// Login function used for authentication
const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userInfo = await signInWithEmailAndPassword(auth, email, password);
    localStorage.isSigninSuccess = true;
    return { success: true, userInfo };
  } catch (e) {
    toast.error("User and Password not correct", { toastId: "loginError" });
    return { success: false, error: e };
  }
};

// Function for sending email confirmation to the user
const registerWithEmailAndPassword = async (email, password, date) => {
  try {
    const userInfo = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userInfo.user;

    await sendEmailVerification(userInfo.user);
    console.log("Email verification sent");

    await setDoc(doc(firestoredb, "Users", user.uid), {
      uid: user.uid,
      email: email,
      isApproved: true,
      isAdmin: false,
      firstName: "",
      lastName: "",
      dateOfBirth: date,
      phoneNumber: "",
      bindedWallet: "",
    });
    localStorage.isSignupSuccess = true;
    let userData = {
      email: user.email,
      name: user.displayName,
      uid: user.uid,
    };
    const jsonString = JSON.stringify(userData);
    localStorage.setItem("tuxnftuser", jsonString);
    toast("Signup success");

    await signOut(auth);
    console.log("User signed out successfully");
    return true;
  } catch (error) {
    console.log(error);
    if (error.code === "auth/email-already-in-use") {
      toast("This Email is already Registered");
    }
    return false;
  }
};

// get All user data from firebase
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestoredb, "Users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id, // Document ID (name)
        ...doc.data(), // Get all the other fields
      });
    });
    return users;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// save featured User and image to firebase

export const saveFeaturedUser = async (data) => {
  try {
    const { artistAddress, featuredImage } = data;
    const imageRef = ref(storage, Date.now() + "image");
    const snapshot = await uploadBytes(imageRef, featuredImage);
    const imageUrl = await getDownloadURL(imageRef);

    // Set the document in the "featuredUsers" collection with the timestamp
    await setDoc(
      doc(firestoredb, "featuredUsers", artistAddress),
      {
        image: imageUrl,
        timestamp: serverTimestamp(), // Add the server timestamp
      },
      { merge: true }
    );

    console.log("Image upload successful");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get featured user from firebase and return last added user

export const getFeaturedUser = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "featuredUsers")
    );
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id, // Document ID (name)
        image: doc.data().image, // Get the 'image' field
        timestamp: doc.data().timestamp, // Get the 'timestamp' field
      });
    });
    users.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order
    return users.length > 0 ? users[0] : null; // Return the first document with the latest timestamp
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const SaveSpotlight = async (data) => {
  try {
    console.log("Spotlight data:", data);
    const {
      spotActive,
      spotAddress,
      spotUsername,
      spotTwitter,
      spotWebsite,
      spotFeaturedImage1,
      spotFeaturedName1,
      spotFeaturedImage2,
      spotFeaturedName2,
      spotFeaturedImage3,
      spotFeaturedName3,
      spotBio,
      spotHeader1,
      spotSection1image,
      spotSection1,
      spotHeader2,
      spotSection2,
      spotSection2image,
      spotHeader3,
      spotSection3,
      spotSection3image1,
      spotSection3image2,
    } = data;

    // If the Spotlight object doesn't exist, create a new one
    console.log("Spotlight function...");

    let imageUrl1 = "";
    let imageUrl2 = "";
    let imageUrl3 = "";
    let imageUrl4 = "";
    let imageUrl5 = "";
    let imageUrl6 = "";
    let imageUrl7 = "";

    if (typeof spotFeaturedImage1 === "object") {
      const imageRef1 = ref(storage, Date.now() + "FeaturedImage1");
      const snapshot1 = await uploadBytes(imageRef1, spotFeaturedImage1);
      imageUrl1 = await getDownloadURL(imageRef1);
      console.log(imageUrl1);
    } else {
      imageUrl1 = spotFeaturedImage1;
    }

    if (typeof spotFeaturedImage2 === "object") {
      const imageRef2 = ref(storage, Date.now() + "FeaturedImage2");
      const snapshot2 = await uploadBytes(imageRef2, spotFeaturedImage2);
      imageUrl2 = await getDownloadURL(imageRef2);
      console.log(imageUrl2);
    } else {
      imageUrl2 = spotFeaturedImage2;
    }

    if (typeof spotFeaturedImage3 === "object") {
      const imageRef3 = ref(storage, Date.now() + "FeaturedImage3");
      const snapshot3 = await uploadBytes(imageRef3, spotFeaturedImage3);
      imageUrl3 = await getDownloadURL(imageRef3);
      console.log(imageUrl3);
    } else {
      imageUrl3 = spotFeaturedImage3;
    }

    if (typeof spotSection1image === "object") {
      const imageRef4 = ref(storage, Date.now() + "Section1image");
      const snapshot4 = await uploadBytes(imageRef4, spotSection1image);
      imageUrl4 = await getDownloadURL(imageRef4);
      console.log(imageUrl4);
    } else {
      imageUrl4 = spotSection1image;
    }

    if (typeof spotSection2image === "object") {
      const imageRef5 = ref(storage, Date.now() + "Section2image");
      const snapshot5 = await uploadBytes(imageRef5, spotSection2image);
      imageUrl5 = await getDownloadURL(imageRef5);
      console.log(imageUrl5);
    } else {
      imageUrl5 = spotSection2image;
    }

    if (typeof spotSection3image1 === "object") {
      const imageRef6 = ref(storage, Date.now() + "Section3image1");
      const snapshot6 = await uploadBytes(imageRef6, spotSection3image1);
      imageUrl6 = await getDownloadURL(imageRef6);
      console.log(imageUrl6);
    } else {
      imageUrl6 = spotSection3image1;
    }

    if (typeof spotSection3image2 === "object") {
      const imageRef7 = ref(storage, Date.now() + "Section3image2");
      const snapshot7 = await uploadBytes(imageRef7, spotSection3image2);
      imageUrl7 = await getDownloadURL(imageRef7);
      console.log(imageUrl7);
    } else {
      imageUrl7 = spotSection3image2;
    }

    // const imageRef1 = ref(storage, Date.now() + "FeaturedImage1");
    // const imageRef2 = ref(storage, Date.now() + "FeaturedImage2");
    // const imageRef3 = ref(storage, Date.now() + "FeaturedImage3");
    // const imageRef4 = ref(storage, Date.now() + "Section1image");
    // const imageRef5 = ref(storage, Date.now() + "Section2image");
    // const imageRef6 = ref(storage, Date.now() + "Section3image1");
    // const imageRef7 = ref(storage, Date.now() + "Section3image2");

    // // Upload images to Firestore storage

    // const snapshot1 = await uploadBytes(imageRef1, spotFeaturedImage1);
    // const snapshot2 = await uploadBytes(imageRef2, spotFeaturedImage2);
    // const snapshot3 = await uploadBytes(imageRef3, spotFeaturedImage3);
    // const snapshot4 = await uploadBytes(imageRef4, spotSection1image);
    // const snapshot5 = await uploadBytes(imageRef5, spotSection2image);
    // const snapshot6 = await uploadBytes(imageRef6, spotSection3image1);
    // const snapshot7 = await uploadBytes(imageRef7, spotSection3image2);

    // // Get the URLs of the images

    // const imageUrl1 = await getDownloadURL(imageRef1);
    // const imageUrl2 = await getDownloadURL(imageRef2);
    // const imageUrl3 = await getDownloadURL(imageRef3);
    // const imageUrl4 = await getDownloadURL(imageRef4);
    // const imageUrl5 = await getDownloadURL(imageRef5);
    // const imageUrl6 = await getDownloadURL(imageRef6);
    // const imageUrl7 = await getDownloadURL(imageRef7);

    // Set the document in the "featuredUsers" collection

    // delete all documents from spotlightUsers collection
    const querySnapshot = await getDocs(
      collection(firestoredb, "spotlightUsers")
    );

    querySnapshot.forEach((doc) => {
      const docRef = doc.ref;
      deleteDoc(docRef);
    });

    await setDoc(
      doc(firestoredb, "spotlightUsers", spotAddress),
      {
        spotActive: spotActive,
        spotAddress: spotAddress,
        spotUsername: spotUsername,
        spotTwitter: spotTwitter,
        spotWebsite: spotWebsite,
        spotFeaturedImage1: imageUrl1,
        spotFeaturedName1: spotFeaturedName1,
        spotFeaturedImage2: imageUrl2,
        spotFeaturedName2: spotFeaturedName2,
        spotFeaturedImage3: imageUrl3,
        spotFeaturedName3: spotFeaturedName3,
        spotBio: spotBio,
        spotHeader1: spotHeader1,
        spotSection1image: imageUrl4,
        spotSection1: spotSection1,
        spotHeader2: spotHeader2,
        spotSection2: spotSection2,
        spotSection2image: imageUrl5,
        spotHeader3: spotHeader3,
        spotSection3: spotSection3,
        spotSection3image1: imageUrl6,
        spotSection3image2: imageUrl7,
      },
      { merge: true }
    );

    console.log("Spotlight object created successfully");
    toast.success("Spotlight Updated successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get spotlight user from firebase and return last added user

export const getSpotlightUser = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "spotlightUsers")
    );
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error(err);
    return null;
  }
};

// handle All activities of collection

// export const handleCollectionHistory = async (collectionId, data) => {
//   try {
//     const { action, user, artworkUri, from, to, price, tokenId } = data;
//     console.log("Collection history data:", data);
//     console.log("Collection history action:", action);
//     console.log("Collection history user:", user);
//     console.log("Collection history artworkUri:", artworkUri);
//     console.log("Collection history from:", from);
//     console.log("Collection history to:", to);
//     console.log("Collection history price:", price);
//     const timestamp = serverTimestamp();
//     console.log("Collection history timestamp:", timestamp);

//     const collectionHistoryRef = doc(
//       firestoredb,
//       "collectionHistory",
//       collectionId
//     );
//     const collectionHistoryDoc = await getDoc(collectionHistoryRef);
//     if (collectionHistoryDoc.exists()) {
//       const collectionHistoryData = collectionHistoryDoc.data();
//       const newCollectionHistoryData = {
//         ...collectionHistoryData,
//         [tokenId]: {
//           action: action,
//           user: user,
//           artworkUri: artworkUri,
//           from: from,
//           to: to,
//           price: price,
//           timestamp: timestamp,
//         },
//       };
//       await setDoc(collectionHistoryRef, newCollectionHistoryData);
//     } else {
//       const newCollectionHistoryData = {
//         [tokenId]: {
//           action: action,
//           user: user,
//           artworkUri: artworkUri,
//           from: from,
//           to: to,
//           price: price,
//           timestamp: timestamp,
//         },
//       };
//       await setDoc(collectionHistoryRef, newCollectionHistoryData);
//     }
//     console.log("Collection history updated successfully");
//     return true;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };

// export const handleCollectionHistory = async (collectionId, data) => {
//   try {
//     const { action, user, artworkUri, from, to, price, tokenId } = data;

//     // Reference to the Firestore collection path
//     const collectionHistoryRef = doc(
//       firestoredb,
//       "CollectionHistory",
//       collectionId
//     );

//     // Check if the document already exists
//     const docSnap = await getDoc(collectionHistoryRef);

//     if (docSnap.exists()) {
//     //   // if document exists, keep the existing data and add the new data

//     } else {
//     // If the document doesn't exist, create it
//     await setDoc(collectionHistoryRef, {
//       tokenId,
//       action,
//       user,
//       artworkUri,
//       from,
//       to,
//       price,
//       timestamp: serverTimestamp(),
//     });
//     }

//     console.log("Data saved successfully");
//   } catch (error) {
//     console.error("Error saving data:", error);
//   }
// };
export const handleCollectionHistory = async (collectionId, data) => {
  try {
    // Validate input data
    if (!collectionId || !data) {
      console.error("Invalid input. Please provide collectionId and data.");
      return;
    }

    const { action, user, artworkUri, from, to, price, tokenId } = data;
    console.log("Collection history data:", data);
    console.log("Collection history action:", action);
    console.log("Collection history user:", user);
    console.log("Collection history artworkUri:", artworkUri);
    console.log("Collection history from:", from);
    console.log("Collection history to:", to);
    console.log("Collection history price:", price);
    console.log("Collection history tokenId:", tokenId);

    // Reference to the Firestore collection path and random document ID
    const randomDocId = Math.random().toString(36).substring(2, 8);
    console.log("randomDocId:", randomDocId);
    const collectionHistoryRef = doc(
      firestoredb,
      "CollectionHistory",
      `${collectionId}_${randomDocId}`
    );

    const docSnap = await getDoc(collectionHistoryRef);

    if (docSnap.exists()) {
      // Update existing document
      await setDoc(
        collectionHistoryRef,
        {
          collectionId,
          tokenId,
          action,
          user,
          artworkUri,
          from,
          to,
          price,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("Document updated successfully");
    } else {
      // Create a new document
      await setDoc(collectionHistoryRef, {
        collectionId,
        tokenId,
        action,
        user,
        artworkUri,
        from,
        to,
        price,
        timestamp: serverTimestamp(),
      });
      console.log("New document created successfully");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// get collection history from firebase

export const getCollectionHistoryByCollectionId = async (collectionId) => {
  try {
    // Validate input data
    if (!collectionId) {
      console.error("Invalid input. Please provide collectionId.");
      return;
    }

    const collectionHistoryQuery = query(
      collection(firestoredb, "CollectionHistory"),
      where("collectionId", "==", collectionId)
    );

    const querySnapshot = await getDocs(collectionHistoryQuery);

    const collectionHistory = [];

    querySnapshot.forEach((doc) => {
      collectionHistory.push(doc.data());
    });

    return collectionHistory;
  } catch (error) {
    console.error("Error getting collection history:", error);
  }
};

// getting setting from firebase
export const getSettingFirebase = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const querySnapshot = await getDocs(collection(firestoredb, "Settings"));

      const docRef = doc(firestoredb, "Settings", address);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        resolve(docSnap.data());
      } else {
        console.log("Document does not exist");
        reject(new Error("Document not found"));
      }
    } catch (err) {
      console.error(err);
      reject(err); // Reject with the actual error
    }
  });
};

// save settings to firebase

export const saveSettingToFirebase = async (data, address) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      await setDoc(doc(firestoredb, "Settings", address), {
        data: data,
      }).then((res) => {
        console.log(res);
      });

      resolve({ success: true });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while applying Setting", {
        toastId: "applyError",
      });
      reject({ success: false });
    }
  });
};

// get userdata by username

export const getUserDataByUserName = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersRef = collection(firestoredb, "Users");
      // Create a query against the collection.
      const q = query(usersRef, where("userName", "==", username));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        resolve({ documentId: doc.id, documentData: doc.data() });
      });
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

// add collection in firebase

export const saveCollection = async (
  name,
  symbol,
  address,
  selectedNetwork,
  contractAddress
) => {
  console.log(name, symbol);

  try {
    await setDoc(doc(collection(firestoredb, "Collections")), {
      name: name,
      symbol: symbol,
      address: address,
      selectedNetwork: selectedNetwork,
      contractAddress: contractAddress,
      Approved: false,
      isWhiteList: false,
      isBlackList: false,
      timestamp: serverTimestamp(),
    }).then((res) => {
      console.log("collection saved successfully", res);
      toast.success("Collections saved successfully");
      return true;
    });
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while applying Setting", {
      toastId: "applyError",
    });
  }
  return true;
};

// update collection in firebase

export const updateCollection = async (
  name,
  symbol,
  address,
  contractAddress,
  documentId,
  approved
) => {
  console.log(name, symbol);

  try {
    await setDoc(doc(firestoredb, "Collections", documentId), {
      name: name,
      symbol: symbol,
      address: address,
      contractAddress: contractAddress,
      Approved: approved,
    }).then((res) => {
      console.log(res);
      toast.success("Collections updated successfully");
      return true;
    });
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while applying Setting", {
      toastId: "applyError",
    });
    return false;
  }
};

// update collection approved status in firebase

export const updateCollectionApprovedStatus = async (documentId, approved) => {
  try {
    await setDoc(
      doc(firestoredb, "Collections", documentId),
      {
        Approved: approved,
      },
      { merge: true }
    ).then((res) => {
      console.log(res);
      toast.success("Collections updated successfully");
      return true;
    });
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while applying Setting", {
      toastId: "applyError",
    });
    return false;
  }
};

// update collection status in firebase

export const updateCollectionStatus = async (
  documentId,
  isWhiteList,
  isBlackList
) => {
  try {
    await setDoc(
      doc(firestoredb, "Collections", documentId),
      {
        isWhiteList: isWhiteList,
        isBlackList: isBlackList,
      },
      { merge: true }
    ).then((res) => {
      console.log(res);
      toast.success("Collections updated successfully");
      return true;
    });
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while applying Setting", {
      toastId: "applyError",
    });
    return false;
  }
};

// get collection from firebase

export const getCollections = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let allCollections = [];
      const querySnapshot = await getDocs(
        collection(firestoredb, "Collections")
      );
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        allCollections.push({ documentId: doc.id, data: doc.data() });

        // lastest document on top by timestamp
        allCollections.sort(
          (a, b) => b?.data?.timestamp?.seconds - a?.data?.timestamp?.seconds
        );
      });
      console.log(allCollections);
      resolve(allCollections);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

// function to get collection details based on location details.

export const getCollectionDetailsFirebase = (locationDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(firestoredb, "Collections", locationDetails);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }

      resolve(docSnap.data());
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

// function to upload image

const uploadImageStorageAndGetLink = async (image) => {
  const imageRef = ref(storage, Date.now() + "image");
  //upload image to firestore storage
  const snapshot = await uploadBytes(imageRef, image);
  //get url of the
  const imageUrl = await getDownloadURL(imageRef);
  console.log(imageUrl);
  return imageUrl;
};

// Save Edit collection to firebase
export const saveEditCollectionDetails = async (
  image,
  featureImage,
  description,
  collectionUrl,
  documentId
) => {
  try {
    const logoImageUrl = await uploadImageStorageAndGetLink(image);
    const FeaturedImageUrl = await uploadImageStorageAndGetLink(featureImage);
    console.log(logoImageUrl);
    console.log(FeaturedImageUrl);
    if (logoImageUrl && FeaturedImageUrl) {
      await setDoc(
        doc(firestoredb, "Collections", documentId),
        {
          image: logoImageUrl,
          featureImage: FeaturedImageUrl,
          description: description,
          collectionUrl: collectionUrl,
          creationTime: Date.now(),
        },
        { merge: true }
      );
      toast("Data saved successfully");
    }
  } catch (error) {
    console.log(error);
  }
};

// adding favourite to firebase
export const handleFavorite = async (userName, id) => {
  try {
    const favoritesCollection = collection(firestoredb, "favorites");
    const querySnapshot = await getDocs(
      query(favoritesCollection, where("nftId", "==", id))
    );
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log(
          `Document with nftId ${id} deleted from Firestore collection`
        );
      });
      return false;
    }
    await addDoc(favoritesCollection, {
      userName: userName,
      nftId: id,
    });

    console.log("Document added to Firestore collection successfully");

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// add artist followers to firebase

export const handleFollow = async (followerUsername, artistUsername) => {
  try {
    const followersCollection = collection(firestoredb, "followers");
    await addDoc(followersCollection, {
      follower_username: followerUsername,
      artist_username: artistUsername,
    });

    console.log("Document added to Firestore collection successfully");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to check if an artist is followed
export const checkIfFollowed = async (followerUsername, artistUsername) => {
  try {
    const followersCollection = collection(firestoredb, "followers");
    const querySnapshot = await getDocs(
      query(
        followersCollection,
        where("follower_username", "==", followerUsername),
        where("artist_username", "==", artistUsername)
      )
    );
    if (querySnapshot.size > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// unfollow Artist

export const unfollowArtist = async (followerUsername, artistUsername) => {
  try {
    const followersCollection = collection(firestoredb, "followers");
    const querySnapshot = await getDocs(
      query(
        followersCollection,
        where("follower_username", "==", followerUsername),
        where("artist_username", "==", artistUsername)
      )
    );

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(docToDelete.ref);
      console.log("Document deleted successfully!");
    } else {
      console.log("Document not found or already deleted.");
    }
  } catch (error) {
    console.log("Error in deleting doc");
  }
};

// Get followers data based on username

export const getFollowersData = async (username) => {
  try {
    const followersCollection = collection(firestoredb, "followers");
    const querySnapshot = await getDocs(
      query(followersCollection, where("artist_username", "==", username))
    );
    console.log("querySnapshot", querySnapshot);
    const followersData = querySnapshot.docs.map(
      (doc) => doc.data().follower_username
    );
    const followersCount = followersData.length;
    console.log("username", username, followersData, followersCount);
    return { count: followersCount, data: followersData };
  } catch (error) {
    console.error(error);
    return { count: 0, data: [] };
  }
};

// Get following data based on username

export const getFollowingData = async (username) => {
  try {
    const followersCollection = collection(firestoredb, "followers");
    const querySnapshot = await getDocs(
      query(followersCollection, where("follower_username", "==", username))
    );
    const followingData = querySnapshot.docs.map(
      (doc) => doc.data().artist_username
    );
    const followingCount = followingData.length;
    return { count: followingCount, data: followingData };
  } catch (error) {
    console.error(error);

    return { count: 0, data: [] };
  }
};

// posting notifications in firebase

export const handleNotifications = async (
  username,
  content,
  notificationType,
  price,
  isVisible
) => {
  try {
    const followersCollection = collection(firestoredb, "Notifications");
    await addDoc(followersCollection, {
      username: username,
      content: content,
      price: price,
      notificationType: notificationType,
      nftName: "test",
      isRead: false,
      createdAt: Date.now(),
      isVisible: true,
    });

    console.log("Notifications added to Firestore collection successfully");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// getting notification from firebase
export const getNotifications = async (username) => {
  try {
    const notificationsCollection = collection(firestoredb, "Notifications");
    const querySnapshot = await getDocs(
      query(notificationsCollection, where("username", "==", username))
    );

    const notificationsData = [];

    querySnapshot.forEach((doc) => {
      const notification = doc.data();
      const createdAtTimestamp = notification.createdAt;
      const createdAtDate = new Date(createdAtTimestamp);
      notification.createdAt = createdAtDate.toLocaleString();

      // Create a new 'id' field and push the 'id' into it
      notification.id = doc.id;

      notificationsData.push(notification);
    });

    return notificationsData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateNotificationVisiblity = async (Visible, notificationId) => {
  try {
    const notificationRef = doc(firestoredb, "Notifications", notificationId);

    await setDoc(notificationRef, { isVisible: Visible }, { merge: true });
    console.log("Notification marked as read in the database");
  } catch (error) {
    console.error("Error updating 'isRead' in the database:", error);
  }
};

export const markAllNotificationsAsRead = async (username) => {
  try {
    const notificationsCollection = collection(firestoredb, "Notifications");

    const querySnapshot = await getDocs(
      query(notificationsCollection, where("username", "==", username))
    );
    querySnapshot.forEach((e) => {
      const notificationRef = doc(notificationsCollection, e.id);
      setDoc(notificationRef, { isRead: true }, { merge: true });
    });

    console.log("All notifications marked as read for user:", username);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to update 'isRead' for a specific notification

export const updateSingleIsReadInDatabase = async (notificationId) => {
  try {
    const notificationRef = doc(firestoredb, "Notifications", notificationId);

    await setDoc(notificationRef, { isRead: true }, { merge: true });
    console.log("Notification marked as read in the database");
  } catch (error) {
    console.error("Error updating 'isRead' in the database:", error);
  }
};

// Adding nft to firebase

export const saveNftDataToFirebase = async (
  username,
  image,
  previewImage,
  name,
  description,
  selectedCollection,
  selectedCollectionId,
  traits,
  selectedBlockchain,
  selectedTags
) => {
  const image1 = await uploadImageStorageAndGetLink(image);
  const previewImg2 = await uploadImageStorageAndGetLink(previewImage);
  try {
    console.log("test");
    await addDoc(collection(firestoredb, "Nfts"), {
      username: username,
      image: image1,
      previewImg: previewImg2,
      name: name,
      description: description,
      selectedCollection: selectedCollection,
      selectedCollectionId: selectedCollectionId,
      traits: traits,
      selectedBlockchain: selectedBlockchain,
      selectedTags: selectedTags,
      creationTime: Date.now(),
    });
    toast("Data saved successfully");
    return {
      data: {
        Image: image1,
        PreviewImage: previewImg2,
      },
      success: true,
    };
  } catch (error) {
    toast.error(error);
  }
};

// create Art and save to firebase

export const saveArtDataToFirebase = async (
  username,
  image,
  previewImage,
  name,
  description,
  traits,
  selectedTags,
  artistFee,
  artistAddress,
  isMinted
) => {
  try {
    const image1 = await uploadImageStorageAndGetLink(image);
    const previewImg2 = await uploadImageStorageAndGetLink(previewImage);
    console.log("test");
    await addDoc(collection(firestoredb, "Arts"), {
      artistName: username,
      image: image1,
      previewImg: previewImg2,
      name: name,
      description: description,
      traits: traits,
      selectedTags: selectedTags,
      artistFee: artistFee,
      artistAddress: artistAddress,
      isMinted: isMinted,
      creationTime: Date.now(),
    });
    console.log("Art Created successfully");
    toast("Art Created successfully");
    return {
      data: {
        Image: image1,
        PreviewImage: previewImg2,
      },
      success: true,
    };
  } catch (error) {
    toast.error(error);
  }
};

// get all arts from firebase

export const getAllArts = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let allArts = [];
      const querySnapshot = await getDocs(collection(firestoredb, "Arts"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        allArts.push({ documentId: doc.id, data: doc.data() });
      });
      console.log(allArts);
      resolve(allArts);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

// get art created by Artist
export const getArtCreatedByArtistLength = async (username) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestoredb, "Arts"),
        where("artistName", "==", username)
      )
    );
    return querySnapshot.size;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// get all artist Details from firebase

export const getAllArtistDetails = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let allArtists = [];
      const querySnapshot = await getDocs(
        collection(firestoredb, "artistsDetails")
      );
      querySnapshot.forEach((doc) => {
        allArtists.push({ documentId: doc.id, data: doc.data() });
      });
      console.log("All Arrist".allArtists);
      resolve(allArtists);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

// update art to firebase

export const updateArtDataToFirebase = async (
  username,
  image,
  previewImage,
  name,
  description,
  traits,
  selectedTags,
  artistFee,
  artistAddress,
  isMinted,
  documentId
) => {
  try {
    const image1 = await uploadImageStorageAndGetLink(image);
    const previewImg2 = await uploadImageStorageAndGetLink(previewImage);
    console.log("test");
    await setDoc(
      doc(firestoredb, "Arts", documentId),
      {
        artistName: username,
        image: image1,
        previewImg: previewImg2,
        name: name,
        description: description,
        traits: traits,
        selectedTags: selectedTags,
        artistFee: artistFee,
        artistAddress: artistAddress,
        isMinted: isMinted,
        creationTime: Date.now(),
      },
      { merge: true }
    );
    console.log("Art updated successfully");
    toast("Art updated successfully");
    return {
      data: {
        Image: image1,
        PreviewImage: previewImg2,
      },
      success: true,
    };
  } catch (error) {
    toast.error(error);
  }
};

// Getting NFTs In collections based on Id

export const getNftsInCollectionFirebase = async (locationDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      var allNfts = [];
      const q = query(
        collection(firestoredb, "Nfts"),
        where("selectedCollectionId", "==", locationDetails)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        allNfts.push({ documentId: doc.id, data: doc.data() });
      });

      resolve(allNfts);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

// Getting NFT From Firebase by NFT id

export const getNftDetailsFirebase = async (id) => {
  try {
    const docRef = doc(firestoredb, "Nfts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const saveCollectionStats = async (data) => {
  try {
    const {
      collectionId,
      artworkCount,
      createdAt,
      creatorEarning,
      volume,
      SGBvolume,
      FLRvolume,
      USDvolume,
      floorPrice,
      owners,
      listedCount,
      saleCount,
    } = data;

    // Reference to the Firestore collection path and random document ID
    console.log("stats collectionId:", collectionId);
    console.log("stats artworkCount:", artworkCount);
    console.log("stats createdAt:", createdAt);
    console.log("stats creatorEarning:", creatorEarning);
    console.log("stats volume:", volume);
    console.log("stats SGBvolume:", SGBvolume);
    console.log("stats FLRvolume:", FLRvolume);
    console.log("stats USDvolume:", USDvolume);
    console.log("stats floorPrice:", floorPrice);
    console.log("stats owners:", owners);
    console.log("stats listedCount:", listedCount);
    console.log("stats saleCount:", saleCount);

    const collectionStatsRef = doc(
      firestoredb,
      "CollectionStats",
      `${collectionId}`
    );

    const docSnap = await getDoc(collectionStatsRef);

    if (docSnap.exists()) {
      // Update existing document
      await setDoc(
        collectionStatsRef,
        {
          collectionId,
          artworkCount,
          createdAt,
          creatorEarning,
          volume,
          SGBvolume,
          FLRvolume,
          USDvolume,
          floorPrice,
          owners,
          listedCount,
          saleCount,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("Stats Document updated successfully");
    } else {
      // Create a new document
      await setDoc(collectionStatsRef, {
        collectionId,
        artworkCount,
        createdAt,
        creatorEarning,
        volume,
        SGBvolume,
        FLRvolume,
        USDvolume,
        floorPrice,
        owners,
        listedCount,
        saleCount,
        timestamp: serverTimestamp(),
      });
      console.log("New Stats document created successfully");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// Get collection stats from firebase

export const getCollectionStats = async (collectionId) => {
  console.log("stats collectionId", collectionId);
  try {
    const collectionStatsRef = doc(
      firestoredb,
      "CollectionStats",
      collectionId
    );
    const collectionStatsDoc = await getDoc(collectionStatsRef);
    if (collectionStatsDoc.exists()) {
      const collectionStatsData = collectionStatsDoc.data();
      return collectionStatsData;
    } else {
      console.log("Collection stats not found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// get All collection stats from firebase

export const getAllCollectionStats = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "CollectionStats")
    );
    const collectionStats = [];
    querySnapshot.forEach((doc) => {
      const collectionStatsData = doc.data();
      collectionStats.push(collectionStatsData);
    });
    return collectionStats;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// save Artsits Stats to firebase

export const saveArtistStats = async (artistAddress, sale) => {
  try {
    console.log("artistAddress", artistAddress);
    const artistStatsRef = doc(firestoredb, "ArtistStats", `${artistAddress}`);
    const docSnap = await getDoc(artistStatsRef);
    if (docSnap.exists()) {
      // Update existing document
      console.log("docSnap");
      const sales = docSnap.data().Sale;

      const salesCount = sales.length;
      console.log("salesCount", salesCount);
      console.log("sales", sales);
      await setDoc(
        artistStatsRef,
        {
          artistAddress,
          salesCount: salesCount + 1,
          Sale: [...sales, sale],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("Artist Stats Document updated successfully");
      toast.success("Artist Stats Document updated successfully");
    } else {
      // Create a new document
      await setDoc(artistStatsRef, {
        artistAddress,
        salesCount: 1,
        Sale: [sale],
        updatedAt: serverTimestamp(),
      });
      console.log("New Artist Stats document created successfully");
      toast.success("New Artist Stats document created successfully");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// get all artists stats from firebase

export const getAllArtistStats = async () => {
  try {
    console.log("getAllArtistStats 54645");
    const querySnapshot = await getDocs(collection(firestoredb, "ArtistStats"));
    const artistStats = [];
    console.log("querySnapshot", querySnapshot);
    querySnapshot.forEach((doc) => {
      const artistStatsData = doc.data();
      const higherSale = Math.max(...artistStatsData.Sale);
      // Sale ["1", "2", "3", "4", "5"]
      const AverageSaleValue =
        artistStatsData.Sale.reduce((acc, val) => acc + parseFloat(val), 0) /
        artistStatsData.Sale.length;
      artistStatsData.higherSale = higherSale;
      artistStatsData.AverageSale = AverageSaleValue;
      artistStats.push(artistStatsData);
    });
    console.log("artistStats 12345", artistStats);
    return artistStats;
  } catch (error) {
    console.log("Error getting artist stats", error);
    console.error(error);
    return null;
  }
};

// get artist trending Artist

export const getTrendingArtist = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestoredb, "ArtistStats"));
    const artistStats = [];
    console.log("querySnapshot", querySnapshot.length);
    querySnapshot.forEach((doc) => {
      const artistStatsData = doc.data();
      const higherSale = Math.max(...artistStatsData.Sale);
      const AverageSale =
        artistStatsData.Sale.reduce((a, b) => a + b, 0) /
        artistStatsData.Sale.length;
      artistStatsData.higherSale = higherSale;
      artistStatsData.AverageSale = AverageSale;
      artistStats.push(artistStatsData);
    });
    if (artistStats.length > 1) {
      artistStats.sort((a, b) => b.higherSale - a.higherSale);
    }
    // artistStats.sort((a, b) => b.higherSale - a.higherSale);
    return artistStats;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Save Admin Stats to firebase

export const saveAdminStats = async (data) => {
  try {
    const {
      sales,
      volume,
      SGBvolume,
      FLRvolume,
      USDvolume,
      commissions,
      whitelistedArtists,
    } = data;
    const adminStatsRef = doc(
      firestoredb,
      "AdminStats",
      `${new Date().getTime()}`
    );
    const docSnap = await getDoc(adminStatsRef);
    if (docSnap.exists()) {
      // Update existing document
      await setDoc(
        adminStatsRef,
        {
          sales,
          volume,
          SGBvolume,
          FLRvolume,
          USDvolume,
          commissions,
          whitelistedArtists,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("Admin Stats Document updated successfully");
    } else {
      // Create a new document
      await setDoc(adminStatsRef, {
        sales,
        volume,
        SGBvolume,
        FLRvolume,
        USDvolume,
        commissions,
        whitelistedArtists,
        timestamp: serverTimestamp(),
      });
      console.log("New Admin Stats document created successfully");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// Get Admin stats from firebase

export const getAdminStats = async () => {
  try {
    const adminStatsRef = doc(
      firestoredb,
      "AdminStats",
      `${new Date().getTime()}`
    );
    const adminStatsDoc = await getDoc(adminStatsRef);
    if (adminStatsDoc.exists()) {
      const adminStatsData = adminStatsDoc.data();
      return adminStatsData;
    } else {
      console.log("Admin stats not found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// get sales and shitelisted stats

export const getSalesAndWhitelistedStats = async () => {
  try {
    // read all collection stats document and add saleCount
    console.log("getSalesAndWhitelistedStats");

    const querySnapshotCS = await getDocs(
      collection(firestoredb, "CollectionStats")
    );
    console.log("querySnapshotCS", querySnapshotCS);
    let sales = 0;
    querySnapshotCS.forEach((doc) => {
      const collectionStats = doc.data();
      console.log("collectionStats", collectionStats);
      sales += collectionStats.saleCount;
    });

    // read all artistDetails document and add whitelistedCount

    const querySnapshotAD = await getDocs(
      collection(firestoredb, "artistsDetails")
    );
    console.log("querySnapshotAD", querySnapshotAD);
    let whitelistedArtists = 0;
    querySnapshotAD.forEach((doc) => {
      const artistDetails = doc.data();
      console.log("artist document data", artistDetails);
      if (
        artistDetails.approved === true &&
        artistDetails.isBlacklisted === false
      ) {
        whitelistedArtists += 1;
      }
    });

    return { sales, whitelistedArtists };
  } catch (error) {
    console.error(error);
    console.log("Error getting sales and whitelisted stats");
    console.log("Returning default values");
    return { sales: 0, whitelistedArtists: 0 };
  }
};

// Get Favourite Users

export const getFavoritesForUser = async (username) => {
  try {
    const favoritesCollection = collection(firestoredb, "favorites");

    // Query to retrieve favorite documents where userName matches the given username
    const q = query(favoritesCollection, where("userName", "==", username));

    // Get the matching favorite documents
    const querySnapshot = await getDocs(q);

    const favorites = [];

    // Create an array of promises for fetching NFT details
    const nftPromises = querySnapshot.docs.map(async (docRef) => {
      const favoriteData = docRef.data();
      const nftId = favoriteData.nftId;
      return getNftDetailsFirebase(nftId);
    });

    // Wait for all promises to resolve and add results to favorites
    const nftDetails = await Promise.all(nftPromises);
    favorites.push(...nftDetails);

    return favorites;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateUserEmailAndVerified = async (address, newEmail) => {
  try {
    const userDocRef = doc(firestoredb, "Users", address);
    const userDocSnap = await getUserData(address); // Retrieve existing user data
    console.log("upadtaed email", userDocSnap);

    if (userDocSnap) {
      console.log("Username already exists");

      if (userDocSnap?.userMail) {
        console.log("present");
      } else {
        if (userDocSnap) {
          // Update email and verified status
          const updatedData = {
            ...userDocSnap,
            userMail: newEmail,
            verified: false,
          };
          await updateDoc(userDocRef, updatedData);
          console.log(
            "User email and verified status updated successfully!" + updatedData
          );
          return updatedData;
        } else {
          console.log("User not found!");
          return null;
        }
      }
      return "username already exists";
    } else {
      console.log("Username successfully updated");
      await setDoc(
        doc(firestoredb, "Users", address),
        {
          userMail: newEmail,
          verified: false,
          isuserMailSend: false,
        },
        { merge: true }
      );
      console.log("Username update successful");
      return "success";
    }
  } catch (err) {
    console.error("Error updating user email and verified status:", err);
    return null;
  }
};

/**  unlink email */

// export const unlinkemail = async (user, address) => {
export const unlinkemail = async (address) => {
  //console.log(user.email,"email")
  // if (user) {
  await setDoc(
    doc(firestoredb, "Users", address),
    {
      userMail: deleteField(),
      isuserMailSend: false,
      verified: false,
    },
    { merge: true }
  );
  console.log("hi hoe are you  email is unlinked");
  logout();
  //alert("logout")
  // } else {
  //   console.error("No user is currently authenticated.");
  // }
};

// export const updateemail = async (user, newEmail, address) => {
//   console.log(user, newEmail);
//   if (user && newEmail) {
//     console.log("eamil updated", address, newEmail, auth);
//     try {
//       await createUserWithEmailAndPassword(auth, newEmail, address)
//         .then(async (res) => {
//           const { user } = res;
//           updateProfile(auth.currentUser, {
//             displayName: "test",
//           })
//             .then(async () => {
//               await setDoc(
//                 doc(firestoredb, "Users", address),
//                 {
//                   userMail: newEmail,
//                   verified: false,
//                   isuserMailSend: true,
//                 },
//                 { merge: true }
//               )
//                 .then((res1) => {
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
//           }

//           setDoc(
//             doc(firestoredb, "Users", address),
//             {
//               verified: user.emailVerified,
//             },
//             { merge: true }
//           );

//           return false;
//         });
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//       return false;
//     }

//     console.log("Username updated successfully");
//     return "success";
//   }
// };

// save top artist to firebase

export const saveTopArtist = async (data) => {
  try {
    const { artistAddress, topImage } = data;
    // This is the image reference which includes the image name and storage reference of Firebase storage
    const imageRef = ref(storage, Date.now() + "image");

    // Upload image to Firestore storage
    const snapshot = await uploadBytes(imageRef, topImage);

    // Get the URL of the image
    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl);
    // Set the document in the "featuredUsers" collection
    await setDoc(
      doc(firestoredb, "topUsers", artistAddress),
      {
        image: imageUrl,
      },
      { merge: true }
    );
    console.log("Image upload successful");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get top artist from firebase and return last added user

export const getTopArtist = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestoredb, "topUsers"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id, // Document ID (name)
        image: doc.data().image, // Get the 'image' field
      });
    });

    return users[users.length - 1];
  } catch (err) {
    console.error(err);
    return null;
  }
};

// save top collection to firebase

export const saveTopCollection = async (data) => {
  try {
    const { collectionAddress, topImage } = data;
    // This is the image reference which includes the image name and storage reference of Firebase storage
    const imageRef = ref(storage, Date.now() + "image");

    // Upload image to Firestore storage
    const snapshot = await uploadBytes(imageRef, topImage);

    // Get the URL of the image
    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl);
    // Set the document in the "featuredUsers" collection
    await setDoc(
      doc(firestoredb, "topCollections", collectionAddress),
      {
        image: imageUrl,
      },
      { merge: true }
    );
    console.log("Image upload successful");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get top collection from firebase and return last added user

export const getTopCollection = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "topCollections")
    );
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id, // Document ID (name)
        image: doc.data().image, // Get the 'image' field
      });
    });

    return users[users.length - 1];
  } catch (err) {
    console.error(err);
    return null;
  }
};

// save top series to firebase

export const saveTopSeries = async (data) => {
  try {
    const { seriesAddress, topImage } = data;
    // This is the image reference which includes the image name and storage reference of Firebase storage
    const imageRef = ref(storage, Date.now() + "image");

    // Upload image to Firestore storage
    const snapshot = await uploadBytes(imageRef, topImage);

    // Get the URL of the image
    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl);
    // Set the document in the "featuredUsers" collection
    await setDoc(
      doc(firestoredb, "topSeries", seriesAddress),
      {
        image: imageUrl,
      },
      { merge: true }
    );
    console.log("Image upload successful");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get top series from firebase and return last added user

export const getTopSeries = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestoredb, "topSeries"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id, // Document ID (name)
        image: doc.data().image, // Get the 'image' field
      });
    });

    return users[users.length - 1];
  } catch (err) {
    console.error(err);
    return null;
  }
};

// save top collectors to firebase

export const saveTopCollectors = async (data) => {
  try {
    const { collectorAddress, topImage } = data;
    // This is the image reference which includes the image name and storage reference of Firebase storage
    const imageRef = ref(storage, Date.now() + "image");

    // Upload image to Firestore storage
    const snapshot = await uploadBytes(imageRef, topImage);

    // Get the URL of the image
    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl);
    // Set the document in the "featuredUsers" collection
    await setDoc(
      doc(firestoredb, "topCollectors", collectorAddress),
      {
        image: imageUrl,
      },
      { merge: true }
    );
    console.log("Image upload successful");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// get top collectors from firebase and return last added user

export const getTopCollectors = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(firestoredb, "topCollectors")
    );
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id, // Document ID (name)
        image: doc.data().image, // Get the 'image' field
      });
    });

    return users[users.length - 1];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const saveLikedArtwork = async (username, artworkId) => {
  try {
    // const sanitizedArtworkId = encodeURIComponent(artworkId);
    console.log("Sanitized artworkId:", artworkId);
    const docRef = doc(firestoredb, "likedArtworks", `${username}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      const likes = docSnap.data().likedArtworks || [];

      if (likes.includes(artworkId)) {
        console.log("Artwork already liked");

        const index = likes.indexOf(artworkId);
        if (index > -1) {
          likes.splice(index, 1);
        }

        await setDoc(
          docRef,
          {
            likedArtworks: likes,
          },
          { merge: true }
        );

        console.log("Artwork unliked successfully");
        return false;
      } else {
        console.log("Artwork not liked");

        await setDoc(
          docRef,
          {
            likedArtworks: [...likes, artworkId],
          },
          { merge: true }
        );

        console.log("Liked artwork saved successfully");
        return true;
      }
    } else {
      console.log("No such document!");

      await setDoc(
        docRef,
        {
          likedArtworks: [artworkId],
        },
        { merge: true }
      );

      console.log("Liked artwork saved successfully");
      return true;
    }
  } catch (err) {
    console.error("Error in saveLikedArtwork:", err);
    return false;
  }
};

export const getAllLikedArtwork = async (username) => {
  try {
    const likedArtworkRef = doc(firestoredb, "likedArtworks", username);
    const likedArtworkDoc = await getDoc(likedArtworkRef);
    if (likedArtworkDoc.exists()) {
      const likedArtworkData = likedArtworkDoc.data();
      console.log("Liked artwork data:", likedArtworkData);
      return likedArtworkData;
    } else {
      console.log("Liked artwork not found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const logout = () => {
  signOut(auth);
  console.log("logout");
};

export {
  auth,
  app,
  storage,
  firestoredb,
  secondaryAuth,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};
