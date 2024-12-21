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
// import { DemoPageContent } from './DashboardLayoutAccount';

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

    // const [currentPath, setCurrentPath] = useState('/dashboard'); 
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
        if (option === "sample01") {
            // setCurrentPath('/busFacilities');


        } else if (option === "sample02") {
            // setCurrentPath('/busFacilities');

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
                    <MenuItem onClick={() => handleMenuItemClick("sample01")}>Sample 01</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick("sample02")}>Sample 02</MenuItem>
                </Menu>
            </Box>
        </Container>
    );
};

export default ActiveRouteManagement;
