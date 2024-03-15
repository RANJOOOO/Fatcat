
// import "../style/main.scss";
// import React, { useEffect, useState } from 'react';
// import { getFavoritesForUser } from '../firebase/firebase'; // Import the function to fetch favorite documents
// import { getUserData } from "../firebase/firebase";
// import { useAccount } from "wagmi";
// function WishList() {
//    const { address } = useAccount();
//   const [favoriteData, setFavoriteData] = useState([]);
//   const [userData, setUserData] = useState("");

//   const getfirebasedata = async () => {
//     const data = await getUserData(address);
//     console.log(data);
//     setUserData(data);
//   };
//   const username = userData?.userName; // Get the username of the user
//   getfirebasedata();

//   // alert("Before localStorage.setItem");
//   localStorage.setItem("userName", username);
//   // alert("After localStorage.setItem");
//   useEffect(() => {
//     if (username) {
//       getFavoritesForUser(username).then((favorites) => {
//         setFavoriteData(favorites);
//       });
//     }
//   }, [username]);

//   return (
//     <div>
//       <h4>Favorites for {username}</h4>
//       <ul>
//         {favoriteData.map((favorite, index) => (
//           <li key={index}>{favorite.userName}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default WishList;
