import React, { useState } from "react";
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
    Grid,
    TablePagination
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { setroutval } from "./DashboardLayoutAccount";
// import CustomAlert from "./Parts/CustomAlert";

const ActiveDepot = () => {

    // const [alert, setAlert] = useState(null);
    // const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    // const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Sample data
    const [depots] = useState([
        { id: "DEP001", name: "Central Depot", region: "Western", activeBusCount: 25 },
        { id: "DEP002", name: "Northern Hub", region: "Northern", activeBusCount: 18 },
        { id: "DEP003", name: "Eastern Terminal", region: "Eastern", activeBusCount: 30 },
        { id: "DEP004", name: "Southern Station", region: "Southern", activeBusCount: 22 },
        { id: "DEP005", name: "Western Point", region: "Western", activeBusCount: 15 },
        { id: "DEP006", name: "Northern Center", region: "Northern", activeBusCount: 28 },
        { id: "DEP007", name: "Eastern Hub", region: "Eastern", activeBusCount: 20 },
        { id: "DEP008", name: "Southern Depot", region: "Southern", activeBusCount: 33 },
        { id: "DEP009", name: "Western Terminal", region: "Western", activeBusCount: 27 },
        { id: "DEP010", name: "Northern Point", region: "Northern", activeBusCount: 19 },
        { id: "DEP011", name: "Eastern Station", region: "Eastern", activeBusCount: 24 },
        { id: "DEP012", name: "Southern Center", region: "Southern", activeBusCount: 31 },
        { id: "DEP013", name: "Western Hub", region: "Western", activeBusCount: 16 },
        { id: "DEP014", name: "Northern Station", region: "Northern", activeBusCount: 29 },
        { id: "DEP015", name: "Eastern Point", region: "Eastern", activeBusCount: 21 },
        { id: "DEP016", name: "Southern Hub", region: "Southern", activeBusCount: 26 },
        { id: "DEP017", name: "Western Station", region: "Western", activeBusCount: 23 },
        { id: "DEP018", name: "Northern Terminal", region: "Northern", activeBusCount: 17 },
        { id: "DEP019", name: "Eastern Center", region: "Eastern", activeBusCount: 32 },
        { id: "DEP020", name: "Southern Point", region: "Southern", activeBusCount: 28 },
        { id: "DEP021", name: "Southern Point", region: "Southern", activeBusCount: 28 },
    ]);

    // States for filters
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedDepot, setSelectedDepot] = useState(null);

    // Sample regions and depots
    const regions = ["Western", "Northern", "Eastern", "Southern"];
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

            {/* {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert} setOpen={setAlert} /> : <></>} */}

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
                            <TableRow sx={{backgroundColor: '#7cdffa4b'}} >
                                <TableCell sx={{ py: 1 }}>Depot ID</TableCell>
                                <TableCell sx={{ py: 1 }}>Depot Name</TableCell>
                                <TableCell sx={{ py: 1 }}>Region</TableCell>
                                <TableCell sx={{ py: 1 }} align="center">Active Bus Count</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDepots
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((depot) => (
                                    <TableRow key={depot.id}>
                                        <TableCell sx={{ py: 0 }}>{depot.id}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.name}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{depot.region}</TableCell>
                                        <TableCell sx={{ py: 0 }} align="center">{depot.activeBusCount}</TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
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
                    <TablePagination
                        component="div"
                        count={filteredDepots.length}
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

export default ActiveDepot;