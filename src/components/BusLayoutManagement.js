import React, { useState, useEffect } from "react";
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
    InputAdornment,
    IconButton,
    Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Draggable from 'react-draggable';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

// import ChairIcon from "@mui/icons-material/Chair";


const BusLayoutManagement = () => {


    // Sample data
    const [layouts, setLayouts] = useState([]);
    const loadLayOuts = () => {
        api.get('admin/seat-layout/get-all')
            .then(res => {
                setLayouts(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        loadLayOuts()
    }, [])
    // States
    const [selectedBusType, setSelectedBusType] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentLayout, setCurrentLayout] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newLayout, setNewLayout] = useState({
        layoutName: "",
        busType: "",
        seatsCount: 0,
        description: "",
        seatDetails: {}
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})



    const initialSeatDetails = {
        seatNumber: "",
        serviceChargeCTB: "",
        serviceChargeHGH: "",
        // corporateTax: "",
        vat: "",
        discount: "",
        // agentCommission: "",
        bankCharges: "",
        serviceCharge01: "",
        serviceCharge02: ""
    };

    // Seat selection states
    const [seatModalOpen, setSeatModalOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatDetails, setSeatDetails] = useState(initialSeatDetails);

    // Update seat count when seatDetails change
    useEffect(() => {
        const selectedSeatsCount = Object.keys(newLayout.seatDetails).length;
        setNewLayout(prev => ({
            ...prev,
            seatsCount: selectedSeatsCount
        }));
    }, [newLayout?.seatDetails]);

    const busTypes = [
        "Luxury Buses",
        "Semi Luxury",
        "Super Luxury",
        "Normal Buses"
    ];

    // Handlers
    const handleCreateLayout = () => {
        setNewLayout({
            layoutName: "",
            busType: "",
            seatsCount: 0,
            description: "",
            seatDetails: {}
        });
        setCreateModalOpen(true);
    };


    const handleView = (layout) => {
        setCurrentLayout(layout);
        setIsEditMode(false);
        setOpen(true);
    };

    const handleEdit = (layout) => {
        setCurrentLayout(layout);
        setNewLayout(layout);
        setIsEditMode(true);
        setCreateModalOpen(true);
    };

    const handleSeatClick = (seatId) => {
        if (currentStep === 1) {
            // Step 1: Only select/deselect seats
            setNewLayout(prev => {
                const updatedDetails = { ...prev.seatDetails };
                if (updatedDetails[seatId]) {
                    delete updatedDetails[seatId];
                } else {
                    updatedDetails[seatId] = { seatNumber: "" };
                }
                return { ...prev, seatDetails: updatedDetails };
            });
        } else if (currentStep === 2) {
            // Step 2: Open seat details modal
            setSelectedSeat(seatId);
            setSeatModalOpen(true);
            if (newLayout.seatDetails[seatId]) {
                setSeatDetails(newLayout.seatDetails[seatId]);
            } else {
                setSeatDetails(initialSeatDetails);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSeatDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveSeatDetails = () => {
        setNewLayout(prev => ({
            ...prev,
            seatDetails: {
                ...prev.seatDetails,
                [selectedSeat]: seatDetails
            }
        }));
        handleClose();
    };

    const handleSaveLayout = () => {
        if (newLayout.layoutName === '' || newLayout.busType === '' ) {
            sendAlert("Please fill in all required fields.");
        } else {
            if (isEditMode) {
                // setLayouts(prev =>
                //     prev.map(layout =>
                //         layout.id === currentLayout.id ? { ...newLayout, id: layout.id } : layout
                //     )
                // );
                api.post('admin/seat-layout/edit', newLayout)
                    .then(res => {
                        loadLayOuts()
                        sendAlert('layout is updated')
                    })
                    .catch(handleError)
            } else {
                const layoutToSave = {
                    ...newLayout,
                    id: layouts.length + 1,
                };
                // setLayouts(prev => [...prev, layoutToSave]);
                api.post('admin/seat-layout/add-new', layoutToSave)
                    .then(res => {
                        loadLayOuts()
                        sendAlert('a new layout is added')
                    })
                    .catch(handleError)
            }
            setCreateModalOpen(false);
            setIsEditMode(false);
            setNewLayout({
                layoutName: "",
                busType: "",
                seatsCount: 0,
                description: "",
                seatDetails: {}
            });
            setCurrentStep(1);
        }
    };

    // Step navigation handlers
    const handleNextStep = () => {
        if (Object.keys(newLayout.seatDetails).length === 0) {
            alert("Please select at least one seat");
            return;
        }
        setCurrentStep(2);
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };


    const renderModalContent = () => (
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 1200,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
            border: "2px solid gray",
            maxHeight: '90vh',
            overflow: 'auto',
        }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {isEditMode ? 'Edit Layout' : 'Create New Layout'} - Step {currentStep}
            </Typography>

            {currentStep === 1 && (
                <>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Layout Name"
                                value={newLayout.layoutName}
                                onChange={(e) => setNewLayout(prev => ({
                                    ...prev,
                                    layoutName: e.target.value
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                value={newLayout.busType}
                                onChange={(event, newValue) => setNewLayout(prev => ({
                                    ...prev,
                                    busType: newValue
                                }))}
                                options={busTypes}
                                renderInput={(params) => (
                                    <TextField {...params} label="Bus Type" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Seats Count"
                                value={newLayout.seatsCount}
                                disabled
                                helperText="Automatically calculated based on selected seats"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={2}
                                value={newLayout.description}
                                onChange={(e) => setNewLayout(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" gutterBottom>
                        Select Seats
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Box sx={{ mb: 4, maxWidth: 700, width: '100%' }}>
                            {renderSeatGrid()}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextStep}
                            sx={{ marginRight: "8px" }}
                        >
                            Next Step
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setCreateModalOpen(false);
                                setIsEditMode(false);
                                setNewLayout({
                                    layoutName: "",
                                    busType: "",
                                    seatsCount: 0,
                                    description: "",
                                    seatDetails: {}
                                });
                                setCurrentStep(1);
                            }}
                            sx={{ backgroundColor: 'gray' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </>
            )}

            {currentStep === 2 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Box sx={{ mb: 4, maxWidth: 700, width: '100%' }}>
                                {renderSeatGrid()}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handlePrevStep}
                                sx={{ marginRight: "8px" }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveLayout}
                                sx={{ marginRight: "8px" }}
                            >
                                Save Layout
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    setCreateModalOpen(false);
                                    setIsEditMode(false);
                                    setNewLayout({
                                        layoutName: "",
                                        busType: "",
                                        seatsCount: 0,
                                        description: "",
                                        seatDetails: {}
                                    });
                                    setCurrentStep(1);
                                }}
                                sx={{ backgroundColor: 'gray' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Box>
    );


    // Calculate seat count based on selected seats
    useEffect(() => {
        const selectedSeatsCount = Object.keys(newLayout.seatDetails).length;
        setNewLayout(prev => ({
            ...prev,
            seatsCount: selectedSeatsCount
        }));
    }, [newLayout.seatDetails]);

    // Render seat grid for viewing
    const renderViewSeatGrid = (layout) => {
        const rows = 6;
        const cols = 13;
        const grid = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const seatId = `seat-${i}-${j}`;
                const seatInfo = layout.seatDetails[seatId];

                // Add seat (selected or empty) to the grid
                grid.push(
                    seatInfo ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={seatId} className="relative m-1" onClick={() => handleViewSeatDetails(seatInfo)}>
                            <SeatIcon isSelected={!!seatInfo} />
                            {seatInfo?.seatNumber && (
                                <span style={{ left: "11px", bottom: "15px", fontWeight: "bold", color: "#FFFFFF" }} className="absolute text-xs font-medium cursor-pointer">
                                    {seatInfo.seatNumber}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div key={seatId} >
                            <EmpltySeatIcon />
                        </div>
                    )
                );
            }
        }

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    // gap: '10px',
                    marginTop: '10px'
                }}
            >
                {grid}
            </div>
        );
    };


    // Add handler for viewing seat details
    const [selectedViewSeat, setSelectedViewSeat] = useState(null);

    const handleViewSeatDetails = (seatInfo) => {
        setSelectedViewSeat(seatInfo);
    };

    // Add the seat details display component
    const SeatDetailsDisplay = () => {
        if (!selectedViewSeat) return (
            <Box sx={{ mt: 0, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>
                    Selected Seat Details -
                </Typography>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>Service Charge CTB: </Typography>
                        <Typography marginTop={1}>Service Charge HGH: </Typography>
                        {/* <Typography marginTop={1}>Corporate Tax: </Typography> */}
                        <Typography marginTop={1}>VAT: </Typography>
                        <Typography marginTop={1}>Discount: </Typography>
                        {/* <Typography marginTop={1}>Agent Commission: </Typography> */}
                        <Typography marginTop={1}>Bank Charges: </Typography>

                        <Typography marginTop={1}>Service Charge 01: </Typography>
                        <Typography marginTop={1}>Service Charge 02: </Typography>

                    </Grid>
                </Grid>
            </Box>
        );

        return (
            <Box sx={{ mt: 0, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>
                    Selected Seat Details - {selectedViewSeat.seatNumber}
                </Typography>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>Service Charge CTB: {selectedViewSeat.serviceChargeCTB}</Typography>
                        <Typography marginTop={1}>Service Charge HGH: {selectedViewSeat.serviceChargeHGH}</Typography>
                        {/* <Typography marginTop={1}>Corporate Tax: {selectedViewSeat.corporateTax}</Typography> */}
                        <Typography marginTop={1}>VAT: {selectedViewSeat.vat}</Typography>
                        <Typography marginTop={1}>Discount: {selectedViewSeat.discount}</Typography>
                        {/* <Typography marginTop={1}>Agent Commission: {selectedViewSeat.agentCommission}</Typography> */}
                        <Typography marginTop={1}>Bank Charges: {selectedViewSeat.bankCharges}</Typography>

                        <Typography marginTop={1}>Service Charge 01: {selectedViewSeat.serviceCharge01}</Typography>
                        <Typography marginTop={1}>Service Charge 02: {selectedViewSeat.serviceCharge02}</Typography>

                    </Grid>
                </Grid>
            </Box>
        );
    };

    // Update the view modal content
    const ViewModal = () => (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="layout-modal"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 1200,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh',
                overflow: 'auto',
                border: "2px solid gray",
                borderRadius: "10px",
            }}>
                <Typography variant="h6" gutterBottom>
                    View Layout Details
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 2 }}>
                            {currentLayout && renderViewSeatGrid(currentLayout)}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <SeatDetailsDisplay />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
    );

    const SeatIcon = ({ isSelected }) => (
        <div className="relative flex flex-col items-center">
            <svg
                viewBox="0 0 100 100"
                className={`w-12 h-12 cursor-pointer transition-colors duration-200 ${isSelected ? 'text-green-600' : 'text-gray-000'
                    }`}
            >
                <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
                    <path d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z" fill="currentColor" />
                </g>
            </svg>
        </div>
    );
    const EmpltySeatIcon = () => (
        <div className="relative flex flex-col items-center">
            <svg
                viewBox="0 0 100 100"
                className={`w-12 h-12 cursor-pointer transition-colors duration-200}`}
                style={{ visibility: "hidden" }}
            >
                <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
                    <path d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z" fill="currentColor" />
                </g>
            </svg>
        </div>
    );

    // Generate 6x13 grid of seats
    const renderSeatGrid = () => {
        const rows = 6;
        const cols = 13;
        const grid = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const seatId = `seat-${i}-${j}`;
                const seatInfo = newLayout.seatDetails[seatId];

                if (currentStep === 1) {
                    grid.push(
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            key={seatId}
                            className="relative m-1"
                            onClick={() => handleSeatClick(seatId)}>
                            <SeatIcon isSelected={!!seatInfo} />
                            <span style={{ left: "11px", bottom: "15px", fontWeight: "bold", color: "#FFFFFF" }}
                                className="absolute text-xs font-medium cursor-pointer">
                                {seatInfo?.seatNumber || ''}
                            </span>
                        </div>
                    );
                } else if (currentStep === 2 && seatInfo) {
                    grid.push(
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            key={seatId}
                            className="relative m-1"
                            onClick={() => handleSeatClick(seatId)}>
                            <SeatIcon isSelected={true} />
                            <span style={{ left: "11px", bottom: "15px", fontWeight: "bold", color: "#FFFFFF" }}
                                className="absolute text-xs font-medium cursor-pointer">
                                {seatInfo?.seatNumber || ''}
                            </span>
                        </div>
                    );
                } else {
                    grid.push(
                        <div key={seatId}>
                            <EmpltySeatIcon />
                        </div>
                    );
                }
            }
        }

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    marginTop: '10px'
                }}
            >
                {grid}
            </div>
        );
    };

    // Filtered layouts based on selected bus type
    const filteredLayouts = selectedBusType
        ? layouts.filter(layout => layout.busType === selectedBusType)
        : layouts;

    // Handlers
    const handleBusTypeChange = (event, newValue) => {
        setSelectedBusType(newValue);
    };

    const handleClose = () => {
        setSeatModalOpen(false);
        setOpen(false);
        setSelectedSeat(null);
        setSelectedViewSeat(null);
        setSeatDetails(initialSeatDetails);
    };

    const handleDelete = (id) => {
        api.post('admin/seat-layout/delete', {id})
            .then(res => {
                loadLayOuts()
                sendAlert('deleted')
            })
            .catch(handleError)
    };

    return (
        <Container component="main" maxWidth="lg">
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                                                        setOpen={setAlert}/> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Layout Management for Bus Seat Structures
                </Typography>

                {/* Filter and Add Button Section */}
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    mt: 3,
                }}>
                    <Box sx={{ width: "300px" }}>
                        <Autocomplete
                            value={selectedBusType}
                            onChange={handleBusTypeChange}
                            options={busTypes}
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '40px',
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateLayout}
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
                        Add New Layout
                    </Button>
                </Box>

                {/* Table Section */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Layout Name</TableCell>
                                <TableCell>Bus Type</TableCell>
                                <TableCell align="center">Seats Count</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLayouts.map((layout) => (
                                <TableRow key={layout.id}>
                                    <TableCell>{layout.layoutName}</TableCell>
                                    <TableCell>{layout.busType}</TableCell>
                                    <TableCell align="center">{layout.seatsCount}</TableCell>
                                    <TableCell>{layout.description}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="info"
                                            onClick={() => handleView(layout)}
                                            sx={{ marginRight: "8px" }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(layout)}
                                            sx={{ marginRight: "8px" }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(layout.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Create/Edit Layout Modal */}
                <Modal
                    open={createModalOpen}
                    onClose={() => {
                        setCreateModalOpen(false);
                        setIsEditMode(false);
                        setNewLayout({
                            layoutName: "",
                            busType: "",
                            seatsCount: 0,
                            description: "",
                            seatDetails: {}
                        });
                    }}

                >
                    {renderModalContent()}


                </Modal>

                <Modal
                    open={seatModalOpen}
                    onClose={handleClose}
                    aria-labelledby="seat-details-modal"
                >
                    <Box sx={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.5)'
                    }}>
                        <Draggable
                            handle="#draggable-modal-header"
                            positionOffset={{ x: '-50%', y: '-50%' }}
                            defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
                        >
                            <Paper sx={{
                                position: 'absolute',
                                width: 600,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                border: "2px solid gray",
                                borderRadius: "10px",
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }}>
                                <div id="draggable-modal-header" style={{
                                    cursor: 'move',
                                    padding: '16px',
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: '1px solid #ddd',
                                    borderRadius: '8px 8px 0 0'
                                }}>
                                    <Box sx={{
                                        p: 4,
                                    }}>
                                        <Typography variant="h6" gutterBottom>
                                            Seat Details - {selectedSeat}
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Seat Number"
                                                    name="seatNumber"
                                                    value={seatDetails.seatNumber}
                                                    onChange={handleInputChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Service Charge CTB"
                                                    name="serviceChargeCTB"
                                                    type="number"
                                                    value={seatDetails.serviceChargeCTB}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <InputAdornment position="start">LKR</InputAdornment>
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
                                                    type="number"
                                                    value={seatDetails.serviceChargeHGH}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <InputAdornment position="start">LKR</InputAdornment>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            {/* <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Corporate Tax"
                                                    name="corporateTax"
                                                    type="number"
                                                    value={seatDetails.corporateTax}
                                                    onChange={handleInputChange}
                                                />
                                            </Grid> */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="VAT"
                                                    name="vat"
                                                    type="number"
                                                    value={seatDetails.vat}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Discount"
                                                    name="discount"
                                                    type="number"
                                                    value={seatDetails.discount}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                                    }}
                                                />
                                            </Grid>

                                            {/* <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Agent Commission"
                                                    name="agentCommission"
                                                    type="number"
                                                    value={seatDetails.agentCommission}
                                                    onChange={handleInputChange}
                                                />
                                            </Grid> */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Bank Charges"
                                                    name="bankCharges"
                                                    type="number"
                                                    value={seatDetails.bankCharges}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Service Charge 01"
                                                    name="serviceCharge01"
                                                    type="number"
                                                    value={seatDetails.serviceCharge01}
                                                    onChange={handleInputChange}
                                                     InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <InputAdornment position="start">LKR</InputAdornment>
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
                                                    type="number"
                                                    value={seatDetails.serviceCharge02}
                                                    onChange={handleInputChange}
                                                     InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <InputAdornment position="start">LKR</InputAdornment>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleSaveSeatDetails}
                                                sx={{ marginRight: "8px" }}
                                            >
                                                Save Seat
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
                                </div>
                            </Paper>
                        </Draggable>
                    </Box>

                </Modal>

                <ViewModal />
            </Box>
        </Container>
    );
};

export default BusLayoutManagement;
