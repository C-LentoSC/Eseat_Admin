import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    TextField, InputAdornment, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Modal,Autocomplete
} from '@mui/material';
import { NoteAdd, CheckCircle, FileDownload } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const RefundBooking = () => {
    // Sample initial data
    const [bookings] = useState([
        {
            id: 1,
            refNo: "REF001",
            vCode: "V001",
            bookDate: "2025-01-01",
            travelDate: "2025-01-10",
            scheduleNo: "SCH001",
            depot: "Colombo",
            route: "Colombo-Kandy",
            seatNo: "1A, 2A",
            name: "John Doe",
            mobileNo: "0771234567",
            netAmount: 2500,
            bankDetails:"Peaple's Bank, Colombo",
            refunded: false,
            note: ""
        },
        {
            id: 2,
            refNo: "REF002",
            vCode: "V002",
            bookDate: "2025-01-02",
            travelDate: "2025-01-15",
            scheduleNo: "SCH002",
            depot: "Galle",
            route: "Galle-Matara",
            seatNo: "3B",
            name: "Jane Smith",
            mobileNo: "0777654321",
            netAmount: 1800,
            bankDetails:"Peaple's Bank, Colombo",
            refunded: false,
            note: ""
        }
    ]);

    // States
    const [selectedBookDate, setSelectedBookDate] = useState(null);
    const [refVCode, setRefVCode] = useState('');
    const [scheduleNo, setScheduleNo] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [selectedRefundStatus, setSelectedRefundStatus] = useState('All');
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [note, setNote] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [bookingToRefund, setBookingToRefund] = useState(null);

    const refundStatuses = ['All', 'Refunded', 'Not Refunded'];

    // Filter bookings based on criteria
   const filteredBookings = bookings.filter(booking => {
        const bookDateMatch = !selectedBookDate || 
            dayjs(booking.bookDate).format('YYYY-MM-DD') === dayjs(selectedBookDate).format('YYYY-MM-DD');
        const refVCodeMatch = !refVCode || 
            booking.refNo.toLowerCase().includes(refVCode.toLowerCase()) ||
            booking.vCode.toLowerCase().includes(refVCode.toLowerCase());
        const scheduleNoMatch = !scheduleNo || 
            booking.scheduleNo.toLowerCase().includes(scheduleNo.toLowerCase());
        const mobileNoMatch = !mobileNo || 
            booking.mobileNo.includes(mobileNo);
        const refundStatusMatch = selectedRefundStatus === 'All' || 
            (selectedRefundStatus === 'Refunded' && booking.refunded) ||
            (selectedRefundStatus === 'Not Refunded' && !booking.refunded);

        return bookDateMatch && refVCodeMatch && scheduleNoMatch && mobileNoMatch && refundStatusMatch;
    });

    // Handle note modal
    const handleNoteClick = (booking) => {
        setSelectedBooking(booking);
        setNote(booking.note);
        setNoteModalOpen(true);
    };

    const handleNoteSave = () => {
        if (selectedBooking) {
            selectedBooking.note = note;
        }
        setNoteModalOpen(false);
    };

    // Handle refund confirmation
    const handleRefundClick = (booking) => {
        setBookingToRefund(booking);
        setConfirmDialogOpen(true);
    };

    const handleRefundConfirm = () => {
        if (bookingToRefund) {
            bookingToRefund.refunded = true;
        }
        setConfirmDialogOpen(false);
    };

    // Export to CSV
    const formatDateForCSV = (dateStr) => {
        const formattedDate = dayjs(dateStr).format('DD/MM/YYYY');
        return `="${formattedDate}"`;
    };

    const formatCSVField = (field) => {
        if (field === null || field === undefined) return '""';
        const fieldStr = String(field);
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
            return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
    };

    const handleExport = () => {
        const headers = [
            'Ref No',
            'V-Code',
            'Book Date',
            'Travel Date',
            'Schedule No',
            'Depot',
            'Route',
            'Seat No',
            'Name',
            'Mobile No',
            'Net Amount',
            'Bank Details',
            'Refunded',
            'Note'
        ];

        const rows = filteredBookings.map(booking => [
            formatCSVField(booking.refNo),
            formatCSVField(booking.vCode),
            formatDateForCSV(booking.bookDate),
            formatDateForCSV(booking.travelDate),
            formatCSVField(booking.scheduleNo),
            formatCSVField(booking.depot),
            formatCSVField(booking.route),
            formatCSVField(booking.seatNo),
            formatCSVField(booking.name),
            `="${booking.mobileNo}"`,
            formatCSVField(booking.netAmount),
            formatCSVField(booking.bankDetails),
            formatCSVField(booking.refunded ? 'Yes' : 'No'),
            formatCSVField(booking.note)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `refund_bookings_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Refund Booking
                </Typography>

                {/* Filters */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Book Date"
                                value={selectedBookDate}
                                onChange={(newValue) => setSelectedBookDate(newValue)}
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
                    <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Ref. / V-Code"
                            value={refVCode}
                            onChange={(e) => setRefVCode(e.target.value)}
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
                    <Grid item xs={12} sm={6} md={2.4}>
                        <TextField
                            fullWidth
                            label="Schedule No"
                            value={scheduleNo}
                            onChange={(e) => setScheduleNo(e.target.value)}
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
                    <Grid item xs={12} sm={6} md={2.4}>
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
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Autocomplete
                            value={selectedRefundStatus}
                            onChange={(_, value) => setSelectedRefundStatus(value || 'All')}
                            options={refundStatuses}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Refund Status"
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

                {/* Export Button */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: '-15px',
                    marginTop: '-10px'
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ref.</TableCell>
                                <TableCell>V-Code</TableCell>
                                <TableCell>Book Date</TableCell>
                                <TableCell>Travel Date</TableCell>
                                <TableCell>Schedule No</TableCell>
                                <TableCell>Depot</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Seats No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Mobile No</TableCell>
                                <TableCell>Net Amount</TableCell>
                                <TableCell>Bank Details</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.refNo}</TableCell>
                                    <TableCell>{booking.vCode}</TableCell>
                                    <TableCell>{booking.bookDate}</TableCell>
                                    <TableCell>{booking.travelDate}</TableCell>
                                    <TableCell>{booking.scheduleNo}</TableCell>
                                    <TableCell>{booking.depot}</TableCell>
                                    <TableCell>{booking.route}</TableCell>
                                    <TableCell>{booking.seatNo}</TableCell>
                                    <TableCell>{booking.name}</TableCell>
                                    <TableCell>{booking.mobileNo}</TableCell>
                                    <TableCell>{booking.netAmount}</TableCell>
                                    <TableCell>{booking.bankDetails}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleNoteClick(booking)}
                                            color="primary"
                                        >
                                            <NoteAdd />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleRefundClick(booking)}
                                            color="success"
                                            disabled={booking.refunded}
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Note Modal */}
                <Modal
                    open={noteModalOpen}
                    onClose={() => setNoteModalOpen(false)}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "10px",
                        border: "2px solid gray",
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Add Note
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="contained"
                                onClick={handleNoteSave}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setNoteModalOpen(false)}
                                sx={{ backgroundColor: 'gray' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Refund Confirmation Dialog */}
                <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                >
                    <DialogTitle>
                        Confirm Refund
                    </DialogTitle>
                    <DialogContent>
                        Are you sure you want to mark this booking as refunded?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)}>
                            No
                        </Button>
                        <Button onClick={handleRefundConfirm} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default RefundBooking;