import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    Autocomplete, TextField, InputAdornment, FormControlLabel,
    Switch, TablePagination,
} from '@mui/material';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";
// import DeleteIcon from '@mui/icons-material/Delete';

// import CustomAlert from "./Parts/CustomAlert";

// import LoadingOverlay from './Parts/LoadingOverlay';

const ScheduleManagement = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Sample initial data
    const [schedules, setSchedules] = useState([]);
    useEffect(() => {
        loadAll()
    }, []);
    const loadAll = () => {
        api.get('admin/schedule-report/get-all-schedules')
            .then(res => {
                setSchedules(res.data);
            })
            .catch(handleError)
    }

    // Filter states
    const [selectedScheduleNo, setSelectedScheduleNo] = useState(null);
    const [selectedRouteNo, setSelectedRouteNo] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Extract unique values for filters
    const scheduleNumbers = [...new Set(schedules.map(schedule => schedule.scheduleNumber))];
    const routeNos = [...new Set(schedules.map(schedule => schedule.routeNo))];
    const routes = [...new Set(schedules.map(schedule => schedule.route))];
    const statuses = ["Active", "Inactive"];

    // Filter the schedules based on selected criteria
    const filteredSchedules = schedules.filter(schedule => {
        const scheduleNoMatch = !selectedScheduleNo || schedule.scheduleNumber === selectedScheduleNo;
        const routeNoMatch = !selectedRouteNo || schedule.routeNo === selectedRouteNo;
        const routeMatch = !selectedRoute || schedule.route === selectedRoute;
        const statusMatch = !selectedStatus || schedule.status === selectedStatus;

        return scheduleNoMatch && routeNoMatch && routeMatch && statusMatch;
    });

    // Handle delete
    // const handleDelete = (id) => {
    //     setSchedules(schedules.filter(schedule => schedule.id !== id));
    // };


    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        api.post("admin/schedule-report/toggle-status", { id })
            .then(res => {
                loadAll()
            })
            .catch(handleError)
    };


    // Reusable Autocomplete component
    const AutocompleteField = ({ value, onChange, options, label }) => (
        <Autocomplete
            value={value}
            onChange={(_, value) => onChange(value)}
            options={options}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
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
    );

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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Schedule Management
                </Typography>

                {/* Filters */}
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedScheduleNo}
                            onChange={setSelectedScheduleNo}
                            options={scheduleNumbers}
                            label="Schedule Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedRouteNo}
                            onChange={setSelectedRouteNo}
                            options={routeNos}
                            label="Route No"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedRoute}
                            onChange={setSelectedRoute}
                            options={routes}
                            label="Route"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={statuses}
                            label="Status"
                        />
                    </Grid>
                </Grid>

                {/* Schedules Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Schedule Number</TableCell>
                                <TableCell sx={{ py: 1 }}>Route No</TableCell>
                                <TableCell sx={{ py: 1 }}>Route</TableCell>
                                <TableCell sx={{ py: 1 }}>Travel Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Start Time</TableCell>
                                <TableCell sx={{ py: 1 }}>End Date</TableCell>
                                <TableCell sx={{ py: 1 }}>End Time</TableCell>
                                <TableCell sx={{ py: 1 }}>Closing Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Closing Time</TableCell>
                                <TableCell sx={{ py: 1 }}>Status</TableCell>
                                {/* <TableCell>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSchedules
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((schedule) => (
                                    <TableRow key={schedule.id}>
                                        <TableCell>{schedule.scheduleNumber}</TableCell>
                                        <TableCell>{schedule.routeNo}</TableCell>
                                        <TableCell>{schedule.route}</TableCell>
                                        <TableCell>{schedule.travelDate}</TableCell>
                                        <TableCell>{schedule.startTime}</TableCell>
                                        <TableCell>{schedule.endDate}</TableCell>
                                        <TableCell>{schedule.endTime}</TableCell>
                                        <TableCell>{schedule.closingDate}</TableCell>
                                        <TableCell>{schedule.closingTime}</TableCell>
                                        <TableCell>
                                            {/* <Typography variant="body2" sx={{ color: schedule.status === 'Active' ? 'green' : 'red' }}>{schedule.status}</Typography> */}

                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={schedule.active}
                                                        onChange={() => handleActiveChange(schedule.id)}
                                                    />
                                                }
                                                label={schedule.active ? "Active" : "Inactive"}
                                            />
                                        </TableCell>
                                        {/* <TableCell>
                                        {schedule.status === 'Duplicate' ? (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(schedule.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        ) : null}
                                    </TableCell> */}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        showFirstButton
                        showLastButton
                        component="div"
                        count={filteredSchedules.length}
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

export default ScheduleManagement;