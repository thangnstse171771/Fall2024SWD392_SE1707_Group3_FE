import KoiFishArt from "../../assets/Koi-Fish-yinyang-01_grande.webp";
import "./Home.scss";

function Home() {
  return (
    <div className="home-page">
      <div className="home-card">
        <img src={KoiFishArt} alt="Fish art" className="fish-art"/>
        <div className="welcome-text">
          <h1>Welcome to Koi care system</h1>
          <p className="welcome-context">Koi care system is an online Koi fish health tracking system designed to 
            help you take care of your Koi fishes at home.</p>
        </div>
      </div>

      <div>
        
      </div>
    </div>
  );
}

export default Home;
