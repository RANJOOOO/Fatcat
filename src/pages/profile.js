import React, { useState } from "react";
import Headers from "../components/profile/header";
import ProfileTabs from "../components/profile/profileTabs";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  console.log(id);
  const [userDataByUserName, setUserDataByUserName] = useState("");

  return (
    <div>
      <div className="pb-4">
        <Headers
          id={id}
          setUserDataByUserName={setUserDataByUserName}
          userDataByUserName={userDataByUserName}
        />
        <ProfileTabs
          id={id}
          setUserDataByUserName={setUserDataByUserName}
          userDataByUserName={userDataByUserName}
        />
      </div>
    </div>
  );
};

export default Profile;
