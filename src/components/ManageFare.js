import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    IconButton,
    Autocomplete,
    InputAdornment,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SaveIcon from '@mui/icons-material/Save';

// import CustomAlert from "./Parts/CustomAlert";

const ManageFare = () => {

    // const [alert, setAlert] = useState(null);
    // const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    // const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })


    const [selectedBusType, setSelectedBusType] = useState(null);
    const [percentage, setPercentage] = useState('');

    const [routes, setRoutes] = useState([
        { id: 1, name: 'Colombo - Kandy', oldFare: 500, newFare: 500 },
        { id: 2, name: 'Colombo - Galle', oldFare: 450, newFare: 450 },
        { id: 3, name: 'Colombo - Jaffna', oldFare: 1200, newFare: 1200 },
    ]);

    const busTypes = ["Luxury", "Semi-Luxury", "Normal"];

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
        setRoutes(routes.map(route =>
            route.id === id ? { ...route, newFare: parseInt(value) || 0 } : route
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
    const handleSave = () => { };

    return (
        <Container maxWidth="lg">
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
                        <Autocomplete
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
                        />
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
                                <TableRow>
                                    <TableCell>Route</TableCell>
                                    <TableCell align="right">Current Fare</TableCell>
                                    <TableCell align="center">=</TableCell>
                                    <TableCell align="right">New Fare</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routes.map((route) => (
                                    <TableRow key={route.id}>
                                        <TableCell>{route.name}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                disabled
                                                value={`LKR ${route.oldFare}`}
                                                size="small"
                                                sx={{ width: 150 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">=</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                value={route.newFare}
                                                onChange={(e) => handleFareChange(route.id, e.target.value)}
                                                size="small"
                                                sx={{ width: 150 }}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default ManageFare;