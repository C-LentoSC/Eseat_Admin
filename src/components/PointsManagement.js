import React, { useEffect, useState } from "react";
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
    TablePagination
} from "@mui/material";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
import {useLoading} from "../loading";

// import LoadingOverlay from './Parts/LoadingOverlay';

const PointsManagement = () => {
    
    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);


    const [points, setPoints] = useState([]);
    const [addmodel, setAddmodel] = useState(false);

    const [newPointName, setNewPointName] = useState("");
    const [open, setOpen] = useState(false);
    const [currentPoint, setCurrentPoint] = useState(null);
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })
    const [filterPointName, setFilterPointName] = useState("");
    const {startLoading,stopLoading}=useLoading()


    useEffect(() => {
        loadAllPoints()
    }, [])
    const loadAllPoints = () => {
        const L=startLoading()
        api.get("admin/points/get-all")
            .then(res => {
                stopLoading(L)
                setPoints(res.data)
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    }
    // Add New Point
    const handleAddPoint = () => {
        if (newPointName.trim()) {
            const id=startLoading()
            api.post("admin/points/add", { name: newPointName })
                .then(res => {
                    stopLoading(id)
                    loadAllPoints()
                    sendAlert(res.data.message || "new point added")
                    handleClose();
                })
                .catch(err=> {
                    stopLoading(id)
                    handleError(err)
                })

            setNewPointName("");
        }
    };

    // Open Edit Modal
    const handleOpen = (point) => {
        setCurrentPoint(point);
        setOpen(true);
    };

    // Close Modal
    const handleClose = () => {
        setCurrentPoint(null);
        setOpen(false);
        setAddmodel(false);
        setNewPointName("")
    };

    // Save Edited Point
    const handleSave = () => {
        const id = startLoading()
        api.post('admin/points/edit', currentPoint)
            .then(res => {
                stopLoading(id)
                sendAlert(res.data.message || "point edited")
                loadAllPoints()
                handleClose();
            })
            .catch(err=> {
                stopLoading(err)
                handleError(err)
            })
    };

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPoint({ ...currentPoint, [name]: value });
    };

    // Delete Point
    const handleDelete = (id) => {
        const L=startLoading()
        api.post('admin/points/delete', { id })
            .then(res => {
                stopLoading(L)
                sendAlert(res.data.message || "point deleted")
                loadAllPoints()
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })
    };

    const filteredPoint = points.filter(point => {
        const nameMatch = !filterPointName || point.name.toLowerCase().includes(filterPointName.toLowerCase());
        return nameMatch;
    });

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
        <Container component="main" maxWidth="lg">
          
           {/* <LoadingOverlay show={loading} /> */}
           
             {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                setOpen={setAlert} /> : <></>}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Title Section */}
                <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "20px" }}>
                    Points Management
                </Typography>


                <Modal open={addmodel} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: "90%",
                            maxWidth: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid gray',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '10px',
                        }}
                    >

                        <Typography variant="h6" gutterBottom>
                            Add Points
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Point Name"
                                    variant="outlined"
                                    required
                                    value={newPointName}
                                    onChange={(e) => setNewPointName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LoyaltyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddPoint}
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
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
                        <TextField
                            label="Point Name"
                            value={filterPointName}
                            onChange={(e) => setFilterPointName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 250,
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                }
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => setAddmodel(true)}
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
                        Add Points
                    </Button>
                </Box>

                {/* Table Section */}
                {/* <Typography variant="h6" sx={{ marginTop: "40px", marginBottom: "20px" }}>
                    All Points
                </Typography> */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Point Name</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPoint
                                .slice(startIndex, startIndex + rowsPerPage)
                                .map((point) => (
                                    <TableRow key={point.id}>
                                        <TableCell sx={{ py: 0 }}>{point.name}</TableCell>
                                        <TableCell sx={{ py: 0 }} align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpen(point)}
                                                sx={{ marginRight: "8px" }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(point.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        showFirstButton
                        showLastButton
                        component="div"
                        count={filteredPoint.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
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
                            Edit Point
                        </Typography>
                        <TextField
                            fullWidth
                            label="Point Name"
                            variant="outlined"
                            name="name"
                            value={currentPoint?.name || ""}
                            onChange={handleInputChange}
                            sx={{ marginBottom: "16px" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{ marginRight: "8px" }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                                sx={{ backgroundColor: "gray" }}
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

export default PointsManagement;
