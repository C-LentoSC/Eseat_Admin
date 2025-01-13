import React, { useState } from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    TextField, InputAdornment, Button, TablePagination
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import dayjs from 'dayjs';

const TicketMarkingSystem = () => {
    // Sample initial data
    const [tickets] = useState([
        {
            id: 1,
            refNo: "TKT001",
            ticketType: "Regular",
            seatNo: "1A, 2A",
            depot: "Colombo",
            scheduleNo: "SCH001",
            vCode: "V001",
            modeOfPay: "Cash",
            route: "Colombo-Kandy",
            nic: "199912345678",
            bookedBy: "John Doe",
            bookedDate: "2025-01-01"
        },
        {
            id: 2,
            refNo: "TKT002",
            ticketType: "Student",
            seatNo: "3B",
            depot: "Galle",
            scheduleNo: "SCH002",
            vCode: "V002",
            modeOfPay: "Card",
            route: "Galle-Matara",
            nic: "200045678912",
            bookedBy: "Jane Smith",
            bookedDate: "2025-01-02"
        }
    ]);

    // States for filters
    const [depot, setDepot] = useState('');
    const [scheduleNo, setScheduleNo] = useState('');
    const [vCode, setVCode] = useState('');

    // Filter tickets based on criteria
    const filteredTickets = tickets.filter(ticket => {
        const depotMatch = !depot ||
            ticket.depot.toLowerCase().includes(depot.toLowerCase());
        const scheduleMatch = !scheduleNo ||
            ticket.scheduleNo.toLowerCase().includes(scheduleNo.toLowerCase());
        const vCodeMatch = !vCode ||
            ticket.vCode.toLowerCase().includes(vCode.toLowerCase());

        return depotMatch && scheduleMatch && vCodeMatch;
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
            'Seat No',
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
            formatCSVField(ticket.seatNo),
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
                            label="V-Code"
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTickets
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell sx={{ py: 0 }}>{ticket.refNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.ticketType}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.seatNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.depot}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.scheduleNo}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.vCode}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.modeOfPay}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.route}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.nic}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.bookedBy}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{ticket.bookedDate}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
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
        </Container>
    );
};

export default TicketMarkingSystem;