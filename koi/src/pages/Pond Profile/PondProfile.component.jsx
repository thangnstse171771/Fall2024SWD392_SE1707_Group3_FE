import "./PondProfile.scss";
import { useState } from "react";
import PondProfileInfo from "./PondProfileInfo.component";
import WaterParameterProfile from "./Water Parameter Profile/WaterParameterProfile.component";
import PondFishList from "./Fish List/PondFishList.component";
import { Divider } from "antd";

function PondProfile() {
  const [refreshPondProfile, setRefreshPondProfile] = useState(false);
  const userType = localStorage.getItem("usertype");

  const handlePondProfileRefresh = () => {
    setRefreshPondProfile((prev) => !prev);
  };

  return (
    <div className="pond-profile-page">
      <div className="pond-profile-header">
        <h1>Pond profile</h1>
      </div>
      <div className="pond-profile-body">
        <Divider style={{ borderColor: "#7cb305" }}>Pond Info</Divider>
        <div>
          <PondProfileInfo refresh={refreshPondProfile} />
        </div>
        <Divider style={{ borderColor: "#7cb305" }}>Water Parameter</Divider>
        <div className="pond-profile-water-parameter">
          <WaterParameterProfile />
        </div>
        {userType === "Customer" && (
          <>
            <Divider style={{ borderColor: "#7cb305" }}>Fish List</Divider>
            <div className="pond-profile-fish-list">
              <PondFishList onFishAdded={handlePondProfileRefresh} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PondProfile;
