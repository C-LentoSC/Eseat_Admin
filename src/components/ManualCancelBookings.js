import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    Autocomplete, TextField, InputAdornment, Modal, Button,
    Chip, Checkbox
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// import CustomAlert from "./Parts/CustomAlert";

const ManualCancelBookings = () => {

    // const [alert, setAlert] = useState(null);
    // const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    // const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })


    // Sample initial data
    const [bookings] = useState([
        {
            id: 1,
            vCode: "V001",
            refNo: "REF001",
            scheduleNo: "SCH001",
            route: "Colombo-Kandy",
            seatDetails: [
                { seatNo: "1A", seatCost: 1000, serviceCharge: 100, vat: 150, discount: 50, otherCharges: 0, status: 'Confirmed' },
                { seatNo: "2A", seatCost: 1000, serviceCharge: 100, vat: 150, discount: 50, otherCharges: 0, status: 'Confirmed' }
            ],
            name: "John Doe",
            mobileNo: "0771234567",
            travelDate: "2025-01-10",
            bookBy: "John Doe",
            bookDate: "2025-01-01",
            netAmount: 2500,
            paymentType: "Credit Card",
            bookingStatus: "Manual Cancel",
            paymentStatus: "Pending",
            deleteDate: null
        },
        {
            id: 2,
            vCode: "V002",
            refNo: "REF002",
            scheduleNo: "SCH002",
            route: "Galle-Matara",
            seatDetails: [
                { seatNo: "3B", seatCost: 800, serviceCharge: 80, vat: 120, discount: 0, otherCharges: 0, status: 'Pending' }
            ],
            name: "John Doe",
            mobileNo: "0777654321",
            travelDate: "2025-01-15",
            bookBy: "Jane Smith",
            bookDate: "2025-01-02",
            netAmount: 1800,
            paymentType: "Cash",
            bookingStatus: "Failed",
            paymentStatus: "Failed",
            deleteDate: null
        },
        {
            id: 3,
            vCode: "V003",
            refNo: "REF003",
            scheduleNo: "SCH003",
            route: "Colombo-Galle",
            seatDetails: [
                { seatNo: "5C", seatCost: 900, serviceCharge: 90, vat: 135, discount: 0, otherCharges: 0, status: 'Pending' }
            ],
            name: "Agen",
            mobileNo: "0773456789",
            travelDate: "2025-01-20",
            bookBy: "Travel Agent X",
            bookDate: "2025-01-03",
            netAmount: 2000,
            paymentType: "Bank Transfer",
            bookingStatus: "Manual Cancel",
            paymentStatus: "Paid",
            deleteDate: null
        },
        {
            id: 4,
            vCode: "V004",
            refNo: "REF004",
            scheduleNo: "SCH004",
            route: "Kandy-Colombo",
            seatDetails: [
                { seatNo: "7D", seatCost: 1200, serviceCharge: 120, vat: 180, discount: 100, otherCharges: 0, status: 'Pending' }
            ],
            name: "Guest",
            mobileNo: "0779876543",
            travelDate: "2025-01-25",
            bookBy: "Sam Wilson",
            bookDate: "2025-01-04",
            netAmount: 1400,
            paymentType: "Credit Card",
            bookingStatus: "Failed",
            paymentStatus: "Failed",
            deleteDate: null
        },
        {
            id: 5,
            vCode: "V005",
            refNo: "REF005",
            scheduleNo: "SCH005",
            route: "Matara-Colombo",
            seatDetails: [
                { seatNo: "8A", seatCost: 1100, serviceCharge: 110, vat: 165, discount: 0, otherCharges: 50, status: 'Pending' }
            ],
            name: "Guest",
            mobileNo: "0775555555",
            travelDate: "2025-01-30",
            bookBy: "Mary Johnson",
            bookDate: "2025-01-05",
            netAmount: 1425,
            paymentType: "Cash",
            bookingStatus: "Deleted",
            paymentStatus: "Pending",
            deleteDate: "2025-01-06"
        }
    ]);

    // States
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBooking] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState({});
    const [bookingId, setBookingId] = useState('');
    const [refNo, setRefNo] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedBookingStatus] = useState("Manual Cancel");
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
    const [selectedBookDate, setSelectedBookDate] = useState(null);

    // Extract unique values for selectors
    const paymentMethods = [...new Set(bookings.map(booking => booking.paymentType))];
    // const bookingStatuses = ["All", "Pending", "Manual Cancel", "Agent Bookings", "Fail", "Deleted"];
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
        const paymentStatusMatch =
            !selectedPaymentStatus ||
            booking.paymentStatus === selectedPaymentStatus;
        const bookDateMatch = !selectedBookDate ||
            dayjs(booking.bookDate).format('YYYY-MM-DD') === dayjs(selectedBookDate).format('YYYY-MM-DD');

        return bookingIdMatch && refNoMatch && mobileNoMatch &&
            paymentMethodMatch && bookingStatusMatch && paymentStatusMatch &&
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

        const fileName = `manual_cancel_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`;
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Manual Cancel Bookings
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
                    {/* <Grid item xs={12} sm={6} md={3}>
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
                    </Grid> */}
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
                            <TableRow>
                                <TableCell>V-Code</TableCell>
                                <TableCell>Ref No</TableCell>
                                <TableCell>Schedule No</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Seat No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Mobile No</TableCell>
                                <TableCell>Travel Date</TableCell>
                                <TableCell>Book By</TableCell>
                                <TableCell>Book Date</TableCell>
                                <TableCell>Net Amount</TableCell>
                                <TableCell>Payment Type</TableCell>
                                <TableCell>Booking Status</TableCell>
                                <TableCell>Payment Status</TableCell>
                                {selectedBookingStatus === 'Deleted' && <TableCell>Delete Date</TableCell>}
                                {/* <TableCell align='right'>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.vCode}</TableCell>
                                    <TableCell>{booking.refNo}</TableCell>
                                    <TableCell>{booking.scheduleNo}</TableCell>
                                    <TableCell>{booking.route}</TableCell>
                                    <TableCell>{booking.seatDetails.map(s => s.seatNo).join(', ')}</TableCell>
                                    <TableCell>{booking.name}</TableCell>
                                    <TableCell>{booking.mobileNo}</TableCell>
                                    <TableCell>{booking.travelDate}</TableCell>
                                    <TableCell>{booking.bookBy}</TableCell>
                                    <TableCell>{booking.bookDate}</TableCell>
                                    <TableCell>{booking.netAmount}</TableCell>
                                    <TableCell>{booking.paymentType}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={booking.bookingStatus}
                                            color={booking.bookingStatus === 'Booked' ? 'success' : booking.bookingStatus === 'Pending' ? 'warning' : 'error'}
                                            size="small"
                                            sx={{minWidth:80, height: 20, paddingTop: '2px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={booking.paymentStatus}
                                            color={booking.paymentStatus === 'Paid' ? 'success' : booking.paymentStatus === 'Pending' ? 'warning' : 'error'}
                                            size="small"
                                            sx={{ minWidth: 80, height: 20, paddingTop: '2px' }}
                                        />
                                    </TableCell>
                                    {selectedBookingStatus === 'Deleted' && <TableCell>{booking.deleteDate}</TableCell>}
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
                                    <TableRow>
                                        <TableCell>Seat No</TableCell>
                                        <TableCell>Seat Cost</TableCell>
                                        <TableCell>Service Charge</TableCell>
                                        <TableCell>VAT</TableCell>
                                        <TableCell>Discount</TableCell>
                                        <TableCell>Other Charges</TableCell>
                                        <TableCell>Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedBooking?.seatDetails.map((seat) => (
                                        <TableRow key={seat.seatNo}>
                                            <TableCell>{seat.seatNo}</TableCell>
                                            <TableCell>{seat.seatCost}</TableCell>
                                            <TableCell>{seat.serviceCharge}</TableCell>
                                            <TableCell>{seat.vat}</TableCell>
                                            <TableCell>{seat.discount}</TableCell>
                                            <TableCell>{seat.otherCharges}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedSeats[seat.seatNo] || false}
                                                    onChange={() => handleSeatSelect(seat.seatNo)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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

export default ManualCancelBookings;