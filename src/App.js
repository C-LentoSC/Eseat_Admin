import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import SignInPage from "./components/SignIn";
import OtpEntryPage from "./components/OtpEntryPage";
import DashboardLayoutAccount from "./components/DashboardLayoutAccount";
import api from "./model/API";
import LoadingOverlay from "./components/Parts/LoadingOverlay";


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );





    useEffect(() => {
        const handleActivity = () => {
            // Reset the inactivity timer on user activity
            clearTimeout(window.inactivityTimeout);
            window.inactivityTimeout = setTimeout(() => {
                handleLogout(); // Logout after 45 minutes of inactivity
            }, 45 * 60 * 1000); // 45 minutes in milliseconds
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
    const handleSignIn = (username, password, setAlert) => {
        api.post("admin/sign-in", {username, password}).then(r => r.data)
            .then(d => {
                if (d.status === "ok") {
                    if (!d.token) {
                        setAlert({severity: "error", message: "wrong password"})
                        return
                    }
                    setAlert({severity: "info", message: "done"})
                    localStorage.setItem('token', d.token)
                    setIsAuthenticated(true)
                    localStorage.setItem('isAuthenticated', 'true')
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

    const [loadingList, setLoadingList] = useState([]);
    const loading = loadingList.length !== 0;

    function generateUniqueId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const startLoading = (id) => setLoadingList((prevState) => [...prevState, id]);
    const endLoading = (id) => setLoadingList((prevState) => prevState.filter((i) => i !== id));

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
            const requestId = generateUniqueId()
            config.headers["X-Request-ID"] = requestId
            startLoading(requestId)
            config.metadata = { requestId }
            return config
        });
        const responseInterceptor = api.interceptors.response.use(
            (response) => {
                const requestId = response.config.metadata?.requestId
                if (requestId) {
                    endLoading(requestId)
                }
                return response
            },
            (error) => {
                const requestId = error.config?.metadata?.requestId
                if (requestId) {
                    endLoading(requestId)
                }
                return Promise.reject(error)
            }
        )
        return () => {
            api.interceptors.request.eject(requestInterceptor)
            api.interceptors.response.eject(responseInterceptor)
        };
    }, [])
    return (
        <>
            <CssBaseline/>
            <Router>
                <LoadingOverlay show={loading}/>
                <Routes>
                    {/* Sign-In Page Route */}
                    <Route
                        path="/signin"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" replace/>
                            ) : (
                                <SignInPage onSignIn={handleSignIn}/>
                            )
                        }
                    />

                    {/* OtpEntryPage Route */}
                    <Route
                        path="/otpEntryPage"
                        element={
                            <OtpEntryPage/>
                        }
                    />

                    {/* Dashboard Route */}
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? (
                                <DashboardLayoutAccount onLogout={handleLogout}/>
                            ) : (
                                <Navigate to="/signin" replace/>
                            )
                        }
                    />

                    {/* Redirect to Sign-In by default */}
                    <Route path="*" element={<Navigate to="/signin" replace/>}/>
                </Routes>
            </Router>
        </>
    );
};


export default App;
