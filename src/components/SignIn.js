import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import favicon from "../resources/favicon.ico";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import CustomAlert from './Parts/CustomAlert';
import {useLoading} from "../loading";
import api from "../model/API";
import {unstable_resetCleanupTracking} from "@mui/x-data-grid";


// import LoadingOverlay from './Parts/LoadingOverlay';

const ForgotPasswordDialog = ({open, handleClose,handleError,sendAlert}) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const {startLoading, stopLoading} = useLoading()


    const handleNext = () => {
        if (step === 1) {
            let id = startLoading()
            api.post("admin/password-reset-request", {email: email})

                .then(res => {
                    stopLoading(id)
                    // window.alert("The Otp Has Been Sent To Your Mobile")
                    sendAlert("The Otp Has Been Sent To Your Mobile")
                    if (step < 3) {
                        setStep(step + 1);
                    }
                }).catch(err => {
                stopLoading(id)
                handleError(err)
            })
        }else{
            if (step < 3) {
                setStep(step + 1);
            }
        }

    };

    const handleReset = () => {
        let id = startLoading()
        api.post("admin/password-reset", {
            email: email,
            otp: otp,
            password: newPassword
        })
            .then( res => {
                stopLoading(id)
                window.alert("Password Reset Successfully")
                let token=res.data.token
                sessionStorage.setItem('isAuthenticated', 'true')
                sessionStorage.setItem('token', token)
                window.location.reload()
            })
            .catch(er=>{
            stopLoading(id)
            handleError(er)
        })

        handleClose();
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
    };

    return (
        <Dialog open={open} onClose={()=>{
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            handleClose()
        }} fullWidth maxWidth="xs">
            <DialogTitle>
                Forgot Password
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{position: "absolute", right: 8, top: 8}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {step === 1 && (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                )}
                {step === 2 && (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter OTP"
                        type="text"
                        fullWidth
                        variant="outlined"
                        inputProps={{maxLength: 6}}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                )}
                {step === 3 && (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                {step < 3 ? (
                    <Button onClick={handleNext} disabled={step === 1 && !email}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleReset} disabled={!newPassword}>
                        Reset Password
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};


const OTPLoginDialog = ({open, handleClose, handleConfirm,handleError}) => {
    const [otp, setOtp] = useState("");
    const {startLoading,stopLoading}=useLoading()

    const handleLogin = () => {
        console.log("Logging in with OTP:", otp);
        let id=startLoading()
        api.post("admin/otp-check", {otp:otp})
            .then(res=>{
                stopLoading(id)
                sessionStorage.removeItem('otp')
                sessionStorage.setItem('isAuthenticated', 'true')
                sessionStorage.setItem('token', res.data.token)
                window.location.reload()
            })
            .catch(err=>{
                stopLoading(id)
                handleError(err)
                handleClose()
            })
        // handleConfirm();
        setOtp("");
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>
                Enter OTP
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{position: "absolute", right: 8, top: 8}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    label="5-digit OTP"
                    type="text"
                    fullWidth
                    variant="outlined"
                    inputProps={{maxLength: 6}}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLogin} disabled={otp.length !== 5}>
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const SignInPage = ({onSignIn}) => {
    const [forgotOpen, setForgotOpen] = useState(false);
    const [otpLoginOpen, setOtpLoginOpen] = useState((sessionStorage.getItem("otp") === "0"));
    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);

    const handleOtpConfirm = () => {
        setOtpLoginOpen(false);
        // onSignIn(); 
    };
    const {clearLoading}=useLoading()
    useEffect(() => {
        clearLoading()
    })

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState(null)

    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})

    const handleSubmit = (event) => {
        event.preventDefault();
        onSignIn(username, password, setAlert);
    };


    return (
        <>
            <Container component="main" maxWidth="xs"
                       sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "90vh"}}>

                {/* <LoadingOverlay show={loading} /> */}

                {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                      setOpen={setAlert}/> : <></>}
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{
                        m: 1,
                        width: "80px",
                        height: "80px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <img src={favicon} alt="favicon" style={{width: "60px", height: "60px"}}/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username "
                            label="Username"
                            name="username "
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={evt => setUsername(evt.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={evt => setPassword(evt.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Box sx={{textAlign: "center"}}>
                            <Link
                                href="#"
                                variant="body2"
                                onClick={() => setForgotOpen(true)}
                            >
                                Forgot password?
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <ForgotPasswordDialog
                open={forgotOpen}
                handleClose={() => setForgotOpen(false)}
                handleError={handleError}
                sendAlert={sendAlert}
            />
            <OTPLoginDialog
                open={otpLoginOpen}
                handleClose={() => {
                    setOtpLoginOpen(false)
                    sessionStorage.removeItem('otp')
                    sessionStorage.setItem('isAuthenticated', 'false')
                }}
                handleConfirm={handleOtpConfirm}
                handleError={handleError}
            />
        </>
    );
};

SignInPage.propTypes = {
    onSignIn: PropTypes.func.isRequired,
};

export default SignInPage;
