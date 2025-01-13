import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    Autocomplete, TextField, InputAdornment,
    Chip, TablePagination
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
                                    <TableCell sx={{ py: 0 }}>{schedule.scheduleNumber}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.routeNo}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.route}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.travelDate}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.startTime}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.endDate}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.endTime}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.closingDate}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{schedule.closingTime}</TableCell>
                                    <TableCell sx={{ py: 0 }}>
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
                     <TablePagination
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