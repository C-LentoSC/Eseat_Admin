import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";

const UserRegistrationPage = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [roles, setRoles] = useState([])
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [role_id, setRole_id] = useState()
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        api.get('admin/get-roles').then(r => {
            setRoles(r.data)
        })
        loadAllUsers()

    }, []);
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})
    const loadAllUsers = () => {
        api.get('admin/manage-admin/all').then(r => {
            setUsers(r.data)
        }).catch(handleError)
    }
    const saveNewUser = () => {
        api.post('admin/manage-admin/add', {name, username, email, mobile, password, role_id}).then(r => {
            if (r.data.status === "ok") {
                sendAlert("new user added")
                loadAllUsers()
            } else {
                console.log(r)
            }
        })
            .catch(handleError)
    }
    const handleOpen = (user) => {
        setCurrentUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentUser(null);
        setOpen(false);
    };

    const handleSave = () => {
        // Logic to save user details
        // console.log(currentUser)
        api.post('admin/manage-admin/update', currentUser)
            .then(r => {
                if (r.data.status === "ok") {
                    sendAlert("user is updated")
                    loadAllUsers();
                }
            })
            .catch(handleError)
        handleClose();
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCurrentUser({...currentUser, [name]: value});

    };
    const handleDeleteUser = (user) => {
        api.post("admin/manage-admin/delete", {id: user.id})
            .then(res => {
                sendAlert(res.data.message)
                loadAllUsers()
            })
            .catch(handleError)
    }


    return (<Container component="main" maxWidth="lg" sx={{py: 0}}>
        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            {/* Title Section */}
            <Typography variant="h5" sx={{fontWeight: 600, marginBottom: '20px'}}>
                User Registration
            </Typography>

            {/* Registration Form Section */}
            <Box component="form" sx={{width: '100%'}}>
                {/* First Row (3 fields) */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={evt => setName(evt.target.value)}
                            label="Full Name"
                            variant="outlined"
                            required
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <PersonIcon/>
                                </InputAdornment>),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            value={email}
                            onChange={evt => setEmail(evt.target.value)}
                            label="Email"
                            variant="outlined"
                            required
                            type="email"
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <EmailIcon/>
                                </InputAdornment>),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            value={mobile}
                            onChange={evt => setMobile(evt.target.value)}
                            label="Mobile Number"
                            variant="outlined"
                            required
                            type="tel"
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <PhoneIcon/>
                                </InputAdornment>),
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{marginTop: '20px'}}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            value={username}
                            onChange={evt => setUsername(evt.target.value)}
                            label="Username"
                            variant="outlined"
                            required
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <AccountCircleIcon/>
                                </InputAdornment>),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            value={password}
                            onChange={evt => setPassword(evt.target.value)}
                            label="Password"
                            variant="outlined"
                            required
                            type="password"
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <LockIcon/>
                                </InputAdornment>),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel shrink id="role-label">
                                Role
                            </InputLabel>
                            <Select
                                value={role_id}
                                onChange={evt => setRole_id(evt.target.value)}
                                labelId="role-label"
                                defaultValue=""
                                displayEmpty
                                inputProps={{'aria-label': 'Role'}}
                                label="Role"
                            >


                                <MenuItem value="" disabled>
                                    Select User Role
                                </MenuItem>
                                {roles.map(r => {
                                    return <MenuItem value={r.id}>{r.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Submit Button Section */}
                <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: '30px'}}>
                    <Button
                        onClick={saveNewUser}
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
                        Register
                    </Button>
                </Box>
            </Box>

            {/* User Table Section */}
            <Typography variant="h6" sx={{marginTop: '40px', marginBottom: '20px'}}>
                Registered Users
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (<TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    color="primary"
                                    onClick={() => {

                                        handleOpen(user)
                                    }}
                                    sx={{marginRight: '8px'}}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton color="error">
                                    <DeleteIcon onClick={() => {
                                        handleDeleteUser(user)
                                    }}/>
                                </IconButton>
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit User Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid gray',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Edit User
                    </Typography>
                    <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        name="name"
                        value={currentUser?.name || ''}
                        onChange={handleInputChange}
                        sx={{marginBottom: '16px'}}
                    />
                    <TextField
                        fullWidth
                        disabled={true}
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={currentUser?.email || ''}
                        onChange={handleInputChange}
                        sx={{marginBottom: '16px'}}
                    />
                    <TextField
                        fullWidth
                        disabled={true}
                        label="Phone"
                        variant="outlined"
                        name="phone"
                        value={currentUser?.phone || ''}
                        onChange={handleInputChange}
                        sx={{marginBottom: '16px'}}
                    />
                    <TextField
                        fullWidth
                        disabled={true}
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={currentUser?.username || ''}
                        onChange={handleInputChange}
                        sx={{marginBottom: '16px'}}
                    />
                    <FormControl fullWidth variant="outlined" sx={{marginBottom: '16px'}}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role_id"
                            value={currentUser?.role_id || ''}
                            onChange={handleInputChange}
                            label="Role"
                        >
                            {roles.map(role => <MenuItem value={role.id}>{role.name}</MenuItem>)}

                        </Select>
                    </FormControl>
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
                            onClick={handleClose}
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

export default UserRegistrationPage;
