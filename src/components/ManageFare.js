import React, {useState, useRef, useEffect} from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    IconButton,
    // Autocomplete,
    InputAdornment,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

// import CustomAlert from "./Parts/CustomAlert";

// import LoadingOverlay from './Parts/LoadingOverlay';

const ManageFare = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })


    // const [selectedBusType, setSelectedBusType] = useState(null);
    const fileInputRef = useRef();
    const [percentage, setPercentage] = useState('');

    const [routes, setRoutes] = useState([]);
    const loadAll=()=>{
        api.get('admin/bulk-fare/get-all')
            .then(res=>{
                setRoutes(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        loadAll()
    }, []);
    // const busTypes = ["Luxury", "Semi-Luxury", "Normal"];

    const updateAllFares = (isIncrease) => {
        const multiplier = isIncrease ?
            (100 + parseFloat(percentage)) / 100 :
            (100 - parseFloat(percentage)) / 100;

        setRoutes(routes.map(route => ({
            ...route,
            newFare: Math.round(route.oldFare * multiplier)
        })));
    };

    const handleFareChange = (id, value) => {
        let formattedValue = value.replace(/[^0-9.]/g, '');
        if (formattedValue.indexOf('.') !== -1) {
            const [integerPart, decimalPart] = formattedValue.split('.');
            formattedValue = `${integerPart}.${decimalPart.slice(0, 2)}`;
        }
        if (formattedValue) {
            formattedValue = parseFloat(formattedValue).toFixed(2);
        }
         setRoutes(routes.map(route =>
            route.id === id ? { ...route, newFare: formattedValue } : route
        ));
    };

    const handleExport = () => {
        const csv = [
            ['Route', 'Current Fare', 'New Fare'],
            ...routes.map(route => [route.name, route.oldFare, route.newFare])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bus_fares.csv';
        a.click();
    };
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split('\n');
                // Skip header row
                const updatedRoutes = rows.slice(1).map(row => {
                    const [name, oldFare, newFare] = row.split(',');
                    // Find matching route by name and update its fares
                    const existingRoute = routes.find(r => r.name.trim() === name.trim());
                    if (existingRoute) {
                        return {
                            ...existingRoute,
                            oldFare: parseInt(oldFare),
                            newFare: parseInt(newFare)
                        };
                    }
                    return null;
                }).filter(route => route !== null);

                if (updatedRoutes.length > 0) {
                    setRoutes(routes.map(route => {
                        const updatedRoute = updatedRoutes.find(r => r.id === route.id);
                        return updatedRoute || route;
                    }));
                }
            };
            reader.readAsText(file);
        }
        // Reset file input
        event.target.value = '';
    };


    const handleSave = () => {
        api.post('admin/bulk-fare/save', {routes})
            .then(()=> {
                loadAll()
                sendAlert('fare saved successfully')
            })
            .catch(handleError)
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
        <Container maxWidth="lg">
           
            {/* <LoadingOverlay show={loading} /> */}
            
             {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                  setOpen={setAlert}/> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Bus Fare Management
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mt: 2 }}>
                        {/* <Autocomplete
                            options={busTypes}
                            value={selectedBusType}
                            onChange={(_, value) => setSelectedBusType(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Bus Type"
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
                                    width: '200px'
                                }
                            }}
                        /> */}
                        <TextField
                            label="Percentage"
                            type="number"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    width: '200px'
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                        />
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                                color="primary"
                                onClick={() => updateAllFares(true)}
                                disabled={!percentage}
                                sx={{
                                    borderRadius: '8px', backgroundColor: "#3f51b5", color: "#fff",
                                    "&:hover": { backgroundColor: "#303f9f" },
                                    "&.Mui-disabled": {
                                        backgroundColor: "#d3d3d3",
                                        color: "#808080"
                                    }
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => updateAllFares(false)}
                                disabled={!percentage}
                                sx={{
                                    borderRadius: '8px', backgroundColor: "#f44336", color: "#fff",
                                    "&:hover": { backgroundColor: "#d32f2f" },
                                    "&.Mui-disabled": {
                                        backgroundColor: "#d3d3d3",
                                        color: "#808080"
                                    }
                                }}
                            >
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImport}
                        />
                        <Button
                            variant="contained"
                            startIcon={<FileUploadIcon />}
                            onClick={() => fileInputRef.current.click()}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Import
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExport}
                            sx={{
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#388e3c",
                                },
                            }}
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>


                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                    <TableCell sx={{ py: 1 }}>Route</TableCell>
                                    <TableCell sx={{ py: 1 }} align="right">Current Fare</TableCell>
                                    <TableCell sx={{ py: 1 }} align="center">=</TableCell>
                                    <TableCell sx={{ py: 1 }} align="right">New Fare</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routes
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((route) => (
                                    <TableRow key={route.id}>
                                        <TableCell sx={{ py: 0 }}>{route.name}</TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
                                            <TextField
                                                disabled
                                                value={`LKR ${route.oldFare}`}
                                                size="small"
                                                sx={{ width: 250 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 0 }} align="center">=</TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
                                            <TextField
                                                value={route.newFare}
                                                onChange={(e) => handleFareChange(route.id, e.target.value)}
                                                size="small"
                                                sx={{ width: 250 }}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <TablePagination
                                                component="div"
                                                count={routes.length}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                rowsPerPage={rowsPerPage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                            />
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default ManageFare;
