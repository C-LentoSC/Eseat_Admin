import React, { useEffect, useState } from "react";
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
    InputAdornment,
    TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";
import {useLoading} from "../loading";

// import LoadingOverlay from './Parts/LoadingOverlay';

const ManageDepots = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


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
    const {startLoading,stopLoading}=useLoading()
    const [addmodel, setAddmodel] = useState(false);
    const [regions, setRegions] = useState([])
    const loadAllDepots = () => {
        const L=startLoading()
        api.get('admin/depots/get-all-depots')
            .then(res => {
                stopLoading(L)
                setDepots(res.data)
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    }
    const loadAllRegions = () => {
        const L=startLoading()
        api.get('admin/depots/get-regions')
            .then(res => {
                stopLoading(L)
                setRegions(res.data)
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    }
    useEffect(() => {
        loadAllDepots()
        loadAllRegions()
    }, [])
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Form states
    const [formData, setFormData] = useState({
        region: "",
        depotName: "",
        dsName: "",
        mobile: "",
        email: "",
        description: "",
        mobile2:""
    });

    // Modal states
    const [open, setOpen] = useState(false);
    const [currentDepot, setCurrentDepot] = useState(null);

    const [filterRegion, setFilterRegion] = useState("");
    const [filterDepotName, setFilterDepotName] = useState("");
    const [filterDSName, setFilterDSName] = useState("");
    const [filterMobile, setFilterMobile] = useState("");


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

        if (formData.region && formData.depotName && formData.dsName && formData.mobile) {
            const newDepot = {
                ...formData,
                active: true,
            };
            // setDepots(prev => [...prev, newDepot]);
            const L=startLoading()
            api.post('admin/depots/add', newDepot)
                .then(res => {
                    stopLoading(L)
                    sendAlert('added new')
                    loadAllDepots()
                    handleClose();
                    setFormData({
                        region: "",
                        depotName: "",
                        dsName: "",
                        mobile: "",
                        address: "",
                        email: "",
                        description: "",
                    });
                })
                .catch(err=> {
                    stopLoading(L)
                    handleError(err)
                })
            // Reset form

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
        setAddmodel(false);
        setFormData({
            region: "",
            depotName: "",
            address: "",
            description: "",
            dsName: "",
            email: "",
            mobile: ""
        })
    };

    // Save edited depot
    const handleSave = () => {
        const L=startLoading()
        api.post('admin/depots/edit', currentDepot)
            .then(res => {
                stopLoading(L)
                sendAlert('updated')
                loadAllDepots()
                handleClose();
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
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
        const L=startLoading()
        api.post('admin/depots/delete', { id })
            .then(res => {
                stopLoading(L)
                loadAllDepots()
                sendAlert('deleted')
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    };

    // Toggle active status
    const handleActiveChange = (id) => {
        const L=startLoading()
        api.post('admin/depots/toggle-status', { id })
            .then(res => {
                stopLoading(L)
                loadAllDepots()
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    };


    const filteredoption = depots.filter(option => {
        const nameMatch = !filterRegion || option.region.toLowerCase().includes(filterRegion.toLowerCase());
        const nameMatch2 = !filterDepotName || option.depotName.toLowerCase().includes(filterDepotName.toLowerCase());
        const nameMatch3 = !filterDSName || option.dsName.toLowerCase().includes(filterDSName.toLowerCase());
        const nameMatch4 = !filterMobile || option.mobile.toLowerCase().includes(filterMobile.toLowerCase());
        return nameMatch && nameMatch2 && nameMatch3 && nameMatch4;
    });

    //Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const startIndex = page * rowsPerPage;
    //End Pagination

    return (
        <Container component="main" maxWidth="lg">

            {/* <LoadingOverlay show={loading} /> */}

            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                setOpen={setAlert} /> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                {/* <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Manage Depots
                </Typography> */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '20px' }}>
                    Manage Depots
                </Typography>



                <Modal open={addmodel} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: "90%",
                            maxWidth: 600,
                            bgcolor: 'background.paper',
                            border: '2px solid gray',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '10px',
                        }}
                    >

                        <Typography variant="h6" gutterBottom>
                            Add Depot
                        </Typography>

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
                                    label="Mobile 02"
                                    name="mobile2"
                                    value={formData.mobile2}
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

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddDepot}
                                sx={{ marginRight: '8px' }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                                sx={{ backgroundColor: 'gray' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>


                <Box sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    mt: 3,
                    flexWrap: "wrap",
                    gap: 2
                }}>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>

                        <TextField
                            label="Region"
                            value={filterRegion}
                            onChange={(e) => setFilterRegion(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 150,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="Depot Name"
                            value={filterDepotName}
                            onChange={(e) => setFilterDepotName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 150,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="DS Name"
                            value={filterDSName}
                            onChange={(e) => setFilterDSName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 150,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="Mobile"
                            value={filterMobile}
                            onChange={(e) => setFilterMobile(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 150,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => setAddmodel(true)}
                        sx={{
                            padding: "6px 24px",
                            fontWeight: "bold",
                            borderRadius: "4px",
                            height: "40px",
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

                {/* Table Section */}
                {/* <Box sx={{ width: "100%", mt: 5 }}> */}
                {/* <Typography variant="h6" sx={{ mb: 2 }}>
                        All Depots
                    </Typography> */}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Region</TableCell>
                                <TableCell sx={{ py: 1 }}>Depot Name</TableCell>
                                <TableCell sx={{ py: 1 }}>DS Name</TableCell>
                                <TableCell sx={{ py: 1 }}>Mobile</TableCell>
                                <TableCell sx={{ py: 1 }}>Email</TableCell>
                                <TableCell sx={{ py: 1 }}>Mobile 2</TableCell>
                                <TableCell sx={{ py: 1 }}>Description</TableCell>
                                <TableCell sx={{ py: 1 }}>Status</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredoption
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((depot) => (
                                    <TableRow key={depot.id}>
                                        <TableCell sx={{ py: 0 }}>{depot.region}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.depotName}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.dsName}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.mobile}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.email}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.mobile2}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.description}</TableCell>
                                        <TableCell sx={{ py: 0 }}>
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
                                        <TableCell sx={{ py: 0 }} align="right">
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
                    <TablePagination
                        showFirstButton
                        showLastButton
                        component="div"
                        count={filteredoption.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>
                {/* </Box> */}

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
                                    label="Mobile 2"
                                    name="mobile2"
                                    value={currentDepot?.mobile2 || ""}
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
