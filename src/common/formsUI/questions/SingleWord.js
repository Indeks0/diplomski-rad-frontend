import {
    Grid,
    TextField as TextFieldMaterial,
    Typography,
} from "@mui/material";
import { Field, useField, useFormikContext } from "formik";
import { Autocomplete, TextField } from "formik-mui";
import { useEffect, useState } from "react";

export const SingleWord = ({ name, correctAnswersArray }) => {
    const { setFieldValue } = useFormikContext();

    let [correctAnswers, setCorrectAnswers] = useState([]);

    const [field, mata] = useField(`${name}.content.correctAnswers`);

    const configTextfield = {};

    if (mata && mata.touched && mata.error) {
        configTextfield.error = true;
        configTextfield.helperText = mata.error;
    }
    const cities = [
        { name: "New York", value: 1, state: "NY" },
        { name: "San Francisco", value: 2, state: "CA" },
        { name: "Los Angeles", value: 3, state: "CA" },
    ];

    const handleDeleteChip = (chip, index) => {
        let tempArray = correctAnswersArray;
        tempArray.splice(index, 1);
        setFieldValue(`${name}.content.correctAnswers`, tempArray);
    };

    const handleAddChip = (chip) => {
        if (correctAnswersArray.indexOf(chip) === -1) {
            correctAnswersArray.push(chip);
            setFieldValue(
                `${name}.content.correctAnswers`,
                correctAnswersArray
            );
        }
    };

    useEffect(() => {
        setCorrectAnswers(correctAnswersArray);
    }, [correctAnswersArray]);

    return (
        <Grid item container xs={10} spacing={4} sx={{ p: 2 }}>
            <Grid item xs={12} md={2}>
                <Typography>Vrsta pitanja:</Typography>
                <Typography>Popuni prazninu</Typography>
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
            <Grid item xs={12} md={4} container>
                <Field
                    options={[]}
                    name={`${name}.content.correctAnswers`}
                    component={Autocomplete}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    onChange={(event, value) => {
                        setFieldValue(`${name}.content.correctAnswers`, value);
                    }}
                    freeSolo
                    multiple
                    renderInput={(params) => (
                        <TextFieldMaterial
                            {...configTextfield}
                            {...params}
                            label="Prihvaćeni odgovori"
                            fullWidth
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};
