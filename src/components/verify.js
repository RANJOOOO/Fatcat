import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { encode, decode } from "base-64";
import { doc, setDoc } from "firebase/firestore";
import { firestoredb } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const verifying = async (address) => {
    await setDoc(
      doc(firestoredb, "Users", address),
      {
        verified: true,
      },
      { merge: true }
    )
      .then((res1) => {
        toast.success("Email Verified");
        localStorage.setItem("emailVerified", true);
        navigate("/");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    console.log("location: ", location);
    const queryParams = location.pathname.split("/");
    console.log("queryParams: ", queryParams);
    // const encodedUserId = queryParams.get("hashedUserId");

    const address = decode(queryParams[2]);
    console.log("decryptedUserId:", address);
    verifying(address);
  }, [location.search]);

  return (
    <div>
      {/* You can render a loading spinner or other UI elements here */}
      Verifying email...
    </div>
  );
};

export default VerifyEmail;
