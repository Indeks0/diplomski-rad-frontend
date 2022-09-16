import {
    Box,
    Divider,
    Drawer,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import useAxios from "api/axios/useAxios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { selectUser } from "api/redux/authSlice";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

export const UsersLayout = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [isTeacherAdmin, setIsTeacherAdmin] = useState(false);
    let { role } = useSelector(selectUser);

    let { subjectId } = useParams();

    const api = useAxios();

    const getSubject = async () => {
        try {
            let result = await api.get(`/Subject/${subjectId}`);
            setSubject(result.data);
        } catch (error) {}
    };

    const getIsTeacherAdmin = async () => {
        try {
            let result = await api.get(
                `/Subject/get-is-teacher-admin?subjectId=${subjectId}`
            );
            if (result.data) setIsTeacherAdmin(result.data);
        } catch (error) {}
    };

    useEffect(() => {
        getSubject();
        getIsTeacherAdmin();
    }, []);

    const handleZahtjevi = () => {
        navigate("/predmet/" + subjectId + "/korisnici/zahtjevi");
    };
    const handleUcenici = () => {
        navigate("/predmet/" + subjectId + "/korisnici/ucenici");
    };
    const handleUcitelji = () => {
        navigate("/predmet/" + subjectId + "/korisnici/nastavnici");
    };
    const handlePovratak = () => {
        navigate("/predmet/" + subjectId);
    };

    return (
        <Grid container sx={{ mt: 4, mr: 4, bgcolor: "primary.background" }}>
            <Grid item xs={3} md={3} lg={2} xl={2}>
                <Box position="fixed">
                    <List>
                        <ListItem key={1} disablePadding>
                            <ListItemButton onClick={handlePovratak}>
                                <ListItemIcon>
                                    <ArrowBackIosNewIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="POVRATAK"
                                />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem key={2} disablePadding>
                            <ListItemButton onClick={handleZahtjevi}>
                                <ListItemIcon>
                                    <GroupAddIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="Zahtjevi za pristup"
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={3} disablePadding>
                            <ListItemButton onClick={handleUcenici}>
                                <ListItemIcon>
                                    <GroupIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="Učenici"
                                />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        {isTeacherAdmin === true ? (
                            <ListItem key={4} disablePadding>
                                <ListItemButton onClick={handleUcitelji}>
                                    <ListItemIcon>
                                        <SchoolIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "none",
                                                md: "block",
                                            },
                                        }}
                                        primary="Nastavnici"
                                    />
                                </ListItemButton>
                            </ListItem>
                        ) : null}
                    </List>
                </Box>
            </Grid>
            <Outlet />
        </Grid>
    );
};
