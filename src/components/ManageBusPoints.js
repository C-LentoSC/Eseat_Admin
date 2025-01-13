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

const ManageBusPoints = () => {

    const RouteID = sessionStorage.getItem('currentValueID');
    const [details, setDetails] = useState({
        routID: RouteID,
        CityName: "",
    })

    const [allPoints, setAllPoints] = useState([])
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        loadAllPoints()
        getInfo()
        allPointGet()
    }, [])
    const allPointGet = () => {
        api.get('admin/routes/points/get-all?id=' + RouteID)
            .then(res => {
                setBusPoints(res.data)
            })
            .catch(handleError)
    }
    const getInfo = () => {
        api.get('admin/routes/points/info?id=' + RouteID)
            .then(res => {
                setDetails(res.data)
            })
            .catch(handleError)
    }
    const loadAllPoints = () => {
        api.get("admin/points/get-all")
            .then(res => setAllPoints(res.data.map(o => o.name)))
            .catch(handleError)

    }
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })


    const [busPoints, setBusPoints] = useState([]);

    const [direction, setDirection] = useState("");
    const [routePoint, setRoutePoint] = useState("");
    const [open, setOpen] = useState(false);
    const [currentBusPoint, setCurrentBusPoint] = useState(null);
    const [openOrderModal, setOpenOrderModal] = useState(false);

    // Add new bus point
    const handleAddBusPoint = () => {
        if (direction && routePoint) {
            const newBusPoint = {
                direction,
                routePoint,
                route: RouteID
            };
            api.post("admin/routes/points/add", newBusPoint)
                .then(res => {
                    allPointGet()
                    sendAlert('new point added')
                    setDirection("");
                    setRoutePoint("");
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
        api.post('admin/routes/points/edit', currentBusPoint)
            .then(res => {
                sendAlert("updated")
                allPointGet()
                handleCloseModal();
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
        api.post('admin/routes/points/delete', { id })
            .then(res => {
                sendAlert("deleted")
                allPointGet()
            })
            .catch(handleError)
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        api.post('admin/routes/points/toggle-status', { id })
            .then(res => {
                allPointGet()
            })
            .catch(handleError)
    };

    // Export to CSV
    const handleExport = () => {
        const csvData = busPoints.map((busPoint) =>
            [
                busPoint.direction,
                busPoint.routePoint,
                busPoint.active ? "Active" : "Inactive",
            ].join(",")
        );
        const csvContent = ["Direction,Route Point,Status"].concat(csvData).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "bus_points.csv";
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
                    const [direction, routePoint, status] = row.split(",");
                    if (direction && routePoint) {
                        return {
                            id: Date.now() + Math.random(),
                            direction,
                            routePoint,
                            active: status === "Active",
                        };
                    }
                    return null;
                })
                .filter((busPoint) => busPoint !== null);
            api.post('admin/routes/points/import', { route: RouteID, data: newBusPoints })
                .then(res => {
                    allPointGet()
                    sendAlert('import success')
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
        const newOrder = busPoints.map((p, i) => {
            return {
                id: p.id,
                order: i
            }
        })
        api.post('admin/routes/points/change-order', { data: newOrder })
            .then(res => {
                allPointGet()
            })
            .catch(handleError)
        setOpenOrderModal(false);
    };

    const handleBackClick = () => {
        setroutval('/route-management/active-route', '00');
    };

    const handleReorderBoarding = (newOrder) => {
        // Update only the boarding items in the busPoints state
        const droppingItems = busPoints.filter((point) => point.direction === "Dropping");
        setBusPoints([...newOrder, ...droppingItems]);
    };

    const handleReorderDropping = (newOrder) => {
        // Update only the dropping items in the busPoints state
        const boardingItems = busPoints.filter((point) => point.direction === "Boarding");
        setBusPoints([...boardingItems, ...newOrder]);
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

                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "20px",
                    justifyContent: "center"
                }}>
                    <IconButton onClick={handleBackClick} sx={{ marginRight: "10px", padding: '0' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Manage Bus Points ({details.CityName})
                    </Typography>
                </Box>

                {/* Form Section */}
                <Box component="form" sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Autocomplete
                        value={direction}
                        onChange={(event, newValue) => setDirection(newValue)}
                        options={["Boarding", "Dropping"]}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Direction"
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

                    <Autocomplete
                        value={routePoint}
                        onChange={(event, newValue) => setRoutePoint(newValue)}
                        options={allPoints}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Route Point"
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
                            Add Bus Point
                        </Button>
                    </Box>
                </Box>

                {/* Bus Points Table Section */}
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "20px",
                    marginBottom: "20px",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Typography variant="h6">All Bus Points</Typography>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleExport}
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
                                <TableCell sx={{ py: 1 }}>Direction</TableCell>
                                <TableCell sx={{ py: 1 }}>Route Point</TableCell>
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
                                            <IconButton color="primary" onClick={() => handleOpenEdit(busPoint)}
                                                sx={{ marginRight: "8px" }}>
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
                            Edit Bus Point
                        </Typography>

                        <Autocomplete
                            value={currentBusPoint?.direction || ""}
                            onChange={(e, newValue) => handleInputChange({
                                target: {
                                    name: "direction",
                                    value: newValue
                                }
                            })}
                            options={["Boarding", "Dropping"]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Direction"
                                    variant="outlined"
                                    required
                                    sx={{ marginBottom: "16px" }}
                                />
                            )}
                        />

                        <Autocomplete
                            value={currentBusPoint?.routePoint || ""}
                            onChange={(e, newValue) => handleInputChange({
                                target: {
                                    name: "routePoint",
                                    value: newValue
                                }
                            })}
                            options={allPoints}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Route Point"
                                    variant="outlined"
                                    required
                                    sx={{ marginBottom: "16px" }}
                                />
                            )}
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
                            Reorder Boarding and Dropping Points
                        </Typography>

                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Boarding List</Typography>
                                    <Reorder.Group
                                        axis="y"
                                        values={busPoints.filter((point) => point.direction === "Boarding")}
                                        onReorder={handleReorderBoarding}
                                    >
                                        {busPoints
                                            .filter((point) => point.direction === "Boarding")
                                            .map((busPoint) => (
                                                <Item key={busPoint.key} busPoint={busPoint} />
                                            ))}
                                    </Reorder.Group>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Dropping List</Typography>
                                    <Reorder.Group
                                        axis="y"
                                        values={busPoints.filter((point) => point.direction === "Dropping")}
                                        onReorder={handleReorderDropping}
                                    >
                                        {busPoints
                                            .filter((point) => point.direction === "Dropping")
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

export default ManageBusPoints;
