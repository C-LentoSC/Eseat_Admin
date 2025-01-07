import React, {useEffect, useState} from 'react';
import {
    Box, Container, TextField, Typography, InputAdornment, Button, Grid, Paper, Autocomplete
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";

const SeatTransfer = () => {

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})


    const [searchData, setSearchData] = useState({
        refNo: '', mobileNumber: ''
    });

    const [bookingDetails, setBookingDetails] = useState(null);
    const [selectedNewDate, setSelectedNewDate] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showSeatLayout, setShowSeatLayout] = useState(false);

    const [points, setPoints] = useState([]);

    const [transferDetails, setTransferDetails] = useState({
        boardingPoint: {
            id: 0, name: '', price: ''
        }, droppingPoint: '', newSeatNumber: '', seatCost: '', oldSeatCost: 0, balanceToPay: ''
    });
    const handleSeatNoChange = (no) => {
        if (!selectedSchedule) return;
        if (transferDetails.boardingPoint === "" || transferDetails.boardingPoint === null) {
            sendAlert("select the fare break first")
            return;
        }
        let updatedDetails = {...transferDetails, newSeatNumber: no};
        const seatDetails = selectedSchedule?.seatDetails ?? {};
        const entry = Object.entries(seatDetails).map(e => e[1]);
        const filteredSeats = entry.filter(d => d?.seatNumber === no);
        const selectedSeat = filteredSeats[0];
        if (!selectedSeat) {
            updatedDetails = {
                ...updatedDetails, newSeatId: null, seatCost: '', balanceToPay: ''
            };
        } else {
            if (selectedSeat.status !== "available") {
                sendAlert('this seat is not available')
                updatedDetails = {
                    ...updatedDetails, newSeatId: null, seatCost: '', balanceToPay: ''
                };
            } else {

        const busFare = transferDetails.boardingPoint.price;
        const ctbCharge = selectedSeat.serviceChargeCTB;
        const hghCharge = selectedSeat.serviceChargeHGH;
        const discountRate = selectedSeat.discount;
        const vatRate = selectedSeat.vat;
        const bankChargeRate = selectedSeat.bankCharges;
        const serviceCharge1 = selectedSeat.serviceCharge01;
        const serviceCharge2 = selectedSeat.serviceCharge02;
    
        //01
        const totalBeforeDiscount = busFare + ctbCharge + hghCharge;
    
        //02
        const discount = (totalBeforeDiscount * discountRate) / 100;
        const afterDiscountPrice = totalBeforeDiscount - discount;
    
        //03
        const vat = (afterDiscountPrice * vatRate) / 100;
        const afterVatPrice = afterDiscountPrice + vat;
    
        //04
        const bankCharge = (afterVatPrice * bankChargeRate) / 100;
        const afterBankChargePrice = afterVatPrice + bankCharge;
    
        const finalTotal = afterBankChargePrice + serviceCharge1 + serviceCharge2;
        const seatCostTotal = finalTotal.toFixed(2);
                
                updatedDetails = {
                    ...updatedDetails,
                    newSeatNumber: selectedSeat.seatNumber,
                    newSeatId: selectedSeat.id,
                    seatCost: transferDetails.boardingPoint?.price+selectedSeat?.cost,
                    balanceToPay: transferDetails.boardingPoint?.price  - (transferDetails?.oldSeatCost ?? 0)
                };
            }
        }
        setTransferDetails(updatedDetails);
    };
    const handleTransfer = () => {
        if (transferDetails.newSeatNumber === "" || transferDetails.newSeatId === null) {
            sendAlert('select a valid seat');
            return
        }
        api.post('admin/seat-transfer/transfer', transferDetails)
            .then(res => {
                setBookingDetails(null)
                setShowSeatLayout(false)
                setSelectedSchedule(null)
                setTransferDetails({
                    boardingPoint: {
                        id: 0, name: '', price: ''
                    }, droppingPoint: '', newSeatNumber: '', seatCost: '', oldSeatCost: 0, balanceToPay: ''
                })
                setSearchData({
                    refNo: '', mobileNumber: ''
                })
                loadAllSchedules()
                sendAlert('transfer success')

            })
            .catch(handleError)
    }

    const handleSearch = () => {
        // Simulate API call
        api.post('admin/seat-transfer/search', searchData)
            .then(res => {
                if(!res.data)sendAlert('invalid search data')
                setBookingDetails(res.data)
                setTransferDetails({
                    ...transferDetails, oldSeatCost: res.data.totalCost, id: res.data.id
                })
            })
            .catch(handleError)
    };
    const handleRouteChange = (data) => {
        setPoints(data?.brake)
        setTransferDetails({
            ...transferDetails, scheduleId: data?.id
        })
    }

    const [schedules, setSchedules] = useState([]);
    const loadAllSchedules = () => {
        api.get('admin/seat-transfer/all-schedules')
            .then(res => {
                setSchedules(res.data)
            })
            .catch(handleError)
    }
    useEffect(() => {
        loadAllSchedules()
    }, []);

    const SeatIcon = ({status, Setwidth, Setheight}) => {
        const colors = {
            available: "#CCCCCC", processing: "#4CAF50", counter: "#FF9800", blocked: "#F44336"
        };

        return (<div className="relative flex flex-col items-center">
            <svg
                viewBox="0 0 100 100"
                className={`w-${Setwidth ? Setwidth : '12'}  h-${Setheight ? Setheight : '12'} cursor-pointer transition-colors duration-200`}
            >
                <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
                    <path
                        d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z"
                        fill={colors[status]}/>
                </g>
            </svg>
        </div>);
    };

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

    const SeatLegend = () => (<Box className="flex gap-4 justify-center mb-5">
        {[{status: 'available', label: 'Available'}, {
            status: 'processing', label: 'Processing'
        }, {status: 'counter', label: 'Counter'}, {status: 'blocked', label: 'Blocked'}].map(({status, label}) => (
            <div key={status} className="flex items-center gap-2">
                <SeatIcon status={status} Setwidth="8" Setheight="10"/>
                <span>{label}</span>
            </div>))}
    </Box>);

    const renderSeatLayout = (layout) => {
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
                         className="relative m-1">
                        <SeatIcon status={seatInfo.status}/>
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

    return (<LocalizationProvider dateAdapter={AdapterDayjs}>
        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}
        <Container maxWidth="lg">
            <Box sx={{display: "flex", alignItems: "center", marginBottom: '48px'}}>
                <Typography variant="h5" sx={{fontWeight: 600}}>
                    Seat Transfer
                </Typography>
            </Box>

            <Box sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                mt: 5,
                flexWrap: "wrap",
                gap: 2
            }}>
                <Box sx={{display: "flex", gap: 2, flexWrap: "wrap", flex: 1}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Reference Number"
                                value={searchData.refNo}
                                onChange={(e) => setSearchData({...searchData, refNo: e.target.value})}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                    </InputAdornment>),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                value={searchData.mobileNumber}
                                onChange={(e) => setSearchData({...searchData, mobileNumber: e.target.value})}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                    </InputAdornment>),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                </Box>

                <Button
                    variant="contained"
                    onClick={handleSearch}

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
                    Search
                </Button>
            </Box>


            {bookingDetails && (<Paper className="mt-6 p-4">
                <Typography variant="h6" sx={{marginBottom: "15px"}}>Current Booking Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Travel Date:
                        </Typography>
                        <Typography>{bookingDetails.TravelDate}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Schedule:
                        </Typography>
                        <Typography>{bookingDetails.Schedule}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Seat No:
                        </Typography>
                        <Typography>{bookingDetails.SeatNo}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Route:
                        </Typography>
                        <Typography>{bookingDetails.Route}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Bus No:
                        </Typography>
                        <Typography>{bookingDetails.BusNo}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            V-Code:
                        </Typography>
                        <Typography>{bookingDetails.VCode}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Phone Number:
                        </Typography>
                        <Typography>{bookingDetails.PhoneNumber}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Pay Ref.No:
                        </Typography>
                        <Typography>{bookingDetails.PayRefNo}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Card Suffix No:
                        </Typography>
                        <Typography>{bookingDetails.CardSuffixNo}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Typography variant="subtitle2" className="font-bold">
                            Booked Date & Time:
                        </Typography>
                        <Typography>{bookingDetails.BookedDateTime}</Typography>
                    </Grid>

                </Grid>
            </Paper>)}

            {bookingDetails && (<Box sx={{marginTop: "40px"}}>

                <Typography variant="h6" sx={{marginBottom: "15px"}}>Transfer Details</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="New Travel Date"
                            value={selectedNewDate}
                            onChange={res=> {
                                setSelectedNewDate(res)
                                setShowSeatLayout(false)
                                setSelectedSchedule(null)
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth/>}
                            sx={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={schedules.filter(s => s.date === selectedNewDate?.format('YYYY-MM-DD'))}
                            getOptionLabel={(option) => `${option.date} ${option.time} - ${option.route} (${option.busNo})`}
                            onChange={(_, value) => {
                                setSelectedSchedule(value);
                                setShowSeatLayout(value !== null);
                                handleRouteChange(value)
                            }}
                            onClose={(evt, reason) => {
                                if (reason === 'clear') {
                                    setShowSeatLayout(false)
                                }
                            }}

                            renderInput={(params) => (<TextField
                                {...params}
                                label="Select Schedule"
                                InputProps={{
                                    ...params.InputProps, startAdornment: (<InputAdornment position="start">
                                    </InputAdornment>),
                                }}

                            />)}
                        />
                    </Grid>
                </Grid>

                {showSeatLayout && (<Box sx={{marginTop: "80px"}}>
                    <SeatLegend/>

                    <Box sx={{
                        width: "100%", display: "flex", justifyContent: "center", alignItems: "center"
                    }}>
                        <Box sx={{width: "100%", maxWidth: "800px"}}>
                            {renderSeatLayout(selectedSchedule)}
                        </Box>
                    </Box>

                    <Box sx={{marginTop: "80px"}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={points}
                                    getOptionLabel={(option) => option?.name || ''}
                                    getOptionKey={(option) => option?.id}
                                    value={transferDetails.boardingPoint || null}
                                    onChange={(_, value) => {
                                        setTransferDetails({ ...transferDetails, boardingPoint: value });
                                    }}
                                    onClose={(evt, reason) => {
                                        if (reason === 'clear') {
                                            setTransferDetails({ ...transferDetails, boardingPoint: '' });
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Fare Break" />}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="New Seat Number"
                                    value={transferDetails.newSeatNumber}
                                    onChange={(e) => {
                                        // setTransferDetails({
                                        //     ...transferDetails,
                                        //     newSeatNumber: e.target.value
                                        // })
                                        handleSeatNoChange(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Seat Cost"
                                    value={transferDetails.seatCost}
                                    onChange={(e) => setTransferDetails({
                                        ...transferDetails, seatCost: e.target.value
                                    })}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Old Seat Cost"
                                    value={transferDetails.oldSeatCost}
                                    onChange={(e) => setTransferDetails({
                                        ...transferDetails, oldSeatCost: e.target.value
                                    })}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Balance To Pay"
                                    value={transferDetails.balanceToPay}
                                    onChange={(e) => setTransferDetails({
                                        ...transferDetails, balanceToPay: e.target.value
                                    })}
                                    disabled
                                />
                            </Grid>

                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: '30px'}}>
                            <Button
                                onClick={handleTransfer}
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
                                Transfer Seat
                            </Button>
                        </Box>
                    </Box>
                </Box>)}
            </Box>)}
        </Container>
    </LocalizationProvider>);
};

export default SeatTransfer;
