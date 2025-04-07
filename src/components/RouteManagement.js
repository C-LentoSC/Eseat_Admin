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
    IconButton,
    InputAdornment,
    FormControlLabel,
    Switch,
    TablePagination
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";
import {useLoading} from "../loading";

// import LoadingOverlay from './Parts/LoadingOverlay';

const RouteManagement = () => {
    
    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);

    const {startLoading,stopLoading}=useLoading()
    const [routes, setRoutes] = useState([]);
    const [addmodel, setAddmodel] = useState(false);

    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [routeNo, setRouteNo] = useState("");
    const [description, setDescription] = useState("");
    const [busFare, setBusFare] = useState("");
    const [open, setOpen] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [allPoints, setAllPoints] = useState([])
    const [alert, setAlert] = useState(null)

    const [fillRouteNo, setFillRouteNo] = useState("");
    const [fillStartPoint, setFillStartPoint] = useState("");
    const [fillEndPoint, setFillEndPoint] = useState("");

    useEffect(() => {
        loadAllPoints()
        loadAllRoutes()
    }, [])
    const loadAllRoutes = () => {
        const id=startLoading()
        api.get('admin/routes/load-all')
            .then(res => {
                stopLoading(id)
                setRoutes(res.data)
            })
            .catch(err=> {
                stopLoading(id)
                handleError(err)
            })
    }
    const loadAllPoints = () => {
        const id=startLoading()
        api.get("admin/points/get-all")
            .then(res => {
                stopLoading(id)
                setAllPoints(res.data.map(o => o.name))
            })
            .catch(err=> {
                stopLoading(id)
                handleError(err)
            })

    }
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Add new route
    const handleAddRoute = () => {
        if (startPoint && endPoint && routeNo && busFare) {
            const newRoute = {
                id: Date.now(),
                starting_point: startPoint,
                end_point: endPoint,
                routeNo,
                description,
                busFare: parseFloat(busFare),
                active: true,
            };
            const L=startLoading()
            api.post("admin/routes/add", newRoute)
                .then(() => {
                    stopLoading(L)
                    sendAlert("new route added")
                    setAddmodel(false)
                    loadAllRoutes()
                    setStartPoint("");
                    setEndPoint("");
                    setRouteNo("");
                    setDescription("");
                    setBusFare("");
                })
                .catch(err=> {
                    stopLoading(L)
                    handleError(err)
                })

        }
    };

    // Open Edit Modal
    const handleOpen = (route) => {
        setCurrentRoute(route);
        setOpen(true);
    };

    // Close Modal
    const handleClose = () => {
        setCurrentRoute(null);
        setOpen(false);
        setAddmodel(false);
        setStartPoint(null)
        setEndPoint(null)
        setRouteNo("")
        setBusFare("")
        setDescription("")
    };

    // Save Edited Route
    const handleSave = () => {
        const id=startLoading()
        api.post('admin/routes/edit', currentRoute)
            .then(res => {
                stopLoading(id)
                loadAllRoutes()
                sendAlert("updated")
                handleClose()
            })
            .catch(err=> {
                stopLoading(id)
                handleError(err)
            })

    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRoute({ ...currentRoute, [name]: value });
    };

    // Delete Route
    const handleDelete = (id) => {
        const L=startLoading()
        api.post('admin/routes/delete', { id })
            .then(res => {
                stopLoading(L)
                loadAllRoutes()
                sendAlert("deleted")
            })
            .catch(err=> {
                stopLoading(id)
                handleError(err)
            })
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        const L=startLoading()
        api.post("admin/routes/toggle-status", { id })
            .then(res => {
                stopLoading(L)
                loadAllRoutes()
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    };

    // Export to CSV
    const handleExport = () => {
        const csvData = routes.map((route) =>
            [
                route.routeNo,
                route.startPoint,
                route.endPoint,
                route.description,
                route.busFare,
                route.active ? "Active" : "Inactive",
                route.id
            ].join(",")
        );
        const csvContent = ["Route No,Start Point,End Point,Description,Bus Fare,Status,Id"]
            .concat(csvData)
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "routes.csv";
        link.click();
    };

    // Import from CSV
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvRows = event.target.result.split("\n").slice(1);
            const newRoutes = csvRows
                .map((row) => {
                    const [routeNo, startPoint, endPoint, description, busFare, status, id] =
                        row.split(",");
                    if (routeNo && startPoint && endPoint && busFare && id) {
                        return {
                            id,
                            routeNo,
                            startPoint,
                            endPoint,
                            description,
                            busFare: parseFloat(busFare),
                            active: status === "Active",
                        };
                    }
                    return null;
                })
                .filter((route) => route !== null);
            // setRoutes((prev) => [...prev, ...newRoutes]);
            // console.log(newRoutes)
            const L=startLoading()
            api.post('admin/routes/import', { data: newRoutes })
                .then(res => {
                    stopLoading(L)
                    loadAllRoutes()
                    sendAlert('success')
                })
                .catch(err=> {
                    stopLoading(L)
                    handleError(err)
                })
        };
        reader.readAsText(file);
    };

    const filteredRoute = routes.filter(route => {
        const idMatch = !fillRouteNo || route.routeNo.toString().includes(fillRouteNo);
        const startMatch = !fillStartPoint || route.startPoint.toLowerCase().includes(fillStartPoint.toLowerCase());
        const endMatch = !fillEndPoint || route.endPoint.toLowerCase().includes(fillEndPoint.toLowerCase());
        return idMatch && startMatch && endMatch;
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
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Route Management
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
                            Add Route
                        </Typography>

                        <Grid container spacing={3}>

                            <Grid item xs={12} sm={6}>

                                <Autocomplete
                                    value={startPoint}
                                    onChange={(event, newValue) => setStartPoint(newValue)}
                                    options={allPoints}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Start Point"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        {/* <AccountCircleIcon /> */}
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    value={endPoint}
                                    onChange={(event, newValue) => setEndPoint(newValue)}
                                    options={allPoints}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="End Point"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        {/* <AccountCircleIcon /> */}
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
                                    label="Route No"
                                    variant="outlined"
                                    required
                                    value={routeNo}
                                    onChange={(e) => setRouteNo(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {/* <AccountCircleIcon /> */}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Bus Fare"
                                    variant="outlined"
                                    required
                                    type="number"
                                    value={busFare}
                                    onChange={(e) => setBusFare(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">LKR</InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {/* <AccountCircleIcon /> */}
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
                                onClick={handleAddRoute}
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


                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "20px",
                        marginBottom: "20px",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
                        <TextField
                            label="Route No"
                            value={fillRouteNo}
                            onChange={(e) => setFillRouteNo(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 200,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="Start Point"
                            value={fillStartPoint}
                            onChange={(e) => setFillStartPoint(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 200,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="End Point"
                            value={fillEndPoint}
                            onChange={(e) => setFillEndPoint(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 200,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#388e3c",
                                },
                            }}
                        >
                            Import
                            <input type="file" accept=".csv" hidden onChange={handleImport} />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setAddmodel(true)}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Add Route
                        </Button>
                    </Box>
                </Box>


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Route No</TableCell>
                                <TableCell sx={{ py: 1 }}>Start Point</TableCell>
                                <TableCell sx={{ py: 1 }}>End Point</TableCell>
                                <TableCell sx={{ py: 1 }}>Description</TableCell>
                                <TableCell sx={{ py: 1 }}>Bus Fare</TableCell>
                                <TableCell sx={{ py: 1 }}>Status</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRoute
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((route) => (
                                    <TableRow key={route.id}>
                                        <TableCell sx={{ py: 0 }}>{route.routeNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{route.startPoint}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{route.endPoint}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{route.description}</TableCell>
                                        <TableCell sx={{ py: 0 }}>LKR {route.busFare}</TableCell>
                                        <TableCell sx={{ py: 0 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={route.active}
                                                        onChange={() => handleActiveChange(route.id)}
                                                    />
                                                }
                                                label={route.active ? "Active" : "Inactive"}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpen(route)}
                                                sx={{ marginRight: "8px" }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(route.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredRoute.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
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
                            Edit Route
                        </Typography>
                        <TextField
                            fullWidth
                            label="Route No"
                            variant="outlined"
                            name="routeNo"
                            value={currentRoute?.routeNo || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                        />

                        <Autocomplete
                            value={currentRoute?.startPoint || ""}
                            onChange={(e, newValue) => handleInputChange({
                                target: {
                                    name: "startPoint",
                                    value: newValue
                                }
                            })}
                            options={allPoints}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Start Point"
                                    variant="outlined"
                                    required
                                    sx={{ marginBottom: "16px" }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {/* <AccountCircleIcon /> */}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <Autocomplete
                            value={currentRoute?.endPoint || ""}
                            onChange={(e, newValue) => handleInputChange({ target: { name: "endPoint", value: newValue } })}
                            options={allPoints}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="End Point"
                                    variant="outlined"
                                    required
                                    sx={{ marginBottom: "16px" }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {/* <AccountCircleIcon /> */}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            name="description"
                            multiline
                            rows={4}
                            value={currentRoute?.description || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                        />
                        <TextField
                            fullWidth
                            label="Bus Fare"
                            variant="outlined"
                            name="busFare"
                            type="number"
                            value={currentRoute?.busFare || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">LKR</InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
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
            </Box>
        </Container>
    );
};

export default RouteManagement;
