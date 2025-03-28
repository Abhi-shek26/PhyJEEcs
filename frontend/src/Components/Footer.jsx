import { Link } from "react-router-dom";
import { FaTelegram, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer-container">
        <hr></hr>
      <footer className="footer">
        <div className="footer-links">
          <Link to="/contact">Contact Us</Link>
        </div>
        <p className="footer-text">
          ©{currentYear} phyJEEcs. All rights reserved.
        </p>
        <div className="footer-icons">
          <FaTelegram className="icon" />
          <FaInstagram className="icon" />
          <FaYoutube className="icon" />
        </div>
      </footer>
    </div>
  );
};
export default Footer;
