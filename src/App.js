import React, {useState, useEffect} from "react";
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
    const [isDuplicateTab, setIsDuplicateTab] = useState(false);

    useEffect(() => {
        const currentTabId = sessionStorage.getItem('tabId') || Math.random().toString(36).substring(7);
        sessionStorage.setItem('tabId', currentTabId);

        const getOpenTabs = () => {
            let openTabs = [];
            try {
                const storedTabs = localStorage.getItem('openTabs');
                if (storedTabs) {
                    openTabs = JSON.parse(storedTabs);
                }
            } catch (e) {
                console.error("Error parsing openTabs from localStorage", e);
                openTabs = [];
            }
            return Array.isArray(openTabs) ? openTabs : [];
        };

        const checkTabs = () => {
            const openTabs = getOpenTabs();
            if (openTabs.length > 0 && openTabs[0] !== currentTabId) {
                setIsDuplicateTab(true);
            }
        };

        const addTab = () => {
            const openTabs = getOpenTabs();
            if (!openTabs.includes(currentTabId)) {
                openTabs.push(currentTabId);
                localStorage.setItem('openTabs', JSON.stringify(openTabs));
            }
        };

        const removeTab = () => {
            let openTabs = getOpenTabs();
            const updatedTabs = openTabs.filter(tabId => tabId !== currentTabId);
            localStorage.setItem('openTabs', JSON.stringify(updatedTabs));
        };

        const handleStorageChange = (e) => {
            if (e.key === 'openTabs') {
                checkTabs();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('load', addTab);
        window.addEventListener('beforeunload', removeTab);

        addTab();
        checkTabs();

        const interval = setInterval(checkTabs, 1000);

        return () => {
            removeTab();
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('load', addTab);
            window.removeEventListener('beforeunload', removeTab);
            clearInterval(interval);
        };
    }, []);

    const handleSignIn = (username, password, setAlert) => {
        api.post("admin/sign-in", {username, password}).then(r => r.data)
            .then(d => {
                if (d.status === "ok") {
                    if (!d.token) {
                        setAlert({severity: "error", message: "wrong password"})
                        return
                    }
                    sessionStorage.setItem('token', d.token)
                    sessionStorage.setItem('otp', "0")
                    window.location.reload()
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

    if (isDuplicateTab) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px'
            }}>
                This application is already open in another tab. To ensure a smooth experience, please use the existing tab or close this one.
            </div>
        );
    }


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

