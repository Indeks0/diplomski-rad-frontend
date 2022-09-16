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
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const BasicInformation = () => {
    let [createErrorMsg, setCreateErrorMsg] = useState(null);
    let [isLoading, setIsLoading] = useState(null);
    let [color, setColor] = useState("#aabbcc");
    const { subjectId } = useParams();

    const [initialValues, setInitialValues] = useState({
        id: subjectId,
        name: "",
        description: "",
        color: "",
    });

    const validationSchema = yup.object({
        name: yup
            .string()
            .required("Niste unijeli naziv")
            .max(10, "Najviše 10 znakova"),
        description: yup
            .string()
            .required("Niste unijeli opis")
            .max(15, "Najviše 15 znakova"),
        color: yup.string(),
    });

    const api = useAxios();

    const handleColorChange = (value) => {
        setColor(value);
    };

    const getSubjectInfo = async () => {
        try {
            let result = await api.get(`/Subject/${subjectId}`);
            setColor(result.data.color);
            setInitialValues(result.data);
        } catch {}
    };

    const handleSubmit = async (values) => {
        await api.put(`/Subject/update-subject`, {
            ...values,
        });
    };

    useEffect(() => {
        getSubjectInfo();
    }, []);

    return (
        <Grid item xs={9} md={6} sm={8} xl={4}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
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
                                    Uređivanje predmeta
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Textfield name="name" label="Naziv predmeta" />
                            </Grid>
                            <Grid item xs={8}>
                                <Textfield name="description" label="Opis" />
                            </Grid>
                            <Grid item xs={8}>
                                <HexColorPicker
                                    color={color}
                                    style={{ width: "100%" }}
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
                                        Spremi
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
        </Grid>
    );
};
