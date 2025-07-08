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
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");

    useEffect(() => {
        const handleActivity = () => {
            clearTimeout(window.inactivityTimeout);
            window.inactivityTimeout = setTimeout(() => {
                handleLogout();
            }, 45 * 60 * 1000);
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);

        // Tab tracking logic
        const onBeforeUnload = () => {
            let tabCount = parseInt(localStorage.getItem('openTabs') || '0', 10);
            tabCount = Math.max(0, tabCount - 1);
            localStorage.setItem('openTabs', tabCount);
            if (tabCount === 0) {
                handleLogout();
            }
        };

        const onLoad = () => {
            let tabCount = parseInt(localStorage.getItem('openTabs') || '0', 10);
            localStorage.setItem('openTabs', tabCount + 1);
        };

        window.addEventListener('beforeunload', onBeforeUnload);
        window.addEventListener('load', onLoad);

        // Initial load
        onLoad();

        return () => {
            clearTimeout(window.inactivityTimeout);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            window.removeEventListener('beforeunload', onBeforeUnload);
            window.removeEventListener('load', onLoad);
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

                    localStorage.setItem('token', d.token)
                    localStorage.setItem('otp', "0")
                    window.location.reload()
                    // setIsAuthenticated(true)
                    // localStorage.setItem('isAuthenticated', 'true')
                } else {
                    console.log(d)
                }
            }).catch(err => setAlert({message: err.response.data.message, severity: "error"}))

    };

    // Function to handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
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
