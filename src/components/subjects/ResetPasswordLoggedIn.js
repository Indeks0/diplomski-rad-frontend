import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
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
import YupPassword from "yup-password";
import { selectUser } from "api/redux/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
YupPassword(yup);

export const ResetPasswordLoggedIn = () => {
    let [createErrorMsg, setCreateErrorMsg] = useState(null);
    let [isLoading, setIsLoading] = useState(null);

    const [resetSuccessMsg, setResetSuccessMsg] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [renderVisibilityIcon, setRenderVisibilityIcon] = useState(false);
    let { email } = useSelector(selectUser);
    const INITIAL_FORM_STATE = {
        email: email,
        newPassword: "",
    };

    const validationSchema = yup.object({
        email: yup.string().email("Nevažeći oblik email adrese"),
        newPassword: yup
            .string()
            .required("Unesite novu lozinku")
            .min(
                8,
                "Barem 8 znakova; Po jedno: malo slovo, veliko slovo, broj, specijalni znak"
            )
            .minLowercase(1, "barem 1 malo slovo")
            .minUppercase(1, "barem 1 veliko slovo")
            .minNumbers(1, "barem 1 broj")
            .minSymbols(1, "barem 1 specijalni znak"),
    });

    let api = useAxios();

    const handleSubmit = async (values) => {
        api.post(
            `/Authenticate/reset-password-logged-in?email=${values.email}&newPassword=${values.newPassword}`
        ).then((res) => {
            setResetSuccessMsg(`Uspješna promjena lozinke. `);
        });
    };

    const changePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                        Promjena lozinke
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield
                                        name="newPassword"
                                        label="Nova lozinka"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        InputProps={{
                                            endAdornment:
                                                showPassword == true ? (
                                                    <IconButton
                                                        onClick={
                                                            changePasswordVisibility
                                                        }
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        onClick={
                                                            changePasswordVisibility
                                                        }
                                                    >
                                                        <VisibilityOffIcon />
                                                    </IconButton>
                                                ),
                                        }}
                                    />
                                </Grid>
                                {resetSuccessMsg != null ? (
                                    <Grid item xs={8}>
                                        <Alert>{resetSuccessMsg}</Alert>
                                    </Grid>
                                ) : null}
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
                                            Resetiraj lozinku
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
