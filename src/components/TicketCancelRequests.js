import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Cancel } from '@mui/icons-material';
import dayjs from 'dayjs';

const TicketCancelRequests = () => {
    // Sample initial data
    const [requests] = useState([
        {
            id: 1,
            refNo: "REF001",
            requestDate: "2025-01-05",
            bookDate: "2025-01-01",
            travelDate: "2025-01-10",
            cancelType: "Passenger Request",
            canceledBy: "John Doe",
            scheduleNo: "SCH001",
            depot: "Colombo",
            route: "Colombo-Kandy",
            seatNo: "1A, 2A",
            name: "John Doe",
            mobileNo: "0771234567",
            bankInfo: "Bank of Ceylon - 1234567890",
            netAmount: 2500,
            isCanceled: false
        },
        {
            id: 2,
            refNo: "REF002",
            requestDate: "2025-01-06",
            bookDate: "2025-01-02",
            travelDate: "2025-01-15",
            cancelType: "System Cancel",
            canceledBy: "System",
            scheduleNo: "SCH002",
            depot: "Galle",
            route: "Galle-Matara",
            seatNo: "3B",
            name: "Jane Smith",
            mobileNo: "0777654321",
            bankInfo: "Sampath Bank - 0987654321",
            netAmount: 1800,
            isCanceled: false
        }
    ]);

    // States
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Handle cancel confirmation
    const handleCancelClick = (request) => {
        setSelectedRequest(request);
        setConfirmDialogOpen(true);
    };

    const handleCancelConfirm = () => {
        if (selectedRequest) {
            selectedRequest.isCanceled = true;
        }
        setConfirmDialogOpen(false);
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Ticket Cancel Requests
                </Typography>

                {/* Requests Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ref.</TableCell>
                                <TableCell>Request Date</TableCell>
                                <TableCell>Book Date</TableCell>
                                <TableCell>Travel Date</TableCell>
                                <TableCell>Cancel Type</TableCell>
                                <TableCell>Canceled By</TableCell>
                                <TableCell>Schedule No</TableCell>
                                <TableCell>Depot</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>Seats No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Mobile No</TableCell>
                                <TableCell>Bank Info</TableCell>
                                <TableCell>Net Amount</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.refNo}</TableCell>
                                    <TableCell>{dayjs(request.requestDate).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{dayjs(request.bookDate).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{dayjs(request.travelDate).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{request.cancelType}</TableCell>
                                    <TableCell>{request.canceledBy}</TableCell>
                                    <TableCell>{request.scheduleNo}</TableCell>
                                    <TableCell>{request.depot}</TableCell>
                                    <TableCell>{request.route}</TableCell>
                                    <TableCell>{request.seatNo}</TableCell>
                                    <TableCell>{request.name}</TableCell>
                                    <TableCell>{request.mobileNo}</TableCell>
                                    <TableCell>{request.bankInfo}</TableCell>
                                    <TableCell>{request.netAmount}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleCancelClick(request)}
                                            color="error"
                                            disabled={request.isCanceled}
                                        >
                                            <Cancel />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Cancel Confirmation Dialog */}
                <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                >
                    <DialogTitle>
                        Confirm Cancel
                    </DialogTitle>
                    <DialogContent>
                        Are you sure you want to cancel this ticket?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)}>
                            No
                        </Button>
                        <Button onClick={handleCancelConfirm} color="error" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default TicketCancelRequests;