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
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { orange } from "@mui/material/colors";
import { baseURL } from "api/axios/useAxios";
import axios from "axios";
import Textfield from "common/formsUI/textfield";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { selectUser, setCredentials } from "api/redux/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const INITIAL_FORM_STATE = {
    email: "",
    password: "",
};

const validationSchema = yup.object({
    email: yup.string().email("Nevažeći email").required("Unesite Email"),
    password: yup.string().required("Unesite lozinku"),
});

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const dispatch = useDispatch();
    const [loginErrorMsg, setLoginErrorMsg] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [renderVisibilityIcon, setRenderVisibilityIcon] = useState(false);

    let { token, refreshToken, expiration } = useSelector(selectUser);

    const handleSubmit = async (values) => {
        try {
            setisLoading(true);

            let response = await axios.post(baseURL + "/Authenticate/login", {
                ...values,
            });

            dispatch(setCredentials({ ...response.data }));
            setisLoading(false);
            navigate("/predmeti/user-only");
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                setLoginErrorMsg("No Server Response");
            }
            setisLoading(false);
        }
    };

    const changePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const checkIfLoggedIn = () => {
        const isTokenExpired = Date.now() > Date.parse(expiration);

        if (!isTokenExpired && token != null) {
            navigate("/predmeti/user-only");
        }
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    return (
        <Grid container justifyContent="center" sx={{ pt: 16 }}>
            <Grid item xs={10} sm={6} md={4} xl={3}>
                <Paper elevation={10}>
                    <Formik
                        initialValues={{ ...INITIAL_FORM_STATE }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <Grid
                                sx={{ pb: 3 }}
                                container
                                spacing={3}
                                justifyContent="center"
                            >
                                <Grid item xs={12}>
                                    <Typography variant="h4" textAlign="center">
                                        Prijava
                                    </Typography>
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
                                {loginErrorMsg != null ? (
                                    <Grid item xs={8}>
                                        <Alert severity="error">
                                            {loginErrorMsg}
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
                                            Prijava
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
                    <Grid sx={{ pb: 2 }} container justifyContent="center">
                        <Typography variant="span">
                            <Link to="/reset-password">
                                Zaboravljena lozinka?
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        justifyContent="flex-end"
                        sx={{ pb: 2, pr: 2 }}
                    >
                        <Typography variant="span" sx={{ pr: 1 }}>
                            Nemate račun?
                        </Typography>
                        <Link to="/register">Registracija</Link>
                    </Grid>
                </Paper>
                <Grid item xs={10} sx={{ m: 6 }} justifyContent="center">
                    <Outlet />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Login;
