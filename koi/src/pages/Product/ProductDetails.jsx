// import "./PondProfile.scss";
// import PondProfileInfo from "./PondProfileInfo.component";
// import WaterParameterProfile from "./Water Parameter Profile/WaterParameterProfile.component";
// import PondFishList from "./Fish List/PondFishList.component";
import { Divider } from "antd";
import ProductInfo from "./ProductInfo";

function ProductDetails() {
  return (
    <div className="pond-profile-page">
      <div className="pond-profile-header">
        <h1 style={{ color: "red", fontWeight: "bold" }}>PRODUCT PROFILE</h1>
      </div>
      <div className="pond-profile-body">
        <Divider
          style={{
            borderColor: "#7cb305",
            fontSize: "2em",
            fontWeight: "500",
            color: "darkcyan",
          }}
        >
          Product Details
        </Divider>
        <div>
          <ProductInfo />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
