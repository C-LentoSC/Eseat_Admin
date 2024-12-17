import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import favicon from "../resources/favicon.ico";  // Import your favicon image

const OtpEntryPage = ({ onSubmitOtp }) => {
    const [otp, setOtp] = useState("");

    const handleChange = (event) => {
        setOtp(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (otp.length === 6) { // Assuming OTP is 6 digits
            onSubmitOtp(otp);
        } else {
            alert("Please enter a valid 6-digit OTP.");
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, width: "80px", height: "80px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={favicon} alt="favicon" style={{ width: "60px", height: "60px" }} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Enter OTP
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="otp"
                        label="OTP"
                        name="otp"
                        type="text"
                        inputProps={{
                            maxLength: 6,  // Set max length for OTP
                            pattern: "[0-9]{6}",  // Only allow 6 digit numbers
                        }}
                        value={otp}
                        onChange={handleChange}
                        autoComplete="off"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit OTP
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

OtpEntryPage.propTypes = {
    onSubmitOtp: PropTypes.func.isRequired,
};

export default OtpEntryPage;
