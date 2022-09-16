import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    Modal,
    Paper,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";
import Textfield from "common/formsUI/textfield";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "api/axios/useAxios";
import { useSelector } from "react-redux";
import moment from "moment";
import { selectUser } from "api/redux/authSlice";
import { SubjectNoticeDialog } from "./notice/SubjectNoticeDialog";
import { confirmAlert } from "react-confirm-alert";

export const SubjectDetails = () => {
    let { subjectId } = useParams();
    let { role } = useSelector(selectUser);

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [openExams, setOpenExams] = useState([]);
    const [futureExams, setFutureExams] = useState([]);

    const [notices, setNotices] = useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openedNotice, setOpenedNotice] = useState(null);
    const [noticeOpen, setNoticeOpen] = useState(false);
    const [insertedNotice, setInsertedNotice] = useState(false);
    const [subject, setSubject] = useState(null);
    const [studentId, setStudentId] = useState("");

    const handleIspiti = () => {
        navigate("/predmet/" + subjectId + "/ispiti/pregled");
    };
    const handleKorisnici = () => {
        navigate("/predmet/" + subjectId + "/korisnici/zahtjevi");
    };
    const handlePostavke = () => {
        navigate("/predmet/" + subjectId + "/postavke");
    };
    const handleOcjene = () => {
        navigate("/predmet/" + subjectId + "/ispiti/ocjene");
    };

    const handleOpenNotice = (notice) => {
        setOpenedNotice(notice);
        setNoticeOpen(true);
    };

    const handleCloseNotice = () => {
        setOpenedNotice(null);
        setNoticeOpen(false);
    };

    let api = useAxios();

    const INITIAL_FORM_STATE = {
        title: "",
        description: "opis",
    };

    const validationSchema = yup.object({
        title: yup.string().required("Niste unijeli Naslov"),
        description: yup.string().required("Niste unijeli opis"),
    });

    const handleNoticeSubmit = async (values) => {
        try {
            let response = await api.post("/SubjectNotice/create-notice", {
                subjectId,
                ...values,
            });
            setInsertedNotice(!insertedNotice);
            handleClose();
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
            }
        }
    };

    const handleStartExam = async (id) => {
        navigate(`/exam/${id}/${studentId}`);
    };

    const handleNapustiPredmet = async () => {
        confirmAlert({
            title: `Napuštanje predmeta`,
            message: `Želite li napustiti predmet?`,
            buttons: [
                {
                    label: "Napusti",
                    onClick: async () => {
                        try {
                            let result = await api.delete(
                                `/SubjectStudent/delete-student`,
                                {
                                    data: { subjectId: subjectId },
                                }
                            );
                            navigate(`/predmeti/user-only`);
                            alert("Napustili ste predmet");
                        } catch (error) {}
                    },
                },
                {
                    label: "Odustani",
                },
            ],
        });
    };

    const getNotices = async () => {
        try {
            let result = await api.get(
                `/SubjectNotice/get-notices?subjectId=${subjectId}&rpp=10`
            );
            setNotices(result.data.items);
        } catch (error) {}
    };

    const getSubject = async () => {
        try {
            let result = await api.get(`/Subject/${subjectId}`);
            setSubject(result.data);
        } catch (error) {}
    };

    const getStudentExams = async () => {
        try {
            if (role === "Student") {
                let subjectStudentResult = await api.get(
                    `/SubjectStudent/subject-student?subjectId=${subjectId}`
                );
                setStudentId(subjectStudentResult.data.id);
                let resultExams = await api.get(
                    `/Exam/get-student-exams?subjectId=${subjectId}&studentId=${subjectStudentResult.data.id}`
                );
                setOpenExams(resultExams.data.openExams);
                setFutureExams(resultExams.data.futureExams);
            } else {
                let openResult = await api.get(
                    `/Exam/get-open-exams?subjectId=${subjectId}`
                );
                let futureResult = await api.get(
                    `/Exam/get-future-exams?subjectId=${subjectId}`
                );
                setOpenExams(openResult.data);
                setFutureExams(futureResult.data);
            }
        } catch (error) {}
    };

    useEffect(() => {
        getNotices();
    }, [insertedNotice]);

    useEffect(() => {
        getStudentExams();
        getSubject();
    }, []);

    const editorConfiguration = {
        toolbar: {
            items: [
                "heading",
                "alignment",
                "bulletedList",
                "numberedList",
                "link",
                "|",
                "code",
                "insertTable",
                "-",
                "bold",
                "italic",
                "underline",
                "highlight",
                "|",
                "undo",
                "redo",
            ],
            shouldNotGroupWhenFull: true,
        },
    };
    return (
        <Box display="flex" justifyContent="center">
            <Grid item xs={10} container spacing={2} sx={{ p: 2 }}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <Typography textAlign="center" variant="h3">
                            {subject != null ? subject.name : null}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={1}
                    item
                    xs={6}
                    sm={6}
                    md={2}
                    maxHeight={700}
                    order={{ xs: 3, sm: 3, md: 2 }}
                >
                    <Paper elevation={5} sx={{ p: 2, width: "100%" }}>
                        <Grid item xs={12} container justifyContent="center">
                            <Grid
                                item
                                container
                                xs={12}
                                justifyContent="center"
                                sx={{ pb: 5 }}
                            ></Grid>
                            <Dialog
                                open={open}
                                disableEnforceFocus
                                maxWidth="md"
                                fullWidth
                            >
                                <DialogTitle
                                    textAlign="center"
                                    sx={{ fontSize: "30px" }}
                                >
                                    Nova obavijest
                                </DialogTitle>
                                <DialogContent>
                                    <Formik
                                        initialValues={{
                                            ...INITIAL_FORM_STATE,
                                        }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleNoticeSubmit}
                                    >
                                        {({ values, setFieldValue }) => (
                                            <Form>
                                                <Grid
                                                    container
                                                    justifyContent="center"
                                                    spacing={4}
                                                    sx={{ p: 2 }}
                                                >
                                                    <Grid item xs={11}>
                                                        <Textfield
                                                            name="title"
                                                            label="Naslov obavijesti"
                                                        ></Textfield>
                                                    </Grid>
                                                    <Grid item xs={11}>
                                                        <div>
                                                            <CKEditor
                                                                editor={Editor}
                                                                config={
                                                                    editorConfiguration
                                                                }
                                                                data="Opis<br><br>"
                                                                onReady={(
                                                                    editor
                                                                ) => {
                                                                    // You can store the "editor" and use when it is needed.
                                                                    console.log(
                                                                        "Editor is ready to use!",
                                                                        editor
                                                                    );
                                                                }}
                                                                onChange={(
                                                                    event,
                                                                    editor
                                                                ) => {
                                                                    const data =
                                                                        editor.getData();

                                                                    setFieldValue(
                                                                        "description",
                                                                        data
                                                                    );
                                                                    console.log(
                                                                        {
                                                                            event,
                                                                            editor,
                                                                            data,
                                                                        }
                                                                    );
                                                                }}
                                                                onBlur={(
                                                                    event,
                                                                    editor
                                                                ) => {
                                                                    console.log(
                                                                        "Blur.",
                                                                        editor
                                                                    );
                                                                }}
                                                                onFocus={(
                                                                    event,
                                                                    editor
                                                                ) => {
                                                                    console.log(
                                                                        "Focus.",
                                                                        editor
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                                <DialogActions>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleClose}
                                                    >
                                                        Odustani
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        type="submit"
                                                    >
                                                        Spremi
                                                    </Button>
                                                </DialogActions>
                                            </Form>
                                        )}
                                    </Formik>
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={12} sx={{ pb: 2 }}>
                                <Typography variant="h5" textAlign="center">
                                    OBAVIJESTI
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                container
                                xs={11}
                                justifyContent="center"
                                sx={{ p: 2, borderTop: 1, borderBottom: 1 }}
                            >
                                <Grid item xs={12} sx={{ pb: 2 }}>
                                    <List
                                        sx={{
                                            bgcolor: "background.paper",
                                            maxWidth: 190,
                                            position: "relative",
                                            overflow: "auto",
                                            maxHeight: 400,
                                            "& ul": { padding: 0 },
                                        }}
                                    >
                                        {notices.map((x) => {
                                            let date = new Date(x.dateCreated);
                                            return (
                                                <ListItem>
                                                    <Grid key={x.id} item>
                                                        <Grid item xs={8}>
                                                            <Button
                                                                color="primary"
                                                                variant="text"
                                                                onClick={() =>
                                                                    handleOpenNotice(
                                                                        x
                                                                    )
                                                                }
                                                            >
                                                                {x.title}
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h7">
                                                                {moment(
                                                                    date
                                                                ).format(
                                                                    "dddd DD. MM. YYYY., HH:mm"
                                                                )}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Grid>

                                {openedNotice && (
                                    <SubjectNoticeDialog
                                        notice={openedNotice}
                                        open={noticeOpen}
                                        handleClose={handleCloseNotice}
                                    />
                                )}
                            </Grid>
                            <Grid item>
                                {role == "Teacher" ? (
                                    <Grid item sx={{ pt: 5, pb: 2 }}>
                                        <Button
                                            onClick={handleOpen}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Kreiraj
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={8}
                    spacing={1}
                    justifyContent="center"
                    order={{ xs: 2, sm: 2, md: 3 }}
                >
                    <Paper elevation={5} sx={{ p: 2, width: "100%" }}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography variant="h4" textAlign="center">
                                    Ispiti u tijeku
                                </Typography>
                                {openExams.map((x) => {
                                    return (
                                        <Grid
                                            key={x.id}
                                            container
                                            spacing={2}
                                            padding={4}
                                        >
                                            <Grid item xs={12}>
                                                <Typography textAlign="center">
                                                    {x.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>{`Otvoren do: ${moment(
                                                    x.dateOpenEnd
                                                ).format(
                                                    "dddd DD. MM. YYYY., HH:mm"
                                                )}`}</Typography>
                                            </Grid>
                                            {role === "Student" ? (
                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() =>
                                                            handleStartExam(
                                                                x.id
                                                            )
                                                        }
                                                    >
                                                        Započni rješavanje
                                                        ispita
                                                    </Button>
                                                </Grid>
                                            ) : null}
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h4" textAlign="center">
                                    Budući ispiti
                                </Typography>
                                {futureExams.map((x) => {
                                    return (
                                        <Grid container spacing={2} padding={4}>
                                            <Grid item xs={12}>
                                                <Typography textAlign="center">
                                                    {x.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>{`Ispit dostupan od: ${moment(
                                                    x.dateOpenStart
                                                ).format(
                                                    "dddd DD. MM. YYYY., HH:mm"
                                                )}\n do ${moment(
                                                    x.dateOpenEnd
                                                ).format(
                                                    "dddd DD. MM. YYYY., HH:mm"
                                                )}`}</Typography>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid
                    item
                    container
                    xs={6}
                    sm={6}
                    md={2}
                    spacing={1}
                    justifyContent="center"
                    order={{ xs: 4, sm: 4, md: 4 }}
                >
                    {role == "Teacher" ? (
                        <Paper elevation={5} sx={{ p: 2, width: "100%" }}>
                            <Grid item container spacing={4}>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleIspiti}
                                    >
                                        Ispiti
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleKorisnici}
                                    >
                                        korisnici
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handlePostavke}
                                    >
                                        Postavke
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    ) : (
                        <Paper elevation={5} sx={{ p: 2, width: "100%" }}>
                            <Grid
                                item
                                container
                                xs={2}
                                spacing={1}
                                justifyContent="center"
                            >
                                <Grid item xs={12}>
                                    <Typography variant="h4" textAlign="center">
                                        Ocjene
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleOcjene}
                                    >
                                        Ocjene
                                    </Button>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNapustiPredmet}
                                    >
                                        Napusti predmet
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
