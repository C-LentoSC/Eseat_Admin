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
    FormControlLabel,
    Switch,
    IconButton,
    Autocomplete,
    InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

const ManageDepots = () => {
    // Sample initial data
    const [depots, setDepots] = useState([
        // {
        //     id: 1,
        //     region: "Western Region",
        //     depotName: "Colombo Central",
        //     dsName: "John Doe",
        //     mobile: "0771234567",
        //     address: "123 Main St, Colombo",
        //     email: "colombo.central@example.com",
        //     description: "Main depot in Colombo area",
        //     active: true,
        // },
    ]);
    const [regions,setRegions]=useState([])
    const loadAllDepots=()=>{
        api.get('admin/depots/get-all-depots')
            .then(res=>{
                setDepots(res.data)
            })
            .catch(handleError)
    }
    const loadAllRegions=()=>{
        api.get('admin/depots/get-regions')
            .then(res=>{
                setRegions(res.data)
            })
            .catch(handleError)
    }
    useEffect(()=>{
        loadAllDepots()
        loadAllRegions()
    },[])
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})

    // Form states
    const [formData, setFormData] = useState({
        region: "",
        depotName: "",
        dsName: "",
        mobile: "",
        address: "",
        email: "",
        description: "",
    });

    // Modal states
    const [open, setOpen] = useState(false);
    const [currentDepot, setCurrentDepot] = useState(null);



    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle region selection
    const handleRegionChange = (event, newValue) => {
        setFormData({
            ...formData,
            region: newValue
        });
    };

    // Add new depot
    const handleAddDepot = () => {
        if (formData.region && formData.depotName && formData.dsName) {
            const newDepot = {
                ...formData,
                active: true,
            };
            // setDepots(prev => [...prev, newDepot]);
            api.post('admin/depots/add',newDepot)
                .then(res=>{
                    sendAlert('done')
                    loadAllDepots()
                })
                .catch(handleError)
            // Reset form
            setFormData({
                region: "",
                depotName: "",
                dsName: "",
                mobile: "",
                address: "",
                email: "",
                description: "",
            });
        }
    };

    // Open edit modal
    const handleOpen = (depot) => {
        setCurrentDepot(depot);
        setOpen(true);
    };

    // Close modal
    const handleClose = () => {
        setCurrentDepot(null);
        setOpen(false);
    };

    // Save edited depot
    const handleSave = () => {
        api.post('admin/depots/edit',currentDepot)
            .then(res=>{
                sendAlert('done')
                loadAllDepots()
            })
            .catch(handleError)
        handleClose();
    };

    // Handle edit modal region change
    const handleEditRegionChange = (event, newValue) => {
        setCurrentDepot({
            ...currentDepot,
            region: newValue
        });
    };

    // Handle edit modal input changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentDepot({
            ...currentDepot,
            [name]: value,
        });
    };

    // Delete depot
    const handleDelete = (id) => {
        api.post('admin/depots/delete',{id})
            .then(res=>{
                loadAllDepots()
            })
            .catch(handleError)
    };

    // Toggle active status
    const handleActiveChange = (id) => {
        api.post('admin/depots/toggle-status',{id})
            .then(res=>{
                loadAllDepots()
            })
            .catch(handleError)
    };

    return (
        <Container component="main" maxWidth="lg">
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                  setOpen={setAlert}/> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Manage Depots
                </Typography>

                {/* Form Section */}
                <Box component="form" sx={{ width: "100%" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                value={formData.region}
                                onChange={handleRegionChange}
                                options={regions}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Region"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Depot Name"
                                name="depotName"
                                value={formData.depotName}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="DS Name"
                                name="dsName"
                                value={formData.dsName}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddDepot}
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
                            Add Depot
                        </Button>
                    </Box>
                </Box>

                {/* Table Section */}
                <Box sx={{ width: "100%", mt: 5 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        All Depots
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Region</TableCell>
                                    <TableCell>Depot Name</TableCell>
                                    <TableCell>DS Name</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {depots.map((depot) => (
                                    <TableRow key={depot.id}>
                                        <TableCell>{depot.region}</TableCell>
                                        <TableCell>{depot.depotName}</TableCell>
                                        <TableCell>{depot.dsName}</TableCell>
                                        <TableCell>{depot.mobile}</TableCell>
                                        <TableCell>{depot.email}</TableCell>
                                        <TableCell>{depot.address}</TableCell>
                                        <TableCell>{depot.description}</TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={depot.active}
                                                        onChange={() => handleActiveChange(depot.id)}
                                                    />
                                                }
                                                label={depot.active ? "Active" : "Inactive"}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpen(depot)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(depot.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Edit Modal */}
                <Modal open={open} onClose={handleClose}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        border: "2px solid gray",
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Edit Depot
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    value={currentDepot?.region || null}
                                    onChange={handleEditRegionChange}
                                    options={regions}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Region"
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Depot Name"
                                    name="depotName"
                                    value={currentDepot?.depotName || ""}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="DS Name"
                                    name="dsName"
                                    value={currentDepot?.dsName || ""}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile"
                                    name="mobile"
                                    value={currentDepot?.mobile || ""}
                                    onChange={handleEditChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={currentDepot?.email || ""}
                                    onChange={handleEditChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    value={currentDepot?.address || ""}
                                    onChange={handleEditChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={currentDepot?.description || ""}
                                    onChange={handleEditChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSave}
                                        sx={{ marginRight: "8px" }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleClose}
                                        sx={{
                                            backgroundColor: 'gray',
                                            "&:hover": {
                                                backgroundColor: "#666",
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default ManageDepots;