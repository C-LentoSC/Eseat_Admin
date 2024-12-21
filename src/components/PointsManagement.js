import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    IconButton,
    InputAdornment,
} from "@mui/material";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";

const PointsManagement = () => {
    const [points, setPoints] = useState([]);

    const [newPointName, setNewPointName] = useState("");
    const [open, setOpen] = useState(false);
    const [currentPoint, setCurrentPoint] = useState(null);
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})

    useEffect(()=>{
        loadAllPoints()
    },[])
    const loadAllPoints=()=>{
        api.get("admin/points/get-all")
            .then(res=>{
                setPoints(res.data)
            })
            .catch(handleError)
    }
    // Add New Point
    const handleAddPoint = () => {
        if (newPointName.trim()) {
            api.post("admin/points/add",{name:newPointName})
                .then(res=>{
                    loadAllPoints()
                    sendAlert(res.data.message||"new point added")
                })
                .catch(handleError)

            setNewPointName("");
        }
    };

    // Open Edit Modal
    const handleOpen = (point) => {
        setCurrentPoint(point);
        setOpen(true);
    };

    // Close Modal
    const handleClose = () => {
        setCurrentPoint(null);
        setOpen(false);
    };

    // Save Edited Point
    const handleSave = () => {
        api.post('admin/points/edit',currentPoint)
            .then(res=>{
                sendAlert(res.data.message || "point edited")
                loadAllPoints()
            })
            .catch(handleError)
        handleClose();
    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCurrentPoint({...currentPoint, [name]: value});
    };

    // Delete Point
    const handleDelete = (id) => {
        api.post('admin/points/delete',{id})
            .then(res=>{
                sendAlert(res.data.message || "point deleted")
                loadAllPoints()
            })
            .catch(handleError)
    };

    return (
        <Container component="main" maxWidth="lg">
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                  setOpen={setAlert}/> : <></>}
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                {/* Title Section */}
                <Typography variant="h5" sx={{fontWeight: 600, marginBottom: "20px"}}>
                    Points Management
                </Typography>

                {/* Form Section */}
                <Box component="form" sx={{width: "100%"}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Point Name"
                                variant="outlined"
                                required
                                value={newPointName}
                                onChange={(e) => setNewPointName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LoyaltyIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{display: "flex", justifyContent: "flex-end", marginTop: "30px"}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddPoint}
                            sx={{
                                padding: "12px 24px",
                                fontWeight: "bold",
                                borderRadius: "4px",
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Add Point
                        </Button>
                    </Box>
                </Box>

                {/* Table Section */}
                <Typography variant="h6" sx={{marginTop: "40px", marginBottom: "20px"}}>
                    All Points
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Point Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {points.map((point) => (
                                <TableRow key={point.id}>
                                    <TableCell>{point.name}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(point)}
                                            sx={{marginRight: "8px"}}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(point.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Modal */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid gray",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "10px",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Edit Point
                        </Typography>
                        <TextField
                            fullWidth
                            label="Point Name"
                            variant="outlined"
                            name="name"
                            value={currentPoint?.name || ""}
                            onChange={handleInputChange}
                            sx={{marginBottom: "16px"}}
                        />
                        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{marginRight: "8px"}}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                                sx={{backgroundColor: "gray"}}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default PointsManagement;
