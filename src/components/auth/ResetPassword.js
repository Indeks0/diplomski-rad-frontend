import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import Textfield from "common/formsUI/textfield";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { baseURL } from "api/axios/useAxios";

export const ResetPassword = () => {
    let [tokenSent, setTokenSent] = useState(false);
    let [isLoading, setIsLoading] = useState(false);
    let [passwordChangedSuccessMsg, setPasswordChangedSuccessMsg] =
        useState(null);
    let navigate = useNavigate();

    const INITIAL_FORM_STATE_MAIL = {
        email: "",
    };
    const validationSchemaEmail = yup.object({
        email: yup.string().email("Unesite Email").required(),
    });

    const INITIAL_FORM_STATE_PASSWORD_CHANGE = {
        email: "",
        token: "",
        password: "",
        passwordConfirm: "",
    };
    const validationSchemaChangePassword = yup.object({
        email: yup.string().email().required(),
        token: yup.string().required(),
        password: yup
            .string()
            .required()
            .matches(
                "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,.]).{8,}$",
                "Minimalno 8 znakova te sadržavati: veliko slovo, malo slovo, broj i poseban znak."
            ),
        passwordConfirm: yup
            .string()
            .required()
            .oneOf([yup.ref("password")], "Lozinke se ne podudaraju"),
    });

    const handleSubmitEmail = async (values) => {
        try {
            let result = await axios.get(
                baseURL + "/Authenticate/get-password-token",
                {
                    params: { ...values },
                }
            );
            validationSchemaChangePassword.email = result.data.email;
            setTokenSent(true);
        } catch (error) {}
    };

    const handleSubmitPasswordReset = async (values) => {
        try {
            let result = await axios.post(
                baseURL + "/Authenticate/reset-password",
                null,
                {
                    params: { ...values },
                }
            );
            setPasswordChangedSuccessMsg(
                "Uspješno ste promjenili lozinku. Odlazak na stranicu za prijavu."
            );
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {}
    };

    return (
        <div>
            <Grid
                container
                justifyContent="center"
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                <Grid item xs={3} sx={{ pt: 16 }}>
                    <Paper elevation={10}>
                        {!tokenSent ? (
                            <Formik
                                initialValues={{ ...INITIAL_FORM_STATE_MAIL }}
                                validationSchema={validationSchemaEmail}
                                onSubmit={handleSubmitEmail}
                            >
                                <Form>
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={3}
                                    >
                                        <Grid item xs={8}>
                                            <Typography variant="h5">
                                                Ponovno postavljanje lozinke
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Textfield
                                                name="email"
                                                label="Email"
                                            />
                                        </Grid>

                                        <Grid item xs={8}>
                                            <Box
                                                sx={{
                                                    m: 1,
                                                    position: "relative",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    fullWidth
                                                    disabled={isLoading}
                                                >
                                                    Pošalji kod za postavljanje
                                                    lozinke
                                                </Button>
                                                {isLoading && (
                                                    <CircularProgress
                                                        size={24}
                                                        sx={{
                                                            color: orange[500],
                                                            position:
                                                                "absolute",
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
                            </Formik>
                        ) : (
                            <Formik
                                initialValues={{
                                    ...INITIAL_FORM_STATE_PASSWORD_CHANGE,
                                }}
                                validationSchema={
                                    validationSchemaChangePassword
                                }
                                onSubmit={handleSubmitPasswordReset}
                            >
                                <Form>
                                    <Grid
                                        container
                                        justifyContent="center"
                                        spacing={3}
                                    >
                                        {passwordChangedSuccessMsg == null ? (
                                            <Grid item xs={8}>
                                                <Alert severity="success">
                                                    Na Vašu mail adresu poslan
                                                    je kod za promjenu lozinke.
                                                </Alert>
                                            </Grid>
                                        ) : null}
                                        <Grid item xs={8}>
                                            <Textfield
                                                name="email"
                                                label="Email"
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Textfield
                                                name="token"
                                                label="Kod za resetiranje"
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Textfield
                                                name="password"
                                                label="Lozinka"
                                                type="password"
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Textfield
                                                name="passwordConfirm"
                                                label="Potvrda lozinke"
                                                type="password"
                                            />
                                        </Grid>
                                        <Grid item xs={8} sx={{ pb: 6 }}>
                                            <Box
                                                sx={{
                                                    m: 1,
                                                    position: "relative",
                                                }}
                                            >
                                                {passwordChangedSuccessMsg !=
                                                null ? (
                                                    <Grid item xs={8}>
                                                        <Alert>
                                                            {
                                                                passwordChangedSuccessMsg
                                                            }
                                                        </Alert>
                                                        <LinearProgress color="success" />
                                                    </Grid>
                                                ) : null}
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    fullWidth
                                                    disabled={isLoading}
                                                >
                                                    Resetiraj lozinku
                                                </Button>
                                                {isLoading && (
                                                    <CircularProgress
                                                        size={24}
                                                        sx={{
                                                            color: orange[500],
                                                            position:
                                                                "absolute",
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
                            </Formik>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};
