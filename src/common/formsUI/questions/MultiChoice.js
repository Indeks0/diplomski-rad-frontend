import {
    Box,
    Checkbox,
    Chip,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Typography,
} from "@mui/material";
import { Field, Form, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { TextField, Select } from "formik-mui";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export const MultiChoice = ({ name, answersArray, correctAnswersArray }) => {
    const { setFieldValue } = useFormikContext();

    let [answers, setAnswers] = useState([]);
    let [arrayChanged, setArrayChanged] = useState(false);
    const [selected, setSelected] = useState([]);

    const handleDeleteAnswer = (index) => {
        if (answers.length > 1) {
            answersArray.splice(index, 1);
            setFieldValue(`${name}.content.answers`, answersArray);
            setSelected([]);
            setFieldValue(`${name}.content.correctAnswersIndexes`, []);
        }
    };

    const handleCheckboxChange = (event) => {
        const value = event.target.value;

        setFieldValue(`${name}.content.correctAnswersIndexes`, value);
        if (value[value.length - 1] === "all") {
            setSelected(
                selected.length === answersArray.length ? [] : answersArray
            );
            return;
        }
        setSelected(value);
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
                <Typography>Više točnih odgovora</Typography>
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
                    multiple
                    label="Točni Odgovori"
                    sx={{ minWidth: "200px" }}
                    onChange={handleCheckboxChange}
                    value={selected}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                            {selected.map((value) => (
                                <Chip key={value} label={answersArray[value]} />
                            ))}
                        </Box>
                    )}
                >
                    {answers.map((x, index) => {
                        return (
                            <MenuItem value={index}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selected.indexOf(index) > -1}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={x} />
                            </MenuItem>
                        );
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
