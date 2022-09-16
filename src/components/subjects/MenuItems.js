import {
    Button,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Drawer,
    Divider,
    ListItemText,
    Toolbar,
    Box,
    Typography,
    Pagination,
    Paper,
    InputBase,
    IconButton,
    Input,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSelector } from "react-redux";
import { selectUser } from "api/redux/authSlice";

export const MenuItems = () => {
    const navigate = useNavigate();

    let { role } = useSelector(selectUser);

    const handleKreiranje = () => {
        navigate("/predmeti/kreiranje");
    };

    const handlePregled = () => {
        navigate("/predmeti/all");
    };

    const handlePregledUserOnly = () => {
        navigate("/predmeti/user-only");
    };

    return (
        <Grid container sx={{ mt: 4, mr: 4 }}>
            <Grid item xs={3} md={3} sm={2} lg={2} xl={2}>
                <Box position="fixed">
                    <List>
                        {role === "Student" ? (
                            <ListItem key={1} disablePadding>
                                <ListItemButton onClick={handlePregled}>
                                    <ListItemIcon>
                                        <ListAltIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "none",
                                                md: "block",
                                            },
                                        }}
                                        primary="Svi predmeti"
                                    />
                                </ListItemButton>
                            </ListItem>
                        ) : null}

                        <ListItem key={2} disablePadding>
                            <ListItemButton onClick={handlePregledUserOnly}>
                                <ListItemIcon>
                                    <ListAltIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="Moji predmeti"
                                />
                            </ListItemButton>
                        </ListItem>

                        <Divider />
                        <ListItem key={3} disablePadding>
                            <ListItemButton onClick={handleKreiranje}>
                                <ListItemIcon>
                                    <AddBoxIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="Kreiranje predmeta"
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Grid>
            <Outlet />
        </Grid>
    );
};
