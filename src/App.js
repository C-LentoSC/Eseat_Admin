import React, {useState, useEffect, useRef} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import SignInPage from "./components/SignIn";
import OtpEntryPage from "./components/OtpEntryPage";
import DashboardLayoutAccount from "./components/DashboardLayoutAccount";
import api from "./model/API";
import {LoadingProvider} from "./loading";

const App = () => {
    return (
        <LoadingProvider>
            <AppMain/>
        </LoadingProvider>
    )
}

const AppMain = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem("isAuthenticated") === "true");

    useEffect(() => {
        const handleActivity = () => {

            clearTimeout(window.inactivityTimeout);
            window.inactivityTimeout = setTimeout(() => {
                handleLogout();
            }, 45 * 60 * 1000);
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);

        return () => {
            clearTimeout(window.inactivityTimeout);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
        };
    }, []);

    // Function to handle login
    const handleSignIn = (username, password, setAlert) => {
        api.post("admin/sign-in", {username, password}).then(r => r.data)
            .then(d => {
                if (d.status === "ok") {
                    if (!d.token) {
                        setAlert({severity: "error", message: "wrong password"})
                        return
                    }
                    setAlert({severity: "info", message: "done"})
                    sessionStorage.setItem('token', d.token)
                    sessionStorage.setItem('otp', "0")
                    window.location.reload()
                    // setIsAuthenticated(true)
                    // sessionStorage.setItem('isAuthenticated', 'true')
                } else {
                    console.log(d)
                }
            }).catch(err => setAlert({message: err.response.data.message, severity: "error"}))

    };

    // Function to handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("token");
    };


    return (<>
            <CssBaseline/>
            <Router>
                <Routes>
                    {/* Sign-In Page Route */}
                    <Route
                        path="/signin"
                        element={isAuthenticated ? (<Navigate to="/dashboard" replace/>) : (
                            <SignInPage onSignIn={handleSignIn}/>)}
                    />

                    {/* OtpEntryPage Route */}
                    <Route
                        path="/otpEntryPage"
                        element={<OtpEntryPage/>}
                    />

                    {/* Dashboard Route */}
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? (<DashboardLayoutAccount onLogout={handleLogout}/>) : (
                            <Navigate to="/signin" replace/>)}
                    />

                    {/* Redirect to Sign-In by default */}
                    <Route path="*" element={<Navigate to="/signin" replace/>}/>
                </Routes>
            </Router>
        </>);
};


export default App;
