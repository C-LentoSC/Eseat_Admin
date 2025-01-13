import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TablePagination
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
                    Ticket Cancel Requests
                </Typography>

                {/* Requests Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Ref.</TableCell>
                                <TableCell sx={{ py: 1 }}>Request Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Book Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Travel Date</TableCell>
                                <TableCell sx={{ py: 1 }}>Cancel Type</TableCell>
                                <TableCell sx={{ py: 1 }}>Canceled By</TableCell>
                                <TableCell sx={{ py: 1 }}>Schedule No</TableCell>
                                <TableCell sx={{ py: 1 }}>Depot</TableCell>
                                <TableCell sx={{ py: 1 }}>Route</TableCell>
                                <TableCell sx={{ py: 1 }}>Seats No</TableCell>
                                <TableCell sx={{ py: 1 }}>Name</TableCell>
                                <TableCell sx={{ py: 1 }}>Mobile No</TableCell>
                                <TableCell sx={{ py: 1 }}>Bank Info</TableCell>
                                <TableCell sx={{ py: 1 }}>Net Amount</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell sx={{ py: 0 }}>{request.refNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{dayjs(request.requestDate).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{dayjs(request.bookDate).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{dayjs(request.travelDate).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.cancelType}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.canceledBy}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.scheduleNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.depot}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.route}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.seatNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.name}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.mobileNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.bankInfo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{request.netAmount}</TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
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
                    <TablePagination
                        component="div"
                        count={requests.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
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