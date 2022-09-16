import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import useAxios from "api/axios/useAxios";
import { MultiChoice } from "common/formsUI/questions/MultiChoice";
import { SingleChoice } from "common/formsUI/questions/SingleChoice";
import { SingleWord } from "common/formsUI/questions/SingleWord";
import { TrueFalse } from "common/formsUI/questions/TrueFalse";
import { FieldArray, Form, Formik } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { object } from "yup";

export const QuestionCreate = () => {
    const { subjectId } = useParams();

    const questionTypes = [
        {
            type: "true/false",
            subjectId: subjectId,
            content: { stem: "", correctAnswer: "" },
        },
        {
            type: "singleChoice",
            subjectId: subjectId,
            content: {
                stem: "",
                answers: [""],
                correctAnswerIndex: "",
            },
        },
        {
            type: "multiChoice",
            subjectId: subjectId,
            content: {
                stem: "",
                answers: [""],
                correctAnswersIndexes: [],
            },
        },
        {
            type: "singleWord",
            subjectId: subjectId,
            content: { stem: "", correctAnswers: [] },
        },
        { type: "sequence", stem: "", correctAnswers: [] },
    ];

    const api = useAxios();

    const [selectedQuestionTypeObject, setSelectedQuestionTypeObject] =
        useState(questionTypes[0]);
    const [selectedQuestionType, setSelectedQuestionType] =
        useState("true/false");

    const handleQuestionTypeChange = (event) => {
        setSelectedQuestionType(event.target.value);
        let questionType = questionTypes.find(
            (e) => e.type === event.target.value
        );
        setSelectedQuestionTypeObject(questionType);
    };

    const handleSubmit = async (values) => {
        let questionsCopy = _.cloneDeep(values.questions);
        questionsCopy.map((x) => (x.content = JSON.stringify(x.content)));
        try {
            let response = await api.post("/Question/create-questions", {
                questions: questionsCopy,
            });
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
            }
        }
    };

    return (
        <Grid item sx={{ pr: 4 }} xs={9} md={9} sm={10} lg={10} xl={10}>
            <Grid item xs={12}>
                <Formik
                    initialValues={{ questions: [] }}
                    validationSchema={object({
                        questions: yup.array().of(
                            yup.lazy((item) => {
                                const { type } = item;

                                if (type === "true/false") {
                                    return object({
                                        type: yup.string(),
                                        content: object({
                                            stem: yup
                                                .string()
                                                .required("Unesite pitanje"),
                                            correctAnswer: yup
                                                .boolean()
                                                .required("Odaberite odgovor"),
                                        }),
                                    });
                                }

                                if (type === "singleChoice") {
                                    return object({
                                        type: yup.string(),
                                        content: object({
                                            stem: yup
                                                .string()
                                                .required("Unesite pitanje"),
                                            answers: yup
                                                .array()
                                                .of(
                                                    yup
                                                        .string()
                                                        .required(
                                                            "Unesite odgovor"
                                                        )
                                                ),
                                            correctAnswerIndex: yup
                                                .number()
                                                .required(
                                                    "Odaberite točan odgovor"
                                                ),
                                        }),
                                    });
                                }

                                if (type === "multiChoice") {
                                    return object({
                                        type: yup.string(),
                                        content: object({
                                            stem: yup
                                                .string()
                                                .required("Unesite pitanje"),
                                            answers: yup
                                                .array()
                                                .of(
                                                    yup
                                                        .string()
                                                        .required(
                                                            "Unesite odgovor"
                                                        )
                                                ),
                                            correctAnswersIndexes: yup.array(),
                                        }),
                                    });
                                }

                                if (type === "singleWord") {
                                    return object({
                                        type: yup.string(),
                                        content: object({
                                            stem: yup
                                                .string()
                                                .required("Unesite pitanje"),
                                            correctAnswers: yup
                                                .array()
                                                .min(
                                                    1,
                                                    "Unesite točne odgovore"
                                                )
                                                .required(
                                                    "Unesite točne odgovore"
                                                ),
                                        }),
                                    });
                                }
                            })
                        ),
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, isSubmitting, isValid }) => (
                        <Form autoComplete="off">
                            <Grid container item spacing={4} xs={12}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" textAlign="center">
                                        Kreiranje pitanja
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Select
                                        value={selectedQuestionType}
                                        sx={{ minWidth: 200 }}
                                        onChange={handleQuestionTypeChange}
                                    >
                                        <MenuItem value={"true/false"}>
                                            Točno/netočno
                                        </MenuItem>
                                        <MenuItem value={"singleChoice"}>
                                            Točan odgovor
                                        </MenuItem>
                                        <MenuItem value={"multiChoice"}>
                                            Više točnih odgovora
                                        </MenuItem>
                                        <MenuItem value={"singleWord"}>
                                            Popuni prazninu
                                        </MenuItem>
                                    </Select>
                                </Grid>

                                <Grid
                                    item
                                    container
                                    xs={12}
                                    justifyContent="center"
                                >
                                    <FieldArray name="questions">
                                        {({ push, remove }) => (
                                            <Grid
                                                item
                                                xs={12}
                                                container
                                                spacing={2}
                                                justifyContent="start"
                                            >
                                                <Button
                                                    sx={{ m: 2.5 }}
                                                    disabled={isSubmitting}
                                                    variant="contained"
                                                    onClick={() =>
                                                        push(
                                                            selectedQuestionTypeObject
                                                        )
                                                    }
                                                >
                                                    Dodaj pitanje
                                                </Button>

                                                <Button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    variant="contained"
                                                    color="success"
                                                    sx={{ m: 2.5 }}
                                                    startIcon={
                                                        isSubmitting ? (
                                                            <CircularProgress size="0.9rem" />
                                                        ) : undefined
                                                    }
                                                >
                                                    Spremi pitanja
                                                </Button>
                                                {values.questions.map(
                                                    (_, index) => {
                                                        let { type } = _;

                                                        if (
                                                            type ===
                                                            "true/false"
                                                        )
                                                            return (
                                                                <Grid
                                                                    key={index}
                                                                    container
                                                                    item
                                                                    xs={12}
                                                                    sx={
                                                                        index %
                                                                            2 ==
                                                                        0
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      "white",
                                                                              }
                                                                            : null
                                                                    }
                                                                >
                                                                    <TrueFalse
                                                                        key={
                                                                            index
                                                                        }
                                                                        name={`questions[${index}]`}
                                                                    />
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                        container
                                                                        sx={{
                                                                            p: 2,
                                                                        }}
                                                                        alignContent="center"
                                                                    >
                                                                        <Button
                                                                            variant="contained"
                                                                            disabled={
                                                                                isSubmitting
                                                                            }
                                                                            onClick={() =>
                                                                                remove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Ukloni
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            );
                                                        if (
                                                            type ===
                                                            "singleChoice"
                                                        )
                                                            return (
                                                                <Grid
                                                                    key={index}
                                                                    container
                                                                    item
                                                                    xs={12}
                                                                    sx={
                                                                        index %
                                                                            2 ==
                                                                        0
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      "white",
                                                                              }
                                                                            : null
                                                                    }
                                                                >
                                                                    <SingleChoice
                                                                        key={
                                                                            index
                                                                        }
                                                                        name={`questions[${index}]`}
                                                                        answersArray={
                                                                            _
                                                                                .content
                                                                                .answers
                                                                        }
                                                                    />
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                        container
                                                                        sx={{
                                                                            p: 2,
                                                                        }}
                                                                        alignContent="center"
                                                                    >
                                                                        <Button
                                                                            variant="contained"
                                                                            disabled={
                                                                                isSubmitting
                                                                            }
                                                                            onClick={() =>
                                                                                remove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Ukloni
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            );
                                                        if (
                                                            type ===
                                                            "multiChoice"
                                                        )
                                                            return (
                                                                <Grid
                                                                    key={index}
                                                                    container
                                                                    item
                                                                    xs={12}
                                                                    sx={
                                                                        index %
                                                                            2 ==
                                                                        0
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      "white",
                                                                              }
                                                                            : null
                                                                    }
                                                                >
                                                                    <MultiChoice
                                                                        key={
                                                                            index
                                                                        }
                                                                        name={`questions[${index}]`}
                                                                        answersArray={
                                                                            _
                                                                                .content
                                                                                .answers
                                                                        }
                                                                        correctAnswersArray={
                                                                            _
                                                                                .content
                                                                                .correctAnswersIndexes
                                                                        }
                                                                    />
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                        sx={{
                                                                            p: 2,
                                                                        }}
                                                                        container
                                                                        alignContent="center"
                                                                    >
                                                                        <Button
                                                                            variant="contained"
                                                                            disabled={
                                                                                isSubmitting
                                                                            }
                                                                            onClick={() =>
                                                                                remove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Ukloni
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            );
                                                        if (
                                                            type ===
                                                            "singleWord"
                                                        )
                                                            return (
                                                                <Grid
                                                                    key={index}
                                                                    container
                                                                    item
                                                                    xs={12}
                                                                    sx={
                                                                        index %
                                                                            2 ==
                                                                        0
                                                                            ? {
                                                                                  backgroundColor:
                                                                                      "white",
                                                                              }
                                                                            : null
                                                                    }
                                                                >
                                                                    <SingleWord
                                                                        key={
                                                                            index
                                                                        }
                                                                        name={`questions[${index}]`}
                                                                        correctAnswersArray={
                                                                            _
                                                                                .content
                                                                                .correctAnswers
                                                                        }
                                                                        errors={
                                                                            errors
                                                                        }
                                                                    />
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        md={2}
                                                                        container
                                                                        sx={{
                                                                            p: 2,
                                                                        }}
                                                                        alignContent="center"
                                                                    >
                                                                        <Button
                                                                            variant="contained"
                                                                            disabled={
                                                                                isSubmitting
                                                                            }
                                                                            onClick={() =>
                                                                                remove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Ukloni
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            );
                                                    }
                                                )}
                                            </Grid>
                                        )}
                                    </FieldArray>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};
