import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    Autocomplete, TextField, InputAdornment
} from '@mui/material';

const BookingHistory = () => {
    // Sample initial data
    const [bookings] = useState([
        {
            id: 1,
            vCode: "V001",
            refNo: "REF001",
            scheduleNo: "SCH001",
            route: "Colombo-Kandy",
            seatNumbers: "1A, 2A",
            mobileNo: "0771234567",
            travelDate: "2025-01-10",
            bookBy: "John Doe",
            bookDate: "2025-01-01",
            netAmount: 2500,
            paymentType: "Credit Card",
            bookingStatus: "Confirmed",
            paymentStatus: "Paid"
        },
        {
            id: 2,
            vCode: "V002",
            refNo: "REF002",
            scheduleNo: "SCH002",
            route: "Galle-Matara",
            seatNumbers: "3B, 4B",
            mobileNo: "0777654321",
            travelDate: "2025-01-15",
            bookBy: "Jane Smith",
            bookDate: "2025-01-02",
            netAmount: 1800,
            paymentType: "Cash",
            bookingStatus: "Pending",
            paymentStatus: "Pending"
        }
    ]);

    // Filter states
    const [bookingId, setBookingId] = useState('');
    const [refNo, setRefNo] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedBookingStatus, setSelectedBookingStatus] = useState(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);

    // Extract unique values for selectors
    const paymentMethods = [...new Set(bookings.map(booking => booking.paymentType))];
    const bookingStatuses = ["All", "Pending", "Manual Cancel", "Agent Bookings", "Fail", "Deleted"];
    const paymentStatuses = ["Paid", "Pending", "Failed"];

    // Filter the bookings based on selected criteria
    const filteredBookings = bookings.filter(booking => {
        const bookingIdMatch = !bookingId || booking.id.toString().includes(bookingId);
        const refNoMatch = !refNo || booking.refNo.toLowerCase().includes(refNo.toLowerCase());
        const mobileNoMatch = !mobileNo || booking.mobileNo.includes(mobileNo);
        const paymentMethodMatch = !selectedPaymentMethod || booking.paymentType === selectedPaymentMethod;
        const bookingStatusMatch = !selectedBookingStatus || booking.bookingStatus === selectedBookingStatus;
        const paymentStatusMatch = !selectedPaymentStatus || booking.paymentStatus === selectedPaymentStatus;
        
        return bookingIdMatch && refNoMatch && mobileNoMatch && 
               paymentMethodMatch && bookingStatusMatch && paymentStatusMatch;
    });

    // Reusable Autocomplete component for selectors
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

    // Reusable Input Field component
    const InputField = ({ value, onChange, label }) => (
        <TextField
            fullWidth
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    </InputAdornment>
                ),
            }}
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
                    Booking History
                </Typography>

                {/* Filters */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <InputField
                            value={bookingId}
                            onChange={setBookingId}
                            label="Booking ID"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <InputField
                            value={refNo}
                            onChange={setRefNo}
                            label="Reference No"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <InputField
                            value={mobileNo}
                            onChange={setMobileNo}
                            label="Mobile No"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedPaymentMethod}
                            onChange={setSelectedPaymentMethod}
                            options={paymentMethods}
                            label="Payment Method"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedBookingStatus}
                            onChange={setSelectedBookingStatus}
                            options={bookingStatuses}
                            label="Booking Status"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AutocompleteField
                            value={selectedPaymentStatus}
                            onChange={setSelectedPaymentStatus}
                            options={paymentStatuses}
                            label="Payment Status"
                        />
                    </Grid>
                </Grid>

                {/* Bookings Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>V-Code</TableCell>
                                <TableCell>Ref No</TableCell>
                                <TableCell>Schedule No</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Seat No</TableCell>
                                <TableCell>Mobile No</TableCell>
                                <TableCell>Travel Date</TableCell>
                                <TableCell>Book By</TableCell>
                                <TableCell>Book Date</TableCell>
                                <TableCell>Net Amount</TableCell>
                                <TableCell>Payment Type</TableCell>
                                <TableCell>Booking Status</TableCell>
                                <TableCell>Payment Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.vCode}</TableCell>
                                    <TableCell>{booking.refNo}</TableCell>
                                    <TableCell>{booking.scheduleNo}</TableCell>
                                    <TableCell>{booking.route}</TableCell>
                                    <TableCell>{booking.seatNumbers}</TableCell>
                                    <TableCell>{booking.mobileNo}</TableCell>
                                    <TableCell>{booking.travelDate}</TableCell>
                                    <TableCell>{booking.bookBy}</TableCell>
                                    <TableCell>{booking.bookDate}</TableCell>
                                    <TableCell>{booking.netAmount}</TableCell>
                                    <TableCell>{booking.paymentType}</TableCell>
                                    <TableCell>{booking.bookingStatus}</TableCell>
                                    <TableCell>{booking.paymentStatus}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default BookingHistory;