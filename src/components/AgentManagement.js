import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
    Stack,
    TablePagination,
    Checkbox,
    Divider,
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CloseIcon from '@mui/icons-material/Close';
import BusIcon from '@mui/icons-material/DirectionsBus';
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";
import { useLoading } from "../loading";

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const { startLoading, stopLoading } = useLoading();

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
        assignedBuses: [],
        managerMobile: "",
        bookingFee: "",
        agentCode: "",
    };

    const [selectedName, setSelectedName] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [busModalOpen, setBusModalOpen] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState(initialAgentState);

    const [paymentMethodOptions, setPaymentMethodsOptions] = useState([]);
    const [availableBuses, setAvailableBuses] = useState([]);

    // States for the assign modal (multi-select + filters + permissions)
    const [selectedBusIds, setSelectedBusIds] = useState([]);
    const [selectedClosePermissions, setSelectedClosePermissions] = useState({}); // { [busId]: boolean }
    const [allSelected, setAllSelected] = useState(false);
    const [globalClosePermission, setGlobalClosePermission] = useState(false);

    const [depotFilter, setDepotFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [scheduleFilter, setScheduleFilter] = useState('');

    const [alert, setAlert] = useState(null);

    const sendAlert = (text) => setAlert({ message: text, severity: "info" });
    const handleError = (err) => setAlert({ message: err?.response?.data?.message || err.message || 'Error', severity: "error" });

    const agentTypes = ["HGH", "CTB", "Private"];

    const loadAllBuses = () => {
        const id = startLoading();
        api.get('admin/agent/all-buses')
            .then(res => {
                stopLoading(id);
                setAvailableBuses(res.data || []);
            })
            .catch(err => {
                stopLoading(id);
                handleError(err);
            });
    };

    const loadAllPaymentMethods = () => {
        const id = startLoading();
        api.get('admin/agent/all-payment-options')
            .then(res => {
                stopLoading(id);
                setPaymentMethodsOptions(res.data || []);
            }).catch(err => {
                stopLoading(id);
                handleError(err);
            });
    };

    const loadAllAgents = () => {
        const L = startLoading();
        api.get('admin/agent/all')
            .then(res => {
                stopLoading(L);
                setAgents(res.data || []);
                // keep selectedAgent reference up-to-date
                if (selectedAgent) {
                    const updated = (res.data || []).find(a => a.id === selectedAgent.id);
                    if (updated) setSelectedAgent(updated);
                }
            })
            .catch(err => {
                stopLoading(L);
                handleError(err);
            });
    };

    useEffect(() => {
        loadAllPaymentMethods();
        loadAllBuses();
        loadAllAgents();
    }, []);

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
    const startIndex = page * rowsPerPage;

    const filteredAgents = agents.filter(agent => {
        const nameMatch = !selectedName || agent.name?.toLowerCase().includes(selectedName.toLowerCase());
        const idMatch = !selectedId || agent.id?.toString().includes(selectedId);
        return nameMatch && idMatch;
    });

    const getAvailableBuses = useCallback(() => {
        const assignedBusIds = selectedAgent?.assignedBuses?.map(bus => bus.id) || [];
        return (availableBuses || []).filter(bus => !assignedBusIds.includes(bus.id));
    }, [availableBuses, selectedAgent]);

    // Filters for assign modal (only show buses that match filters)
    const filteredAvailableBuses = useMemo(() => {
        const arr = getAvailableBuses();
        const depot = depotFilter?.trim().toLowerCase();
        const time = timeFilter?.trim().toLowerCase();
        const schedule = scheduleFilter?.trim().toLowerCase();
        console.log(time)
        return arr.filter(bus => {
            const depotOk = !depot || (bus.depot ?? '').toString().toLowerCase().includes(depot);
            // const timeOk = !time || (bus.time ?? '').toString().toLowerCase().includes(time);
            const timeOk = !time || (bus.time ?? []).some(t => t.toLowerCase().includes(time.toLowerCase()));
            const scheduleOk = !schedule || (bus.schedule ?? '').toString().toLowerCase().includes(schedule);
            return depotOk && timeOk && scheduleOk;
        });
    }, [getAvailableBuses, depotFilter, timeFilter, scheduleFilter]);

    // When user opens assign modal, reset selection states
    useEffect(() => {
        if (!assignModalOpen) return;
        setSelectedBusIds([]);
        setSelectedClosePermissions({});
        setAllSelected(false);
        setGlobalClosePermission(false);
    }, [assignModalOpen]);

    // Keep per-bus permission values in sync when globalClosePermission toggles
    useEffect(() => {
        setSelectedClosePermissions(prev => {
            const next = { ...prev };
            selectedBusIds.forEach(id => {
                next[id] = globalClosePermission;
            });
            return next;
        });
    }, [globalClosePermission]);

    // Ensure newly selected buses get a permission default
    useEffect(() => {
        setSelectedClosePermissions(prev => {
            const next = { ...prev };
            // add defaults for newly selected ids
            selectedBusIds.forEach(id => {
                if (!(id in next)) {
                    const bus = availableBuses.find(b => b.id === id);
                    next[id] = globalClosePermission || (bus?.close_permission ?? false);
                }
            });
            // remove perms for de-selected ids
            Object.keys(next).forEach(k => {
                if (!selectedBusIds.includes(k) && !selectedBusIds.includes(Number(k))) {
                    delete next[k];
                }
            });
            return next;
        });
        setAllSelected(selectedBusIds.length > 0 && selectedBusIds.length === filteredAvailableBuses.length);
    }, [selectedBusIds, availableBuses, filteredAvailableBuses, globalClosePermission]);

    // Single bus assign (kept for compatibility with older UI if needed)
    const assignBus = useCallback((bus, permission) => {
        if (!bus || !selectedAgent) return;
        const updatedAgent = {
            id: selectedAgent.id,
            assignedBuses: [...(selectedAgent.assignedBuses || []), { ...bus, close_permission: permission }],
        };
        const L = startLoading();
        api.post('admin/agent/assign-bus', updatedAgent)
            .then(res => {
                stopLoading(L);
                loadAllAgents();
                sendAlert('Bus assigned');
            })
            .catch(err => {
                stopLoading(L);
                handleError(err);
            });
    }, [selectedAgent]);

    // Remove bus (existing behavior)
    const removeBus = useCallback((busId) => {
        if (!selectedAgent) return;
        const updatedAgent = { id: selectedAgent.id, busId: busId };
        const L = startLoading();
        api.post('admin/agent/remove-bus', updatedAgent)
            .then(res => {
                stopLoading(L);
                loadAllAgents();
                sendAlert('Bus removed');
            })
            .catch(err => {
                stopLoading(L);
                handleError(err);
            });
    }, [selectedAgent]);

    // Handlers for assign modal selection
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setAllSelected(checked);
        if (checked) {
            const ids = filteredAvailableBuses.map(b => b.id);
            setSelectedBusIds(ids);
            const perms = {};
            filteredAvailableBuses.forEach(b => { perms[b.id] = globalClosePermission || b.close_permission || false; });
            setSelectedClosePermissions(perms);
        } else {
            setSelectedBusIds([]);
            setSelectedClosePermissions({});
        }
    };

    const toggleSelectBus = (busId) => {
        setSelectedBusIds(prev => {
            const exists = prev.includes(busId);
            if (exists) {
                return prev.filter(id => id !== busId);
            } else {
                return [...prev, busId];
            }
        });
    };

    const toggleBusClosePermission = (busId, checked) => {
        setSelectedClosePermissions(prev => ({ ...prev, [busId]: checked }));
    };

    // Assign all selected buses in one request (backend must accept assignedBuses array). 
    // If your backend expects a different shape (e.g. per-bus endpoint), replace this with a loop or change endpoint accordingly.
    const handleAssignSelected = async () => {
        if (!selectedAgent) {
            sendAlert('Select an agent first');
            return;
        }
        if (selectedBusIds.length === 0) return;

        const busesToAssign = (availableBuses || []).filter(b => selectedBusIds.includes(b.id)).map(b => ({ ...b, close_permission: selectedClosePermissions[b.id] ?? false }));
        const payload = {
            id: selectedAgent.id,
            assignedBuses: [...(selectedAgent.assignedBuses || []), ...busesToAssign],
        };

        const L = startLoading();
        api.post('admin/agent/assign-bus', payload)
            .then(res => {
                stopLoading(L);
                sendAlert('Selected buses assigned');
                setAssignModalOpen(false);
                // reset selection states
                setSelectedBusIds([]);
                setSelectedClosePermissions({});
                setAllSelected(false);
                setGlobalClosePermission(false);
                loadAllAgents();
            })
            .catch(err => {
                stopLoading(L);
                handleError(err);
            });
    };

    const handleDelete = (agent) => {
        const L = startLoading();
        api.post('admin/agent/delete', agent)
            .then(res => {
                stopLoading(L);
                loadAllAgents();
            })
            .catch(err => {
                stopLoading(L);
                handleError(err);
            });
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
        const L = startLoading();
        if (newAgent.id) {
            api.post('admin/agent/edit', newAgent)
                .then(res => {
                    stopLoading(L);
                    sendAlert('agent updated');
                    loadAllAgents();
                    handleModalClose();
                }).catch(err => {
                    stopLoading(L);
                    handleError(err);
                });
        } else {
            api.post('admin/agent/add', newAgent)
                .then(res => {
                    stopLoading(L);
                    sendAlert('new agent added');
                    loadAllAgents();
                    handleModalClose();
                }).catch(err => {
                    stopLoading(L);
                    handleError(err);
                });
        }
    };

    const handleBusAssignment = useCallback((agent) => {
        setSelectedAgent({ ...agent });
        setBusModalOpen(true);
    }, []);

    return (
        <Container component="main" maxWidth="lg">
            {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert} setOpen={setAlert} /> : null}

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Agent Management
                    </Typography>
                </Box>

                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 3, flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
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
                    <Button variant="contained" onClick={() => setAddModalOpen(true)} sx={{ padding: "6px 24px", fontWeight: "bold", borderRadius: "4px", height: "40px", backgroundColor: "#3f51b5", color: "#fff", "&:hover": { backgroundColor: "#303f9f" } }}>
                        Add New Agent
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#7cdffa4b' }}>
                                <TableCell sx={{ py: 1 }}>Agent ID</TableCell>
                                <TableCell sx={{ py: 1 }}>Agent Name</TableCell>
                                <TableCell sx={{ py: 1 }}>Mobile Number</TableCell>
                                <TableCell sx={{ py: 1 }}>Username</TableCell>
                                <TableCell sx={{ py: 1 }}>Status</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAgents.slice(startIndex, startIndex + rowsPerPage).map((agent) => (
                                <TableRow key={agent.id}>
                                    <TableCell sx={{ py: 0 }}>{agent.id}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{agent.name}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{agent.mobile}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{agent.username}</TableCell>
                                    <TableCell sx={{ py: 0 }}>
                                        <FormControlLabel
                                            control={<Switch checked={agent.status} onChange={() => {
                                                const L = startLoading();
                                                api.post('admin/agent/toggle-status', agent)
                                                    .then(res => { stopLoading(L); loadAllAgents(); })
                                                    .catch(err => { stopLoading(L); handleError(err); });
                                            }} />}
                                            label={agent.status ? "Active" : "Inactive"}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 0 }} align="right">
                                        <IconButton sx={{ color: 'green' }} onClick={() => handleBusAssignment(agent)}>
                                            <DirectionsBusIcon />
                                        </IconButton>

                                        <IconButton color="primary" onClick={() => handleEdit(agent)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(agent)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination component="div" count={filteredAgents.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[10, 25, 50, 100]} />
                </TableContainer>

                {/* Add/Edit Modal */}
                <Modal open={addModalOpen} onClose={handleModalClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: "10px", border: "2px solid gray", maxHeight: "90vh", overflow: "auto" }}>
                        <Typography variant="h6" gutterBottom>{newAgent.id ? 'Edit Agent' : 'Add New Agent'}</Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Agent Name" value={newAgent.name} onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" value={newAgent.mobile} onChange={(e) => setNewAgent(prev => ({ ...prev, mobile: e.target.value }))} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Address" value={newAgent.address} onChange={(e) => setNewAgent(prev => ({ ...prev, address: e.target.value }))} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="SMS Sender ID" value={newAgent.smsId} onChange={(e) => setNewAgent(prev => ({ ...prev, smsId: e.target.value }))} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Username" value={newAgent.username} onChange={(e) => setNewAgent(prev => ({ ...prev, username: e.target.value }))} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="Password" value={newAgent.password} onChange={(e) => setNewAgent(prev => ({ ...prev, password: e.target.value }))} /></Grid>
                            <Grid item xs={12} sm={6}><Autocomplete value={newAgent.agentType} onChange={(_, value) => setNewAgent(prev => ({ ...prev, agentType: value }))} options={agentTypes} renderInput={(params) => <TextField {...params} label="Agent Type" />} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth  label={newAgent.agentType === "Private" ? "BR Number" : "NIC"} value={newAgent.nic} onChange={(e) => setNewAgent(prev => ({ ...prev, nic: e.target.value }))} /></Grid>

                            {newAgent.agentType === "Private" && (
                                <>
                                    <Grid item xs={12} sm={6}><TextField fullWidth value={newAgent.bookingFee} onChange={(e) => setNewAgent(prev => ({ ...prev, bookingFee: e.target.value }))} label="Booking Fee" /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Agent Code" value={newAgent.agentCode} onChange={(e) => setNewAgent(prev => ({ ...prev, agentCode: e.target.value }))} /></Grid>
                                </>
                            )}

                            <Grid item xs={12} sm={6}><Autocomplete multiple value={newAgent.paymentMethods} onChange={(_, value) => setNewAgent(prev => ({ ...prev, paymentMethods: value }))} options={paymentMethodOptions} renderInput={(params) => <TextField {...params} label="Payment Methods" />} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Manager Mobile Number" value={newAgent.managerMobile} onChange={(e) => setNewAgent(prev => ({ ...prev, managerMobile: e.target.value }))} /></Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="contained" color="primary" onClick={handleSaveAgent} sx={{ marginRight: "8px" }}>{newAgent.id ? 'Update' : 'Save'}</Button>
                                <Button variant="contained" onClick={handleModalClose} sx={{ backgroundColor: 'gray', "&:hover": { backgroundColor: "#666" } }}>Cancel</Button>
                            </Box>
                        </Grid>
                    </Box>
                </Modal>

                {/* Bus Assignment Modal (view assigned) */}
                <Modal open={busModalOpen} onClose={() => setBusModalOpen(false)}>
                    <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 900, maxHeight: "90vh", overflow: "auto", p: 3, borderRadius: "12px" }}>
                        <Stack spacing={3}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" fontWeight={600}>Assigned Buses</Typography>
                                <Button variant="contained" startIcon={<BusIcon />} onClick={() => setAssignModalOpen(true)}>Assign Bus</Button>
                            </Stack>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bus ID</TableCell>
                                        <TableCell>Route</TableCell>
                                        <TableCell>Close Permission</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedAgent?.assignedBuses?.map((bus) => (
                                        <TableRow key={bus.id}>
                                            <TableCell>{bus.id}</TableCell>
                                            <TableCell>{bus.route}</TableCell>
                                            <TableCell>{bus.close_permission ? "Yes" : "No"}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => removeBus(bus.bus_id)} sx={{ color: "error.main" }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="contained" onClick={() => setBusModalOpen(false)} sx={{ backgroundColor: "gray", "&:hover": { backgroundColor: "#666" } }}>Close</Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Modal>

                {/* Assign Modal (select from all buses with filters + select all + per-bus permission) */}
                <Modal open={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
                    <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, maxHeight: "90vh", overflow: "auto", p: 3, borderRadius: "12px" }}>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} justifyContent="space-between">
                                <Typography variant="h6" fontWeight={600}>Assign New Bus</Typography>

                                <Stack direction="row" spacing={1} justifyContent="space-between">
                                    <Button variant="contained" onClick={handleAssignSelected} startIcon={<BusIcon />} disabled={!selectedAgent || selectedBusIds.length === 0}>Assign Selected</Button>
                                    <Button variant="outlined" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
                                </Stack>
                            </Stack>

                            {/* Filters */}
                            <Stack direction="row" spacing={2}>

                                <TextField label="Search by Depot" value={depotFilter} onChange={(e) => setDepotFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                        </InputAdornment>),
                                    }}
                                    sx={{
                                        width: 200, '& .MuiOutlinedInput-root': {
                                            height: '40px',
                                        }
                                    }} fullWidth />

                                <TextField type="time" label="Filter by Time" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                        </InputAdornment>),
                                    }}
                                    sx={{
                                        width: 200, '& .MuiOutlinedInput-root': {
                                            height: '40px',
                                        }
                                    }} fullWidth />
                                <TextField label="Filter by Schedule" value={scheduleFilter} onChange={(e) => setScheduleFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                        </InputAdornment>),
                                    }}
                                    sx={{
                                        width: 200, '& .MuiOutlinedInput-root': {
                                            height: '40px',
                                        }
                                    }} fullWidth />
                            </Stack>


                            <Divider />

                            {/* Bus list with checkboxes */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={allSelected} onChange={handleSelectAll} />
                                        </TableCell>
                                        <TableCell>Bus ID</TableCell>
                                        <TableCell>Route</TableCell>
                                        <TableCell>
                                            <FormControlLabel control={<Checkbox checked={globalClosePermission} onChange={(e) => setGlobalClosePermission(e.target.checked)} />} label="All Close Permission" />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAvailableBuses.map((bus) => (
                                        <TableRow key={bus.id}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedBusIds.includes(bus.id)} onChange={() => toggleSelectBus(bus.id)} />
                                            </TableCell>
                                            <TableCell>{bus.id}</TableCell>
                                            <TableCell>{bus.route}</TableCell>
                                            <TableCell>
                                                <Checkbox checked={!!selectedClosePermissions[bus.id]} onChange={(e) => toggleBusClosePermission(bus.id, e.target.checked)} disabled={!selectedBusIds.includes(bus.id)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>


                        </Stack>
                    </Paper>
                </Modal>

            </Box>
        </Container>
    );
};

export default AgentManagement;
