import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    Autocomplete, TextField, InputAdornment,
    Chip
} from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// import CustomAlert from "./Parts/CustomAlert";

const ScheduleManagement = () => {

     // const [alert, setAlert] = useState(null);
    // const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    // const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Sample initial data
    const [schedules] = useState([
        {
            id: 1,
            scheduleNumber: "SCH001",
            routeNo: "R001",
            route: "Colombo-Kandy",
            travelDate: "2025-01-10",
            startTime: "08:00",
            endDate: "2025-01-10",
            endTime: "11:00",
            closingDate: "2025-01-09",
            closingTime: "20:00",
            status: "Active"
        },
        {
            id: 2,
            scheduleNumber: "SCH002",
            routeNo: "R002",
            route: "Galle-Matara",
            travelDate: "2025-01-15",
            startTime: "09:30",
            endDate: "2025-01-15",
            endTime: "11:30",
            closingDate: "2025-01-14",
            closingTime: "21:00",
            status: "Inactive"
        },
        {
            id: 3,
            scheduleNumber: "SCH002",
            routeNo: "R002",
            route: "Galle-Matara",
            travelDate: "2025-01-15",
            startTime: "09:30",
            endDate: "2025-01-15",
            endTime: "11:30",
            closingDate: "2025-01-14",
            closingTime: "21:00",
            status: "Active"
        }
    ]);

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

    return (
        <Container component="main" maxWidth="lg">
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
                            <TableRow>
                                <TableCell>Schedule Number</TableCell>
                                <TableCell>Route No</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Travel Date</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Closing Date</TableCell>
                                <TableCell>Closing Time</TableCell>
                                <TableCell>Status</TableCell>
                                {/* <TableCell>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSchedules.map((schedule) => (
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
                                        <Typography variant="body2" sx={{ color: schedule.status === 'Active' ? 'green' : 'red' }}>{schedule.status}</Typography>
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
                </TableContainer>
            </Box>
        </Container>
    );
};

export default ScheduleManagement;