import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Modal,
    TextField,
    Grid,
    Switch,
    FormControlLabel,
    Autocomplete,
    InputAdornment,
    Divider,
    Stack,
    TablePagination
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CloseIcon from '@mui/icons-material/Close';
import BusIcon from '@mui/icons-material/DirectionsBus';
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
import {useLoading} from "../loading";

// import LoadingOverlay from './Parts/LoadingOverlay';

const AgentManagement = () => {

    // const [loading, setLoading] = useState(false);
    // setLoading(true);
    // setLoading(false);

    const [agents, setAgents] = useState([]);
    const {startLoading, stopLoading} = useLoading()

    const initialAgentState = {
        name: "",
        mobile: "",
        address: "",
        nic: "",
        username: "",
        password: "",
        smsId: "",
        agentType: "",
        paymentMethods: [],
        status: true,
        assignedBuses: []
    };

    const [selectedName, setSelectedName] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [busModalOpen, setBusModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState(initialAgentState);
    const [selectedBus, setSelectedBus] = useState(null);

    const agentTypes = ["HGH", "CTB", "Private"];
    const [paymentMethodOptions, setPaymentMethodsOptions] = useState([]);
    const [availableBuses, setAvailableBuses] = useState([]);
    const loadAllBuses = () => {
        const id = startLoading()
        api.get('admin/agent/all-buses')
            .then(res => {
                stopLoading(id)
                setAvailableBuses(res.data)
            })
            .catch(err => {
                stopLoading(id)
                handleError(err)
            })
    }
    const loadAllPaymentMethods = () => {
        const id = startLoading()
        api.get('admin/agent/all-payment-options')
            .then(res => {
                stopLoading(id)
                setPaymentMethodsOptions(res.data)
            }).catch(err => {
            stopLoading(id)
            handleError(err)
        })
    }
    const loadAllAgents = () => {
        const L = startLoading()
        api.get('admin/agent/all')
            .then(res => {
                stopLoading(L)
                setAgents(res.data)
                if (selectedAgent) {
                    res.data.forEach(a => {
                        if (selectedAgent.id === a.id) setSelectedAgent(a)
                    })
                }
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    }
    useEffect(() => {
        loadAllPaymentMethods()
        loadAllBuses()
        loadAllAgents()
    }, []);
    const handleDelete = (agent) => {
        const L = startLoading()
        api.post('admin/agent/delete', agent)
            .then(res => {
                stopLoading(L)

                loadAllAgents()
            })
            .catch(err => {
                stopLoading(L)
                handleError(err)
            })
    };

    const handleEdit = (agent) => {
        setNewAgent(agent);
        setAddModalOpen(true);
    };

    const handleModalClose = () => {
        setAddModalOpen(false);
        setNewAgent(initialAgentState);
    };

    const handleSaveAgent = () => {
        const L = startLoading()
        if (newAgent.id) {
            api.post('admin/agent/edit', newAgent)
                .then(res => {
                    stopLoading(L)
                    sendAlert('agent updated')
                    loadAllAgents()
                    handleModalClose();
                }).catch(err => {
                stopLoading(L)
                handleError(err)
            })
        } else {
            api.post('admin/agent/add', newAgent)
                .then(res => {
                    stopLoading(L)
                    sendAlert('new agent added')
                    loadAllAgents()
                    handleModalClose();
                }).catch(err=> {
                    stopLoading(L)
                handleError(err)
            })
        }


    };

    const handleBusAssignment = useCallback((agent) => {
        setSelectedAgent({ ...agent });
        setBusModalOpen(true);
    }, []);

    const assignBus = useCallback((bus) => {
        if (!bus) return;


        const updatedAgent = {
            id: selectedAgent.id, assignedBuses: [...selectedAgent.assignedBuses, bus]
        };
        const L = startLoading()
        api.post('admin/agent/assign-bus', updatedAgent)
            .then(res => {
                stopLoading(L)
                loadAllAgents()
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })


        setSelectedBus(null); // Reset selection
    }, [selectedAgent]);

    const removeBus = useCallback((busId) => {

        const updatedAgent = {
            id: selectedAgent.id, busId: busId
        }
        const L=startLoading()
        api.post('admin/agent/remove-bus', updatedAgent)
            .then(res => {
                stopLoading(L)

                loadAllAgents()
            })
            .catch(err=> {
                stopLoading(L)
                handleError(err)
            })


    }, [selectedAgent]);
    const filteredAgents = agents.filter(agent => {
        const nameMatch = !selectedName || agent.name.toLowerCase().includes(selectedName.toLowerCase());
        const idMatch = !selectedId || agent.id.toString().includes(selectedId);
        return nameMatch && idMatch;
    });

    const getAvailableBuses = () => {
        const assignedBusIds = selectedAgent?.assignedBuses.map(bus => bus.id) || [];
        return availableBuses.filter(bus => !assignedBusIds.includes(bus.id));
    };
    const [alert, setAlert] = useState(null)
    const sendAlert = (text) => setAlert({ message: text, severity: "info" })
    const handleError = (err) => setAlert({ message: err.response.data.message, severity: "error" })


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

    return (<Container component="main" maxWidth="lg">

        {/* <LoadingOverlay show={loading} /> */}

        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
                <Typography variant="h5" sx={{fontWeight: 600}}>
                    Agent Management
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
                    <TextField
                        label="Agent Name"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
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
                    <TextField
                        label="Agent ID"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
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
                    Add New Agent
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                            <TableCell sx={{py: 1}}>Agent ID</TableCell>
                            <TableCell sx={{py: 1}}>Agent Name</TableCell>
                            <TableCell sx={{py: 1}}>Mobile Number</TableCell>
                            <TableCell sx={{py: 1}}>Username</TableCell>
                            <TableCell sx={{py: 1}}>Status</TableCell>
                            <TableCell sx={{py: 1}} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAgents
                            .slice(startIndex, startIndex + rowsPerPage)
                            .map((agent) => (<TableRow key={agent.id}>
                                <TableCell sx={{py: 0}}>{agent.id}</TableCell>
                                <TableCell sx={{py: 0}}>{agent.name}</TableCell>
                                <TableCell sx={{py: 0}}>{agent.mobile}</TableCell>
                                <TableCell sx={{py: 0}}>{agent.username}</TableCell>
                                <TableCell sx={{py: 0}}>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={agent.status}
                                            onChange={() => {
                                                const L=startLoading()
                                                api.post('admin/agent/toggle-status', agent)
                                                    .then(res => {
                                                        stopLoading(L)
                                                        loadAllAgents()
                                                    })
                                                    .catch(err=> {
                                                        stopLoading(L)
                                                        handleError(err)
                                                    })
                                            }}
                                        />}
                                        label={agent.status ? "Active" : "Inactive"}
                                    />
                                </TableCell>
                                <TableCell sx={{py: 0}} align="right">
                                    <IconButton
                                        sx={{color: 'green'}}
                                        onClick={() => handleBusAssignment(agent)}
                                    >
                                        <DirectionsBusIcon/>
                                    </IconButton>

                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(agent)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(agent)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredAgents.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                />
            </TableContainer>


            {/* Add/Edit Modal */}
            <Modal
                open={addModalOpen}
                onClose={handleModalClose}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "10px",
                    border: "2px solid gray",
                    maxHeight: "90vh",
                    overflow: "auto",
                    
                }}>
                    <Typography variant="h6" gutterBottom>
                        {newAgent.id ? 'Edit Agent' : 'Add New Agent'}
                    </Typography>


                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Agent Name"
                                value={newAgent.name}
                                onChange={(e) => setNewAgent(prev => ({...prev, name: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                value={newAgent.mobile}
                                onChange={(e) => setNewAgent(prev => ({...prev, mobile: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={newAgent.address}
                                onChange={(e) => setNewAgent(prev => ({...prev, address: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="NIC"
                                value={newAgent.nic}
                                onChange={(e) => setNewAgent(prev => ({...prev, nic: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="SMS Sender ID"
                                value={newAgent.smsId}
                                onChange={(e) => setNewAgent(prev => ({...prev, smsId: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={newAgent.username}
                                onChange={(e) => setNewAgent(prev => ({...prev, username: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                value={newAgent.password}
                                onChange={(e) => setNewAgent(prev => ({...prev, password: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                value={newAgent.agentType}
                                onChange={(_, value) => setNewAgent(prev => ({...prev, agentType: value}))}
                                options={agentTypes}
                                renderInput={(params) => <TextField {...params} label="Agent Type"/>}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                multiple
                                value={newAgent.paymentMethods}
                                onChange={(_, value) => setNewAgent(prev => ({...prev, paymentMethods: value}))}
                                options={paymentMethodOptions}
                                renderInput={(params) => <TextField {...params} label="Payment Methods"/>}
                            />
                        </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Manager Mobile Number"
                                // value={newAgent.mobile}
                                // onChange={(e) => setNewAgent(prev => ({...prev, mobile: e.target.value}))}
                            />
                        </Grid>
                    </Grid>


                    <Grid item xs={12} sx={{mt: 3}}>
                        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveAgent}
                                sx={{marginRight: "8px"}}
                            >
                                {newAgent.id ? 'Update' : 'Save'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleModalClose}
                                sx={{
                                    backgroundColor: 'gray', "&:hover": {
                                        backgroundColor: "#666",
                                    },
                                }}
                            >
                                Cancel
                            </Button>

                        </Box>
                    </Grid>

                </Box>
            </Modal>

            {/* Bus Assignment Modal */}
            <Modal
                open={busModalOpen}
                onClose={() => setBusModalOpen(false)}
            >
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "10px",
                    border: "2px solid gray"
                }}>
                    <Stack spacing={3}>
                        <Typography variant="h5" sx={{fontWeight: 600}}>
                            Manage Bus Assignments
                        </Typography>

                        <Box>
                            <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 500}}>
                                Assign New Bus:
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Autocomplete
                                    value={selectedBus}
                                    onChange={(_, newValue) => setSelectedBus(newValue)}
                                    options={getAvailableBuses()}
                                    getOptionLabel={(option) => `( ${option.id} ) ${option.route}`}
                                    renderInput={(params) => (<TextField
                                        {...params}
                                        label="Select Bus"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (<InputAdornment position="start">
                                            </InputAdornment>),
                                        }}
                                        sx={{
                                            minwidth: 300, '& .MuiOutlinedInput-root': {
                                                height: '40px',
                                            }
                                        }}
                                    />)}
                                    sx={{flex: 1}}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => assignBus(selectedBus)}
                                    disabled={!selectedBus}
                                    sx={{height: '40px'}}
                                    startIcon={<BusIcon/>}

                                >
                                    Assign Bus
                                </Button>
                            </Stack>
                        </Box>

                        <Divider/>

                        <Box>
                            <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 500}}>
                                Currently Assigned Buses:
                            </Typography>
                            <Grid container spacing={2}>
                                {selectedAgent?.assignedBuses.map((bus) => (<Grid item xs={12} sm={6} key={bus.id}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            bgcolor: 'background.default',
                                            position: 'relative',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            }
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => removeBus(bus.bus_id)}
                                            sx={{
                                                position: 'absolute', right: 8, top: 8, color: 'error.main'
                                            }}
                                        >
                                            <CloseIcon/>
                                        </IconButton>
                                        <Stack spacing={1}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <BusIcon color="primary"/>
                                                <Typography variant="subtitle2" color="primary">
                                                    {bus.route}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Bus ID: {bus.id}
                                            </Typography>
                                        </Stack>
                                    </Paper>
                                </Grid>))}
                            </Grid>
                        </Box>

                        <Grid item xs={12} sx={{mt: 3}}>
                            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                                <Button
                                    variant="contained"
                                    onClick={() => setBusModalOpen(false)}
                                    sx={{
                                        backgroundColor: 'gray', "&:hover": {
                                            backgroundColor: "#666",
                                        },
                                    }}
                                >
                                    Close
                                </Button>

                            </Box>
                        </Grid>

                    </Stack>
                </Paper>
            </Modal>

        </Box>
    </Container>);

};

export default AgentManagement;
