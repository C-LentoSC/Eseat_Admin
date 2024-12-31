import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Autocomplete,
    TextField,
    InputAdornment,
    Grid
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { setroutval } from "./DashboardLayoutAccount";
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";

const ActiveDepot = () => {

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Sample data
    const [depots,setDepots] = useState([]);
    const loadAllDepots=()=>{
        api.get('admin/bus/all-depot')
            .then(res=>{
                setDepots(res.data)
            })
            .catch(handleError)
    }
    const loadAllRegions=()=>{
        api.get('admin/bus/all-regions')
            .then(res=>{
                setRegions(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        loadAllDepots()
        loadAllRegions()
    }, []);
    // States for filters
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedDepot, setSelectedDepot] = useState(null);

    // Sample regions and depots
    const [regions,setRegions] = useState([]);
    const depotNames = depots.map(depot => depot.name);

    // Filter handlers
    const handleRegionChange = (event, newValue) => {
        setSelectedRegion(newValue);
        setSelectedDepot(null);
    };

    const handleDepotChange = (event, newValue) => {
        setSelectedDepot(newValue);
    };

    // View handler
    const handleView = (depotId) => {
        setroutval('/busManagement', depotId);
    };

    // Filter depots based on selection
    const filteredDepots = depots.filter(depot => {
        if (selectedRegion && depot.region !== selectedRegion) return false;
        if (selectedDepot && depot.name !== selectedDepot) return false;
        return true;
    });

    return (
        <Container component="main" maxWidth="lg">

             {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert} setOpen={setAlert} /> : <></>}

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Bus Management
                </Typography>

                {/* Filter Section */}
                <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            value={selectedRegion}
                            onChange={handleRegionChange}
                            options={regions}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Region"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '40px',
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            value={selectedDepot}
                            onChange={handleDepotChange}
                            options={depotNames}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Depot"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '40px',
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Table Section */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Depot ID</TableCell>
                                <TableCell>Depot Name</TableCell>
                                <TableCell>Region</TableCell>
                                <TableCell align="center">Active Bus Count</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDepots.map((depot) => (
                                <TableRow key={depot.id}>
                                    <TableCell>{depot.id}</TableCell>
                                    <TableCell>{depot.name}</TableCell>
                                    <TableCell>{depot.region}</TableCell>
                                    <TableCell align="center">{depot.activeBusCount}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="info"
                                            onClick={() => handleView(depot.id)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default ActiveDepot;