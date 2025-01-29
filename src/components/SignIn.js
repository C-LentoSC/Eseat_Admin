import React,{useState} from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import favicon from "../resources/favicon.ico";

import CustomAlert from './Parts/CustomAlert';

// import LoadingOverlay from './Parts/LoadingOverlay';

const SignInPage = ({ onSignIn }) => {
    
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
                </Box>
            </Box>
        </Container>
    );
};

SignInPage.propTypes = {
    onSignIn: PropTypes.func.isRequired,
};

export default SignInPage;
