import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    TextField,
    Grid,
    Select,
    Switch,
    FormControlLabel,
    Autocomplete,
    InputAdornment,
    Divider,
    Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setroutval } from "./DashboardLayoutAccount";

const BusManagement = () => {
    //   const DepotID = sessionStorage.getItem('currentValueID');

    const details =
    {
        depotID: 1,
        DepotName: "Yatinuwara",
    };

    const [selectedRoute, setSelectedRoute] = useState("");
    const [selectedBusType, setSelectedBusType] = useState("");
    const [selectedBusCode, setSelectedBusCode] = useState("");

    const handleBackClick = () => {
        setroutval('/activeDepot', '00');
    };

    const routes = ["Colombo - Kandy", "Colombo - Galle", "Kandy - Galle"];
    const busTypes = ["Luxury", "Semi-Luxury", "Normal"];
    const facilities = ["Wifi", "USB", "Seat Belt", "Phone Charger"];

    const [buses, setBuses] = useState([
        {
            id: 1,
            scheduleNumber: "KN08-0600MC",
            busType: "Luxury",
            route: "Colombo - Kandy",
            routeNo: "R001",
            seats: 40,
            status: true
        },
        {
            id: 2,
            scheduleNumber: "KG06-0700GK",
            busType: "Normal",
            route: "Kandy - Galle",
            routeNo: "R002",
            seats: 20,
            status: false
        }
    ]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBus, setSelectedBus] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newBus, setNewBus] = useState({
        scheduleNumber: "",
        busType: "",
        route: "",
        routeNo: "",
        seats: "",
        busModel: "",
        status: true,
        paymentMethods: {
            card: false,
            cash: false,
            bank: false,
            ezcash: false,
            reload: false
        },
        facilities: {
            wifi: false,
            usb: false,
            seatBelt: false,
            phoneCharger: false
        },
        settings: {
            onlineActive: true,
            agentCounter: false,
            autoClose: false,
            manualClose: true
        }
    });

    // Updated filtering logic
    const filteredBuses = buses.filter(bus => {
        const routeMatch = !selectedRoute || bus.route === selectedRoute;
        const typeMatch = !selectedBusType || bus.busType === selectedBusType;
        const codeMatch = !selectedBusCode || bus.scheduleNumber.toLowerCase().includes(selectedBusCode.toLowerCase());
        return routeMatch && typeMatch && codeMatch;
    });

    // Rest of your handlers remain the same
    const handleMenuOpen = (event, bus) => {
        setAnchorEl(event.currentTarget);
        setSelectedBus(bus);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedBus(null);
    };

    const handleEdit = () => {
        setNewBus(selectedBus);
        setAddModalOpen(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setBuses(prev => prev.filter(bus => bus.id !== selectedBus.id));
        handleMenuClose();
    };

    const handleManageSchedules = () => {
        handleMenuClose();
    };

    const handleManageCrew = () => {
        handleMenuClose();
    };

    const handleSaveBus = () => {
        if (newBus.id) {
            setBuses(prev => prev.map(bus =>
                bus.id === newBus.id ? newBus : bus
            ));
        } else {
            setBuses(prev => [...prev, {
                ...newBus,
                id: Math.max(...prev.map(b => b.id)) + 1
            }]);
        }
        setAddModalOpen(false);
        setNewBus({
            scheduleNumber: "",
            busType: "",
            route: "",
            routeNo: "",
            seats: "",
            busModel: "",
            status: true,
            paymentMethods: {
                card: false,
                cash: false,
                bank: false,
                ezcash: false,
                reload: false
            },
            facilities: {
                wifi: false,
                usb: false,
                seatBelt: false,
                phoneCharger: false
            },
            settings: {
                onlineActive: true,
                agentCounter: false,
                autoClose: false,
                manualClose: true
            }
        });
    };


    const renderBusForm = () => (
        <Box sx={{ mt: 2 }}>
            {/* Basic Info Section */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Bus Schedule Number"
                            value={newBus.scheduleNumber}
                            onChange={(e) => setNewBus(prev => ({ ...prev, scheduleNumber: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            value={newBus.busType}
                            onChange={(_, value) => setNewBus(prev => ({ ...prev, busType: value }))}
                            options={busTypes}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Bus Type"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Bus Model"
                            value={newBus.busModel}
                            onChange={(e) => setNewBus(prev => ({ ...prev, busModel: e.target.value }))}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Payment Methods Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>Payment Methods</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.card}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        card: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Credit/Debit Card"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.cash}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        cash: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Pay on Bus"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.bank}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        bank: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Pay to Bank"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.ezcash}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        ezcash: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="eZCash"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.reload}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        reload: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Reload"
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Facilities Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>Facilities</Typography>
            <Grid container spacing={2}>

                {facilities.map((facilities) => (
                    <Grid item xs={12} sm={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newBus.facilities.wifi}
                                    onChange={(e) => setNewBus(prev => ({
                                        ...prev,
                                        facilities: {
                                            ...prev.facilities,
                                            wifi: e.target.checked
                                        }
                                    }))}
                                />
                            }
                            label={facilities}
                        />
                    </Grid>
                ))}

            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Bus Close  Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>Bus Close</Typography>
            <Grid container spacing={2}>

                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.autoClose}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        autoClose: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Auto Close"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newBus.paymentMethods.manualClose}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    paymentMethods: {
                                        ...prev.paymentMethods,
                                        manualClose: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Manual Close"
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Status Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>Status</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newBus.settings.onlineActive}
                                onChange={(e) => setNewBus(prev => ({
                                    ...prev,
                                    settings: {
                                        ...prev.settings,
                                        onlineActive: e.target.checked
                                    }
                                }))}
                            />
                        }
                        label="Online Active"
                    />
                </Grid>
                {/* Add other status switches similarly */}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Route Section */}
            <Typography variant="h6" sx={{ mb: 2 }}>Route Details</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Select
                        fullWidth
                        value={newBus.route}
                        onChange={(e) => setNewBus(prev => ({ ...prev, route: e.target.value }))}
                        displayEmpty
                    >
                        <MenuItem value="">Select Route</MenuItem>
                        {routes.map(route => (
                            <MenuItem key={route} value={route}>{route}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Route Number"
                        value={newBus.routeNo}
                        onChange={(e) => setNewBus(prev => ({ ...prev, routeNo: e.target.value }))}
                    />
                </Grid>
            </Grid>
        </Box>
    );


    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <IconButton onClick={handleBackClick} sx={{ marginRight: "10px", padding: '0' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Bus Management ({details.DepotName} Depot)
                    </Typography>
                </Box>

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
                        <Autocomplete
                            value={selectedRoute}
                            onChange={(_, value) => setSelectedRoute(value)}
                            options={routes}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Route"
                                    InputProps={{
                                        ...params.InputProps,
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
                            )}
                        />
                        <Autocomplete
                            value={selectedBusType}
                            onChange={(_, value) => setSelectedBusType(value)}
                            options={busTypes}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Bus Type"
                                    InputProps={{
                                        ...params.InputProps,
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
                            )}
                        />
                        <TextField
                            label="Bus Code"
                            value={selectedBusCode}
                            onChange={(e) => setSelectedBusCode(e.target.value)}
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
                    <Button
                        variant="contained"
                        onClick={() => setAddModalOpen(true)}

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
                        Add New Bus
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Schedule Number</TableCell>
                                <TableCell>Bus Type</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Route No</TableCell>
                                <TableCell align="center">Seats</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBuses.map((bus) => (
                                <TableRow key={bus.id}>
                                    <TableCell>{bus.scheduleNumber}</TableCell>
                                    <TableCell>{bus.busType}</TableCell>
                                    <TableCell>{bus.route}</TableCell>
                                    <TableCell>{bus.routeNo}</TableCell>
                                    <TableCell align="center">{bus.seats}</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={bus.status}
                                            onChange={() => {
                                                setBuses(prev => prev.map(b =>
                                                    b.id === bus.id ? { ...b, status: !b.status } : b
                                                ));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleMenuOpen(e, bus)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    <MenuItem onClick={handleManageSchedules}>Manage Bus Schedules</MenuItem>
                    <MenuItem onClick={handleManageCrew}>Manage Crew</MenuItem>
                </Menu>

                {/* Add/Edit Modal */}
                <Modal
                    open={addModalOpen}
                    onClose={() => {
                        setAddModalOpen(false);
                        setNewBus({
                            scheduleNumber: "",
                            busType: "",
                            route: "",
                            routeNo: "",
                          
                            seats: "",
                            busModel: "",
                            status: true,
                            paymentMethods: {
                                card: false,
                                cash: false,
                                bank: false,
                                ezcash: false,
                                reload: false
                            },
                            facilities: {
                                wifi: false,
                                usb: false,
                                seatBelt: false,
                                phoneCharger: false
                            },
                            settings: {
                                onlineActive: true,
                                agentCounter: false,
                                autoClose: false,
                                manualClose: true
                            }
                        });
                    }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "90%",
                        maxHeight: "90vh",
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "10px",
                        border: "2px solid gray",
                        overflow: "auto"
                    }}>
                        <Typography variant="h6" gutterBottom>
                            {newBus.id ? 'Edit Bus' : 'Add New Bus'}
                        </Typography>

                        {/* Form Content */}
                        {renderBusForm()}

                        {/* Action Buttons */}
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => setAddModalOpen(false)}
                                sx={{ mr: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveBus}
                                sx={{
                                    backgroundColor: "#3f51b5",
                                    "&:hover": {
                                        backgroundColor: "#303f9f",
                                    },
                                }}
                            >
                                {newBus.id ? 'Update' : 'Save'}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default BusManagement;