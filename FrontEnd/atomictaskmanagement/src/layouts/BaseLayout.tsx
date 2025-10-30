import React, { useState } from "react";
import { AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon, Home, Task, Person } from "@mui/icons-material";
import { Outlet, Link } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";
import UserSelector from "../components/UserSelector";

const BaseLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerWidth = 240;

    const drawer = (
        <div>
            <Toolbar />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemIcon><Home /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/tasks">
                        <ListItemIcon><Task /></ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/users">
                        <ListItemIcon><Person /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <UserProvider>
                <CssBaseline />
                <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                Atomic Task Management
                            </Typography>
                        </Box>
                        <Box sx={{ minWidth: 220 }}>
                            <UserSelector />
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                    <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}>
                        {drawer}
                    </Drawer>

                    <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }} open>
                        {drawer}
                    </Drawer>
                </Box>

                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, display: "flex", justifyContent: "center", mt: 8 }}>
                    <Outlet />
                </Box>
            </UserProvider>
        </Box>
    );
};

export default BaseLayout;