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
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReorderIcon from "@mui/icons-material/Reorder";
import { setroutval } from "./DashboardLayoutAccount";
import { Reorder } from "framer-motion";
import { Item } from "./Parts/ItemPart";

const ManageBusFareBreaks = () => {

    //   const RoutID = sessionStorage.getItem('currentValueID');

    const details =
    {
        routID: 1,
        CityName: "Colombo-Ampara",
    };

    const [busPoints, setBusPoints] = useState([
        {
            key: "1",
            id: 1,
            direction: "City A",
            routePoint: "City C",
            fare: "180",
            active: true,
        },
        {
            key: "2",
            id: 2,
            direction: "City B",
            routePoint: "City C",
            fare: "200",
            active: true,
        },
        {
            key: "3",
            id: 3,
            direction: "City C",
            routePoint: "City A",
            fare: "150",
            active: true,
        },
        {
            key: "4",
            id: 4,
            direction: "City B",
            routePoint: "City A",
            fare: "100",
            active: false,
        },
    ]);

    const [direction, setDirection] = useState("");
    const [routePoint, setRoutePoint] = useState("");
    const [fare, setFare] = useState("");
    const [open, setOpen] = useState(false);
    const [currentBusPoint, setCurrentBusPoint] = useState(null);
    const [openOrderModal, setOpenOrderModal] = useState(false);

    // Add new bus point
    const handleAddBusPoint = () => {
        if (direction && routePoint && fare) {
            const newBusPoint = {
                key: Date.now(),
                id: Date.now(),
                direction,
                routePoint,
                fare,
                active: true,
            };
            setBusPoints((prev) => [...prev, newBusPoint]);
            setDirection("");
            setRoutePoint("");
            setFare("");
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (busPoint) => {
        setCurrentBusPoint(busPoint);
        setOpen(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setCurrentBusPoint(null);
        setOpen(false);
    };

    // Save Edited Bus Point
    const handleSaveBusPoint = () => {
        setBusPoints((prev) =>
            prev.map((busPoint) =>
                busPoint.id === currentBusPoint.id ? { ...currentBusPoint } : busPoint
            )
        );
        handleCloseModal();
    };

    // Handle Input Changes for Edit Modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBusPoint({ ...currentBusPoint, [name]: value });
    };


    // Delete Bus Point
    const handleDeleteBusPoint = (id) => {
        setBusPoints((prev) => prev.filter((busPoint) => busPoint.id !== id));
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        setBusPoints((prev) =>
            prev.map((busPoint) =>
                busPoint.id === id ? { ...busPoint, active: !busPoint.active } : busPoint
            )
        );
    };

    // Export to CSV
    const handleExport = () => {
        const csvData = busPoints.map((busPoint) =>
            [
                busPoint.direction,
                busPoint.routePoint,
                busPoint.fare,
                busPoint.active ? "Active" : "Inactive",
            ].join(",")
        );
        const csvContent = ["Boarding Point , Dropping Point, Fare, Status"].concat(csvData).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "bus_fare_breaks.csv";
        link.click();
    };

    // Import from CSV
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvRows = event.target.result.split("\n").slice(1);
            const newBusPoints = csvRows
                .map((row) => {
                    const [direction, routePoint, fare, status] = row.split(",");
                    if (direction && routePoint && fare) {
                        return {
                            id: Date.now() + Math.random(),
                            direction,
                            routePoint,
                            fare,
                            active: status === "Active",
                        };
                    }
                    return null;
                })
                .filter((busPoint) => busPoint !== null);
            setBusPoints((prev) => [...prev, ...newBusPoints]);
        };
        reader.readAsText(file);
    };

    const handleOpenOrderModal = () => {
        setOpenOrderModal(true);
    };

    const handleCloseOrderModal = () => {
        setOpenOrderModal(false);
    };


    // Save the reordered bus points
    const handleSaveOrder = () => {
        setOpenOrderModal(false);
    };

    const handleBackClick = () => {
        setroutval('/route-management/active-route', '00');
    };

    const handleReorderBoarding = (newOrder) => {
        setBusPoints([...newOrder]);
    };


    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "20px", justifyContent: "center" }}>
                    <IconButton onClick={handleBackClick} sx={{ marginRight: "10px", padding: '0' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Manage Bus Fare Breaks ({details.CityName})
                    </Typography>
                </Box>

                {/* Form Section */}
                <Box component="form" sx={{ width: "100%" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                value={direction}
                                onChange={(event, newValue) => setDirection(newValue)}
                                options={["City A", "City B", "City C"]}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Boarding Point"
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

                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                value={routePoint}
                                onChange={(event, newValue) => setRoutePoint(newValue)}
                                options={["City A", "City B", "City C"]}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Dropping Point"
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

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Fare"
                                variant="outlined"
                                type="number"
                                required
                                value={fare}
                                onChange={(e) => setFare(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <InputAdornment position="start">LKR</InputAdornment>
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
                            onClick={handleAddBusPoint}
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
                            Add Fare Breaks
                        </Button>
                    </Box>
                </Box>

                {/* Bus Points Table Section */}
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", marginTop: "50px", marginBottom: "20px", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">All Bus Fare Breaks</Typography>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleExport} sx={{
                            backgroundColor: "#3f51b5",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#303f9f",
                            },
                        }}
                        >
                            Export
                        </Button>
                        <Button variant="contained" component="label" startIcon={<UploadIcon />}
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
                            color="secondary"
                            startIcon={<ReorderIcon />}
                            onClick={handleOpenOrderModal}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Order
                        </Button>
                    </Box>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Boarding Point</TableCell>
                                <TableCell>Dropping Point</TableCell>
                                <TableCell>Fare</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {busPoints.map((busPoint) => (
                                <TableRow key={busPoint.key}>
                                    <TableCell>{busPoint.direction}</TableCell>
                                    <TableCell>{busPoint.routePoint}</TableCell>
                                    <TableCell>{busPoint.fare}</TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={busPoint.active}
                                                    onChange={() => handleActiveChange(busPoint.id)}
                                                />
                                            }
                                            label={busPoint.active ? "Active" : "Inactive"}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenEdit(busPoint)} sx={{ marginRight: "8px" }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteBusPoint(busPoint.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Modal */}
                <Modal open={open} onClose={handleCloseModal}>
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
                            Edit Bus Fare Breaks
                        </Typography>

                        <Autocomplete
                            value={currentBusPoint?.direction || ""}
                            onChange={(e, newValue) => handleInputChange({ target: { name: "direction", value: newValue } })}
                            options={["City A", "City B", "City C"]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Boarding Point"
                                    variant="outlined"
                                    required
                                    sx={{ marginBottom: "16px" }}
                                />
                            )}
                        />

                        <Autocomplete
                            value={currentBusPoint?.routePoint || ""}
                            onChange={(e, newValue) => handleInputChange({ target: { name: "routePoint", value: newValue } })}
                            options={["City A", "City B", "City C"]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Dropping Point"
                                    variant="outlined"
                                    required
                                    sx={{ marginBottom: "16px" }}
                                />
                            )}
                        />

                        <TextField
                            fullWidth
                            label="Fare"
                            variant="outlined"
                            type="number"
                            required
                            name="fare"
                            value={currentBusPoint?.fare || ""}
                            onChange={handleInputChange}
                            // onChange={(e, newValue) => handleInputChange({ target: { name: "fare", value: newValue } })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <InputAdornment position="start">LKR</InputAdornment>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginBottom: "16px" }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveBusPoint}
                                sx={{ marginRight: '8px' }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCloseModal}
                                sx={{ backgroundColor: 'gray' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>


                {/* Order Modal */}
                <Modal open={openOrderModal} onClose={handleCloseOrderModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            maxHeight: "80%",
                            overflowY: "auto",
                        }}
                    >
                        <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                            Reorder Bus Fare Breaks
                        </Typography>

                        <Box >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Reorder.Group
                                        axis="y"
                                        values={busPoints}
                                        onReorder={handleReorderBoarding}
                                    >
                                        {busPoints
                                            .map((busPoint, index) => (
                                                <Item key={busPoint.key} busPoint={busPoint} index={index + 1} />
                                            ))}
                                    </Reorder.Group>
                                </Grid>

                            </Grid>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
                            <Button variant="contained" color="primary" onClick={handleSaveOrder}>
                                Save Order
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCloseOrderModal}
                                sx={{ marginLeft: 2, backgroundColor: 'gray' }}

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

export default ManageBusFareBreaks;
