import React, {useEffect, useState} from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Stack,
    FormControlLabel, Switch, Autocomplete, TextField,
    Button, Grid, InputAdornment, TablePagination
} from '@mui/material';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

const BulkBusManagement = () => {
    // Sample initial data
    const [buses, setBuses] = useState([]);
    const loadAllBus = () => {
        api.get('admin/bulk-bus/get-all')
            .then(res => {
                setBuses(res.data)

            })
            .catch(handleError)
    }
    useEffect(() => {
        loadAllBus()
    }, []);
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})


    // Filter states
    const [selectedDepot, setSelectedDepot] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Bulk toggle states
    const [bulkOnlineStatus, setBulkOnlineStatus] = useState(true);
    const [bulkAgentStatus, setBulkAgentStatus] = useState(true);
    const [bulkMainBusStatus, setBulkMainBusStatus] = useState(true);

    // Extract unique values for filters
    const depots = [...new Set(buses.map(bus => bus.depot))];
    const regions = [...new Set(buses.map(bus => bus.region))];
    const routes = [...new Set(buses.map(bus => bus.route))];
    const schedules = [...new Set(buses.map(bus => bus.scheduleNumber))];

    // Filter the buses based on selected criteria
    const filteredBuses = buses.filter(bus => {
        const depotMatch = !selectedDepot || bus.depot === selectedDepot;
        const regionMatch = !selectedRegion || bus.region === selectedRegion;
        const routeMatch = !selectedRoute || bus.route === selectedRoute;
        const scheduleMatch = !selectedSchedule || bus.scheduleNumber === selectedSchedule;
        return depotMatch && regionMatch && routeMatch && scheduleMatch;
    });

    // Handle bulk status updates
    const handleBulkStatusUpdate = (statusType) => {
        let obg = {statusType,filteredBuses}

        switch (statusType) {
            case 'online':
                obg = {...obg, status: bulkOnlineStatus}
                break
            case 'agent':
                obg = {...obg, status: bulkAgentStatus}
                break
            case 'main':
                obg = {...obg, status: bulkMainBusStatus}
                break
            default:
                break
        }
        api.post('admin/bulk-bus/change-status', obg)
            .then(res => {
                loadAllBus()
            })
            .catch(handleError)
    };

    // Handle individual status updates
    const handleStatusChange = (id, statusType) => {
        let obg = {id, statusType}
        switch (statusType) {
            case 'online':
                obg = {...obg, status: bulkOnlineStatus}
                break
            case 'agent':
                obg = {...obg, status: bulkAgentStatus}
                break
            case 'main':
                obg = {...obg, status: bulkMainBusStatus}
                break
            default:
                break
        }
        api.post('admin/bulk-bus/change-status', obg)
            .then(res => {
                loadAllBus()
            })
            .catch(handleError)
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
                                  setOpen={setAlert}/> : <></>}
            <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                <Typography variant="h5" sx={{fontWeight: 600, mb: 3}}>
                    Bulk Manage of Buses
                </Typography>

                {/* Filters */}
                <Grid container spacing={2} sx={{mb: 3}}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedDepot}
                            onChange={(_, value) => setSelectedDepot(value)}
                            options={depots}
                            // renderInput={(params) => <TextField {...params} label="Depot" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Depot"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                            )}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedRegion}
                            onChange={(_, value) => setSelectedRegion(value)}
                            options={regions}
                            // renderInput={(params) => <TextField {...params} label="Region" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Region"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                            )}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedRoute}
                            onChange={(_, value) => setSelectedRoute(value)}
                            options={routes}
                            // renderInput={(params) => <TextField {...params} label="Route" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Route"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                            )}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px'
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedSchedule}
                            onChange={(_, value) => setSelectedSchedule(value)}
                            options={schedules}
                            // renderInput={(params) => <TextField {...params} label="Schedule" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Schedule"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}

                                />
                            )}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px'
                                }
                            }}
                        />
                    </Grid>
                </Grid>

                {/* Bulk Actions */}
                <Paper sx={{p: 2}}>
                    <Stack spacing={2}>
                        <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                            Bulk Status Update for Filtered Buses
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={bulkOnlineStatus}
                                                onChange={(e) => setBulkOnlineStatus(e.target.checked)}
                                            />
                                        }
                                        label="Online Booking Status"
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleBulkStatusUpdate('online')}
                                        sx={{
                                            fontWeight: "bold",
                                            borderRadius: "4px",
                                            backgroundColor: "#3f51b5",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#303f9f",
                                            },
                                        }}
                                    >

                                        Apply
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={bulkAgentStatus}
                                                onChange={(e) => setBulkAgentStatus(e.target.checked)}
                                            />
                                        }
                                        label="Agent Booking Status"
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleBulkStatusUpdate('agent')}
                                        sx={{
                                            fontWeight: "bold",
                                            borderRadius: "4px",
                                            backgroundColor: "#3f51b5",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#303f9f",
                                            },
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={bulkMainBusStatus}
                                                onChange={(e) => setBulkMainBusStatus(e.target.checked)}
                                            />
                                        }
                                        label="Bus Status"
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleBulkStatusUpdate('main')}
                                        sx={{
                                            fontWeight: "bold",
                                            borderRadius: "4px",
                                            backgroundColor: "#3f51b5",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#303f9f",
                                            },
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Stack>
                </Paper>

                {/* Bus Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                <TableCell sx={{ py: 1 }}>Depot</TableCell>
                                <TableCell sx={{ py: 1 }}>Region</TableCell>
                                <TableCell sx={{ py: 1 }}>Route</TableCell>
                                <TableCell sx={{ py: 1 }}>Bus Type</TableCell>
                                <TableCell sx={{ py: 1 }}>Schedule Number</TableCell>
                                <TableCell sx={{ py: 1 }}>Online Booking</TableCell>
                                <TableCell sx={{ py: 1 }}>Agent Booking</TableCell>
                                <TableCell sx={{ py: 1 }}>Bus Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBuses
                              .slice(startIndex, startIndex + rowsPerPage)
                    .map((bus) => (
                                <TableRow key={bus.id}>
                                    <TableCell sx={{ py: 0 }}>{bus.depot}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{bus.region}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{bus.route}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{bus.busType}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{bus.scheduleNumber}</TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={bus.onlineBookingStatus}
                                                    onChange={() => handleStatusChange(bus.id, 'online')}
                                                />
                                            }
                                            label={bus.onlineBookingStatus ? "Active" : "Inactive"}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={bus.agentBookingStatus}
                                                    onChange={() => handleStatusChange(bus.id, 'agent')}
                                                />
                                            }
                                            label={bus.agentBookingStatus ? "Active" : "Inactive"}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={bus.mainBusStatus}
                                                    onChange={() => handleStatusChange(bus.id, 'main')}
                                                />
                                            }
                                            label={bus.mainBusStatus ? "Active" : "Inactive"}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                                 <TablePagination
                        component="div"
                        count={filteredBuses.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>
            </Box>
        </Container>
    );
};

export default BulkBusManagement;
