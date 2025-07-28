import React, {useState, useRef, useEffect} from 'react';
import {
    Box, Button, Container, TextField, Typography, IconButton, // Autocomplete,
    InputAdornment, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Grid,
    Modal,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";
import {useLoading} from "../loading";

// import CustomAlert from "./Parts/CustomAlert";

// import LoadingOverlay from './Parts/LoadingOverlay';

const ManageFare = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);

    const {startLoading, stopLoading} = useLoading()
    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})
    const [showVerificationBox, setShowVerificationBox] = useState(false);
    const [seatModalOpen, setSeatModalOpen] = useState(false);


    // const [selectedBusType, setSelectedBusType] = useState(null);
    const fileInputRef = useRef();
    const [percentage, setPercentage] = useState('');

    const [routes, setRoutes] = useState([]);
    const [charges, setCharges] = useState({

        service_charge_ctb: 0,
        service_charge_hgh: 0,
        vat: 0,
        discount: 0,
        bank_charges: 0,
        service_charge01: 0,
        service_charge02: 0

    })
    const loadAll = () => {
        loadCharges()

        const L = startLoading()
        api.get('admin/bulk-fare/get-all')
            .then(res => {
                stopLoading(L)
                setRoutes(res.data)
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    }
    useEffect(() => {
        loadAll()
    }, []);
    // const busTypes = ["Luxury", "Semi-Luxury", "Normal"];

    const updateAllFares = (isIncrease) => {
        const multiplier = isIncrease ? (100 + parseFloat(percentage)) / 100 : (100 - parseFloat(percentage)) / 100;

        setRoutes(routes.map(route => ({

            ...route, newFare: Math.round(route.oldFare * multiplier)

        })));
    };

    const handleFareChange = (id, value) => {

        setRoutes(routes.map(route => route.id === id ? {...route, newFare: parseInt(value) || 0} : route));

    };

    const handleExport = () => {
        const csv = [['Route', 'Current Fare', 'New Fare'], ...routes.map(route => [route.name, route.oldFare, route.newFare])].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], {type: 'text/csv'});
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
                            ...existingRoute, oldFare: parseInt(oldFare), newFare: parseInt(newFare)
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

    const loadCharges = () => {
        const id = startLoading()
        api.get("admin/bulk-fare/charges")
            .then(res => {
                setCharges(res.data)
                stopLoading(id)
            }).catch(err => {
            stopLoading(id)
            handleError(err)
        })
    }


    const handleSave = () => {

        const ml = routes.filter(r => r.newFare < 1)
        if (ml.length > 0) {
            sendAlert(`${ml.length} routes have a negative value or zero`)
        }
        const L = startLoading()
        api.post('admin/bulk-fare/save', {routes, code1, code2})
            .then(() => {
                stopLoading(L)
                loadAll()
                sendAlert('fare saved successfully')
                setCode1("")
                setCode2("")
                setShowVerificationBox(false);
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })

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

    const handleClose = () => {
        setSeatModalOpen(false);
    };
    const [code1, setCode1] = useState("")
    const [code2, setCode2] = useState("")

    return (<Container maxWidth="lg">

        {/* <LoadingOverlay show={loading} /> */}

        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}
        <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5" sx={{fontWeight: 600}}>
                        Bus Fare Management
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSeatModalOpen(true)
                            loadCharges()
                        }}
                        sx={{
                            backgroundColor: "#3f51b5",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#303f9f",
                            },
                        }}
                    >
                        Service Changes
                    </Button>
                </Box>
            </Box>

            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap",}}>
                <Box sx={{display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mt: 2}}>
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
                                height: '40px', width: '200px'
                            }
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                            </InputAdornment>), endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                    />
                    <Box sx={{display: "flex", gap: 1}}>
                        <IconButton
                            color="primary"
                            onClick={() => updateAllFares(true)}
                            disabled={!percentage}
                            sx={{
                                borderRadius: '8px',
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {backgroundColor: "#303f9f"},
                                "&.Mui-disabled": {
                                    backgroundColor: "#d3d3d3", color: "#808080"
                                }
                            }}
                        >
                            <AddIcon/>
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => updateAllFares(false)}
                            disabled={!percentage}
                            sx={{
                                borderRadius: '8px',
                                backgroundColor: "#f44336",
                                color: "#fff",
                                "&:hover": {backgroundColor: "#d32f2f"},
                                "&.Mui-disabled": {
                                    backgroundColor: "#d3d3d3", color: "#808080"
                                }
                            }}
                        >
                            <RemoveIcon/>
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{display: "flex", gap: 2, mt: 2}}>
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        onChange={handleImport}
                    />
                    <Button
                        variant="contained"
                        startIcon={<FileUploadIcon/>}
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            backgroundColor: "#3f51b5", color: "#fff", "&:hover": {
                                backgroundColor: "#303f9f",
                            },
                        }}
                    >
                        Import
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon/>}
                        onClick={handleExport}
                        sx={{
                            backgroundColor: "#4caf50", color: "#fff", "&:hover": {
                                backgroundColor: "#388e3c",
                            },
                        }}
                    >
                        Export
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon/>}
                        onClick={() => {
                            const id = startLoading()
                            api.get("admin/bulk-fare/otp-request")
                                .then(res => {
                                    stopLoading(id)
                                    setShowVerificationBox(true)
                                }).catch(err => {
                                handleError(err)
                                stopLoading(id)
                            })

                        }}
                        sx={{
                            backgroundColor: "#3f51b5", color: "#fff", "&:hover": {
                                backgroundColor: "#303f9f",
                            },
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>


            {showVerificationBox && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        padding: 2,
                        border: "2px solid rgb(210, 25, 25)",
                        borderRadius: "8px",
                        backgroundColor: "rgb(255, 228, 228)",
                    }}
                >
                    <TextField
                        label="Confirm Code 01"
                        value={code1}
                        onChange={(e) => setCode1(e.target.value)}
                        size="small"
                        sx={{minWidth: 200, backgroundColor: "white"}}
                    />
                    <TextField
                        label="Confirm Code 02"
                        value={code2}
                        onChange={(e) => setCode2(e.target.value)}
                        size="small"
                        sx={{minWidth: 200, backgroundColor: "white"}}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{height: "40px"}}
                        onClick={handleSave}
                    >
                        Confirm
                    </Button>
                </Box>
            )}


            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                <TableCell sx={{py: 1}}>Route</TableCell>
                                <TableCell sx={{py: 1}} align="right">Current Fare</TableCell>
                                <TableCell sx={{py: 1}} align="center">=</TableCell>
                                <TableCell sx={{py: 1}} align="right">New Fare</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {routes
                                .slice(startIndex, startIndex + rowsPerPage)

                                .map((route) => (<TableRow key={route.id}>
                                    <TableCell sx={{py: 0}}>{route.name}</TableCell>
                                    <TableCell sx={{py: 0}} align="right">
                                        <TextField
                                            disabled
                                            value={`LKR ${route.oldFare}`}
                                            size="small"
                                            sx={{width: 150}}
                                        />
                                    </TableCell>
                                    <TableCell sx={{py: 0}} align="center">=</TableCell>
                                    <TableCell sx={{py: 0}} align="right">

                                        <TextField
                                            value={route.newFare}
                                            onChange={(e) => handleFareChange(route.id, e.target.value)}
                                            size="small"

                                            sx={{width: 150}}
                                            InputProps={{
                                                startAdornment: <InputAdornment
                                                    position="start">LKR</InputAdornment>
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>))}
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


            <Modal
                open={seatModalOpen}
                onClose={handleClose}
                aria-labelledby="seat-details-modal"
            >
                <Box
                    sx={{
                        position: "fixed",
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Paper
                        sx={{
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            border: "2px solid gray",
                            borderRadius: "10px",
                            maxHeight: "90vh",
                            overflow: "auto",
                        }}
                    >
                        <div
                            id="draggable-modal-header"
                            style={{
                                padding: "16px",
                                backgroundColor: "#f5f5f5",
                                borderBottom: "1px solid #ddd",
                                borderRadius: "8px 8px 0 0",
                            }}
                        >
                            <Box
                                sx={{
                                    p: 4,
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{marginBottom: 2}}>
                                    Service Changes Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            value={charges.service_charge_ctb??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    service_charge_ctb: parseFloat(evt.target.value) || 0,
                                                }))}
                                            label="Service Charge CTB"
                                            name="serviceChargeCTB"
                                            type="number"
                                            // value={seatDetails.serviceChargeCTB}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <InputAdornment position="start">
                                                            LKR
                                                        </InputAdornment>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Service Charge HGH"
                                            name="serviceChargeHGH"
                                            value={charges.service_charge_hgh??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    service_charge_hgh: parseFloat(evt.target.value) || 0,
                                                }))}
                                            type="number"
                                            // value={seatDetails.serviceChargeHGH}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <InputAdornment position="start">
                                                            LKR
                                                        </InputAdornment>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="VAT"
                                            name="vat"
                                            value={charges.vat??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    vat: parseFloat(evt.target.value) || 0,
                                                }))}
                                            type="number"
                                            // value={seatDetails.vat}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start"></InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">%</InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Discount"
                                            name="discount"
                                            value={charges.discount??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    discount: parseFloat(evt.target.value) || 0,
                                                }))}
                                            type="number"
                                            // value={seatDetails.discount}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start"></InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">%</InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Bank Charges"
                                            name="bankCharges"
                                            value={charges.bank_charges??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    bank_charges: parseFloat(evt.target.value) || 0,
                                                }))}
                                            type="number"
                                            // value={seatDetails.bankCharges}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start"></InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">%</InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Service Charge 01"
                                            name="serviceCharge01"
                                            value={charges.service_charge01??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    service_charge01: parseFloat(evt.target.value) || 0,
                                                }))}
                                            type="number"
                                            // value={seatDetails.serviceCharge01}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <InputAdornment position="start">
                                                            LKR
                                                        </InputAdornment>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Service Charge 02"
                                            name="serviceCharge02"
                                            value={charges.service_charge02??0}
                                            onChange={evt =>
                                                setCharges(prev => ({
                                                    ...prev,
                                                    service_charge02: parseFloat(evt.target.value) || 0,
                                                }))}
                                            type="number"
                                            // value={seatDetails.serviceCharge02}
                                            // onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <InputAdornment position="start">
                                                            LKR
                                                        </InputAdornment>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        mt: 2,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={()=>{
                                            const id=startLoading()
                                            api.post("admin/bulk-fare/save-charges", charges)
                                                .then(()=>{
                                                    stopLoading(id)
                                                    sendAlert("success")
                                                    loadCharges()
                                                    handleClose()
                                                }).catch(err=>{
                                                stopLoading(id)
                                                handleError(err)
                                            })
                                        }}
                                        sx={{marginRight: "8px"}}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleClose}
                                        sx={{backgroundColor: "gray"}}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </div>
                    </Paper>
                </Box>
            </Modal>
        </Box>
    </Container>);
};

export default ManageFare;
