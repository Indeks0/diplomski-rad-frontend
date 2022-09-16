import { Grid, IconButton, MenuItem, Typography } from "@mui/material";
import { Field, Form, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { TextField, Select } from "formik-mui";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export const SingleChoice = ({ name, answersArray }) => {
    const { setFieldValue } = useFormikContext();

    let [answers, setAnswers] = useState([]);
    let [arrayChanged, setArrayChanged] = useState(false);
    let [correctAnswer, setCorrectAnswer] = useState("");

    const handleDeleteAnswer = (index) => {
        if (answers.length > 1) {
            answersArray.splice(index, 1);
            setFieldValue(`${name}.content.answers`, answersArray);
        }
    };

    const handleCorrectAnswerChange = (event) => {
        setCorrectAnswer(event.target.value);
    };

    const handleAddAnswer = () => {
        answersArray.push("");
        setFieldValue(`${name}.content.answers`, answersArray);
    };

    useEffect(() => {
        setAnswers(answersArray);
    }, [answersArray, arrayChanged]);

    return (
        <Grid item container xs={10} spacing={4} sx={{ p: 2 }}>
            <Grid item xs={12} md={2}>
                <Typography>Vrsta pitanja:</Typography>
                <Typography>Točan odgovor</Typography>
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
            <Grid item xs={12} md={4}>
                <Field
                    name={`${name}.content.correctAnswerIndex`}
                    component={Select}
                    label="Točan Odgovor"
                    sx={{ minWidth: "200px" }}
                    onChange={handleCorrectAnswerChange}
                    value={correctAnswer}
                >
                    {answers.map((x, index) => {
                        return <MenuItem value={index}>{x}</MenuItem>;
                    })}
                </Field>
            </Grid>

            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12}>
                    <Typography textAlign="center" variant="h5">
                        Ponuđeni odgovori
                    </Typography>
                    <IconButton onClick={handleAddAnswer} color="success">
                        <AddCircleOutlineIcon fontSize="large" />
                    </IconButton>
                </Grid>
                {answers.map((x, index) => {
                    return (
                        <Grid item container xs={12} md={6}>
                            <Grid item xs={10}>
                                <Field
                                    fullWidth
                                    name={`${name}.content.answers[${index}]`}
                                    component={TextField}
                                    type="string"
                                    label={`Odgovor ${index + 1}`}
                                    sx={{ minWidth: "200px" }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteAnswer(index)}
                                >
                                    <RemoveCircleOutlineIcon fontSize="large" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};
