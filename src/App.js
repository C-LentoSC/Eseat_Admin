import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import SignInPage from "./components/SignIn";
import OtpEntryPage from "./components/OtpEntryPage";
import DashboardLayoutAccount from "./components/DashboardLayoutAccount";

import api from "./model/API";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const handleActivity = () => {
      // Reset the inactivity timer on user activity
      clearTimeout(window.inactivityTimeout);
      window.inactivityTimeout = setTimeout(() => {
        handleLogout(); // Logout after 15 minutes of inactivity
      }, 3 * 60 * 1000); // 15 minutes in milliseconds
    };

    // Add event listeners for activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      clearTimeout(window.inactivityTimeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  // Function to handle login
  const handleSignIn = (username,password) => {
      api.post("admin/sign-in", {username, password}).then(r  =>r.data)
          .then(d=>{
              if(d.status==="ok"){
                  localStorage.setItem('token',d.token)
                  setIsAuthenticated(true)
                  localStorage.setItem('isAuthenticated','true')
              }else{
                  console.log(d)
              }
          }).catch(err=>alert(err.response.data.message))

  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Sign-In Page Route */}
          <Route
            path="/signin"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <SignInPage onSignIn={handleSignIn} />
              )
            }
          />

          {/* OtpEntryPage Route */}
          <Route
            path="/otpEntryPage"
            element={
              <OtpEntryPage />
            }
          />

          {/* Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardLayoutAccount onLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          {/* Redirect to Sign-In by default */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;