import "./PondProfile.scss";
import PondProfileInfo from "./PondProfileInfo.component";
import { Divider } from "antd";

function PondProfile() {
  return (
    <div className="pond-profile-page">
      <div className="pond-profile-header">
        <h1>Pond profile</h1>
      </div>
      <div className="pond-profile-body">
        <Divider style={{ borderColor: "#7cb305" }}>Pond Info</Divider>
        <div>
          <PondProfileInfo />
        </div>
        <Divider style={{ borderColor: "#7cb305" }}>Fish List</Divider>
        <div className="pond-profile-fish-list">Fish list</div>
        <Divider style={{ borderColor: "#7cb305" }}>Water Parameter</Divider>
        <div className="pond-profile-water-parameter">Pararmeter</div>
      </div>
    </div>
  );
}

export default PondProfile;
