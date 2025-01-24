import React, { useState,useEffect } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    Autocomplete, TextField, InputAdornment, Modal, Button,
     Checkbox, Chip, TablePagination
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";

// import LoadingOverlay from './Parts/LoadingOverlay';

const AgentBookings = () => {

        // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })


    // Sample initial data
    const [bookings,setBookings] = useState([]);
    const loadAll=()=>{
        api.get('admin/bookings/get-agents')
            .then(res=>{
                setBookings(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        let intv

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                clearInterval(intv)
            } else if (document.visibilityState === "visible") {
                loadAll()
                intv = setInterval(loadAll, 5000)
            }
        }
        loadAll()
        intv = setInterval(loadAll, 5000)
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(intv)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        };
    }, [])
    // States
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBooking] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState({});
    const [bookingId, setBookingId] = useState('');
    const [refNo, setRefNo] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedBookingStatus, setSelectedBookingStatus] = useState("All");
    const [selectedBookByStatus] = useState("Agent");
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
    const [selectedBookDate, setSelectedBookDate] = useState(null);

    // Extract unique values for selectors
    const paymentMethods = [...new Set(bookings.map(booking => booking.paymentType))];
    const bookingStatuses = ["All", "Pending", "Manual Cancel", "Failed"];
    const paymentStatuses = ["Paid", "Pending", "Failed"];

    // Filter the bookings based on selected criteria
    const filteredBookings = bookings.filter(booking => {
        const bookingIdMatch = !bookingId || booking.id.toString().includes(bookingId);
        const refNoMatch = !refNo || booking.refNo.toLowerCase().includes(refNo.toLowerCase());
        const mobileNoMatch = !mobileNo || booking.mobileNo.includes(mobileNo);
        const paymentMethodMatch = !selectedPaymentMethod || booking.paymentType === selectedPaymentMethod;
        const bookingStatusMatch =
            !selectedBookingStatus ||
                selectedBookingStatus === "All" ?
                booking.bookingStatus !== "Deleted" :
                booking.bookingStatus === selectedBookingStatus;
        // const agentMethodMatch = !selectedBookByStatus || booking.bookBy === selectedBookByStatus;
        const paymentStatusMatch =
            !selectedPaymentStatus ||
            booking.paymentStatus === selectedPaymentStatus;
        const bookDateMatch = !selectedBookDate ||
            dayjs(booking.bookDate).format('YYYY-MM-DD') === dayjs(selectedBookDate).format('YYYY-MM-DD');

        return bookingIdMatch && refNoMatch && mobileNoMatch &&
            paymentMethodMatch && bookingStatusMatch &&
            // agentMethodMatch            &&
            paymentStatusMatch &&
            bookDateMatch;
    });


    const handleSeatSelect = (seatNo) => {
        setSelectedSeats(prev => ({
            ...prev,
            [seatNo]: !prev[seatNo]
        }));
    };

    // const handleViewPayment = (booking) => {
    //     setSelectedBooking(booking);
    //     setSelectedSeats({});
    //     setModalOpen(true);
    // };

    const handleConfirmPayment = () => {
        setModalOpen(false);
    };

    // const handleRestore = (bookingId) => {
    //     console.log('Restoring booking:', bookingId);
    // };

    // const handleDelete = (bookingId) => {
    //     console.log('Permanently deleting booking:', bookingId);
    // };


    const formatDateForCSV = (dateStr) => {
        const formattedDate = dayjs(dateStr).format('DD/MM/YYYY');
        return `="${formattedDate}"`;
    };

    const formatCSVField = (field) => {
        if (field === null || field === undefined) {
            return '""';
        }
        const fieldStr = String(field);

        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
            return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
    };
    const formatMobileNumber = (number) => {
        return `="${number}"`;
    };


    const convertToCSV = (data) => {
        const headers = [
            'V-Code',
            'Ref No',
            'Schedule No',
            'Route',
            'Seat Numbers',
            'Name',
            'Mobile No',
            'Travel Date',
            'Book By',
            'Book Date',
            'Net Amount',
            'Payment Type',
            'Booking Status',
            'Payment Status'
        ];

        if (selectedBookingStatus === 'Deleted') {
            headers.push('Delete Date');
        }

        const rows = data.map(booking => {
            const row = [
                formatCSVField(booking.vCode),
                formatCSVField(booking.refNo),
                formatCSVField(booking.scheduleNo),
                formatCSVField(booking.route),
                `"${booking.seatDetails.map(s => s.seatNo).join(' ')}"`,
                formatCSVField(booking.name),
                formatMobileNumber(booking.mobileNo),
                formatDateForCSV(booking.travelDate),
                formatCSVField(booking.bookBy),
                formatDateForCSV(booking.bookDate),
                formatCSVField(booking.netAmount),
                formatCSVField(booking.paymentType),
                formatCSVField(booking.bookingStatus),
                formatCSVField(booking.paymentStatus)
            ];

            if (selectedBookingStatus === 'Deleted') {
                row.push(formatDateForCSV(booking.deleteDate || ''));
            }

            return row;
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csvContent;
    };

    // Function to handle export with BOM for Excel
    const handleExport = () => {
        const csvContent = convertToCSV(filteredBookings);
        // Add BOM to handle UTF-8 in Excel correctly
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);

        const fileName = `agent_bookings_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`;
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
          
           {/* <LoadingOverlay show={loading} /> */}
           
             {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                  setOpen={setAlert}/> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Agent Bookings (Live Updates)
                </Typography>

                {/* Filters */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Booking ID"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Reference No"
                            value={refNo}
                            onChange={(e) => setRefNo(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Mobile No"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Book Date"
                                value={selectedBookDate}
                                onChange={(newValue) => setSelectedBookDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        InputProps: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                </InputAdornment>
                                            ),
                                        },
                                        sx: {
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                height: '40px'
                                            }
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedPaymentMethod}
                            onChange={(_, value) => setSelectedPaymentMethod(value)}
                            options={paymentMethods}
                            // renderInput={(params) => <TextField {...params} label="Payment Method" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Payment Method"
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
                                    height: '40px',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedBookingStatus}
                            onChange={(_, value) => setSelectedBookingStatus(value)}
                            options={bookingStatuses}
                            // renderInput={(params) => <TextField {...params} label="Booking Status" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Booking Status"
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
                                    height: '40px',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            value={selectedPaymentStatus}
                            onChange={(_, value) => setSelectedPaymentStatus(value)}
                            options={paymentStatuses}
                            // renderInput={(params) => <TextField {...params} label="Payment Status" />}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Payment Status"
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
                                    height: '40px',
                                }
                            }}
                        />
                    </Grid>
                </Grid>


                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: '-10px',
                    marginTop: '-15px'
                }}>
                    <Button
                        variant="contained"
                        startIcon={<FileDownload />}
                        onClick={handleExport}
                        disabled={filteredBookings.length === 0}
                    >
                        Export
                    </Button>
                </Box>

                {/* Bookings Table */}
                <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <Table >
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                <TableCell sx={{ py: 1 }}>V-Code</TableCell>
                                <TableCell sx={{ py: 1 }}>Ref No</TableCell>
                                <TableCell sx={{ py: 1 }}>Schedule No</TableCell>
                                <TableCell sx={{ py: 1 }}>Route</TableCell>
                                <TableCell sx={{ py: 1 }}>Seat No</TableCell>
                                <TableCell sx={{ py: 1 }}>Name</TableCell>
                                <TableCell sx={{ py: 1 }}>Mobile No</TableCell>
                                <TableCell sx={{ py: 1 }}>Travel Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Book By</TableCell>
                                <TableCell sx={{ py: 1 }}>Book Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Net Amount</TableCell>
                                <TableCell sx={{ py: 1 }}>Payment Type</TableCell>
                                <TableCell sx={{ py: 1 }}>Booking Status</TableCell>
                                <TableCell sx={{ py: 1 }}>Payment Status</TableCell>
                                {selectedBookingStatus === 'Deleted' && <TableCell sx={{ py: 1 }}>Delete Date</TableCell>}
                                {/* <TableCell align='right'>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings
                              .slice(startIndex, startIndex + rowsPerPage)
                                .map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell sx={{ py: 0 }}>{booking.vCode}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.refNo}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.scheduleNo}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.route}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.seatDetails.map(s => s.seatNo).join(', ')}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.name}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.mobileNo}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.travelDate}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.bookBy}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.bookDate}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.netAmount}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{booking.paymentType}</TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <Chip
                                            label={booking.bookingStatus}
                                            color={booking.bookingStatus === 'Booked' ? 'success' : booking.bookingStatus === 'Pending' ? 'warning' : 'error'}
                                            size="small"
                                            sx={{ minWidth: 80, height: 20, paddingTop: '2px' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <Chip
                                            label={booking.paymentStatus}
                                            color={booking.paymentStatus === 'Paid' ? 'success' : booking.paymentStatus === 'Pending' ? 'warning' : 'error'}
                                            size="small"
                                            sx={{ minWidth: 80, height: 20, paddingTop: '2px' }}
                                        />
                                    </TableCell>
                                    {selectedBookingStatus === 'Deleted' && <TableCell sx={{ py: 0 }}>{booking.deleteDate}</TableCell>}
                                    {/* <TableCell align='right'>
                                        {booking.bookingStatus === 'Pending' && (
                                            <IconButton onClick={() => handleViewPayment(booking)}>
                                                <Visibility />
                                            </IconButton>
                                        )}
                                        {booking.bookingStatus === 'Deleted' && (
                                            <>
                                                <IconButton onClick={() => handleRestore(booking.id)} color="primary">
                                                    <RestoreFromTrash />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(booking.id)} color="error">
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                              <TablePagination
                        component="div"
                        count={filteredBookings.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>



                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxHeight: '90vh',
                        overflow: 'auto',
                        borderRadius: "10px",
                        border: "2px solid gray",
                    }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Seat Payment Details
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                        <TableCell sx={{ py: 1 }}>Seat No</TableCell>
                                        <TableCell sx={{ py: 1 }}>Seat Cost</TableCell>
                                        <TableCell sx={{ py: 1 }}>Service Charge</TableCell>
                                        <TableCell sx={{ py: 1 }}>VAT</TableCell>
                                        <TableCell sx={{ py: 1 }}>Discount</TableCell>
                                        <TableCell sx={{ py: 1 }}>Other Charges</TableCell>
                                        <TableCell sx={{ py: 1 }}>Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedBooking?.seatDetails
                                  .slice(startIndex, startIndex + rowsPerPage)
                                .map((seat) => (
                                        <TableRow key={seat.seatNo}>
                                            <TableCell sx={{ py: 0 }}>{seat.seatNo}</TableCell>
                                            <TableCell sx={{ py: 0 }}>{seat.seatCost}</TableCell>
                                            <TableCell sx={{ py: 0 }}>{seat.serviceCharge}</TableCell>
                                            <TableCell sx={{ py: 0 }}>{seat.vat}</TableCell>
                                            <TableCell sx={{ py: 0 }}>{seat.discount}</TableCell>
                                            <TableCell sx={{ py: 0 }}>{seat.otherCharges}</TableCell>
                                            <TableCell sx={{ py: 0 }}>
                                                <Checkbox
                                                    checked={selectedSeats[seat.seatNo] || false}
                                                    onChange={() => handleSeatSelect(seat.seatNo)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                                        <TablePagination
                        component="div"
                        count={selectedBooking?.seatDetails.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleConfirmPayment}
                                disabled={Object.values(selectedSeats).filter(Boolean).length === 0}
                                sx={{ marginRight: '8px' }}
                            >
                                Confirm
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setModalOpen(false)}
                                sx={{ backgroundColor: 'gray' }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default AgentBookings;
