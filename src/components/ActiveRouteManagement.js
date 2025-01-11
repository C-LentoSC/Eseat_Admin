import React, {useEffect, useState} from "react";
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
    IconButton,
    Menu,
    MenuItem,
    TablePagination
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setroutval } from "./DashboardLayoutAccount";
import CustomAlert from "./Parts/CustomAlert";
import api from "../model/API";

const ActiveRouteManagement = () => {

    const [routes,setRoutes] = useState([ ]);
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        loadAllPoints()
        loadAllRoutes()
    }, [])
    const loadAllRoutes = () => {
        api.get('admin/routes/load-all')
            .then(res => setRoutes(res.data.filter(r=>r.active)))
            .catch(handleError)
    }
    const loadAllPoints = () => {
        api.get("admin/points/get-all")
            // .then(res => setAllPoints(res.data.map(o => o.name)))
            .catch(handleError)

    }
    const sendAlert = (text) => setAlert({message: text, severity: "info"})
    const handleError = (err) => setAlert({message: err.response.data.message, severity: "error"})



    // State to manage the menu anchor
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuAnchorRoute,setMenuAnchorRoute]=useState(null)

    const handleMenuOpen = (event, route) => {
        setMenuAnchor(event.currentTarget);
        setMenuAnchorRoute(route)
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    // Handle dropdown menu item click
    const handleMenuItemClick = (option) => {
        if (option === "Mange_Bus_points") {
            setroutval('/route-management/manageBusPoints', menuAnchorRoute);


        } else if (option === "Manage_Bus_fare_breake") {
            setroutval('/route-management/manageBusFareBreaks', menuAnchorRoute);

        }
        handleMenuClose();
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
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                                      setOpen={setAlert}/> : <></>}
                {/* Table Section */}
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    All Active Routes
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                                <TableCell sx={{ py: 1 }}>Route No</TableCell>
                                <TableCell sx={{ py: 1 }}>Start Point</TableCell>
                                <TableCell sx={{ py: 1 }}>End Point</TableCell>
                                <TableCell sx={{ py: 1 }}>Description</TableCell>
                                <TableCell sx={{ py: 1 }}>Bus Fare</TableCell>
                                <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {routes
                         .slice(startIndex, startIndex + rowsPerPage)
                         .map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell sx={{ py: 0 }}>{route.routeNo}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{route.startPoint}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{route.endPoint}</TableCell>
                                    <TableCell sx={{ py: 0 }}>{route.description}</TableCell>
                                    <TableCell sx={{ py: 0 }}>LKR {route.busFare}</TableCell>
                                    <TableCell sx={{ py: 0 }} align="right">
                                        <IconButton
                                            onClick={(event) => handleMenuOpen(event, route.id)}

                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                                 <TablePagination
                        component="div"
                        count={routes.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </TableContainer>

                {/* Dropdown Menu */}
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => handleMenuItemClick("Mange_Bus_points")}>Mange Bus points</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick("Manage_Bus_fare_breake")}>Manage Bus fare breake</MenuItem>

                </Menu>
            </Box>
        </Container>
    );
};

export default ActiveRouteManagement;
