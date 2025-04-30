import React, { useState, useEffect} from "react";
import "./App.css";
import { auth } from "./firebase";
import { signOut , onAuthStateChanged, updatePassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function ScrollHideHeader() {
  const [scrolling, setScrolling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // state pentru profil
  const [UserEmail , setUserEmail] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("");
  const [status , setStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth , (user) => {
      if (user)
      {
        setUserEmail(user.email);
      }
      else
      {
        setUserEmail(null)
      }
    });

    return () => unsubscribe();

  },[]);

  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNewPasswordChange = () => {
    const user = auth.currentUser;
    if (user)
    {
      updatePassword(user , newPassword)
      .then(() => {
        setErrorMessage("Password updated successfully!");
        setStatus(true);
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          setErrorMessage("You need to re-login to update your password.Wait 5 seconds...");
          setTimeout (() => {
            handleLogout();
            setStatus(false);
          },5000);

        }
      });
    }
  };

  return (
    <div className={`header ${scrolling ? "hidden" : ""}`}>
 {/* Profil Dropdown */}
        <div
          className="profile-dropdown"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img
            className="profile-icon"
            src="https://via.placeholder.com/40" 
            alt="Profile"
          />
          {showProfileMenu && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <h3>{UserEmail}</h3>
              <button onClick={handleNewPasswordChange} >Change password </button>
              <input
                type = "password"
                placeholder = "New password"
                className = "new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {status && <h3>{errorMessage}</h3>}
              <button style={{ width: 220 }} onClick={handleLogout}>
              Logout
              </button>
            </div>
          )}
        </div>
         {/* Profil Dropdown */}
      <h1 className="nume">Ai Studio</h1>

      <div className="Dreapta-Header">
        <h1>Home</h1>
        <h1>Contact</h1>
      </div>
      <div className="hamburger" onClick={() => setShowMenu(!showMenu)}>
        ☰
      </div>
      {showMenu && (
        <div className="mobile-menu">
          <h1>Home</h1>
          <h1>Features</h1>
        </div>
      )}
    </div>
  );
}

export default ScrollHideHeader;
