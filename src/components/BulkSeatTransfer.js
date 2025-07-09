import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Container,
    TextField,
    Typography,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Autocomplete,
    InputAdornment,
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import dayjs, {Dayjs} from 'dayjs';


import LoadingOverlay from './Parts/LoadingOverlay';
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
import {useLoading} from "../loading";
import Alert from "@mui/material/Alert";

const BulkSeatTransfer = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);

    const loading = false;


    const {startLoading,stopLoading}=useLoading()

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})
    const [depots, setDepots] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [points, setPoints] = useState([]);


    // States for filter
    const [filterData, setFilterData] = useState({
        date: dayjs().startOf('day'), depot: '', schedule: null
    });

    const [scheduleDetails, setScheduleDetails] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [refundDetails, setRefundDetails] = useState({
        customerName: '', bankDetails: '', note: ''
    });

    const [selectedNewDate, setSelectedNewDate] = useState(dayjs());
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showSeatLayout, setShowSeatLayout] = useState(false);

    const [transferDetails, setTransferDetails] = useState({
        boardingPoint: '', newSeatNumber: '', seatCost: '', oldSeatCost: '', balanceToPay: ''
    });

    const [selectedSeat, setSelectedSeat] = useState([]);

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

    // Sample data

    const [allschedules, setAllSchedules] = useState([{
        id: 1,
        time: "06:00 AM",
        route: "Colombo-Kandy",
        busNo: "NA-1234",
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
                bankCharges: "20",
                status: "blocked"
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
                bankCharges: "20",
                status: "available"
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
                bankCharges: "20",
                status: "blocked"
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
                bankCharges: "20",
                status: "blocked"
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
                bankCharges: "20",
                status: "counter"
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
                bankCharges: "20",
                status: "counter"
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
                bankCharges: "20",
                status: "processing"
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
                bankCharges: "20",
                status: "processing"
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
                bankCharges: "20",
                status: "processing"
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
                bankCharges: "20",
                status: "available"
            }
        }
    }, {
        id: 2,
        time: "06:00 AM",
        route: "Colombo-Kandy",
        busNo: "NA-1234",
        layoutName: "2x2 Luxury Layout",
        busType: "Luxury Buses",
        seatsCount: 40,
        description: "Standard luxury bus layout with 2x2 configuration",
        seatDetails: {}
    }]);
    const loadAllPoints = () => {

    }
    const loadAllDepots = () => {
        const L=startLoading()
        api.get('admin/bulk-seat-transfer/get-all-depots')
            .then(res => {
                stopLoading(L)
                setDepots(res.data)
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    }
    const loadAll = () => {
        const L=startLoading()
        api.get('admin/bulk-seat-transfer/get-all')
            .then(res => {
                stopLoading(L)
                setAllSchedules(res.data)
                let id=(sessionStorage.getItem("toBeChanged"))
                console.log(id)
                if(id){
                    id=Number.parseInt(id)
                    console.log(res.data)
                    let fl= res.data.filter(s=>
                        s.id===id
                    )
                    console.log(fl)
                    if(fl[0]){
                        let s=fl[0]


                        setFilterData(prevState => {
                            return {
                                ...prevState,
                                depot: s.depot,
                                schedule: s,
                                data:dayjs(s.date)
                            }
                        })

                        setTimeout(()=>{
                            search.current.click()

                        },500)
                        sessionStorage.removeItem("toBeChanged")
                    }

                }
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    }
    const [, forceUpdate] = useState();
    useEffect(() => {
        loadAll()
        loadAllDepots()
        console.log(filterData)
        console.log(schedules)
    }, []);
    const formatDateForCSV = (dateStr) => {
        const formattedDate = dayjs(dateStr).format('DD/MM/YYYY');
        return `="${formattedDate}"`;
    };

    const exportToCSV = () => {
        if (scheduleDetails.length === 0) return;
        if (bookings.length === 0) return;

        // Define headers
        const headers = ['Reference No', 'Seat No', 'Mode of Payment', 'NIC', 'Name', 'Booked by', 'Booked date', 'Status'];

        // Format data
        const csvData = bookings.map(booking => [booking.refNo, booking.seatNo, booking.modeOfPay, booking.nic, booking.name, booking.bookedBy, formatDateForCSV(booking.bookedDate), booking.status]);

        // Combine headers and data
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `BST_${scheduleDetails.busShedule}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Handle seat hold
    const handleSeatHold = () => {
        const L=startLoading()
        api.post('admin/bulk-seat-transfer/hold', {id: selectedBooking.id})
            .then(res => {
                stopLoading(L)
                sendAlert('booking was put on hold')
                handleSearch()
                handleMenuClose();
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    };


    // Handle refund modal open
    const handleRefundClick = () => {
        handleMenuClose();
        setRefundModalOpen(true);
    };

    // Handle refund submit
    const handleRefundSubmit = () => {
        // Handle refund logic here

        const L=startLoading()
        api.post('admin/bulk-seat-transfer/refund', {...refundDetails, id: selectedBooking.id})
            .then(res => {
                stopLoading(L)
                sendAlert('refund request is registered')
                handleSearch()
                setRefundModalOpen(false);
                setRefundDetails({
                    customerName: '', bankDetails: '', note: ''
                });
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    };
    const search=useRef()

    // Handle search
    const handleSearch = () => {
        const L=startLoading()
        console.error(filterData)
        api.post('admin/bulk-seat-transfer/search', {
            id: filterData.schedule?.id,
        }).then(res => {
            setScheduleDetails(res.data.schedule);
            setBookings(res.data.bookings);
            stopLoading(L)
        }).catch(err => {
            stopLoading(L)
            handleError(err)
        })
    };

    // Handle menu open
    const handleMenuOpen = (event, booking) => {
        setAnchorEl(event.currentTarget);
        setSelectedBooking(booking);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
        // setSelectedBooking(null);
    };

    // Handle transfer click
    const handleTransferClick = () => {
        handleMenuClose();
        setTransferModalOpen(true);
    };

    // Handle transfer submit
    const handleTransferSubmit = () => {


        if (transferDetails.newSeatNumber === "" || transferDetails.newSeatId === null) {
            sendAlert('select a valid seat');
            return
        }
        if (transferDetails.boardingPoint === "" || transferDetails.boardingPoint === null || transferDetails.boardingPoint.id === 0) {
            sendAlert('select a valid fare break first');
            return
        }
        const L=startLoading()
        api.post('admin/bulk-seat-transfer/transfer', {
            ...transferDetails,
            id:selectedBooking.id,
            scheduleId:selectedSchedule.id,
        })
            .then(res => {
                stopLoading(L)
                handleTransferModalClose()
                setTransferModalOpen(false);
                setShowSeatLayout(false)
                setSelectedSchedule(null)
                setTransferDetails({
                    boardingPoint: {
                        id: 0, name: '', price: ''
                    }, droppingPoint: '', newSeatNumber: '', seatCost: '', oldSeatCost: 0, balanceToPay: ''
                })
                loadAll()
                sendAlert('transfer success')

            })
            .catch(err=>{
                stopLoading(L)
                handleError(err)
            })


    };

    const handleSeatNoChange = (nos) => {
        if (!selectedSchedule) return;
        if (transferDetails.boardingPoint === "" || transferDetails.boardingPoint === null || transferDetails.boardingPoint.id === 0) {
            sendAlert("select the fare break first");
            return;
        }

        let updatedDetails = {...transferDetails, newSeatNumber: nos}; // Store multiple seat numbers
        const seatDetails = selectedSchedule?.seatDetails ?? {};
        const entry = Object.entries(seatDetails).map(e => e[1]);

        let selectedSeats = [];
        let allSeatsAvailable = true;
        let newIds = []; // To store the seat IDs of the selected seats

        // Split the input seat numbers by comma and process each seat
        const seatNumbers = nos.split(',');


        seatNumbers.forEach((no) => {
            const filteredSeats = entry.filter(d => d?.seatNumber === no);
            const selectedSeat = filteredSeats[0];

            if (!selectedSeat) {
                // Seat not found
                // selectedSeats.push({ seatNumber: no, seatId: null, seatCost: '', balanceToPay: '' });
            } else {
                // Seat found, check if it's available

                if (selectedSeat.status !== "available") {
                    sendAlert(`Seat ${no} is not available`);
                    allSeatsAvailable = false;
                } else {
                    selectedSeats.push({
                        seatNumber: selectedSeat.seatNumber,
                        seatId: selectedSeat.id,
                        seatCost: selectedSeat.cost ?? '',
                        balanceToPay: selectedSeat.balanceToPay ?? ''
                    });
                    newIds.push(selectedSeat.id);
                }
            }
        });

        if (!allSeatsAvailable) {
            updatedDetails = {...updatedDetails};
        } else {
            updatedDetails = {
                ...updatedDetails,
                selectedSeats: selectedSeats,
                newSeatIds: newIds,
                seatCost: selectedSeats.reduce((total, seat) => total + parseFloat(seat.seatCost || 0), 0), // Sum up seat costs
                balanceToPay: selectedSeats.reduce((total, seat) => total + parseFloat(seat.balanceToPay || 0), 0) // Sum up balance to pay
            };
        }

        setTransferDetails(updatedDetails);
        setSelectedSeat(selectedSeats);

    };
    const calTotal = () => {
        if (!selectedSeat || !Array.isArray(selectedSeat) || selectedSeat.length === 0) return null;
        if (!transferDetails.boardingPoint) return null;

        const busFare = transferDetails.boardingPoint.price || 0;
        if (busFare === 0) return 0;

        let totalCost = 0;

        // Loop through all selected seats and calculate their total cost
        selectedSeat.forEach((seat) => {
            const ctbCharge = seat.serviceChargeCTB || 0;
            const hghCharge = seat.serviceChargeHGH || 0;
            const discountRate = seat.discount || 0;
            const vatRate = seat.vat || 0;
            const bankChargeRate = seat.bankCharges || 0;
            const serviceCharge1 = seat.serviceCharge01 || 0;
            const serviceCharge2 = seat.serviceCharge02 || 0;

            //01 - Calculate total before discount for the current seat
            const totalBeforeDiscount = busFare + ctbCharge + hghCharge;

            //02 - Calculate discount
            const discount = (totalBeforeDiscount * discountRate) / 100;
            const afterDiscountPrice = totalBeforeDiscount - discount;

            //03 - Calculate VAT
            const vat = (afterDiscountPrice * vatRate) / 100;
            const afterVatPrice = afterDiscountPrice + vat;

            //04 - Calculate bank charges
            const bankCharge = (afterVatPrice * bankChargeRate) / 100;
            const afterBankChargePrice = afterVatPrice + bankCharge;

            // Final Total for the current seat
            const finalTotal = afterBankChargePrice + serviceCharge1 + serviceCharge2;
            totalCost += finalTotal;  // Accumulate the total cost for all selected seats
        });

        // Return the total cost for all seats
        return totalCost.toFixed(2);
    };

    const toPay = () => {
        if (!calTotal()) return null
        return calTotal() - (transferDetails?.oldSeatCost ?? 0)
    }

    // Handle modal close and clear states
    const handleTransferModalClose = () => {
        setTransferModalOpen(false);
        setSelectedNewDate(null);
        setSelectedSchedule(null);
        setShowSeatLayout(false);
        // Reset transfer details
        setTransferDetails({
            boardingPoint: '', newSeatNumber: '', seatCost: '', oldSeatCost: '', balanceToPay: ''
        });
    };
    const dateInput=useRef()

    const filteredList = allschedules
        .filter(schedule =>
            dayjs(schedule.date)
                .isSame(dayjs(filterData.date), 'day') &&
            schedule.depot === filterData.depot && schedule.forTransfer);

    return (<LocalizationProvider dateAdapter={AdapterDayjs}>

        <LoadingOverlay show={loading}/>
        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}
        <Container maxWidth="lg">
            <Box sx={{marginBottom: 4}}>
                <Typography variant="h5" sx={{fontWeight: 600}}>
                    Bulk Seat Transfer
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
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                label="Date"
                                value={filterData.date}
                                ref={dateInput}
                                onChange={(newValue) => setFilterData({
                                    ...filterData, date: newValue, schedule: null
                                })}
                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                slotProps={{
                                    textField: {
                                        fullWidth: true, InputProps: {
                                            startAdornment: (<InputAdornment position="start">
                                            </InputAdornment>),
                                        }, sx: {
                                            width: '100%', '& .MuiOutlinedInput-root': {
                                                height: '40px'
                                            }
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={depots}
                                value={filterData.depot}

                                onChange={(_, value) => {
                                    setFilterData({
                                        ...filterData, depot: value, schedule: null
                                    })
                                    const filteredLists = allschedules.filter((s) => {
                                        const isDepotMatch = s.depot === value
                                        const isDateMatch = filterData.date ? dayjs(filterData.date).isSame(dayjs(s.date), 'day') : false
                                        return isDepotMatch && isDateMatch
                                    });
                                    setSchedules(filteredLists)

                                }}
                                // renderInput={(params) => <TextField {...params} label="Depot" />}
                                renderInput={(params) => (<TextField
                                    {...params}
                                    label="Depot"
                                    InputProps={{
                                        ...params.InputProps, startAdornment: (<InputAdornment position="start">
                                        </InputAdornment>),
                                    }}
                                />)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={filteredList}
                                // options={schedules}
                                getOptionLabel={(params) => params.number}
                                getOptionKey={(p) => p.id}
                                value={filterData.schedule}
                                onChange={(_, value) => setFilterData({...filterData, schedule: value})}
                                // renderInput={(params) => <TextField {...params} label="Bus Schedule" />}
                                renderInput={(params) => (<TextField
                                    {...params}
                                    label="Bus Schedule"
                                    InputProps={{
                                        ...params.InputProps, startAdornment: (<InputAdornment position="start">
                                        </InputAdornment>),
                                    }}
                                />)}
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
                    ref={search}
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

            {/* Schedule Details */}
            {scheduleDetails && (<Paper sx={{p: 3, mb: 4}}>
                <Typography variant="h6" sx={{mb: 2}}>Schedule Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold">Depot:</Typography>
                        <Typography>{scheduleDetails.depot}</Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold">Route:</Typography>
                        <Typography>{scheduleDetails.route}</Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold">Route No:</Typography>
                        <Typography>{scheduleDetails.routeNo}</Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold">Shedule:</Typography>
                        <Typography>{scheduleDetails.busShedule}</Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold">Date:</Typography>
                        <Typography>{scheduleDetails.date}</Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold">Status:</Typography>
                        <Typography>{scheduleDetails.status}</Typography>
                    </Grid>
                </Grid>
            </Paper>)}

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                <Typography variant="h6"></Typography>
                {bookings.length > 0 && (<Button
                    startIcon={<FileDownloadIcon/>}
                    onClick={exportToCSV}
                    sx={{
                        ml: 2,
                        padding: "6px 24px",
                        fontWeight: "bold",
                        borderRadius: "4px",
                        backgroundColor: "#3f51b5",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#303f9f",
                        },
                    }}
                >
                    Export
                </Button>)}
            </Box>

            {/* Bookings Table */}
            {bookings.length > 0 && (<TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ref No</TableCell>
                            <TableCell>Seat No</TableCell>
                            <TableCell>Mode of Pay</TableCell>
                            <TableCell>NIC</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Booked by</TableCell>
                            <TableCell>Booked date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (<TableRow key={booking.refNo}>
                            <TableCell>{booking.refNo}</TableCell>
                            <TableCell>{booking.seatNo}</TableCell>
                            <TableCell>{booking.modeOfPay}</TableCell>
                            <TableCell>{booking.nic}</TableCell>
                            <TableCell>{booking.name}</TableCell>
                            <TableCell>{booking.bookedBy}</TableCell>
                            <TableCell>{booking.bookedDate}</TableCell>
                            <TableCell>{booking.status}</TableCell>
                            <TableCell>
                                <IconButton onClick={(e) => handleMenuOpen(e, booking)}>
                                    <MoreVertIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>)}

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleTransferClick}>Transfer</MenuItem>
                <MenuItem onClick={handleSeatHold}>Seat Hold</MenuItem>
                <MenuItem onClick={handleRefundClick}>Refund</MenuItem>
            </Menu>

            {/* Transfer Modal */}
            <Modal
                open={transferModalOpen}
                onClose={handleTransferModalClose}
                sx={{overflow: "auto", py: 2}}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: 1200,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90vh",
                        overflow: "auto",
                        borderRadius: "10px",
                        border: "2px solid gray",
                    }}
                >

                    <Typography variant="h6" sx={{mb: 3}}>
                        Transfer Request - ({selectedBooking?.refNo || 'N/A'})
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="New Travel Date"
                                value={selectedNewDate}
                                onChange={evt => {
                                    setSelectedNewDate(evt)
                                    setSelectedSchedule(null);
                                    setShowSeatLayout(false);
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                sx={{width: "100%"}}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={allschedules.filter(s => s.isOpen && dayjs(s.date).isSame(selectedNewDate, 'day'))}
                                getOptionKey={opt => opt.id}
                                getOptionLabel={(option) => `${option.time} - ${option.route} (${option.busNo})`}
                                onChange={(event, value, reason) => {
                                    setSelectedSchedule(value);
                                    setShowSeatLayout(value !== null);
                                    setPoints(value?.fare)
                                    setTransferDetails(prevState => {
                                        return {
                                            ...prevState,
                                            oldSeatCost: selectedBooking.price,

                                        }
                                    })
                                }}
                                onClose={(event, reason) => {
                                    if (reason === 'clear') {
                                        setShowSeatLayout(false);
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
                            <Box sx={{display: "flex", justifyContent: "center", width: "100%", maxWidth: "800px"}}>
                                <img src="/wheel.png" style={{ width: "40px", height: "40px", marginTop: "18px", marginRight: "10px", rotate: "-90deg" }} />
                                {renderSeatLayout(selectedSchedule)}
                            </Box>
                        </Box>

                        <Box sx={{marginTop: "80px"}}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        options={points}
                                        value={transferDetails.boardingPoint || null}
                                        getOptionLabel={op => op.label}
                                        getOptionKey={op => op.id}
                                        onChange={(_, value) => setTransferDetails({
                                            ...transferDetails, boardingPoint: value
                                        })}
                                        renderInput={(params) => <TextField {...params} label="Fare Break"/>}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="New Seat Number"
                                        value={transferDetails.newSeatNumber}
                                        onChange={(e) => handleSeatNoChange(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Seat Cost"
                                        // value={transferDetails.seatCost}
                                        value={calTotal() ?? 0}
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
                                        // value={transferDetails.balanceToPay}
                                        value={toPay() ?? 0}
                                        onChange={(e) => setTransferDetails({
                                            ...transferDetails, balanceToPay: e.target.value
                                        })}
                                        disabled
                                    />
                                </Grid>

                            </Grid>

                        </Box>
                    </Box>)}

                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleTransferSubmit}
                            sx={{marginRight: '8px'}}
                        >
                            Transfer
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleTransferModalClose}
                            sx={{backgroundColor: 'gray'}}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Refund Modal */}
            <Modal
                open={refundModalOpen}
                onClose={() => setRefundModalOpen(false)}
                sx={{overflow: "auto", py: 2}}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "50%",
                        maxWidth: 1200,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90vh",
                        overflow: "auto",
                        borderRadius: "10px",
                        border: "2px solid gray",
                    }}
                >
                    <Typography variant="h6" sx={{mb: 2}}>
                        Refund Request - ({selectedBooking?.refNo || 'N/A'})
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                value={refundDetails.customerName || ''}
                                onChange={(e) => setRefundDetails((prev) => ({
                                    ...prev, customerName: e.target.value,
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bank Details"
                                multiline
                                rows={4}
                                value={refundDetails.bankDetails || ''}
                                onChange={(e) => setRefundDetails((prev) => ({
                                    ...prev, bankDetails: e.target.value,
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Note"
                                multiline
                                rows={3}
                                value={refundDetails.note || ''}
                                onChange={(e) => setRefundDetails((prev) => ({
                                    ...prev, note: e.target.value,
                                }))}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRefundSubmit}
                            sx={{marginRight: '8px'}}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setRefundModalOpen(false)}
                            sx={{backgroundColor: 'gray'}}
                        >
                            Cancel
                        </Button>
                    </Box>


                </Box>
            </Modal>

        </Container>
    </LocalizationProvider>);
};

export default BulkSeatTransfer;
