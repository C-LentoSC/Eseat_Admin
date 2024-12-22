import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import UploadIcon from "@mui/icons-material/Upload";
// import DownloadIcon from "@mui/icons-material/Download";

const ManageRegions = () => {
    const [regions, setRegions] = useState([
        {
            id: 1,
            regionName: "Western Region",
            mobile: "0771234567",
            address: "123 Main St, Colombo",
            email: "western@example.com",
            description: "Western province region",
            active: true,
        },
        {
            id: 2,
            regionName: "Eastern Region",
            mobile: "0777654321",
            address: "456 Beach Rd, Batticaloa",
            email: "eastern@example.com",
            description: "Eastern province region",
            active: false,
        },
    ]);

    const [regionName, setRegionName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [currentRegion, setCurrentRegion] = useState(null);

    // Add new region
    const handleAddRegion = () => {
        if (regionName && mobile && address && email && description) {
            const newRegion = {
                id: Date.now(),
                regionName,
                mobile,
                address,
                email,
                description,
                active: true,
            };
            setRegions((prev) => [...prev, newRegion]);
            setRegionName("");
            setMobile("");
            setAddress("");
            setEmail("");
            setDescription("");
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
    };

    // Save Edited Region
    const handleSave = () => {
        setRegions((prev) =>
            prev.map((region) =>
                region.id === currentRegion.id ? { ...currentRegion } : region
            )
        );
        handleClose();
    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRegion({ ...currentRegion, [name]: value });
    };

    // Delete Region
    const handleDelete = (id) => {
        setRegions((prev) => prev.filter((region) => region.id !== id));
    };

    // Toggle Active/Inactive
    const handleActiveChange = (id) => {
        setRegions((prev) =>
            prev.map((region) =>
                region.id === id ? { ...region, active: !region.active } : region
            )
        );
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

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Manage Regions
                </Typography>

                {/* Form Section */}
                <Box component="form" sx={{ width: "100%" }}>
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
                                required
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddRegion}
                            sx={{
                                padding: "12px 24px",
                                fontWeight: "bold",
                                borderRadius: "4px",
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
                </Box>

                <Box
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

                    {/* <Box sx={{
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
                    </Box> */}
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Region Name</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {regions.map((region) => (
                                <TableRow key={region.id}>
                                    <TableCell>{region.regionName}</TableCell>
                                    <TableCell>{region.mobile}</TableCell>
                                    <TableCell>{region.email}</TableCell>
                                    <TableCell>{region.address}</TableCell>
                                    <TableCell>{region.description}</TableCell>
                                    <TableCell>
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
                                    <TableCell align="right">
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
                                sx={{
                                    marginRight: '8px',
                                    backgroundColor: "#3f51b5",
                                    "&:hover": {
                                        backgroundColor: "#303f9f",
                                    },
                                }}
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