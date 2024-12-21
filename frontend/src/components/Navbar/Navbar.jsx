import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Container, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LogoComponent from "./Logo";
import SearchBarComponent from "./SearchBar";
import UserProfileComponent from "./UserProfile";
import AuthButtons from "./AuthButtons";
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import "./css/Navbar.css";

const NavbarComponent = ({ onSearchChange }) => {
  const [userData, setUserData] = useState({ full_name: "", email: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems ? cartItems.length : 0;

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  const handleSearch = (event) => {
    onSearchChange(event.target.value);
  };

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData({
            full_name: response.data.full_name || "N/A",
            email: response.data.email || "N/A",
          });
        })
        .catch((error) => {
          console.error("User data error:", error);
          if (error.response?.status === 403) handleLogout();
        });
    }
  }, [token, handleLogout]);

  return (
    <div className="flex">
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <LogoComponent />
          <SearchBarComponent onSearchChange={handleSearch} />
          <div className="d-flex align-items-center">
            {token ? (
              <>
                <Link to="/cart" className="me-3 position-relative">
                  <TiShoppingCart size={30} className="text-dark" />
                  {cartItemCount > 0 && (
                    <Badge className="cart-badge" pill>
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
                <UserProfileComponent
                  userData={userData}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <AuthButtons navigate={navigate} />
            )}
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
