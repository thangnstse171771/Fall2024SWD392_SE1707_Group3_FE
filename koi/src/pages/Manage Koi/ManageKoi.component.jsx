import "./ManageKoi.scss";
import MyKoiIcon from "../../assets/icons8-koi-fish-100.png";
import MyKoiPondIcon from "../../assets/icons8-aquarium-100.png";
import WaterParametersIcon from "../../assets/icons8-water-100.png";
import RecommendIcon from "../../assets/icons8-good-quality-100.png";

import { Link } from "react-router-dom";

function ManageKoi() {
  return (
    <div className="manage-koi-page">
      <Link to="/manage-koi/my-koi" className="manage-koi-card">
        <div>
          <img src={MyKoiIcon} alt="My Koi Logo" className="manage-koi-logos" />
          <h1 className="manage-koi-text">My Koi</h1>
        </div>
      </Link>

      <Link to="/manage-koi/my-pond" className="manage-koi-card">
        <div>
          <img
            src={MyKoiPondIcon}
            alt="My Pond Logo"
            className="manage-koi-logos"
          />
          <h1 className="manage-koi-text">My Pond</h1>
        </div>
      </Link>

      <Link to="/manage-koi/water-parameters" className="manage-koi-card">
        <div>
          <img
            src={WaterParametersIcon}
            alt="My Koi Logo"
            className="manage-koi-logos"
          />
          <h1 className="manage-koi-text">Water Parameters</h1>
        </div>
      </Link>   

      <Link to="/manage-koi/recommendations" className="customer-recommendations-card">
        <div>
          <img
            src={RecommendIcon}
            alt="Recommendations logo"
            className="customer-recommendations-logo"
          />
          <h1 className="manage-koi-text">Recommendations</h1>
        </div>
      </Link>   
    </div>
  );
}

export default ManageKoi;
