import React, { useState } from "react";
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
    Checkbox
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from 'dayjs';
import { setroutval } from "./DashboardLayoutAccount";

// import CustomAlert from "./Parts/CustomAlert";

const BusSchedule = () => {
    //   const BusID = sessionStorage.getItem('currentValueID');

    // const [alert, setAlert] = useState(null);
    // const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    // const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })

    const details =
    {
        routID: 1,
        ScheduleNum: "KN08-0600MC",
        CityName: "Colombo-Ampara",
    };

    const [schedule, setSchedule] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [enableMultiDates, setEnableMultiDates] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);

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
        closingTime: ""
    });

    const cities = ["Colombo", "Ampara", "Kandy", "Galle", "Jaffna"];

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
        if (enableMultiDates && selectedDates.length > 0) {
            const baseTravel = dayjs(formData.travelDate);
            const baseEnd = dayjs(formData.endDate);
            const baseClose = dayjs(formData.closingDate);

            // Calculate the differences
            const endDiff = baseEnd.diff(baseTravel, 'day');
            const closeDiff = baseClose.diff(baseTravel, 'day');

            const newSchedules = selectedDates.map((date, index) => {
                const currentTravel = dayjs(date);
                return {
                    id: Date.now() + index,
                    ...formData,
                    travelDate: currentTravel.format('YYYY-MM-DD'),
                    endDate: currentTravel.add(endDiff, 'day').format('YYYY-MM-DD'),
                    closingDate: currentTravel.add(closeDiff, 'day').format('YYYY-MM-DD')
                };
            });

            setSchedule([...schedule, ...newSchedules]);
        } else {
            setSchedule([...schedule, {
                id: Date.now(),
                ...formData,
                travelDate: dayjs(formData.travelDate).format('YYYY-MM-DD'),
                endDate: dayjs(formData.endDate).format('YYYY-MM-DD'),
                closingDate: dayjs(formData.closingDate).format('YYYY-MM-DD')
            }]);
        }
        handleCloseAdd();
    };

    const handleEdit = (item) => {
        setCurrentSchedule({
            ...item,
            travelDate: dayjs(item.travelDate),
            endDate: dayjs(item.endDate),
            closingDate: dayjs(item.closingDate)
        });
        setOpenEdit(true);
    };

    const handleSaveEdit = () => {
        setSchedule(schedule.map(item =>
            item.id === currentSchedule.id ? {
                ...currentSchedule,
                travelDate: dayjs(currentSchedule.travelDate).format('YYYY-MM-DD'),
                endDate: dayjs(currentSchedule.endDate).format('YYYY-MM-DD'),
                closingDate: dayjs(currentSchedule.closingDate).format('YYYY-MM-DD')
            } : item
        ));
        setOpenEdit(false);
    };

    const handleOpenAdd = () => setOpenAdd(true);

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
            closingTime: ""
        });
        setSelectedDates([]);
        setEnableMultiDates(false);
    };

    const handleDelete = (id) => {
        setSchedule(schedule.filter(item => item.id !== id));
    };

    const DateInputSection = ({ formData, setFormData, enableMultiDates }) => (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
                <DatePicker
                    label="Travel Date"
                    value={formData.travelDate}
                    onChange={(date) => setFormData({ ...formData, travelDate: date })}
                />
                <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                    minDate={formData.travelDate}
                />
                <DatePicker
                    label="Closing Date"
                    value={formData.closingDate}
                    onChange={(date) => setFormData({ ...formData, closingDate: date })}
                />
            </Box>
            {enableMultiDates && (
                <Box sx={{ border: 1, borderColor: 'divider', p: 2, borderRadius: 1 }}>
                    <Typography sx={{ mb: 1 }}>Selected Additional Dates:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {selectedDates.map(date => (
                            <Chip
                                key={date}
                                label={date}
                                onDelete={() => setSelectedDates(prev => prev.filter(d => d !== date))}
                            />
                        ))}
                    </Box>
                    <DateCalendar
                        value={null}
                        onChange={handleDateSelect}
                        minDate={dayjs()}
                    />
                </Box>
            )}
        </Box>
    );

    const handleBackClick = () => {
        setroutval('/busManagement', '00');
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <IconButton onClick={handleBackClick} sx={{ marginRight: "10px", padding: '0' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex' }}>
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
                            Add Schedule
                        </Button>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>From - To</TableCell>
                                    <TableCell>Travel Date</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Closing Date</TableCell>
                                    <TableCell>ClosingTimes</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schedule.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.from} - {item.to}</TableCell>
                                        <TableCell>{item.travelDate}</TableCell>
                                        <TableCell>{item.startTime}</TableCell>
                                        <TableCell>{item.endDate}</TableCell>
                                        <TableCell>{item.endTime}</TableCell>
                                        <TableCell>{item.closingDate}</TableCell>
                                        <TableCell>
                                            {item.closingTime}
                                        </TableCell>
                                        <TableCell align="right">

                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(item)}
                                                sx={{ marginRight: "8px" }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>


                    {/* Add Modal */}
                    <Modal open={openAdd} onClose={handleCloseAdd}>
                        <Box sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            maxHeight: "90vh",
                            overflow: "auto",
                            borderRadius: "10px",
                            border: "2px solid gray",
                        }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Add New Schedule</Typography>

                            <Stack spacing={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={enableMultiDates}
                                            onChange={(e) => setEnableMultiDates(e.target.checked)}
                                        />
                                    }
                                    label="multiple dates selection"
                                />

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <TextField
                                        label="Travel Name"
                                        value={formData.travelName}
                                        onChange={(e) => setFormData({ ...formData, travelName: e.target.value })}
                                    />
                                    <TextField
                                        label="Bus Number"
                                        value={formData.busNumber}
                                        onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                                    />
                                </Box>

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <Autocomplete
                                        value={formData.from}
                                        onChange={(_, value) => setFormData({ ...formData, from: value })}
                                        options={cities}
                                        renderInput={(params) => <TextField {...params} label="From" />}
                                    />
                                    <Autocomplete
                                        value={formData.to}
                                        onChange={(_, value) => setFormData({ ...formData, to: value })}
                                        options={cities}
                                        renderInput={(params) => <TextField {...params} label="To" />}
                                    />
                                </Box>

                                <DateInputSection
                                    formData={formData}
                                    setFormData={setFormData}
                                    enableMultiDates={enableMultiDates}
                                />

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                                    <TextField
                                        type="time"
                                        label="Start Time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        type="time"
                                        label="End Time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        type="time"
                                        label="Closing Time"
                                        value={formData.closingTime}
                                        onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
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
                                        onClick={handleCloseAdd}
                                        sx={{ backgroundColor: 'gray' }}
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
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            maxHeight: "90vh",
                            overflow: "auto",
                            borderRadius: "10px",
                            border: "2px solid gray",
                        }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Edit Schedule</Typography>

                            {currentSchedule && (
                                <Stack spacing={3}>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <TextField
                                            label="Travel Name"
                                            value={currentSchedule.travelName}
                                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, travelName: e.target.value })}
                                        />
                                        <TextField
                                            label="Bus Number"
                                            value={currentSchedule.busNumber}
                                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, busNumber: e.target.value })}
                                        />
                                    </Box>

                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <Autocomplete
                                            value={currentSchedule.from}
                                            onChange={(_, value) => setCurrentSchedule({ ...currentSchedule, from: value })}
                                            options={cities}
                                            renderInput={(params) => <TextField {...params} label="From" />}
                                        />
                                        <Autocomplete
                                            value={currentSchedule.to}
                                            onChange={(_, value) => setCurrentSchedule({ ...currentSchedule, to: value })}
                                            options={cities}
                                            renderInput={(params) => <TextField {...params} label="To" />}
                                        />
                                    </Box>

                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                                        <DatePicker
                                            label="Travel Date"
                                            value={currentSchedule.travelDate}
                                            onChange={(date) => setCurrentSchedule({ ...currentSchedule, travelDate: date })}
                                        />
                                        <DatePicker
                                            label="End Date"
                                            value={currentSchedule.endDate}
                                            onChange={(date) => setCurrentSchedule({ ...currentSchedule, endDate: date })}
                                        />
                                        <DatePicker
                                            label="Closing Date"
                                            value={currentSchedule.closingDate}
                                            onChange={(date) => setCurrentSchedule({ ...currentSchedule, closingDate: date })}
                                        />
                                    </Box>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                                        <TextField
                                            type="time"
                                            label="Start Time"
                                            value={currentSchedule.startTime}
                                            onChange={(date) => setCurrentSchedule({
                                                ...currentSchedule, startTime: date.target.value
                                            })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            type="time"
                                            label="End Time"
                                            value={currentSchedule.endTime}
                                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, endTime: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            type="time"
                                            label="Closing Time"
                                            value={currentSchedule.closingTime}
                                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, closingTime: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveEdit}
                                            sx={{ marginRight: '8px' }}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setOpenEdit(false)}
                                            sx={{ backgroundColor: 'gray' }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Stack>
                            )}
                        </Box>
                    </Modal>

                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default BusSchedule;