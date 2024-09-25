import KoiFishArt from "../../assets/Koi-Fish-yinyang-01_grande.webp";
import KoiFishArt2 from "../../assets/watercolor-koi-fish-beltschazar.jpg";
import "./Home.scss";

function Home() {
  return (
    <div>
      <div className="home-page">
        <div className="home-card">
          <img src={KoiFishArt} alt="Fish art" className="fish-art" />
          <div className="welcome-text">
            <h1>Welcome to Koi care system</h1>
            <p className="welcome-context">
              Koi care system is an online Koi fish health tracking system
              designed to help you take care of your Koi fishes at home.
            </p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-text">
          <h1>Our app can help you</h1>
          <p className="content-list">Keep an eye on your parameters!</p>
          <p className="content-list">Manage and track your koi!</p>
          <p className="content-list">Determine the ideal amount of food!</p>
          <p className="content-list">Manage your ponds!</p>
        </div>
        <img src={KoiFishArt2} alt="Fish image" className="fish-image" />
      </div>
    </div>
  );
}

export default Home;
