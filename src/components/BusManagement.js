import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {setroutval} from "./DashboardLayoutAccount";
import {Camera, X} from 'lucide-react';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";


const BusManagement = () => {
    const DepotID = sessionStorage.getItem('currentValueID');
    // const DepotID = 2;

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})

    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);

    const [routeData, setRouteData] = useState(null);

    const [selectedLayout, setSelectedLayout] = useState(null);
    const [selectedViewSeat, setSelectedViewSeat] = useState(null);

    const [selectedRoute, setSelectedRoute] = useState("");
    const [selectedBusType, setSelectedBusType] = useState("");
    const [selectedBusCode, setSelectedBusCode] = useState("");

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBus, setSelectedBus] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newBus, setNewBus] = useState({
        scheduleNumber: "",
        busType: "",
        route: "",
        routeNo: "",
        seats: "",
        busModel: "",
        status: true,
        paymentMethods: {
            card: false, cash: false, bank: false, ezcash: false, reload: false
        },
        facilities: {
            wifi: false, usb: false, seatBelt: false, phoneCharger: false
        },
        settings: {
            onlineActive: true, agentCounter: false, autoClose: false, manualClose: true
        }
    });

    const [details, setDetails] = useState({
        depotID: DepotID, DepotName: "",
    });
    const loadInfo = () => {
        if (DepotID === '00') handleBackClick()
        api.get('admin/bus/' + DepotID + '/info')
            .then(res => {
                setDetails(res.data.data)
                setBuses(res.data.buses)
            })
            .catch(handleError)
    }


    const [routesData, setRoutesData] = useState();


    const [routes, setR] = useState([]);
    const loadAllRutes = () => {
        api.get('admin/bus/all-routes')
            .then(res => {
                const d = res.data
                setRoutesData(d.main)
                setR(d.sub)

            })
            .catch(handleError)
    }

    const [layouts, setLayOuts] = useState([{
        id: 1,
        layoutName: "2x2 Luxury Layout",
        busType: "Luxury Buses",
        seatsCount: 40,
        description: "Standard luxury bus layout with 2x2 configuration",
        seatDetails: {
            "seat-0-0": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-0-12": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-5-0": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-5-12": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-4-12": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-3-12": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-2-12": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-1-12": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-0-13": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }, "seat-0-1": {
                seatNumber: "A1",
                serviceChargeCTB: "100",
                serviceChargeHGH: "150",
                serviceChargeOther: "50",
                corporateTax: "25",
                vat: "15",
                discount: "10",
                otherCharges: "30",
                agentCommission: "75",
                bankCharges: "20"
            }
        }
    }, {
        id: 2,
        layoutName: "3x2 Normal Layout",
        busType: "Normal Buses",
        seatsCount: 50,
        description: "Standard normal bus layout with 3x2 configuration",
        seatDetails: {}
    }]);

    const [buses, setBuses] = useState([]);

    const busTypes = ["Luxury Buses", "Semi Luxury", "Super Luxury", "Normal Buses"];

    const [facilities, setFacilities] = useState([])
    const loadAllFacility = () => {
        api.get('admin/bus/all-facility')
            .then(res => setFacilities(res.data))
            .catch(handleError)
    }
    const loadLayouts = () => {
        api.get("admin/bus/all-layout")
            .then(res => {
                setLayOuts(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        loadAllFacility()
        loadAllRutes()
        loadLayouts()
        loadInfo()
    }, []);

    const [selectedFacilities, setSelectedFacilities] = useState(facilities.reduce((acc, facility) => ({
        ...acc, [facility.id]: false
    }), {}));

    const handleFacilityChange = (facilityId) => {
        setSelectedFacilities(prev => ({
            ...prev,

            [facilityId]: !prev[facilityId]

        }));
    };

    const handleMainImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setMainImage(URL.createObjectURL(file));
        }
    };

    const handleOtherImagesUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setOtherImages([...otherImages, ...newImages]);
    };

    const removeOtherImage = (index) => {
        setOtherImages(otherImages.filter((_, i) => i !== index));
    };

    const handleViewSeatDetails = (seatInfo) => {
        setSelectedViewSeat(seatInfo);
    };

    const handleBackClick = () => {
        setroutval('/activeDepot', '00');
    };

    // Updated filtering logic
    const filteredBuses = buses.filter(bus => {
        const routeMatch = !selectedRoute || bus.route === selectedRoute;
        const typeMatch = !selectedBusType || bus.busType === selectedBusType;
        const codeMatch = !selectedBusCode || bus.scheduleNumber.toLowerCase().includes(selectedBusCode.toLowerCase());
        return routeMatch && typeMatch && codeMatch;
    });

    const handleRouteChange = (_, selectedRoute) => {
        if (selectedRoute) {
            setRouteData(routesData[selectedRoute.value]);
        } else {
            setRouteData(null);
        }
    };
    // Rest of your handlers remain the same
    const handleMenuOpen = (event, bus) => {
        setAnchorEl(event.currentTarget);
        setSelectedBus(bus);
        setMainImage(bus.images?.main || null);
        setOtherImages(bus.images?.others || []);

    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedBus(null);
    };

    const handleDelete = () => {
        api.post('admin/bus/delete', {id: selectedBus.id})
            .then(res => {
                loadInfo()
            })
            .catch(handleError)
        handleMenuClose();
    };

    const handleManageSchedules = () => {
        handleMenuClose();
        setroutval('/busSchedule', selectedBus.id);
    };

    const handleManageCrew = () => {
        handleMenuClose();
        setroutval('/crewManagement', selectedBus.id);
    };

    const handleSaveBus = async () => {
        const oi = []
        for (let i in otherImages) {
            if (otherImages[i].startsWith('blob')) {
                var f = await fetch(otherImages[i])
                var r = await f.blob()
                oi.push(r)
            } else oi.push(otherImages[i])
        }
        console.log(selectedFacilities)
        const formattedBus = {
            id: newBus.id || Math.max(...buses.map(b => b.id)) + 1,
            scheduleNumber: newBus.scheduleNumber,
            busType: newBus.busType,
            route: routeData?.route?.from + ' - ' + routeData?.route?.to || '',
            routeNo: routeData?.route?.routeNumber || '',
            seats: selectedLayout?.seatsCount || 0,
            status: newBus.status,
            busModel: newBus.busModel,
            paymentMethods: newBus.paymentMethods,
            facilities: selectedFacilities,
            depot: DepotID,
            fc: Object.entries(selectedFacilities).map((v, k) => {
                return {
                    id: v[0], value: v[1]
                }
            }),
            settings: newBus.settings,
            images: {
                main: (mainImage.startsWith('blob')) ? (await fetch(mainImage).then(res => res.blob())) : mainImage,
                others: oi
            },
            layoutId: selectedLayout?.id
        };
        if (editMode) api.post('admin/bus/edit', formattedBus, {headers: {"Content-Type": "multipart/form-data"}})
            .then(res => {
                sendAlert('updated')
                loadInfo()
                // Reset form
                setNewBus({
                    scheduleNumber: "",
                    busType: "",
                    route: "",
                    routeNo: "",
                    seats: "",
                    busModel: "",
                    status: true,
                    paymentMethods: {
                        card: false, cash: false, bank: false, ezcash: false, reload: false
                    },
                    facilities: {
                        wifi: false, usb: false, seatBelt: false, phoneCharger: false
                    },
                    settings: {
                        onlineActive: true, agentCounter: false, autoClose: false, manualClose: true
                    }
                });
                setEditMode(false)
                setSelectedLayout(null);
                setMainImage(null);
                setOtherImages([]);
                // setSelectedFacilities(facilities.reduce((acc, facility) => ({
                //     ...acc, [facility.id]: false
                // }), {}));
                setSelectedFacilities([])
                setRouteData(null);
                setAddModalOpen(false);
            })
            .catch(handleError); else api.post('admin/bus/add', formattedBus, {headers: {"Content-Type": "multipart/form-data"}})
            .then(res => {
                sendAlert('new bus is added')
                loadInfo()
                // Reset form
                setNewBus({
                    scheduleNumber: "",
                    busType: "",
                    route: "",
                    routeNo: "",
                    seats: "",
                    busModel: "",
                    status: true,
                    paymentMethods: {
                        card: false, cash: false, bank: false, ezcash: false, reload: false
                    },
                    facilities: {
                        wifi: false, usb: false, seatBelt: false, phoneCharger: false
                    },
                    settings: {
                        onlineActive: true, agentCounter: false, autoClose: false, manualClose: true
                    }
                });
                setEditMode(false)
                setSelectedLayout(null);
                setMainImage(null);
                setOtherImages([]);
                // setSelectedFacilities(facilities.reduce((acc, facility) => ({
                //     ...acc, [facility.id]: false
                // }), {}));
                setSelectedFacilities([])
                setRouteData(null);
                setAddModalOpen(false);
            })
            .catch(handleError)
    };

    const handleEdit = () => {
        const bus = selectedBus;
        const layout = layouts.find(l => l.id === bus.layoutId);

        setNewBus({
            ...bus, paymentMethods: bus.paymentMethods || {
                card: false, cash: false, bank: false, ezcash: false, reload: false
            }, settings: bus.settings || {
                onlineActive: true, agentCounter: false, autoClose: false, manualClose: true
            }
        });

        setSelectedLayout(layout);
        setSelectedFacilities(bus.facilities || {});
        setMainImage(bus.images?.main || null);
        setOtherImages(bus.images?.others || []);

        // Set route data
        const routeNumber = bus.routeNo;
        const routeData = routesData[routeNumber];
        if (routeData) {
            setRouteData(routeData);
        }
        setEditMode(true)
        setAddModalOpen(true);
        handleMenuClose();
    };
    const [editMode, setEditMode] = useState(false)

    const SeatDetailsDisplay = () => {
        if (!selectedViewSeat) return (<Box sx={{mt: 0, p: 2, border: '1px solid #ccc', borderRadius: '4px'}}>
            <Typography variant="h6" gutterBottom>
                Selected Seat Details -
            </Typography>
            <Grid container>
                <Grid item xs={12}>
                        <Typography>Service Charge CTB: </Typography>
                        <Typography marginTop={1}>Service Charge HGH: </Typography>
                        <Typography marginTop={1}>VAT: </Typography>
                        <Typography marginTop={1}>Discount: </Typography>
                        <Typography marginTop={1}>Bank Charges: </Typography>

                        <Typography marginTop={1}>Service Charge 01: </Typography>
                        <Typography marginTop={1}>Service Charge 02: </Typography>
                </Grid>
            </Grid>
        </Box>);

        return (<Box sx={{mt: 0, p: 2, border: '1px solid #ccc', borderRadius: '4px'}}>
            <Typography variant="h6" gutterBottom>
                Selected Seat Details - {selectedViewSeat.seatNumber}
            </Typography>
            <Grid container>
                <Grid item xs={12}>
                    <Typography>Service Charge CTB: {selectedViewSeat.serviceChargeCTB}</Typography>
                    <Typography marginTop={1}>Service Charge HGH: {selectedViewSeat.serviceChargeHGH}</Typography>
                    <Typography marginTop={1}>VAT: {selectedViewSeat.vat}</Typography>
                    <Typography marginTop={1}>Discount: {selectedViewSeat.discount}</Typography>
                    <Typography marginTop={1}>Bank Charges: {selectedViewSeat.bankCharges}</Typography>

                    <Typography marginTop={1}>Service Charge 01: {selectedViewSeat.serviceCharge01}</Typography>
                    <Typography marginTop={1}>Service Charge 02: {selectedViewSeat.serviceCharge02}</Typography>

                </Grid>
            </Grid>
        </Box>);
    };

    const renderViewSeatGrid = (layout) => {
        const rows = 6;
        const cols = 13;
        const grid = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const seatId = `seat-${i}-${j}`;
                const seatInfo = layout.seatDetails[seatId];

                // Add seat (selected or empty) to the grid
                grid.push(seatInfo ? (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={seatId}
                         className="relative m-1" onClick={() => handleViewSeatDetails(seatInfo)}>
                        <SeatIcon isSelected={!!seatInfo}/>
                        {seatInfo?.seatNumber && (<span style={{left: "13px", fontWeight: "bold", color: "#FFFFFF"}}
                                                        className="absolute text-xs font-medium cursor-pointer">
                                    {seatInfo.seatNumber}
                                </span>)}
                    </div>) : (<div key={seatId}>
                    <EmpltySeatIcon/>
                </div>));
            }
        }

        return (<div
            style={{
                display: 'grid', gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)`, // gap: '10px',
                marginTop: '10px'
            }}
        >
            {grid}
        </div>);
    };

    const SeatIcon = ({isSelected}) => (<div className="relative flex flex-col items-center">
        <svg
            viewBox="0 0 100 100"
            className={`w-12 h-12 cursor-pointer transition-colors duration-200 ${isSelected ? 'text-green-600' : 'text-gray-000'}`}
        >
            <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
                <path
                    d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z"
                    fill="currentColor"/>
            </g>
        </svg>
    </div>);
    const EmpltySeatIcon = () => (<div className="relative flex flex-col items-center">
        <svg
            viewBox="0 0 100 100"
            className={`w-12 h-12 cursor-pointer transition-colors duration-200}`}
            style={{visibility: "hidden"}}
        >
            <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
                <path
                    d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z"
                    fill="currentColor"/>
            </g>
        </svg>
    </div>);

    const renderBusForm = () => (<Box sx={{mt: 2}}>
        {/* Basic Info Section */}
        <Box sx={{mb: 4}}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Bus Schedule Number"
                        value={newBus.scheduleNumber}
                        onChange={(e) => setNewBus(prev => ({...prev, scheduleNumber: e.target.value}))}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                {/* <AccountCircleIcon /> */}
                            </InputAdornment>),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '40px'
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        value={newBus.busType}
                        onChange={(_, value) => setNewBus(prev => ({...prev, busType: value}))}
                        options={busTypes}
                        renderInput={(params) => (<TextField
                            {...params}
                            label="Select Bus Type"
                            InputProps={{
                                ...params.InputProps, startAdornment: (<InputAdornment position="start">
                                </InputAdornment>),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px'
                                }
                            }}
                        />)}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Bus Model"
                        value={newBus.busModel}
                        onChange={(e) => setNewBus(prev => ({...prev, busModel: e.target.value}))}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                {/* <AccountCircleIcon /> */}
                            </InputAdornment>),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '40px'
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </Box>

        <Divider sx={{my: 3}}/>

        {/* Payment Methods Section */}
        <Typography variant="h6" sx={{mb: 2}}>Payment Methods</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.paymentMethods.card}
                        onChange={(e) => setNewBus(prev => ({
                            ...prev, paymentMethods: {
                                ...prev.paymentMethods, card: e.target.checked
                            }
                        }))}
                    />}
                    label="Credit/Debit Card"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.paymentMethods.cash}
                        onChange={(e) => setNewBus(prev => ({
                            ...prev, paymentMethods: {
                                ...prev.paymentMethods, cash: e.target.checked
                            }
                        }))}
                    />}
                    label="Pay on Bus"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.paymentMethods.bank}
                        onChange={(e) => setNewBus(prev => ({
                            ...prev, paymentMethods: {
                                ...prev.paymentMethods, bank: e.target.checked
                            }
                        }))}
                    />}
                    label="Pay to Bank"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.paymentMethods.ezcash}
                        onChange={(e) => setNewBus(prev => ({
                            ...prev, paymentMethods: {
                                ...prev.paymentMethods, ezcash: e.target.checked
                            }
                        }))}
                    />}
                    label="eZCash"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.paymentMethods.reload}
                        onChange={(e) => setNewBus(prev => ({
                            ...prev, paymentMethods: {
                                ...prev.paymentMethods, reload: e.target.checked
                            }
                        }))}
                    />}
                    label="Reload"
                />
            </Grid>
        </Grid>

        <Divider sx={{my: 3}}/>

        {/* Facilities Section */}
        <Typography variant="h6" sx={{mb: 2}}>Facilities</Typography>
        <Grid container spacing={2}>
            {facilities.map((facility) => (<Grid item xs={12} sm={3} key={facility.id}>
                <FormControlLabel
                    control={<Checkbox
                        checked={selectedFacilities[facility.id] || false}
                        onChange={() => handleFacilityChange(facility.id)}
                    />}
                    label={facility.name}
                />
            </Grid>))}
        </Grid>

        <Divider sx={{my: 3}}/>

        {/* Bus Close  Section */}
        <Typography variant="h6" sx={{mb: 2}}>Bus Close</Typography>
        <Grid container spacing={2}>

            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.settings.autoClose || newBus.paymentMethods.autoClose}
                        onChange={(e) => {
                            setNewBus(prev => ({
                                ...prev, paymentMethods: {
                                    ...prev.paymentMethods, autoClose: e.target.checked
                                }
                            }))
                            setNewBus(prev => ({
                                ...prev, settings: {
                                    ...prev.settings, autoClose: e.target.checked
                                }
                            }))
                        }}
                    />}
                    label="Auto Close"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={<Checkbox
                        checked={newBus.settings.manualClose || newBus.paymentMethods.manualClose}

                        onChange={(e) => {

                            setNewBus(prev => ({
                                ...prev, paymentMethods: {
                                    ...prev.paymentMethods, manualClose: e.target.checked
                                }
                            }))
                            setNewBus(prev => ({
                                ...prev, settings: {
                                    ...prev.settings, manualClose: e.target.checked
                                }
                            }))

                        }}
                    />}
                    label="Manual Close"
                />
            </Grid>
        </Grid>

        <Divider sx={{my: 3}}/>

        {/* Route Section */}
        <Typography variant="h6" sx={{mb: 2}}>Select Free defined Route</Typography>
        <Grid container spacing={2}>

            <Grid item xs={12} sm={4}>
                <Autocomplete
                    options={routes}
                    onChange={handleRouteChange}
                    renderInput={(params) => (<TextField
                        {...params}
                        label="Select Route"
                        InputProps={{
                            ...params.InputProps, startAdornment: (<InputAdornment position="start">
                            </InputAdornment>),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '40px'
                            }
                        }}
                    />)}
                />
            </Grid>

            <Grid item xs={12}>

                {routeData && (<>
                    <div className="grid grid-cols-4 gap-4 mt-5 mb-5">
                        <TextField
                            label="From"
                            value={routeData.route.from}
                            InputProps={{readOnly: true}}
                        />
                        <TextField
                            label="To"
                            value={routeData.route.to}
                            InputProps={{readOnly: true}}
                        />
                        <TextField
                            label="Route Number"
                            value={routeData.route.routeNumber}
                            InputProps={{readOnly: true}}
                        />
                        <TextField
                            label="Price"
                            value={routeData.route.price}
                            InputProps={{readOnly: true}}
                        />
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-500">
                            <th style={{color: '#FFFFFF'}} className="border pl-2 p-1 text-left">Boarding
                                Point
                            </th>
                            <th style={{color: '#FFFFFF'}} className="border pl-2 p-1 text-left">Dropping
                                Point
                            </th>
                            <th style={{color: '#FFFFFF'}} className="border pl-2 p-1 text-left">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {routeData.Points.map((point, index) => (<tr key={index}>
                            <td className="border p-2">{point.boardingPoints}</td>
                            <td className="border p-2">{point.droppingPoints}</td>
                            <td className="border p-2">{point.price}</td>
                        </tr>))}
                        </tbody>
                    </table>
                </>)}

            </Grid>

        </Grid>

        <Divider sx={{my: 3}}/>

        {/* Route Section */}
        <Typography variant="h6" sx={{mb: 2}}>Seat Layout</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Autocomplete
                    value={selectedLayout}
                    onChange={(_, layout) => setSelectedLayout(layout)}
                    options={layouts}
                    getOptionLabel={(option) => option?.layoutName || ''}
                    renderInput={(params) => (<TextField
                        {...params}
                        label="Select Layout"
                        InputProps={{
                            ...params.InputProps, startAdornment: (<InputAdornment position="start">
                            </InputAdornment>),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '40px'
                            }
                        }}
                    />)}
                />
            </Grid>
        </Grid>

        {selectedLayout && (<>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Box sx={{mt: 3}}>
                        {renderViewSeatGrid(selectedLayout)}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{mt: 2}}>
                        <SeatDetailsDisplay/>
                    </Box>
                </Grid>
            </Grid>

        </>)}


        <Divider sx={{my: 3}}/>

        <Typography variant="h6" sx={{mb: 2}}>Images</Typography>

        {/* Main Image */}
        <div className="mb-9">
            <Typography variant="subtitle1" className="mb-2">Main Image</Typography>
            <div style={{width: '300px', height: '200px'}}
                 className="relative border-2 border-dashed rounded-lg flex items-center justify-center">
                {mainImage ? (<div className="relative w-full h-full">
                    <img
                        src={mainImage}
                        alt="Main"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <IconButton
                        className="absolute top-0 right-2 bg-white"
                        onClick={() => setMainImage(null)}
                    >
                        <X className="h-4 w-4" style={{color: 'red', fontWeight: 'bold'}}/>
                    </IconButton>
                </div>) : (<label className="cursor-pointer flex flex-col items-center">
                    <Camera className="h-8 w-8 text-gray-400"/>
                    <span className="mt-2 text-sm text-gray-500">Upload main image</span>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                    />
                </label>)}
            </div>
        </div>

        {/* Other Images */}
        <div>
            <Typography variant="subtitle1" className="mb-2">Other Images</Typography>
            <div className="grid grid-cols-4 gap-4">
                {otherImages.map((img, index) => (<div key={index} className="relative h-32 mb-5">
                    <img
                        src={img}
                        alt={`Other ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <IconButton
                        className="absolute top-0 right-2 bg-white"
                        onClick={() => removeOtherImage(index)}
                    >
                        <X className="h-4 w-4" style={{color: 'red', fontWeight: 'bold'}}/>

                    </IconButton>
                </div>))}
                <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center">
                        <Camera className="h-6 w-6 text-gray-400"/>
                        <span className="mt-1 text-xs text-gray-500">Add image</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleOtherImagesUpload}
                        />
                    </label>
                </div>
            </div>
        </div>
    </Box>);

    return (<Container component="main" maxWidth="lg">

        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}

        <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
                <IconButton onClick={handleBackClick} sx={{marginRight: "10px", padding: '0'}}>
                    <ArrowBackIcon/>
                </IconButton>
                <Typography variant="h5" sx={{fontWeight: 600}}>
                    Bus Management ({details.DepotName} Depot)
                </Typography>
            </Box>

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
                <Box sx={{display: "flex", gap: 2, flexWrap: "wrap", flex: 1}}>
                    <Autocomplete
                        value={selectedRoute}
                        onChange={(_, value) => setSelectedRoute(value)}
                        // onChange={handleRouteChange}
                        options={routes.map((route) => route.label)}
                        renderInput={(params) => (<TextField
                            {...params}
                            label="Select Route"
                            InputProps={{
                                ...params.InputProps, startAdornment: (<InputAdornment position="start">
                                </InputAdornment>),
                            }}
                            sx={{
                                width: 200, '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />)}
                    />
                    <Autocomplete
                        value={selectedBusType}
                        onChange={(_, value) => setSelectedBusType(value)}
                        options={busTypes}
                        renderInput={(params) => (<TextField
                            {...params}
                            label="Bus Type"
                            InputProps={{
                                ...params.InputProps, startAdornment: (<InputAdornment position="start">
                                </InputAdornment>),
                            }}
                            sx={{
                                width: 200, '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />)}
                    />
                    <TextField
                        label="Bus Code"
                        value={selectedBusCode}
                        onChange={(e) => setSelectedBusCode(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                            </InputAdornment>),
                        }}
                        sx={{
                            width: 200, '& .MuiOutlinedInput-root': {
                                height: '40px',
                            }
                        }}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setAddModalOpen(true)}

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
                    Add New Bus
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Schedule Number</TableCell>
                            <TableCell>Bus Type</TableCell>
                            <TableCell>Route</TableCell>
                            <TableCell>Route No</TableCell>
                            <TableCell align="center">Seats</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBuses.map((bus) => (<TableRow key={bus.id}>
                            <TableCell>{bus.scheduleNumber}</TableCell>
                            <TableCell>{bus.busType}</TableCell>
                            <TableCell>{bus.route}</TableCell>
                            <TableCell>{bus.routeNo}</TableCell>
                            <TableCell align="center">{bus.seats}</TableCell>
                            <TableCell align="center">
                                <Switch
                                    checked={bus.status}
                                    onChange={() => {
                                        api.post("admin/bus/toggle-status", {id: bus.id})
                                            .then(res => {
                                                loadInfo()
                                            }).catch(handleError)
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <IconButton onClick={(e) => handleMenuOpen(e, bus)}>
                                    <MoreVertIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem onClick={handleManageSchedules}>Manage Bus Schedules</MenuItem>
                <MenuItem onClick={handleManageCrew}>Manage Crew</MenuItem>
            </Menu>

            {/* Add/Edit Modal */}
            <Modal
                open={addModalOpen}
                onClose={() => {
                    setAddModalOpen(false);
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "90%",
                    maxWidth: "1300px",
                    maxHeight: "90vh",
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "10px",
                    border: "2px solid gray",
                    overflow: "auto"
                }}>
                    <Typography variant="h6" gutterBottom>
                        {newBus.id ? 'Edit Bus' : 'Add New Bus'}
                    </Typography>

                    {/* Form Content */}
                    {renderBusForm()}

                    {/* Action Buttons */}
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveBus}
                            sx={{marginRight: "8px"}}
                        >
                            {newBus.id ? 'Update' : 'Save'}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setNewBus({
                                    scheduleNumber: "",
                                    busType: "",
                                    route: "",
                                    routeNo: "",
                                    seats: "",
                                    busModel: "",
                                    status: true,
                                    paymentMethods: {
                                        card: false, cash: false, bank: false, ezcash: false, reload: false
                                    },
                                    facilities: {
                                        wifi: false, usb: false, seatBelt: false, phoneCharger: false
                                    },
                                    settings: {
                                        onlineActive: true, agentCounter: false, autoClose: false, manualClose: false
                                    }
                                });
                                setEditMode(false)
                                setSelectedLayout(null);
                                setMainImage(null);
                                setOtherImages([]);
                                setSelectedFacilities(facilities.reduce((acc, facility) => ({
                                    ...acc, [facility.id]: false
                                }), {}));
                                setRouteData(null);
                                setAddModalOpen(false);

                            }}
                            sx={{backgroundColor: 'gray'}}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    </Container>);
};

export default BusManagement;
