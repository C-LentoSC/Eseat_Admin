import React, { useState } from "react";
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
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";

const RouteManagement = () => {
    const [routes, setRoutes] = useState([
        {
            id: 1,
            startPoint: "City A",
            endPoint: "City B",
            routeNo: "101",
            description: "Main route",
            busFare: 50,
            active: true,
        },
        {
            id: 2,
            startPoint: "City B",
            endPoint: "City C",
            routeNo: "102",
            description: "Express route",
            busFare: 60,
            active: false,
        },
    ]);

    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");
    const [routeNo, setRouteNo] = useState("");
    const [description, setDescription] = useState("");
    const [busFare, setBusFare] = useState("");
    const [open, setOpen] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(null);

    // Add new route
    const handleAddRoute = () => {
        if (startPoint && endPoint && routeNo && description && busFare) {
            const newRoute = {
                id: Date.now(),
                startPoint,
                endPoint,
                routeNo,
                description,
                busFare: parseFloat(busFare),
                active: true,
            };
            setRoutes((prev) => [...prev, newRoute]);
            setStartPoint("");
            setEndPoint("");
            setRouteNo("");
            setDescription("");
            setBusFare("");
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
    };

    // Save Edited Route
    const handleSave = () => {
        setRoutes((prev) =>
            prev.map((route) =>
                route.id === currentRoute.id ? { ...currentRoute } : route
            )
        );
        handleClose();
    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRoute({ ...currentRoute, [name]: value });
    };

    // Delete Route
    const handleDelete = (id) => {
        setRoutes((prev) => prev.filter((route) => route.id !== id));
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        setRoutes((prev) =>
            prev.map((route) =>
                route.id === id ? { ...route, active: !route.active } : route
            )
        );
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
            ].join(",")
        );
        const csvContent = ["Route No,Start Point,End Point,Description,Bus Fare,Status"]
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
                    const [routeNo, startPoint, endPoint, description, busFare, status] =
                        row.split(",");
                    if (routeNo && startPoint && endPoint && description && busFare) {
                        return {
                            id: Date.now() + Math.random(),
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
            setRoutes((prev) => [...prev, ...newRoutes]);
        };
        reader.readAsText(file);
    };

    return (
        <Container component="main" maxWidth="lg" >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Route Management
                </Typography>

                {/* Form Section */}
                <Box component="form" sx={{ width: "100%" }}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>

                            <Autocomplete
                                value={startPoint}
                                onChange={(event, newValue) => setStartPoint(newValue)}
                                options={["City A", "City B", "City C"]}
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
                                options={["City A", "City B", "City C"]}
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
                                required
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





                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddRoute}
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
                            Add Route
                        </Button>
                    </Box>
                </Box>


                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "50px",
                        marginBottom: "20px",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" sx={{}}>
                        All Routes
                    </Typography>

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
                    </Box>
                </Box>


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Route No</TableCell>
                                <TableCell>Start Point</TableCell>
                                <TableCell>End Point</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Bus Fare</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>{route.routeNo}</TableCell>
                                    <TableCell>{route.startPoint}</TableCell>
                                    <TableCell>{route.endPoint}</TableCell>
                                    <TableCell>{route.description}</TableCell>
                                    <TableCell>LKR {route.busFare}</TableCell>
                                    <TableCell>
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
                                    <TableCell align="right">
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
                            onChange={(e, newValue) => handleInputChange({ target: { name: "startPoint", value: newValue } })}
                            options={["City A", "City B", "City C"]}
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
                            options={["City A", "City B", "City C"]}
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
