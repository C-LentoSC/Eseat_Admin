import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
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
    Stack,
    Autocomplete,
    Chip,
    FormControlLabel,
    Checkbox,
    TablePagination
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from 'dayjs';
import { setroutval } from "./DashboardLayoutAccount";

import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
import {useLoading} from "../loading";

// import LoadingOverlay from './Parts/LoadingOverlay';

const BusSchedule = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);
    const {startLoading, stopLoading} = useLoading()



    const BusID = sessionStorage.getItem('currentValueID');

    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    const [details, setDetails] = useState({
        routID: BusID, ScheduleNum: "", CityName: "", depot: ""
    });
    const loadInfo = () => {
        const L = startLoading()
        api.get(`admin/bus/schedule/${BusID}/info`)
            .then(res => {
                stopLoading(L)
                setDetails(res.data.main)
                setCities(res.data.sub)
                setSelected(res.data.layout)
                setSchedule(res.data.all)

            }).catch(err => {
            stopLoading(L)
            handleError(err)
        })
    }
    useEffect(() => {
        loadInfo()
    }, []);

    const [schedule, setSchedule] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [enableMultiDates, setEnableMultiDates] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [showSeatLayout, setShowSeatLayout] = useState(false);
    const [blockedSeats, setBlockedSeats] = useState({});
    const [blockType, setBlockType] = useState({
        all: true, online: false
    });

    const [formData, setFormData] = useState({
        travelName: "",
        busNumber: "",
        from: "",
        to: "",
        travelDate: dayjs(),
        endDate: dayjs(),
        closingDate: dayjs(),
        startTime: "",
        endTime: "",
        closingTime: "",
        blockedSeats: []
    });

    const [cities, setCities] = useState([]);

    const handleDateSelect = (date) => {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setSelectedDates(prev => {
            if (prev.includes(formattedDate)) {
                return prev.filter(d => d !== formattedDate);
            }
            return [...prev, formattedDate];
        });
    };

    const handleSave = () => {
        let dc = []
        Object.entries(blockedSeats)
            .filter(([_, obg], key) => obg.isBlocked
                // && obg.blockType === "all"
            )

            .forEach(([seatId, obg]) => dc.push({[seatId]: obg}));

        const scheduleData = {
            ...formData, blockedSeats: dc,
            blockedSeatsOnline: Object.entries(blockedSeats)
                .filter(([_, obg], key) => obg.isBlocked && obg.blockType === "online")
                .map(([seatId, obg]) => seatId)
        };
        let arr = []

        if (enableMultiDates && selectedDates.length > 0) {
            const baseTravel = dayjs(formData.travelDate);
            const baseEnd = dayjs(formData.endDate);
            const baseClose = dayjs(formData.closingDate);

            const endDiff = baseEnd.diff(baseTravel, 'day');
            const closeDiff = baseClose.diff(baseTravel, 'day');

            const newSchedules = selectedDates.map((date, index) => ({
                id: BusID, ...scheduleData,
                travelDate: dayjs(date).format('YYYY-MM-DD'),
                endDate: dayjs(date).add(endDiff, 'day').format('YYYY-MM-DD'),
                closingDate: dayjs(date).add(closeDiff, 'day').format('YYYY-MM-DD')
            }));


            arr.push(...newSchedules);
        } else {
            arr.push({
                id: BusID, ...scheduleData,
                travelDate: dayjs(formData.travelDate).format('YYYY-MM-DD'),
                endDate: dayjs(formData.endDate).format('YYYY-MM-DD'),
                closingDate: dayjs(formData.closingDate).format('YYYY-MM-DD')
            });
        }
        const L =startLoading()
            api.post('admin/bus/schedule/add-new', {schedules:arr})
                .then(res => {
                    stopLoading(L)
                    loadInfo()
                    handleCloseAdd();
                    sendAlert("new schedule added")
                })
                .catch(err=> {
                    stopLoading(L)
                    handleError(err)
                })
        // arr.forEach(i => {
        //     const L =startLoading()
        //     api.post('admin/bus/schedule/add', i)
        //         .then(res => {
        //             stopLoading(L)
        //             loadInfo()
        //             handleCloseAdd();
        //             sendAlert("new schedule added")
        //         })
        //         .catch(err=> {
        //             stopLoading(L)
        //             handleError(err)
        //         })
        // })

    };

    const handleEdit = (item) => {
        const blockedSeatsObj = {};
        item.blockedSeats?.forEach(seatId => {
            const o = Object.entries(seatId);
            blockedSeatsObj[o[0][0]] = o[0][1];
        });
        setShowSeatLayout(item.blockedSeats.length !== 0)
        setBlockedSeats(blockedSeatsObj);
        setCurrentSchedule({
            ...item,
            travelDate: dayjs(item.travelDate),
            endDate: dayjs(item.endDate),
            closingDate: dayjs(item.closingDate)
        });
        setOpenEdit(true);
    };


    const handleSaveEdit = () => {
        let dc = []
        Object.entries(blockedSeats)
            .filter(([_, obg], key) => obg.isBlocked
                // && obg.blockType === "all"
            )
            .forEach(([seatId, obg]) => dc.push({[seatId]: obg}));

        const updatedSchedule = {
            ...currentSchedule,
            blockedSeats: dc,
            travelDate: dayjs(currentSchedule.travelDate).format('YYYY-MM-DD'),
            endDate: dayjs(currentSchedule.endDate).format('YYYY-MM-DD'),
            closingDate: dayjs(currentSchedule.closingDate).format('YYYY-MM-DD')
        };
        const L=startLoading()
        api.post('admin/bus/schedule/edit', updatedSchedule)
            .then(res => {
                stopLoading(L)
                loadInfo()
                sendAlert("schedule updated")
                setOpenEdit(false);
                setBlockedSeats({});
                setShowSeatLayout(false);
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })


    };

    const handleOpenAdd = () => {
        setFormData({
            ...formData, from: cities[0], to: cities[1], travelName: details.depot ?? "", busNumber: details.no ?? ""
        })
        setOpenAdd(true)
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
        setFormData({
            travelName: "",
            busNumber: "",
            from: "",
            to: "",
            travelDate: dayjs(),
            endDate: dayjs(),
            closingDate: dayjs(),
            startTime: "",
            endTime: "",
            closingTime: "",
            blockedSeats: []
        });
        setSelectedDates([]);
        setEnableMultiDates(false);
        setShowSeatLayout(false);
        setBlockedSeats({});
    };

    const handleDelete = (id) => {

        const L = startLoading()
        api.post('admin/bus/schedule/delete', {id})

            .then(res => {
                stopLoading(L)
                loadInfo()
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    };


    const DateInputSection = ({formData, setFormData, enableMultiDates}) => (<Box sx={{mb: 2}}>
        <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2}}>
            <DatePicker
                label="Travel Date"
                value={formData.travelDate}
                onChange={(date) => setFormData({...formData, travelDate: date})}

            />
            <DatePicker
                label="End Date"
                value={formData.endDate}

                onChange={(date) => setFormData({...formData, endDate: date})}

                minDate={formData.travelDate}
            />
            <DatePicker
                label="Closing Date"
                value={formData.closingDate}

                onChange={(date) => setFormData({...formData, closingDate: date})}
            />
        </Box>
        {enableMultiDates && (<Box sx={{border: 1, borderColor: 'divider', p: 2, borderRadius: 1}}>
            <Typography sx={{mb: 1}}>Selected Additional Dates:</Typography>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>

                {selectedDates.map(date => (<Chip
                    key={date}
                    label={date}
                    onDelete={() => setSelectedDates(prev => prev.filter(d => d !== date))}
                />))}
            </Box>
            <DateCalendar
                value={null}
                onChange={handleDateSelect}
                minDate={dayjs()}
            />
        </Box>)}
    </Box>);

    const handleBackClick = () => {
        setroutval('/busManagement', '00');
    };



    const SeatIcon = ({isSelected, isBlocked, blockType}) => (<div className="relative flex flex-col items-center">

        <svg
            viewBox="0 0 100 100"
            className={`w-12 h-12 cursor-pointer transition-colors duration-200 ${isSelected ? 'text-green-600' : 'text-gray-000'} ${isBlocked ? blockType === 'all' ? 'text-red-600' : 'text-yellow-500' : 'text-green-600'}`}
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

    const [selectedLayout, setSelected] = useState({
        id: 1,
        layoutName: "2x2 Luxury Layout",
        busType: "Luxury Buses",
        seatsCount: 40,
        description: "Standard luxury bus layout with 2x2 configuration",
        seatDetails: {}
    });


    // Function to render seat layout
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={seatId}
                        onClick={() => handleSeatClick(seatId)} className="relative m-1">
                        <SeatIcon
                            isSelected={!!seatId}
                            isBlocked={blockedSeats[seatId]?.isBlocked}
                            blockType={blockedSeats[seatId]?.blockType}
                        />
                        {seatInfo?.seatNumber && (<span style={{ left: "13px", fontWeight: "bold", color: "#FFFFFF" }}
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
                display: 'grid',
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`, // gap: '10px',
                marginTop: '10px'
            }}
        >
            {grid}
        </div>);
    };

    // Handler for seat clicking
    const handleSeatClick = (seatId) => {
        setBlockedSeats(prev => ({
            ...prev, [seatId]: {
                isBlocked: !prev[seatId]?.isBlocked || false, blockType: blockType.all ? 'all' : 'online'
            }
        }));
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

    return (<LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">

            {/* <LoadingOverlay show={loading} /> */}

            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}

                                  setOpen={setAlert}/> : <></>}
            <Box sx={{display: "flex", flexDirection: "column", gap: 3, py: 2}}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Box sx={{
                        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"
                    }}>
                        <IconButton onClick={handleBackClick} sx={{marginRight: "10px", padding: '0'}}>
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h5" sx={{fontWeight: 600, display: 'flex'}}>

                            Manage Bus Schedule (
                            <Typography variant="h6">
                                {details.ScheduleNum} | {details.CityName}
                            </Typography>
                            )
                        </Typography>

                    </Box>
                    <Button variant="contained" onClick={handleOpenAdd}

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
                            }}>

                        Add Schedule Time
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>

                            <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                <TableCell sx={{py: 1}}>From - To</TableCell>
                                <TableCell sx={{py: 1}}>Travel Date</TableCell>
                                <TableCell sx={{py: 1}}>Start Time</TableCell>
                                <TableCell sx={{py: 1}}>End Date</TableCell>
                                <TableCell sx={{py: 1}}>End Time</TableCell>
                                <TableCell sx={{py: 1}}>Closing Date</TableCell>
                                <TableCell sx={{py: 1}}>ClosingTimes</TableCell>
                                <TableCell sx={{py: 1}} align="right">Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schedule
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((item) => (<TableRow key={item.id}>

                                    <TableCell sx={{py: 0}}>{item.from} - {item.to}</TableCell>
                                    <TableCell sx={{py: 0}}>{item.travelDate}</TableCell>
                                    <TableCell sx={{py: 0}}>{item.startTime}</TableCell>
                                    <TableCell sx={{py: 0}}>{item.endDate}</TableCell>
                                    <TableCell sx={{py: 0}}>{item.endTime}</TableCell>
                                    <TableCell sx={{py: 0}}>{item.closingDate}</TableCell>
                                    <TableCell sx={{py: 0}}>
                                        {item.closingTime}
                                    </TableCell>
                                    <TableCell sx={{py: 0}} align="right">


                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(item)}

                                            sx={{marginRight: "8px"}}
                                        >
                                            <EditIcon/>

                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(item.id)}
                                        >

                                            <DeleteIcon/>

                                        </IconButton>
                                    </TableCell>
                                </TableRow>))}
                        </TableBody>
                    </Table>
                    <TablePagination

                        component="div"
                        count={schedule.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>


                {/* Add Modal */}
                <Modal open={openAdd} onClose={handleCloseAdd}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: '900px',
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90vh",
                        overflow: "auto",
                        borderRadius: "10px",
                        border: "2px solid gray",
                    }}>

                        <Typography variant="h6" sx={{mb: 3}}>Add New Schedule Time</Typography>


                        <Stack spacing={3}>



                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2}}>
                                <TextField
                                    label="Travel Name"
                                    value={formData.travelName}
                                    onChange={(e) => setFormData({...formData, travelName: e.target.value})}

                                />
                                <TextField
                                    label="Bus Number"
                                    value={formData.busNumber}

                                    onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                                />
                            </Box>

                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2}}>
                                <Autocomplete
                                    value={formData.from}
                                    onChange={(_, value) => setFormData({...formData, from: value})}
                                    options={cities}
                                    renderInput={(params) => <TextField {...params} label="From"/>}
                                />
                                <Autocomplete
                                    value={formData.to}
                                    onChange={(_, value) => setFormData({...formData, to: value})}
                                    options={cities}
                                    renderInput={(params) => <TextField {...params} label="To"/>}

                                />
                            </Box>


                            <FormControlLabel
                                control={<Checkbox
                                    checked={enableMultiDates}
                                    onChange={(e) => setEnableMultiDates(e.target.checked)}
                                />}
                                label="Multiple dates selection"
                            />

                            <DateInputSection
                                formData={formData}
                                setFormData={setFormData}
                                enableMultiDates={enableMultiDates}
                            />

                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2}}>

                                <TextField
                                    type="time"
                                    label="Start Time"
                                    value={formData.startTime}

                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    InputLabelProps={{shrink: true}}

                                />
                                <TextField
                                    type="time"
                                    label="End Time"
                                    value={formData.endTime}

                                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                    InputLabelProps={{shrink: true}}

                                />
                                <TextField
                                    type="time"
                                    label="Closing Time"
                                    value={formData.closingTime}

                                    onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                                    InputLabelProps={{shrink: true}}

                                />
                            </Box>


                            <FormControlLabel
                                control={<Checkbox
                                    checked={showSeatLayout}
                                    onChange={(e) => setShowSeatLayout(e.target.checked)}
                                />}
                                label="Block Seats"
                            />


                            {showSeatLayout && (<Box sx={{mt: 2}}>
                                <Typography variant="subtitle1" sx={{mb: 1}}>

                                    Select seats to block
                                </Typography>


                                <Box>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={blockType.all}
                                            onChange={(e) => setBlockType({
                                                all: e.target.checked, online: false
                                            })}
                                        />}
                                        label="All user block"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={blockType.online}
                                            onChange={(e) => setBlockType({
                                                online: e.target.checked, all: false
                                            })}
                                        />}
                                        label="Online user block"
                                    />
                                </Box>

                                {renderSeatLayout(selectedLayout)}
                            </Box>)}


                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}

                                    sx={{marginRight: '8px'}}

                                >
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCloseAdd}

                                    sx={{backgroundColor: 'gray'}}

                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Modal>

                {/* Edit Modal */}
                <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: '900px',
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90vh",
                        overflow: "auto",
                        borderRadius: "10px",
                        border: "2px solid gray",
                    }}>

                        <Typography variant="h6" sx={{mb: 3}}>Edit Schedule</Typography>

                        {currentSchedule && (<Stack spacing={3}>
                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2}}>

                                <TextField
                                    label="Travel Name"
                                    value={currentSchedule.travelName}
                                    onChange={(e) => setCurrentSchedule({
                                        ...currentSchedule, travelName: e.target.value
                                    })}
                                />
                                <TextField
                                    label="Bus Number"
                                    value={currentSchedule.busNumber}
                                    onChange={(e) => setCurrentSchedule({
                                        ...currentSchedule, busNumber: e.target.value
                                    })}
                                />
                            </Box>


                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2}}>

                                <Autocomplete
                                    value={currentSchedule.from}
                                    onChange={(_, value) => setCurrentSchedule({
                                        ...currentSchedule, from: value
                                    })}
                                    options={cities}

                                    renderInput={(params) => <TextField {...params} label="From"/>}
                                />
                                <Autocomplete
                                    value={currentSchedule.to}
                                    onChange={(_, value) => setCurrentSchedule({...currentSchedule, to: value})}
                                    options={cities}
                                    renderInput={(params) => <TextField {...params} label="To"/>}
                                />
                            </Box>

                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2}}>
                                <DatePicker
                                    label="Travel Date"
                                    value={currentSchedule.travelDate}
                                    onChange={(date) => setCurrentSchedule({
                                        ...currentSchedule, travelDate: date
                                    })}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={currentSchedule.endDate}
                                    onChange={(date) => setCurrentSchedule({...currentSchedule, endDate: date})}

                                />
                                <DatePicker
                                    label="Closing Date"
                                    value={currentSchedule.closingDate}
                                    onChange={(date) => setCurrentSchedule({
                                        ...currentSchedule, closingDate: date
                                    })}
                                />
                            </Box>

                            <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2}}>

                                <TextField
                                    type="time"
                                    label="Start Time"
                                    value={currentSchedule.startTime}
                                    onChange={(date) => setCurrentSchedule({
                                        ...currentSchedule, startTime: date.target.value
                                    })}

                                    InputLabelProps={{shrink: true}}

                                />
                                <TextField
                                    type="time"
                                    label="End Time"
                                    value={currentSchedule.endTime}
                                    onChange={(e) => setCurrentSchedule({
                                        ...currentSchedule, endTime: e.target.value
                                    })}

                                    InputLabelProps={{shrink: true}}

                                />
                                <TextField
                                    type="time"
                                    label="Closing Time"
                                    value={currentSchedule.closingTime}
                                    onChange={(e) => setCurrentSchedule({
                                        ...currentSchedule, closingTime: e.target.value
                                    })}

                                    InputLabelProps={{shrink: true}}

                                />
                            </Box>

                            <FormControlLabel
                                control={<Checkbox
                                    checked={showSeatLayout}
                                    onChange={(e) => setShowSeatLayout(e.target.checked)}
                                />}
                                label="Block Seats"
                            />


                            {showSeatLayout && (<Box sx={{mt: 2}}>
                                <Typography variant="subtitle1" sx={{mb: 1}}>

                                    Select seats to block
                                </Typography>

                                <Box>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={blockType.all}
                                            onChange={(e) => setBlockType({
                                                all: e.target.checked, online: false
                                            })}
                                        />}
                                        label="All user block"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={blockType.online}
                                            onChange={(e) => setBlockType({
                                                online: e.target.checked, all: false
                                            })}
                                        />}
                                        label="Online user block"
                                    />
                                </Box>

                                {renderSeatLayout(selectedLayout)}
                            </Box>)}


                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveEdit}

                                    sx={{marginRight: '8px'}}

                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        setBlockedSeats({})
                                        setShowSeatLayout(false)
                                        setOpenEdit(false)
                                    }}

                                    sx={{backgroundColor: 'gray'}}

                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Stack>)}
                    </Box>
                </Modal>

            </Box>
        </Container>
    </LocalizationProvider>);
};

export default BusSchedule;
