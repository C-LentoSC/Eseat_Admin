import React, {useEffect, useState} from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    TextField, InputAdornment, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { FileDownload, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

import LoadingOverlay from './Parts/LoadingOverlay';

const TicketMarkingSystem = () => {
    const [loadingList,setLoadingList] = useState([]);
    const loading = false;
    // setLoading(true);
    // setLoading(false);


    // Sample initial data
    const [tickets, setTickets] = useState([
        {
            id: 1,
            refNo: "TKT001",
            ticketType: "Regular",
            depot: "Colombo",
            scheduleNo: "SCH001",
            vCode: "V001",
            modeOfPay: "Cash",
            route: "Colombo-Kandy",
            nic: "199912345678",
            bookedBy: "John Doe",
            bookedDate: "2025-01-01",
            seatNoDetails: [
                { seatNo: "1A", seatCost: 1000, serviceCharge: 100, vat: 150, discount: 50, otherCharges: 0, confirmed: false },
                { seatNo: "2A", seatCost: 1000, serviceCharge: 100, vat: 150, discount: 50, otherCharges: 0, confirmed: false }
            ],
        },
        {
            id: 2,
            refNo: "TKT002",
            ticketType: "Student",
            depot: "Galle",
            scheduleNo: "SCH002",
            vCode: "V002",
            modeOfPay: "Card",
            route: "Galle-Matara",
            nic: "200045678912",
            bookedBy: "Jane Smith",
            bookedDate: "2025-01-02",
            seatNoDetails: [
                { seatNo: "3B", seatCost: 1000, serviceCharge: 100, vat: 150, discount: 50, otherCharges: 0, confirmed: false },
            ],
        }
    ]);
    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})
    const startLoading = (id) => setLoadingList(prevState => [...prevState,id])
    const endLoading=(id)=>setLoadingList(prevState => prevState.filter(i=>i!==id))
    // States for filters
    const [depot, setDepot] = useState('');
    const [scheduleNo, setScheduleNo] = useState('');
    const [vCode, setVCode] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const loadAll=()=>{
        const id=generateUniqueId()
        startLoading(id)
        api.get('admin/ticket-marking/get-all')
            .then(res=>{
                endLoading(id)
                setTickets(res.data)
                if(selectedTicket){
                    setSelectedTicket(p=>res.data.filter(i=>i.id===p.id)[0])
                }
            })
            .catch(err=>{
                endLoading(id)
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

        const id = generateUniqueId();
        startLoading(id)
        api.post('admin/ticket-marking/confirm', {...ticket, seatNo: seatNo})
            .then(res=>{
                endLoading(id)
                sendAlert("seat marked")
                loadAll()
            })
            .catch(err=>{
                endLoading(id)
                handleError(err)
            })
    

        // setSelectedTicket();
    };
    

    const allSeatsConfirmed = (ticket) => {
        return ticket.seatNoDetails.every(s => s.confirmed);
    };

    return (
        <Container component="main" maxWidth="lg">
           
             <LoadingOverlay show={loading} />
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                  setOpen={setAlert}/> : <></>}
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
                            <TableRow>
                                <TableCell>Ref No</TableCell>
                                <TableCell>Ticket Type</TableCell>
                                <TableCell>Seat No</TableCell>
                                <TableCell>Depot</TableCell>
                                <TableCell>Schedule No</TableCell>
                                <TableCell>V-Code</TableCell>
                                <TableCell>Mode of Pay</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell>NIC</TableCell>
                                <TableCell>Booked By</TableCell>
                                <TableCell>Booked Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.refNo}</TableCell>
                                    <TableCell>{ticket.ticketType}</TableCell>
                                    <TableCell>{ticket.seatNoDetails.map(s => s.seatNo).join(', ')}</TableCell>
                                    <TableCell>{ticket.depot}</TableCell>
                                    <TableCell>{ticket.scheduleNo}</TableCell>
                                    <TableCell>{ticket.vCode}</TableCell>
                                    <TableCell>{ticket.modeOfPay}</TableCell>
                                    <TableCell>{ticket.route}</TableCell>
                                    <TableCell>{ticket.nic}</TableCell>
                                    <TableCell>{ticket.bookedBy}</TableCell>
                                    <TableCell>{ticket.bookedDate}</TableCell>
                                    <TableCell align="right">
                                        {allSeatsConfirmed(ticket) ? (
                                            <CheckCircle color="success" />
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