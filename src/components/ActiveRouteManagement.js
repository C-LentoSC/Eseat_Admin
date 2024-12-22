import React, { useState } from "react";
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
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setroutval } from "./DashboardLayoutAccount";

const ActiveRouteManagement = () => {

    const [routes] = useState([
        {
            id: 1,
            startPoint: "City A",
            endPoint: "City B",
            routeNo: "101",
            description: "Main route",
            busFare: 50,
        },
        {
            id: 2,
            startPoint: "City B",
            endPoint: "City C",
            routeNo: "102",
            description: "Express route",
            busFare: 60,
        },
    ]);


    // State to manage the menu anchor
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleMenuOpen = (event, route) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    // Handle dropdown menu item click
    const handleMenuItemClick = (option) => {
        if (option === "Mange_Bus_points") {
            setroutval('/route-management/manageBusPoints', '01');


        } else if (option === "Manage_Bus_fare_breake") {
            setroutval('/route-management/manageBusFareBreaks', '01');
        }
        handleMenuClose();
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Table Section */}
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    All Active Routes
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Route No</TableCell>
                                <TableCell>Start Point</TableCell>
                                <TableCell>End Point</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Bus Fare</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>{route.routeNo}</TableCell>
                                    <TableCell>{route.startPoint}</TableCell>
                                    <TableCell>{route.endPoint}</TableCell>
                                    <TableCell>{route.description}</TableCell>
                                    <TableCell>LKR {route.busFare}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(event) => handleMenuOpen(event, route)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
