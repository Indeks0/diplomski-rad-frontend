import {
    Box,
    Button,
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
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CreateIcon from "@mui/icons-material/Create";
import GradingIcon from "@mui/icons-material/Grading";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

export const ExamLayout = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    let { role } = useSelector(selectUser);

    let { subjectId } = useParams();

    const api = useAxios();

    const getSubject = async () => {
        try {
            let result = await api.get(`/Subject/${subjectId}`);
            setSubject(result.data);
        } catch (error) {}
    };

    useEffect(() => {
        getSubject();
    }, []);

    const handlePovratak = () => {
        navigate("/predmet/" + subjectId);
    };
    const handleIspiti = () => {
        navigate(`/predmet/${subjectId}/ispiti/pregled`);
    };
    const handleIspitKreiranje = () => {
        navigate(`/predmet/${subjectId}/ispiti/kreiranje`);
    };
    const handlePitanjaPregled = () => {
        navigate(`/predmet/${subjectId}/ispiti/pitanja-pregled`);
    };
    const handlePitanjaKreiranje = () => {
        navigate(`/predmet/${subjectId}/ispiti/pitanja-kreiranje`);
    };
    const handleKriterijOcjenjivanja = () => {
        navigate(`/predmet/${subjectId}/ispiti/kriterij-ocjenjivanja`);
    };
    const handleOcjene = () => {
        navigate(`/predmet/${subjectId}/ispiti/ocjene`);
    };

    return (
        <Grid container sx={{ mt: 4, mr: 4, bgcolor: "primary.background" }}>
            <Grid item xs={3} md={3} sm={2} lg={2} xl={2}>
                <Box position="fixed">
                    <List>
                        <ListItem disablePadding>
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
                        {role == "Teacher" ? (
                            <div>
                                <ListItem key={2} disablePadding>
                                    <ListItemButton onClick={handleIspiti}>
                                        <ListItemIcon>
                                            <AppRegistrationIcon fontSize="large" />
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "none",
                                                    md: "block",
                                                },
                                            }}
                                            primary="Ispiti"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={3} disablePadding divider>
                                    <ListItemButton
                                        onClick={handlePitanjaPregled}
                                    >
                                        <ListItemIcon>
                                            <FolderCopyIcon fontSize="large" />
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "none",
                                                    md: "block",
                                                },
                                            }}
                                            primary="Baza pitanja"
                                        />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem key={4} disablePadding>
                                    <ListItemButton
                                        onClick={handleIspitKreiranje}
                                    >
                                        <ListItemIcon>
                                            <NoteAddIcon fontSize="large" />
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "none",
                                                    md: "block",
                                                },
                                            }}
                                            primary="Kreiranje ispita"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={5} disablePadding>
                                    <ListItemButton
                                        onClick={handlePitanjaKreiranje}
                                    >
                                        <ListItemIcon>
                                            <CreateIcon fontSize="large" />
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "none",
                                                    md: "block",
                                                },
                                            }}
                                            primary="Kreiranje pitanja"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={6} disablePadding divider>
                                    <ListItemButton
                                        onClick={handleKriterijOcjenjivanja}
                                    >
                                        <ListItemIcon>
                                            <GradingIcon fontSize="large" />
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "none",
                                                    md: "block",
                                                },
                                            }}
                                            primary="Kriterij ocjenjivanja"
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </div>
                        ) : null}

                        <ListItem key={7} disablePadding>
                            <ListItemButton onClick={handleOcjene}>
                                <ListItemIcon>
                                    <SpellcheckIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "none",
                                            md: "block",
                                        },
                                    }}
                                    primary="Ocjene"
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
