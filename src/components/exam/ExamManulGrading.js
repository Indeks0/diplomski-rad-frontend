import {
    AppBar,
    Button,
    Grid,
    List,
    ListItem,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useAxios from "api/axios/useAxios";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as yup from "yup";
import { object } from "yup";

export const ExamManualGrading = () => {
    const [name, setName] = useState([]);
    const { solvedExamId, examId } = useParams();
    const [solvedExam, setSolvedExam] = useState(null);

    const [initialValues, setInitialValues] = useState({
        points: [],
    });

    const formRef = useRef();
    const navigate = useNavigate();

    const handleSubmitOutside = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const api = useAxios();

    const getSolvedExam = async () => {
        try {
            let result = await api.get(
                `/SolvedExam/get-solved-exam?id=${solvedExamId}`
            );

            let tempContent = JSON.parse(result.data.content);
            result.data.content = tempContent;

            let tempInitialValues = {
                points: [],
            };

            result.data.content.items.map((x, index) => {
                tempInitialValues.points.push({
                    scored: x.scoredPoints,
                    maxValue: x.maximumPoints,
                });
            });

            setInitialValues(tempInitialValues);
            setSolvedExam(result.data);
        } catch (error) {}
    };

    const handleSubmit = async (values) => {
        let tempSolvedExam = _.cloneDeep(solvedExam);
        let tempScore = 0;

        tempSolvedExam.content.items.map((x, index) => {
            x.scoredPoints = values.points[index].scored;
            tempScore += values.points[index].scored;
        });

        tempSolvedExam.scoredPoints = tempScore;
        tempSolvedExam.content = JSON.stringify(tempSolvedExam.content);

        try {
            let result = await api.put(`/SolvedExam/update-solved-exam`, {
                ...tempSolvedExam,
                examId,
            });
        } catch (error) {}
    };

    useEffect(() => {
        getSolvedExam();
    }, []);

    const renderAnswers = (question) => {
        if (question.type == "true/false") {
            return (
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Točan odgovor: ${
                                question.correctAnswer === "true"
                                    ? "točno"
                                    : "netočno"
                            }`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Dani odgovor: ${
                                question.answered === "true"
                                    ? "točno"
                                    : "netočno"
                            }`}
                        </Typography>
                    </Grid>
                </Grid>
            );
        } else if (question.type == "singleChoice") {
            return (
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Ponuđeni odgovori: ${question.answers}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Točan odgovor: ${question.correctAnswer}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Dani odgovor: ${question.answered}`}
                        </Typography>
                    </Grid>
                </Grid>
            );
        } else if (question.type == "singleWord") {
            return (
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Točni odgovori: ${question.correctAnswers}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Dani odgovor: ${question.answered}`}
                        </Typography>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Ponuđeni odgovori: ${question.answers}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Točni odgovori: ${question.correctAnswers}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {`Odabrani odgovori: ${question.answered}`}
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
    };

    return (
        <Grid item container xs spacing={2} justifyContent="center" padding={2}>
            <Grid item xs={6} container justifyContent="center">
                <Formik
                    enableReinitialize
                    innerRef={formRef}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={object({
                        points: yup.array().of(
                            yup.lazy((item) => {
                                return object({
                                    scored: yup
                                        .number()
                                        .max(
                                            item.maxValue,
                                            `Broj ne može biti veći od ${item.maxValue}`
                                        )
                                        .min(0, "Broj mora biti veći od 0"),
                                });
                            })
                        ),
                    })}
                >
                    {({
                        values,
                        errors,
                        isSubmitting,
                        isValid,
                        touched,
                        setFieldValue,
                    }) => (
                        <Form>
                            <Grid container justifyContent="center">
                                <FieldArray name="points">
                                    {({ push, remove }) => (
                                        <Grid item container xs={12}>
                                            <List
                                                sx={{
                                                    width: "100%",
                                                }}
                                            >
                                                {solvedExam?.content.items.map(
                                                    (x, index) => {
                                                        return (
                                                            <ListItem
                                                                key={x.stem}
                                                                divider
                                                                sx={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                >
                                                                    <Box
                                                                        minHeight={
                                                                            200
                                                                        }
                                                                        justifyContent="start"
                                                                        alignItems="start"
                                                                        margin={
                                                                            2
                                                                        }
                                                                    >
                                                                        <Grid
                                                                            container
                                                                            spacing={
                                                                                2
                                                                            }
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
                                                                            >
                                                                                <Typography variant="h5">
                                                                                    {`${
                                                                                        index +
                                                                                        1
                                                                                    }. ${
                                                                                        x.stem
                                                                                    }`}
                                                                                </Typography>
                                                                            </Grid>
                                                                            {renderAnswers(
                                                                                x
                                                                            )}
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
                                                                            >
                                                                                <Typography variant="h5">
                                                                                    {`Mogući bodovi: ${x.maximumPoints}`}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
                                                                            >
                                                                                {solvedExam?.isLocked ==
                                                                                false ? (
                                                                                    <Field
                                                                                        name={`points[${index}].scored`}
                                                                                        label="Broj bodova"
                                                                                        type="number"
                                                                                        component={
                                                                                            TextField
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    <Typography label="Broj bodova">
                                                                                        {`Ostvareni bodovi: ${x.scoredPoints}`}
                                                                                    </Typography>
                                                                                )}
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Box>
                                                                </Grid>
                                                            </ListItem>
                                                        );
                                                    }
                                                )}
                                            </List>
                                        </Grid>
                                    )}
                                </FieldArray>
                            </Grid>
                            <AppBar
                                position="fixed"
                                color="primary"
                                sx={{ top: "auto", bottom: 0 }}
                            >
                                {solvedExam?.isLocked == false ? (
                                    <Button
                                        variant="text"
                                        color="inherit"
                                        type="submit"
                                    >
                                        Spremi izmjene
                                    </Button>
                                ) : null}
                            </AppBar>
                        </Form>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};
