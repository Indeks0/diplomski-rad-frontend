import { Alert, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { baseURL } from "api/axios/useAxios";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ConfirmAccount = () => {
    let { token, email } = useParams();
    let [response, setResponse] = useState(false);

    const confirmAcc = async () => {
        try {
            let result = await axios.post(
                baseURL + "/Authenticate/confirm-email",
                null,
                {
                    params: {
                        token,
                        email,
                    },
                }
            );
            setResponse(true);
        } catch (error) {}
    };

    useEffect(() => {
        confirmAcc();
    }, []);

    return (
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12}>
                <Paper elevation={10}>
                    <Typography variant="h3">Potvrda računa</Typography>
                    {!response ? (
                        <LinearProgress color="success" />
                    ) : (
                        <Alert severity="success">
                            Uspješno ste potvrdili račun: {email}
                        </Alert>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};
