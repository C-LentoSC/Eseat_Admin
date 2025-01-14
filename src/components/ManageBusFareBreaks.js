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
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

const ManageBusFareBreaks = () => {

    const RouteID = sessionStorage.getItem('currentValueID');

    const [details, setDetails] = useState({
        id: RouteID,
        CityName: ""
    })
    const [alert, setAlert] = useState(null)
    const [d, setD] = useState([])
    const [b, setB] = useState([])
    useEffect(() => {
        getInfo()
        loadPoints()
        loadAll()
    }, []);
    const getInfo = () => {
        api.get('admin/routes/fare/info?id=' + RouteID)
            .then(res => {
                setDetails(res.data)
            })
            .catch(handleError)
    }
    const loadPoints = () => {
        api.get('admin/routes/fare/get-points?id=' + RouteID)
            .then(res => {
                setD(res.data.d)
                setB(res.data.b)
            })
            .catch(handleError)
    }

    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    const [busPoints, setBusPoints] = useState([

    ]);
    const loadAll = () => {
        api.get('admin/routes/fare/all?id=' + RouteID)
            .then(res => {
                setBusPoints(res.data)
            })
            .catch(handleError)
    }
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
                id: RouteID,
                direction,
                routePoint,
                fare,
                active: true,
            };
            // setBusPoints((prev) => [...prev, newBusPoint]);
            api.post('admin/routes/fare/add', newBusPoint)
                .then(res => {
                    loadAll()
                    setDirection("");
                    setRoutePoint("");
                    setFare("");
                    sendAlert('new fare brake is added')
                })
                .catch(handleError)

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
        api.post('admin/routes/fare/edit', currentBusPoint)
            .then(res => {
                loadAll()
                handleCloseModal();
                sendAlert('updated')
            })
            .catch(handleError)

    };

    // Handle Input Changes for Edit Modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBusPoint({ ...currentBusPoint, [name]: value });
    };


    // Delete Bus Point
    const handleDeleteBusPoint = (id) => {
        api.post('admin/routes/fare/delete', { id })
            .then(res => {
                loadAll()
                sendAlert('deleted')
            }).catch(handleError)
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        api.post('admin/routes/fare/toggle-status', { id })
            .then(res => {
                loadAll()
            })
            .catch(handleError)
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
            // setBusPoints((prev) => [...prev, ...newBusPoints]);
            api.post('admin/routes/fare/import', { id: RouteID, data: newBusPoints })
                .then(res => {
                    loadAll()
                    sendAlert('import succsess')
                })
                .catch(handleError)
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
        const nO = (busPoints.map((value, index) => {
            return {
                id: value.id,
                key: index
            }
        }))
        api.post('admin/routes/fare/change-order', { data: nO })
            .then(res => {
                loadAll()
            })
            .catch(handleError)
        setOpenOrderModal(false);
    };

    const handleBackClick = () => {
        setroutval('/route-management/active-route', '00');
    };

    const handleReorderBoarding = (newOrder) => {

        setBusPoints([...newOrder]);
    };


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
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                setOpen={setAlert} /> : <></>}
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
                <Box component="form" sx={{ width: "100%", display: "flex", justifyContent: "center", height: "45px" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                value={direction}
                                onChange={(event, newValue) => setDirection(newValue)}
                                options={b}
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '45px',
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                value={routePoint}
                                onChange={(event, newValue) => setRoutePoint(newValue)}
                                options={d}
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: '45px',
                                            }
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '45px',
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", ml:2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddBusPoint}
                            sx={{
                                width:'160px',
                                padding: "12px 12px",
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
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", marginTop: "20px", marginBottom: "20px", justifyContent: "space-between", alignItems: "center" }}>
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
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Boarding Point</TableCell>
                                <TableCell sx={{ py: 1 }}>Dropping Point</TableCell>
                                <TableCell sx={{ py: 1 }}>Fare</TableCell>
                                <TableCell sx={{ py: 1 }}>Status</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {busPoints
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((busPoint) => (
                                    <TableRow key={busPoint.key}>
                                        <TableCell sx={{ py: 0 }}>{busPoint.direction}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{busPoint.routePoint}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{busPoint.fare}</TableCell>
                                        <TableCell sx={{ py: 0 }}>
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
                                        <TableCell sx={{ py: 0 }} align="right">
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
                    <TablePagination
                        component="div"
                        count={busPoints.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
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
                            options={b}
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
                            options={d}
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
                                            .map((busPoint) => (
                                                <Item key={busPoint.key} busPoint={busPoint} />
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
