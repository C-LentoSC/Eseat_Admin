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

const ManageBreakFare = () => {

    // const [alert, setAlert] = useState(null);
    // const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    // const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    const [selectedBusType, setSelectedBusType] = useState(null);
    const [percentage, setPercentage] = useState('');

    const [breaks, setBreaks] = useState([
        { id: 1, name: 'Colombo - Avissawella', oldFare: 300, newFare: 300 },
        { id: 2, name: 'Colombo - Kadawatha', oldFare: 250, newFare: 250 },
        { id: 3, name: 'Colombo - Gampaha', oldFare: 400, newFare: 400 },
    ]);

    const busTypes = ["Express", "Semi-Express", "Normal"];

    const updateAllBreakFares = (isIncrease) => {
        const multiplier = isIncrease ?
            (100 + parseFloat(percentage)) / 100 :
            (100 - parseFloat(percentage)) / 100;

        setBreaks(breaks.map(breakRoute => ({
            ...breakRoute,
            newFare: Math.round(breakRoute.oldFare * multiplier)
        })));
    };

    const handleBreakFareChange = (id, value) => {
        setBreaks(breaks.map(breakRoute =>
            breakRoute.id === id ? { ...breakRoute, newFare: parseInt(value) || 0 } : breakRoute
        ));
    };

    const handleExport = () => {
        const csv = [
            ['Break Route', 'Current Fare', 'New Fare'],
            ...breaks.map(breakRoute => [breakRoute.name, breakRoute.oldFare, breakRoute.newFare])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'break_fares.csv';
        a.click();
    };

    const handleSave = () => { };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Break Fare Management
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
                                onClick={() => updateAllBreakFares(true)}
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
                                onClick={() => updateAllBreakFares(false)}
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
                                    <TableCell>Break Route</TableCell>
                                    <TableCell align="right">Current Fare</TableCell>
                                    <TableCell align="center">=</TableCell>
                                    <TableCell align="right">New Fare</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {breaks.map((breakRoute) => (
                                    <TableRow key={breakRoute.id}>
                                        <TableCell>{breakRoute.name}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                disabled
                                                value={`LKR ${breakRoute.oldFare}`}
                                                size="small"
                                                sx={{ width: 150 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">=</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                value={breakRoute.newFare}
                                                onChange={(e) => handleBreakFareChange(breakRoute.id, e.target.value)}
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

export default ManageBreakFare;