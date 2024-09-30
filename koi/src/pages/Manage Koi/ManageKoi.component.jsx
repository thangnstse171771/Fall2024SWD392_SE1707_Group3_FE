import "./ManageKoi.scss";
import MyKoiIcon from "../../assets/icons8-koi-fish-100.png";
import MyKoiPondIcon from "../../assets/icons8-aquarium-100.png";
import WaterParametersIcon from "../../assets/icons8-water-100.png";

import { Link } from "react-router-dom";

function ManageKoi() {
  return (
    <div className="manage-koi-page">
      <div className="manage-koi-card">
        <img src={MyKoiIcon} alt="My Koi Logo" className="manage-koi-logos" />
        <Link to="/manage-koi/my-koi" className="manage-koi-text">
          <h1>My Koi</h1>
        </Link>
      </div>

      <div className="manage-koi-card">
        <img
          src={MyKoiPondIcon}
          alt="My Pond Logo"
          className="manage-koi-logos"
        />
        <Link to="/manage-koi/my-pond" className="manage-koi-text">
          <h1>My Pond</h1>
        </Link>
      </div>

      <div className="manage-koi-card">
        <img
          src={WaterParametersIcon}
          alt="My Koi Logo"
          className="manage-koi-logos"
        />
        <Link to="/manage-koi/water-parameters" className="manage-koi-text">
          <h1>Water Parameters</h1>
        </Link>
      </div>
    </div>
  );
}

export default ManageKoi;
