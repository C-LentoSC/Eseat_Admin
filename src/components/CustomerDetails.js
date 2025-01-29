import React, {useEffect, useState} from 'react';
import {
    Box, Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,
    TextField, InputAdornment, Button, TablePagination
} from '@mui/material';
import {FileDownload} from '@mui/icons-material';
import dayjs from 'dayjs';

import LoadingOverlay from './Parts/LoadingOverlay';
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";

const CustomerDetails = () => {


    const [loadingList, setLoadingList] = useState([]);
    const loading = false;

    function generateUniqueId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})
    const startLoading = (id) => setLoadingList(prevState => [...prevState, id])
    const endLoading = (id) => setLoadingList(prevState => prevState.filter(i => i !== id))


    // Sample initial data
    const [customers, setCustomers] = useState([ ]);
    const loadAllCustomers = () => {
        const id = generateUniqueId()
        startLoading(id)
        api.get('admin/customer/get-all')
            .then((response) => {
                endLoading(id)
                setCustomers(response.data)
                console.log(response.data)
            }).catch(err => {
            handleError(err)
            endLoading(id)
        })
    }
    useEffect(() => {
        loadAllCustomers()
    }, []);

    // States for filters
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [customerNic, setCustomerNic] = useState('');

    // Filter customers based on criteria
    const filteredCustomers = customers.filter(customer => {
        const idMatch = !customerId ||
            customer.id.toLowerCase().includes(customerId.toLowerCase());
        const nameMatch = !customerName ||
            customer.name.toLowerCase().includes(customerName.toLowerCase());
        const mobileMatch = !customerMobile ||
            customer.mobile.includes(customerMobile);
        const nicMatch = !customerNic ||
            customer.nic.includes(customerNic);

        return idMatch && nameMatch && mobileMatch && nicMatch;
    });

    // Export to CSV
    const formatCSVField = (field) => {
        if (field === null || field === undefined) return '""';
        const fieldStr = String(field);
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
            return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Mobile', 'NIC'];

        const rows = filteredCustomers.map(customer => [
            formatCSVField(customer.id),
            formatCSVField(customer.name),
            `="${customer.mobile}"`,
            `="${customer.nic}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `customer_details_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`);
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
            <LoadingOverlay show={loading}/>
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                  setOpen={setAlert}/> : <></>}
            <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
                <Typography variant="h5" sx={{fontWeight: 600, mb: 3}}>
                    Customer Details
                </Typography>

                {/* Filters */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="ID"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
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
                            label="Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
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
                            label="Mobile"
                            value={customerMobile}
                            onChange={(e) => setCustomerMobile(e.target.value)}
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
                            label="NIC"
                            value={customerNic}
                            onChange={(e) => setCustomerNic(e.target.value)}
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
                        startIcon={<FileDownload/>}
                        onClick={handleExport}
                        disabled={filteredCustomers.length === 0}
                    >
                        Export
                    </Button>
                </Box>

                {/* Customers Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                <TableCell sx={{py: 1}}>ID</TableCell>
                                <TableCell sx={{py: 1}}>Name</TableCell>
                                <TableCell sx={{py: 1}}>Mobile</TableCell>
                                <TableCell sx={{py: 1}} align="right">NIC</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCustomers
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell sx={{py: 0}}>{customer.id}</TableCell>
                                        <TableCell sx={{py: 0}}>{customer.name}</TableCell>
                                        <TableCell sx={{py: 0}}>{customer.mobile}</TableCell>
                                        <TableCell sx={{py: 0}} align="right">{customer.nic}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredCustomers.length}
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

export default CustomerDetails;