import React, { useState } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageBusFacilities = () => {
    const [facilities, setFacilities] = useState([
        { id: 1, name: 'Wi-Fi', icon: 'wifi.png' },
        { id: 2, name: 'Air Conditioning', icon: 'ac.png' },
    ]);
    const [open, setOpen] = useState(false);
    const [currentFacility, setCurrentFacility] = useState(null);
    const [currentFacilityUpdate, setCurrentFacilityUpdate] = useState(null);

    const handleOpen = (facility) => {
        setCurrentFacilityUpdate(facility);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentFacilityUpdate(null);
        setOpen(false);
    };

    const handleSave = () => {
        setFacilities((prev) =>
            prev.map((facility) =>
                facility.id === currentFacility.id ? currentFacility : facility
            )
        );
        handleClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFacilityUpdate({ ...currentFacilityUpdate, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCurrentFacility({ ...currentFacility, icon: imageUrl });
        }
    };
    const handleImageChange2 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCurrentFacilityUpdate({ ...currentFacilityUpdate, icon: imageUrl });
        }
    };

    const handleDelete = (id) => {
        setFacilities((prev) => prev.filter((facility) => facility.id !== id));
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {/* Title Section */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '20px' }}>
                    Manage Bus Facilities
                </Typography>

                {/* Facility Form Section */}
                <Box component="form" sx={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Facility Name"
                                variant="outlined"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {/* <AccountCircleIcon /> */}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    padding: '12px 24px',
                                    fontWeight: 'bold',
                                    backgroundColor: 'gray',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: 'gray',
                                    },
                                }}
                            >
                                Choose Icon
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {currentFacility?.icon && (
                                <Box sx={{ marginLeft: '10px' }}>
                                    <img
                                        src={currentFacility.icon}
                                        alt="Facility Icon"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                padding: '12px 24px',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#303f9f',
                                },
                            }}
                        >
                            Add Facility
                        </Button>
                    </Box>
                </Box>

                {/* Facility Table Section */}
                <Typography variant="h6" sx={{ marginTop: '40px', marginBottom: '20px' }}>
                    All Facilities
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Facility Name</TableCell>
                                <TableCell>Icon</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facilities.map((facility) => (
                                <TableRow key={facility.id}>
                                    <TableCell>{facility.name}</TableCell>
                                    <TableCell>
                                        <img
                                            src={facility.icon}
                                            alt={facility.name}
                                            style={{ width: '40px', height: '40px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(facility)}
                                            sx={{ marginRight: '8px' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(facility.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit Facility Modal */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid gray',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '10px',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Edit Facility
                        </Typography>
                        <TextField
                            fullWidth
                            label="Facility Name"
                            variant="outlined"
                            name="name"
                            value={currentFacilityUpdate?.name || ''}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '16px' }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom:'30px'}}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    padding: '12px 24px',
                                    fontWeight: 'bold',
                                    backgroundColor: 'gray',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: 'gray',
                                    },
                                }}
                            >
                                Choose Icon
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange2}
                                />
                            </Button>
                            {currentFacilityUpdate?.icon && (
                                <Box sx={{ marginLeft: '10px' }}>
                                    <img
                                        src={currentFacilityUpdate.icon}
                                        alt="Facility Icon"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
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
            </Box>
        </Container>
    );
};

export default ManageBusFacilities;