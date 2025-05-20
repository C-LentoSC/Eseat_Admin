import React,{useState} from "react";
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

// import LoadingOverlay from './Parts/LoadingOverlay';

const ForgotPasswordDialog = ({ open, handleClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    // Simulate reset logic
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("New Password:", newPassword);

    handleClose();
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Forgot Password
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
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
            onChange={(e) => setEmail(e.target.value)}
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
            inputProps={{ maxLength: 6 }}
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

const SignInPage = ({ onSignIn }) => {
    const [forgotOpen, setForgotOpen] = useState(false);
    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [alert,setAlert]=useState(null)
    const handleSubmit = (event) => {
        event.preventDefault();
        onSignIn(username,password,setAlert);
    };


    return (
        <>
        <Container component="main" maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
           
            {/* <LoadingOverlay show={loading} /> */}
            
             {alert?<CustomAlert severity={alert.severity} message={alert.message} open={alert} setOpen={setAlert} />:<></>}
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, width: "80px", height: "80px", display:'flex', justifyContent: 'center', alignItems:'center' }}>
                    <img src={favicon} alt="favicon" style={{ width: "60px", height: "60px" }} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                        onChange={evt=>setUsername(evt.target.value)}
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
                        onChange={evt=>setPassword(evt.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Box sx={{ textAlign: "center" }}>
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
        />
      </>   
    );
};

SignInPage.propTypes = {
    onSignIn: PropTypes.func.isRequired,
};

export default SignInPage;
