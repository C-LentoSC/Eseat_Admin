import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Switch,
    TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
// import UploadIcon from "@mui/icons-material/Upload";
// import DownloadIcon from "@mui/icons-material/Download";

// import LoadingOverlay from './Parts/LoadingOverlay';

const ManageRegions = () => {
    
    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


    const [regions, setRegions] = useState([]);//
    const [alert, setAlert] = useState(null)
    const [addmodel, setAddmodel] = useState(false);

    const [filterRegionName,setFilterRegionName] = useState("");
    const [filterMobile,setFilterMobile] = useState("");
    const [filterEmail,setFilterEmail] = useState("");

    const [regionName, setRegionName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [currentRegion, setCurrentRegion] = useState(null);
    const loadRegions = () => {
        api.get('admin/region/all')
            .then(res => {
                setRegions(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        loadRegions()
    }, []);
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    // Add new region
    const handleAddRegion = () => {
        if (regionName && mobile && address && email) {
            const newRegion = {
                regionName,
                mobile,
                address,
                email,
                description,

            };
            api.post('admin/region/add', newRegion)
                .then(res => {
                    handleClose();
                    loadRegions()
                    setRegionName("");
                    setMobile("");
                    setAddress("");
                    setEmail("");
                    setDescription("");
                    sendAlert('added')
                })
                .catch(handleError)

        }
    };

    // Open Edit Modal
    const handleOpen = (region) => {
        setCurrentRegion(region);
        setOpen(true);
    };

    // Close Modal
    const handleClose = () => {
        setCurrentRegion(null);
        setOpen(false);
        setAddmodel(false);
        setRegionName("")
        setMobile("")
        setEmail("")
        setAddress("")
        setDescription("")
    };

    // Save Edited Region
    const handleSave = () => {
        api.post('admin/region/edit', currentRegion)
            .then(res => {
                loadRegions()
                sendAlert('updated')
                handleClose();
            })
            .catch(handleError)
    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRegion({ ...currentRegion, [name]: value });
    };

    // Delete Region
    const handleDelete = (id) => {
        api.post('admin/region/delete', { id })
            .then(res => {
                loadRegions()
                sendAlert('deleted')
            })
            .catch(handleError)
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        api.post('admin/region/toggle-status', { id })
            .then(res => {
                loadRegions()
            })
            .catch(handleError)
    };

    // Export to CSV
    // const handleExport = () => {
    //     const escapeCSV = (field) => {
    //         if (field === null || field === undefined) return '""';
    //         // Convert to string and check if escaping is needed
    //         const stringField = String(field);
    //         if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    //             return `"${stringField.replace(/"/g, '""')}"`;
    //         }
    //         return stringField;
    //     };

    //     // Convert regions to CSV rows with proper escaping
    //     const csvData = regions.map((region) => {
    //         const fields = [
    //             region.regionName,
    //             region.mobile,
    //             region.email,
    //             region.address,
    //             region.description,
    //             region.active ? "Active" : "Inactive"
    //         ];
    //         return fields.map(escapeCSV).join(',');
    //     });

    //     // Add header row
    //     const headers = ["Region Name", "Mobile", "Email", "Address", "Description", "Status"];
    //     const csvContent = [headers.map(escapeCSV).join(',')]
    //         .concat(csvData)
    //         .join('\n');

    //     // Create and trigger download
    //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.download = "regions.csv";
    //     link.click();
    // };
    // Import from CSV with proper parsing
    // const handleImport = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         // Helper function to parse CSV line considering quotes
    //         const parseCSVLine = (line) => {
    //             const fields = [];
    //             let field = '';
    //             let inQuotes = false;

    //             for (let i = 0; i < line.length; i++) {
    //                 const char = line[i];

    //                 if (char === '"') {
    //                     if (inQuotes && line[i + 1] === '"') {
    //                         // Handle escaped quotes
    //                         field += '"';
    //                         i++; // Skip next quote
    //                     } else {
    //                         // Toggle quote state
    //                         inQuotes = !inQuotes;
    //                     }
    //                 } else if (char === ',' && !inQuotes) {
    //                     // End of field
    //                     fields.push(field.trim());
    //                     field = '';
    //                 } else {
    //                     field += char;
    //                 }
    //             }

    //             // Add the last field
    //             fields.push(field.trim());
    //             return fields;
    //         };

    //         // Split into lines and remove empty lines
    //         const csvLines = event.target.result.split('\n').filter(line => line.trim());

    //         // Skip header row and process data rows
    //         const newRegions = csvLines.slice(1).map(line => {
    //             const [regionName, mobile, address, email, description, status] = parseCSVLine(line);

    //             if (regionName && mobile && address && email && description) {
    //                 return {
    //                     id: Date.now() + Math.random(),
    //                     regionName,
    //                     mobile,
    //                     address,
    //                     email,
    //                     description,
    //                     active: status?.trim() === "Active"
    //                 };
    //             }
    //             return null;
    //         }).filter(region => region !== null);

    //         setRegions(prev => [...prev, ...newRegions]);
    //     };
    //     reader.readAsText(file);
    // };


    const filteredoption = regions.filter(option => {
        const nameMatch = !filterRegionName || option.regionName.toLowerCase().includes(filterRegionName.toLowerCase());
        const nameMatch2 = !filterMobile|| option.mobile.toLowerCase().includes(filterMobile.toLowerCase());
        const nameMatch3 = !filterEmail|| option.email.toLowerCase().includes(filterEmail.toLowerCase());
        return nameMatch && nameMatch2 && nameMatch3;
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
            
             {/* <LoadingOverlay show={loading} /> */}
             
             {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                setOpen={setAlert} /> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                {/* <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Manage Regions
                </Typography> */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '20px' }}>
                    Manage Regions
                </Typography>


                {/* Registration Form Section */}
                <Modal open={addmodel} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: "90%",
                            maxWidth: 600,
                            bgcolor: 'background.paper',
                            border: '2px solid gray',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '10px',
                        }}
                    >

                        <Typography variant="h6" gutterBottom>
                            Add Region
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Region Name"
                                    variant="outlined"
                                    required
                                    value={regionName}
                                    onChange={(e) => setRegionName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile"
                                    variant="outlined"
                                    required
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                        </Grid>


                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddRegion}
                                sx={{ marginRight: '8px' }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                                sx={{ backgroundColor: 'gray' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                <Box sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    mt: 3,
                    flexWrap: "wrap",
                    gap: 2
                }}>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
                        <TextField
                            label="Region Name"
                            value={filterRegionName}
                            onChange={(e) => setFilterRegionName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 200,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="Mobile"
                            value={filterMobile}
                            onChange={(e) => setFilterMobile(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 200,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                        <TextField
                            label="Email"
                            value={filterEmail}
                            onChange={(e) => setFilterEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 200,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => setAddmodel(true)}
                        sx={{
                            padding: "6px 24px",
                            fontWeight: "bold",
                            borderRadius: "4px",
                            height: "40px",
                            backgroundColor: "#3f51b5",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#303f9f",
                            },
                        }}
                    >
                        Add Region
                    </Button>
                </Box>


                {/* <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "50px",
                        marginBottom: "20px",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">
                        All Regions
                    </Typography>

                     <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#388e3c",
                                },
                            }}
                        >
                            Import
                            <input type="file" accept=".csv" hidden onChange={handleImport} />
                        </Button>
                    </Box>
                </Box>  */}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Region Name</TableCell>
                                <TableCell sx={{ py: 1 }}>Mobile</TableCell>
                                <TableCell sx={{ py: 1 }}>Email</TableCell>
                                <TableCell sx={{ py: 1 }}>Address</TableCell>
                                <TableCell sx={{ py: 1 }}>Description</TableCell>
                                <TableCell sx={{ py: 1 }}>Status</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredoption
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((region) => (
                                    <TableRow key={region.id}>
                                        <TableCell sx={{ py: 0 }}>{region.regionName}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{region.mobile}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{region.email}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{region.address}</TableCell>
                                        <TableCell sx={{ py: 0 }}>{region.description}</TableCell>
                                        <TableCell sx={{ py: 0 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={region.active}
                                                        onChange={() => handleActiveChange(region.id)}
                                                    />
                                                }
                                                label={region.active ? "Active" : "Inactive"}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpen(region)}
                                                sx={{ marginRight: "8px" }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(region.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredoption.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>

                {/* Edit Modal */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid gray",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: "10px",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Edit Region
                        </Typography>
                        <TextField
                            fullWidth
                            label="Region Name"
                            variant="outlined"
                            name="regionName"
                            value={currentRegion?.regionName || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Mobile"
                            variant="outlined"
                            name="mobile"
                            value={currentRegion?.mobile || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={currentRegion?.email || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            variant="outlined"
                            name="address"
                            value={currentRegion?.address || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            name="description"
                            multiline
                            rows={4}
                            value={currentRegion?.description || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{ marginRight: "8px" }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleClose}
                                sx={{
                                    backgroundColor: 'gray',
                                    "&:hover": {
                                        backgroundColor: "#666",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default ManageRegions;