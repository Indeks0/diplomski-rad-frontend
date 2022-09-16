import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import Textfield from "common/formsUI/textfield";
import { orange } from "@mui/material/colors";
import useAxios from "api/axios/useAxios";
import { HexColorPicker } from "react-colorful";
import { useNavigate } from "react-router-dom";

export const SubjectCreate = () => {
    let [createErrorMsg, setCreateErrorMsg] = useState(null);
    let [isLoading, setIsLoading] = useState(null);
    let [color, setColor] = useState("#aabbcc");

    const INITIAL_FORM_STATE = {
        name: "",
        description: "",
        color: "#aabbcc",
    };

    const validationSchema = yup.object({
        name: yup
            .string()
            .required("Niste unijeli naziv")
            .max(10, "Najviše 10 znakova"),
        description: yup
            .string()
            .required("Niste unijeli opis")
            .max(10, "Najviše 10 znakova"),
        color: yup.string(), //.required("Niste odabrali boju predmeta"),
    });

    const navigate = useNavigate();

    const handleColorChange = (value) => {
        setColor(value);
    };

    let api = useAxios();

    const handleSubmit = async (values) => {
        await api.post(`/Subject/create-subject`, {
            ...values,
        });
        navigate("/predmeti/user-only");
    };

    return (
        <Grid item xs md={5} sm={5} xl={4} sx={{ ml: 2 }}>
            <Paper
                sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                }}
                elevation={10}
            >
                <Formik
                    initialValues={{ ...INITIAL_FORM_STATE }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <Grid
                                sx={{ pb: 3 }}
                                container
                                spacing={3}
                                justifyContent="center"
                            >
                                <Grid item xs={12}>
                                    <Typography variant="h4" textAlign="center">
                                        Kreiranje predmeta
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield
                                        name="name"
                                        label="Naziv predmeta"
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield
                                        name="description"
                                        label="Opis"
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <HexColorPicker
                                        style={{ width: "100%" }}
                                        color={color}
                                        onChange={(value) => {
                                            handleColorChange(value);
                                            setFieldValue("color", value);
                                        }}
                                    />
                                </Grid>
                                {createErrorMsg != null ? (
                                    <Grid item xs={8}>
                                        <Alert severity="error">
                                            {createErrorMsg}
                                        </Alert>
                                    </Grid>
                                ) : null}
                                <Grid item xs={8}>
                                    <Box sx={{ m: 1, position: "relative" }}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                            disabled={isLoading}
                                        >
                                            Kreiraj predmet
                                        </Button>
                                        {isLoading && (
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    color: orange[500],
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    marginTop: "-12px",
                                                    marginLeft: "-12px",
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    );
};
