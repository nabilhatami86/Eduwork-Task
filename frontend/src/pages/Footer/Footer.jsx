import React from "react";
import { AiFillInstagram } from "react-icons/ai";
import { BsTwitterX, BsFacebook } from "react-icons/bs";

const Footer = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
      className="bg-light shadow-sm"
    >
      <div style={{ flex: 1 }}></div>

      {/* Footer */}
      <div className="container-fluid">
        <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-4 border-top">
          {/* Brand Section */}
          <div className="col mb-3">
            <a
              href="/"
              className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none"
            >
              <svg className="bi me-2" width="40" height="32">
                <use xlinkHref="#bootstrap"></use>
              </svg>
            </a>
            <p className="text-body-secondary">© 2024 TakeCart, Inc</p>
          </div>

          <div className="col mb-3"></div>

          {/* Link Sections */}
          <div className="col mb-3">
            <h5>Explore</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="/" className="nav-link p-0 text-body-secondary">
                  Home
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/product" className="nav-link p-0 text-body-secondary">
                  Products
                </a>
              </li>
              <li className="nav-item mb-2">
                <a
                  href="/features"
                  className="nav-link p-0 text-body-secondary"
                >
                  Features
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/pricing" className="nav-link p-0 text-body-secondary">
                  Pricing
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/about" className="nav-link p-0 text-body-secondary">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div className="col mb-3">
            <h5>Support</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="/faq" className="nav-link p-0 text-body-secondary">
                  FAQs
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/contact" className="nav-link p-0 text-body-secondary">
                  Contact Us
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/terms" className="nav-link p-0 text-body-secondary">
                  Terms of Service
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="/privacy" className="nav-link p-0 text-body-secondary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col mb-3">
            <h5>Follow Us</h5>
            <li className="nav-item mb-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-secondary"
              >
                <BsTwitterX size={20} /> Twitter
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-secondary"
              >
                <AiFillInstagram size={20} /> Instagram
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-secondary"
              >
                <BsFacebook size={20} /> Facebook
              </a>
            </li>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
