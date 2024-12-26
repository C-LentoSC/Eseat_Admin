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
    Chip,
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

const CrewManagement = () => {

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


    const [crew, setCrew] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentCrew, setCurrentCrew] = useState(null);

    const [formData, setFormData] = useState({
        conductorName: "",
        busNumber: "",
        contactNo: "",
        userName: "",
        travelDate: dayjs(),
    });

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
        if (selectedDates.length > 0) {
            const newCrewEntries = selectedDates.map((date, index) => ({
                id: Date.now() + index,
                ...formData,
                travelDate: date
            }));
            setCrew([...crew, ...newCrewEntries]);
        } else {
            setCrew([...crew, {
                id: Date.now(),
                ...formData,
                travelDate: dayjs(formData.travelDate).format('YYYY-MM-DD')
            }]);
        }
        handleCloseAdd();
    };

    const handleEdit = (item) => {
        setCurrentCrew({
            ...item,
            travelDate: dayjs(item.travelDate)
        });
        setOpenEdit(true);
    };

    const handleSaveEdit = () => {
        setCrew(crew.map(item =>
            item.id === currentCrew.id ? {
                ...currentCrew,
                travelDate: dayjs(currentCrew.travelDate).format('YYYY-MM-DD')
            } : item
        ));
        setOpenEdit(false);
    };

    const handleOpenAdd = () => setOpenAdd(true);

    const handleCloseAdd = () => {
        setOpenAdd(false);
        setFormData({
            conductorName: "",
            busNumber: "",
            contactNo: "",
            userName: "",
            travelDate: dayjs(),
        });
        setSelectedDates([]);
    };

    const handleDelete = (id) => {
        setCrew(crew.filter(item => item.id !== id));
    };

    const DateSelectionSection = () => (
        <Box sx={{ border: 1, borderColor: 'divider', p: 2, borderRadius: 1 }}>
            <Typography sx={{ mb: 1 }}>Selected Travel Dates:</Typography>
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
                            Manage Crew (
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
                            Add New Crew
                        </Button>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Conductor Name</TableCell>
                                    <TableCell>Bus Number</TableCell>
                                    <TableCell>Contact No</TableCell>
                                    <TableCell>Travel Date</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {crew.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.conductorName}</TableCell>
                                        <TableCell>{item.busNumber}</TableCell>
                                        <TableCell>{item.contactNo}</TableCell>
                                        <TableCell>{item.travelDate}</TableCell>
                                        <TableCell>{item.userName}</TableCell>
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
                            <Typography variant="h6" sx={{ mb: 3 }}>Add New Crew Member</Typography>

                            <Stack spacing={3}>
                                <TextField
                                    label="Conductor Name"
                                    value={formData.conductorName}
                                    onChange={(e) => setFormData({ ...formData, conductorName: e.target.value })}
                                />
                                <TextField
                                    label="Bus Number"
                                    value={formData.busNumber}
                                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                                />
                                <TextField
                                    label="Contact No"
                                    value={formData.contactNo}
                                    onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                                />
                                <TextField
                                    label="Username"
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                />

                                <DateSelectionSection />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        sx={{ marginRight: '8px' }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
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
                            <Typography variant="h6" sx={{ mb: 3 }}>Edit Crew Member</Typography>

                            {currentCrew && (
                                <Stack spacing={3}>
                                    <TextField
                                        label="Conductor Name"
                                        value={currentCrew.conductorName}
                                        onChange={(e) => setCurrentCrew({ ...currentCrew, conductorName: e.target.value })}
                                    />
                                    <TextField
                                        label="Bus Number"
                                        value={currentCrew.busNumber}
                                        onChange={(e) => setCurrentCrew({ ...currentCrew, busNumber: e.target.value })}
                                    />
                                    <TextField
                                        label="Contact No"
                                        value={currentCrew.contactNo}
                                        onChange={(e) => setCurrentCrew({ ...currentCrew, contactNo: e.target.value })}
                                    />
                                    <TextField
                                        label="Username"
                                        value={currentCrew.userName}
                                        onChange={(e) => setCurrentCrew({ ...currentCrew, userName: e.target.value })}
                                    />
                                    <DatePicker
                                        label="Travel Date"
                                        value={currentCrew.travelDate}
                                        onChange={(date) => setCurrentCrew({ ...currentCrew, travelDate: date })}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveEdit}
                                            sx={{ marginRight: '8px' }}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="contained"
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

export default CrewManagement;