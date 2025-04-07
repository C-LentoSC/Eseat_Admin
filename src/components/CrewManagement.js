import React, {useEffect, useState} from "react";
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
    TablePagination
} from "@mui/material";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateCalendar, DatePicker} from '@mui/x-date-pickers';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from 'dayjs';
import {setroutval} from "./DashboardLayoutAccount";
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
import {useLoading} from "../loading";

// import CustomAlert from "./Parts/CustomAlert";

// import LoadingOverlay from './Parts/LoadingOverlay';

const CrewManagement = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


    const BusID = sessionStorage.getItem('currentValueID');
    const {startLoading, stopLoading} = useLoading()
    const [alert, setAlert] = useState(null);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})
    const [editMode, setEditMode] = useState(false)
    const [details, setDetailes] =
        useState({
            routID: BusID,
            ScheduleNum: "",
            CityName: "",
        });
    useEffect(() => {
        loadInfo()
    }, []);
    const loadInfo = () => {
        const L = startLoading()
        api.get('admin/bus/crew/' + BusID + '/info')
            .then(res => {
                stopLoading(L)
                setDetailes(res.data.main)
                setCrew(res.data.crew)
            }).catch(err => {
            stopLoading(L)
            handleError(err)
        })
    }

    const [crew, setCrew] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentCrew, setCurrentCrew] = useState(null);

    const [formData, setFormData] = useState({});

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
        let arr = []
        if (selectedDates.length > 0) {
            const newCrewEntries = selectedDates.map((date, index) => ({
                busId: BusID,
                ...formData,
                travelDate: date
            }));
            arr.push(...newCrewEntries)
        } else {

            arr.push({
                busId: BusID,
                ...formData,
                travelDate: dayjs(formData.travelDate).format('YYYY-MM-DD')
            });
        }
        arr.forEach(o => {
            const L = startLoading()
            api.post('admin/bus/crew/add', o).then(res => {
                stopLoading(L)
                sendAlert('new member added')
                loadInfo()
                handleCloseAdd();
            }).catch(err => {
                stopLoading(L)
                handleError(err)
            })
        })
    };

    const handleEdit = (item) => {
        setCurrentCrew({
            ...item,
            travelDate: dayjs(item.travelDate)
        });
        setOpenEdit(true);
    };

    const handleSaveEdit = () => {
        // setCrew(crew.map(item =>
        //     item.id === currentCrew.id ? {
        //         ...currentCrew,
        //         travelDate: dayjs(currentCrew.travelDate).format('YYYY-MM-DD')
        //     } : item
        // ));
        const L = startLoading()
        api.post('admin/bus/crew/edit', {
            ...currentCrew,
            travelDate: dayjs(currentCrew.travelDate).format('YYYY-MM-DD')
        }).then(res => {
            stopLoading(L)
            sendAlert('updated')
            loadInfo()
            setOpenEdit(false);
        }).catch(err => {
            stopLoading(L)
            handleError(err)
        })
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
        const L = startLoading()
        api.post('admin/bus/crew/delete', {id})
            .then(res => {
                stopLoading(L)
                sendAlert('deleted')
                loadInfo()
            }).catch(err => {
            stopLoading(L)
            handleError(err)
        })
    };

    const DateSelectionSection = () => (
        <Box sx={{border: 1, borderColor: 'divider', p: 2, borderRadius: 1}}>
            <Typography sx={{mb: 1}}>Selected Travel Dates:</Typography>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg">

                {/* <LoadingOverlay show={loading} /> */}

                {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                      setOpen={setAlert}/> : <></>}
                <Box sx={{display: "flex", flexDirection: "column", gap: 3, py: 2}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <IconButton onClick={handleBackClick} sx={{marginRight: "10px", padding: '0'}}>
                                <ArrowBackIcon/>
                            </IconButton>
                            <Typography variant="h5" sx={{fontWeight: 600, display: 'flex'}}>
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
                                <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                    <TableCell sx={{py: 1}}>Conductor Name</TableCell>
                                    <TableCell sx={{py: 1}}>Bus Number</TableCell>
                                    <TableCell sx={{py: 1}}>Contact No</TableCell>
                                    <TableCell sx={{py: 1}}>Travel Date</TableCell>
                                    <TableCell sx={{py: 1}}>Username</TableCell>
                                    <TableCell sx={{py: 1}} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {crew
                                    .slice(startIndex, startIndex + rowsPerPage)
                                    .map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell sx={{py: 0}}>{item.conductorName}</TableCell>
                                            <TableCell sx={{py: 0}}>{item.busNumber}</TableCell>
                                            <TableCell sx={{py: 0}}>{item.contactNo}</TableCell>
                                            <TableCell sx={{py: 0}}>{item.travelDate}</TableCell>
                                            <TableCell sx={{py: 0}}>{item.userName}</TableCell>
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
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={crew.length}
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
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            maxHeight: "90vh",
                            overflow: "auto",
                            borderRadius: "10px",
                            border: "2px solid gray",
                        }}>
                            <Typography variant="h6" sx={{mb: 3}}>Add New Crew Member</Typography>

                            <Stack spacing={3}>
                                <TextField
                                    label="Conductor Name"
                                    value={formData.conductorName}
                                    onChange={(e) => setFormData({...formData, conductorName: e.target.value})}
                                />
                                <TextField
                                    label="Bus Number"
                                    value={formData.busNumber}
                                    onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                                />
                                <TextField
                                    label="Contact No"
                                    value={formData.contactNo}
                                    onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                                />
                                <TextField
                                    label="Username"
                                    value={formData.userName}
                                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                                />

                                <DateSelectionSection/>

                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        sx={{marginRight: '8px'}}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
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
                            width: 600,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            maxHeight: "90vh",
                            overflow: "auto",
                            borderRadius: "10px",
                            border: "2px solid gray",
                        }}>
                            <Typography variant="h6" sx={{mb: 3}}>Edit Crew Member</Typography>

                            {currentCrew && (
                                <Stack spacing={3}>
                                    <TextField
                                        label="Conductor Name"
                                        value={currentCrew.conductorName}
                                        onChange={(e) => setCurrentCrew({
                                            ...currentCrew,
                                            conductorName: e.target.value
                                        })}
                                    />
                                    <TextField
                                        label="Bus Number"
                                        value={currentCrew.busNumber}
                                        onChange={(e) => setCurrentCrew({...currentCrew, busNumber: e.target.value})}
                                    />
                                    <TextField
                                        label="Contact No"
                                        value={currentCrew.contactNo}
                                        onChange={(e) => setCurrentCrew({...currentCrew, contactNo: e.target.value})}
                                    />
                                    <TextField
                                        label="Username"
                                        value={currentCrew.userName}
                                        onChange={(e) => setCurrentCrew({...currentCrew, userName: e.target.value})}
                                    />
                                    <DatePicker
                                        label="Travel Date"
                                        value={currentCrew.travelDate}
                                        onChange={(date) => setCurrentCrew({...currentCrew, travelDate: date})}
                                    />

                                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveEdit}
                                            sx={{marginRight: '8px'}}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => setOpenEdit(false)}
                                            sx={{backgroundColor: 'gray'}}
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