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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SettingsIcon from "@mui/icons-material/Settings";
import { confirmAlert } from "react-confirm-alert";

export const SettingsLayout = () => {
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

    const handleOsnovniPodaci = () => {};

    const handleBrisanjePredmeta = async () => {
        confirmAlert({
            title: `Brisanje predmeta "${subject.name}"`,
            message: `Želite li obrisati predmet?`,
            buttons: [
                {
                    label: "Obriši",
                    onClick: async () => {
                        try {
                            let result = await api.delete(
                                `/Subject/delete-subject`,
                                {
                                    data: { id: subjectId },
                                }
                            );
                            navigate("/predmeti/user-only");
                            alert("Predmet obrisan");
                        } catch (error) {}
                    },
                },
                {
                    label: "Odustani",
                },
            ],
        });
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
                            <ListItemButton onClick={handleOsnovniPodaci}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="Osnovni podaci"
                                />
                            </ListItemButton>
                        </ListItem>
                        {isTeacherAdmin === true ? (
                            <ListItem key={3} disablePadding>
                                <ListItemButton
                                    onClick={handleBrisanjePredmeta}
                                >
                                    <ListItemIcon>
                                        <DeleteForeverIcon fontSize="large" />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "none",
                                                md: "block",
                                            },
                                        }}
                                        primary="Brisanje predmeta"
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
