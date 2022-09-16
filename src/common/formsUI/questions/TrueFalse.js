import { Grid, MenuItem, Typography } from "@mui/material";
import { Field } from "formik";
import React from "react";

import { Select, TextField } from "formik-mui";

export const TrueFalse = ({ name }) => {
    return (
        <Grid item container xs={10} spacing={4} sx={{ p: 2 }}>
            <Grid item xs={12} md={2}>
                <Typography>Vrsta pitanja:</Typography>

                <Typography>Točno/Netočno</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Field
                    fullWidth
                    name={`${name}.content.stem`}
                    component={TextField}
                    type="string"
                    label="Tekst pitanja"
                    multiline
                />
            </Grid>
            <Grid item xs={12} md>
                <Field
                    name={`${name}.content.correctAnswer`}
                    options={{
                        true: "Točno",
                        false: "Netočno",
                    }}
                    component={Select}
                    label="Odgovor"
                    sx={{ minWidth: "150px" }}
                >
                    <MenuItem value={true}>Točno</MenuItem>
                    <MenuItem value={false}>Netočno</MenuItem>
                </Field>
            </Grid>
        </Grid>
    );
};
