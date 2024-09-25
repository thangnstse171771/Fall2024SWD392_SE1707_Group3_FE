import "./Header.scss";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Fish image</h2>
      </div>
      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/manage">MANAGE KOI</Link>
        <Link to="/login">LOGIN</Link>
      </div>
    </nav>
  );
}

export default Header;
