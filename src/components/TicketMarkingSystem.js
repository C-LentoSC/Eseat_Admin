import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    TextField, InputAdornment, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination
} from '@mui/material';
import { FileDownload, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

import LoadingOverlay from './Parts/LoadingOverlay';
import {useLoading} from "../loading";

const TicketMarkingSystem = () => {
    const [loadingList, setLoadingList] = useState([]);
    const loading = false;
    // setLoading(true);
    // setLoading(false);

    const {startLoading,stopLoading}=useLoading()
    // Sample initial data
    const [tickets, setTickets] = useState([]);
    const [alert, setAlert] = useState(null);

    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})


    // States for filters
    const [depot, setDepot] = useState('');
    const [scheduleNo, setScheduleNo] = useState('');
    const [vCode, setVCode] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const loadAll=()=>{

        const L=startLoading()
        api.get('admin/ticket-marking/get-all')
            .then(res=>{
                stopLoading(L)

                setTickets(res.data)
                if (selectedTicket) {
                    setSelectedTicket(p => res.data.filter(i => i.id === p.id)[0])
                }
            })

            .catch(err=>{
                stopLoading(L)

                handleError(err)
            })
    }
    useEffect(() => {
        loadAll()
    }, []);
    function generateUniqueId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Filter tickets based on criteria
    const filteredTickets = tickets.filter(ticket => {
        const depotMatch = !depot ||
            ticket.depot.toLowerCase().includes(depot.toLowerCase());
        const scheduleMatch = !scheduleNo ||
            ticket.scheduleNo.toLowerCase().includes(scheduleNo.toLowerCase());
        const refNoMatch = !vCode ||
            ticket.refNo.toLowerCase().includes(vCode.toLowerCase());

        return depotMatch && scheduleMatch && refNoMatch;
    });

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
            'Ticket Type',
            'Seat Nos',
            'Depot',
            'Schedule No',
            'V-Code',
            'Mode of Pay',
            'Route',
            'NIC',
            'Booked By',
            'Booked Date'
        ];

        const rows = filteredTickets.map(ticket => [
            formatCSVField(ticket.refNo),
            formatCSVField(ticket.ticketType),
            formatCSVField(ticket.seatNoDetails.map(s => `${s.seatNo} : ${s.confirmed ? 'confirmed' : 'not confirmed'}`).join(', ')),
            formatCSVField(ticket.depot),
            formatCSVField(ticket.scheduleNo),
            formatCSVField(ticket.vCode),
            formatCSVField(ticket.modeOfPay),
            formatCSVField(ticket.route),
            `="${ticket.nic}"`,
            formatCSVField(ticket.bookedBy),
            formatDateForCSV(ticket.bookedDate)
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
        link.setAttribute('download', `ticket_marking_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    const handleViewSeats = (ticket) => {
        setSelectedTicket(ticket);
        setDialogOpen(true);
    };

    const handleConfirmSeat = (ticket, seatNo) => {


        const L=startLoading()
        api.post('admin/ticket-marking/confirm', {...ticket, seatNo: seatNo})
            .then(res=>{
                stopLoading(L)
                sendAlert("seat marked")
                loadAll()
            })
            .catch(err=>{
                stopLoading(L)

                handleError(err)
            })


        // setSelectedTicket();
    };


    const allSeatsConfirmed = (ticket) => {
        return ticket.seatNoDetails.every(s => s.confirmed);
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

            <LoadingOverlay show={loading} />
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                setOpen={setAlert} /> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Ticket Marking System
                </Typography>

                {/* Filters */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Depot"
                            value={depot}
                            onChange={(e) => setDepot(e.target.value)}
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
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Bus Schedule"
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
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Ref No"
                            value={vCode}
                            onChange={(e) => setVCode(e.target.value)}
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
                        disabled={filteredTickets.length === 0}
                    >
                        Export
                    </Button>
                </Box>

                {/* Tickets Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Ref No</TableCell>
                                <TableCell sx={{ py: 1 }}>Ticket Type</TableCell>
                                <TableCell sx={{ py: 1 }}>Seat No</TableCell>
                                <TableCell sx={{ py: 1 }}>Depot</TableCell>
                                <TableCell sx={{ py: 1 }}>Schedule No</TableCell>
                                <TableCell sx={{ py: 1 }}>V-Code</TableCell>
                                <TableCell sx={{ py: 1 }}>Mode of Pay</TableCell>
                                <TableCell sx={{ py: 1 }}>Route</TableCell>
                                <TableCell sx={{ py: 1 }}>NIC</TableCell>
                                <TableCell sx={{ py: 1 }}>Booked By</TableCell>
                                <TableCell sx={{ py: 1 }}>Booked Date</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTickets
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell sx={{ py: 0 }}>{ticket.refNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.ticketType}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.seatNoDetails.map(s => s.seatNo).join(', ')}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.depot}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.scheduleNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.vCode}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.modeOfPay}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.route}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.nic}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.bookedBy}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.bookedDate}</TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
                                            {allSeatsConfirmed(ticket) ? (
                                                <IconButton>
                                                    <CheckCircle color="success" />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => handleViewSeats(ticket)} color="primary">
                                                    <HourglassEmpty />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        showFirstButton
                        showLastButton
                        component="div"
                        count={filteredTickets.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>
            </Box>

            {selectedTicket && (
                <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} sx={{ width: "100%" }}>
                        <DialogTitle>Seat Confirmation Details</DialogTitle>
                        <DialogContent>

                            {selectedTicket.seatNoDetails.map(s => (
                                <div key={s.seatNo} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                    <Typography>{s.seatNo}</Typography>
                                    <Typography>{s.confirmed}</Typography>
                                    <IconButton
                                        onClick={() => handleConfirmSeat(selectedTicket, s.seatNo)}
                                        sx={{ color: s.confirmed ? "success" : "primary" }}
                                        disabled={s.confirmed}
                                    >
                                        {s.confirmed ?
                                            <CheckCircle color="success" />
                                            :
                                            <HourglassEmpty color='primary' />
                                        }

                                    </IconButton>

                                </div>
                            ))}

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            )}

        </Container>
    );
};

export default TicketMarkingSystem;
