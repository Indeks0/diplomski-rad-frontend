import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { baseURL } from "api/axios/useAxios";
import axios from "axios";
import Select from "common/formsUI/select";
import Textfield from "common/formsUI/textfield";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import YupPassword from "yup-password";
YupPassword(yup);
const INITIAL_FORM_STATE = {
    name: "",
    surname: "",
    role: "",
    email: "",
    password: "",
};

const validationSchema = yup.object({
    name: yup.string("Unesite ime").required("Unesite ime"),
    surname: yup.string("Unesite prezime").required("Unesite prezime"),
    role: yup
        .string()
        .required("Odaberite ulogu")
        .oneOf(["Student", "Teacher"], "Odaberite ulogu"),
    email: yup
        .string()
        .email("Nevažeći oblik email adrese")
        .required("Unesite email"),
    password: yup
        .string()
        .required("Unesite lozinku")
        .min(
            8,
            "Barem 8 znakova; Po jedno: malo slovo, veliko slovo, broj, specijalni znak"
        )
        .minLowercase(1, "barem 1 malo slovo")
        .minUppercase(1, "barem 1 veliko slovo")
        .minNumbers(1, "barem 1 broj")
        .minSymbols(1, "barem 1 specijalni znak"),
});

const Register = () => {
    const navigate = useNavigate();

    const [registerErrorMsg, setRegisterErrorMsg] = useState(null);
    const [registerSuccessMsg, setRegisterSuccessMsg] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [renderVisibilityIcon, setRenderVisibilityIcon] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setisLoading(true);
            let response = await axios.post(
                baseURL + "/Authenticate/register",
                {
                    ...values,
                    username: values.email,
                }
            );
            setRegisterSuccessMsg(
                `Uspješna registracija. 
                 Provjerite Vašu email adresu i potvrdite račun.`
            );
            setisLoading(false);
            setRegisterErrorMsg(null);
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                setRegisterErrorMsg("No Server Response");
            }
            setisLoading(false);
        }
    };

    const changePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={10} sm={6} md={4} xl={3} sx={{ pt: 16, pb: 6 }}>
                <Paper elevation={10}>
                    <Formik
                        initialValues={{ ...INITIAL_FORM_STATE }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Grid
                                sx={{ pb: 2 }}
                                container
                                spacing={3}
                                justifyContent="center"
                            >
                                <Grid item xs={12}>
                                    <Typography variant="h4" textAlign="center">
                                        Registracija
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield name="name" label="Ime" />
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield name="surname" label="Prezime" />
                                </Grid>
                                <Grid item xs={8}>
                                    <Select
                                        name="role"
                                        label="Profesija"
                                        options={{
                                            Student: "Učenik",
                                            Teacher: "Nastavnik",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield name="email" label="Email" />
                                </Grid>
                                <Grid item xs={8}>
                                    <Textfield
                                        name="password"
                                        label="Lozinka"
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
                                {registerErrorMsg != null ? (
                                    <Grid item xs={8}>
                                        <Alert severity="error">
                                            {registerErrorMsg}
                                        </Alert>
                                    </Grid>
                                ) : null}
                                {registerSuccessMsg != null ? (
                                    <Grid item xs={8}>
                                        <Alert>{registerSuccessMsg}</Alert>
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
                                            Registracija
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
                    </Formik>
                    <Grid
                        item
                        xs={12}
                        container
                        justifyContent="flex-end"
                        sx={{ pb: 2, pr: 2 }}
                    >
                        <Typography variant="span" sx={{ pr: 1 }}>
                            Već imate račun?
                        </Typography>
                        <Link to="/login">Prijava</Link>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Register;
