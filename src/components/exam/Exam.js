import {
    AppBar,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    Radio,
    Toolbar,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useAxios from "api/axios/useAxios";
import FormikRadioGroup from "common/formsUI/formikRadioGroup/FormikRadioGroup";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import _ from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Exam = () => {
    const [countdown, setCountdown] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [subjectId, setSubjectId] = useState([]);
    const [name, setName] = useState([]);
    const { examId, studentId } = useParams();
    const [initialValues, setInitialValues] = useState({
        examId: "",
        studentExamId: "",
        answers: [],
    });

    const formRef = useRef();
    const navigate = useNavigate();

    const handleSubmitOutside = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const api = useAxios();

    const getExam = async () => {
        try {
            let result = await api.get(
                `/Exam/get-student-exam?examId=${examId}&studentId=${studentId}`
            );
            setCountdown(result.data.exam.durationInMins * 60);
            setSubjectId(result.data.exam.subjectId);
            let tempInitialValues = {
                examId: examId,
                studentExamId: "",
                answers: [],
            };
            tempInitialValues.studentExamId = result.data.studentExamId;
            result.data.exam.questions.map((x) => {
                let tempContent = JSON.parse(x.question.content);
                x.question.content = tempContent;

                if (x.question.type == "multiChoice") {
                    let answersForm = [];
                    tempContent.answers.map((y, indexY) => {
                        answersForm.push({ [indexY]: false });
                    });
                    tempInitialValues.answers.push({
                        id: x.id,
                        answer: [...answersForm],
                    });
                } else {
                    tempInitialValues.answers.push({ id: x.id, answer: "" });
                }
            });
            setInitialValues(tempInitialValues);

            setName(result.data.exam.name);
            setQuestions(result.data.exam.questions);
        } catch (error) {}
    };

    const handleSubmit = async (values) => {
        values.answers.map((x) => {
            if (x.answer instanceof Array) {
                let tempAnswer = _.cloneDeep(x.answer);
                x.answer = JSON.stringify(tempAnswer);
            }
        });
        try {
            let response = await api.post("/Exam/solved-exam-submit", {
                ...values,
            });
            navigate("/predmet/" + subjectId);
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(function () {
            if (countdown != null) {
                if (countdown === 0) {
                    handleSubmitOutside();
                }
                setCountdown(countdown - 1);
            } else {
                getExam();
            }
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [countdown]);

    return (
        <Box sx={{ bgcolor: "primary.background" }} key={examId}>
            <Grid container spacing={2} justifyContent="center" padding={2}>
                <Grid item xs={12} justifyContent="center">
                    <Typography textAlign="center" variant="h4">
                        {`Ime ispita: ${name}`}
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ p: 6 }}>
                    {initialValues.answers.length > 0 ? (
                        <Formik
                            innerRef={formRef}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
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
                                    <Grid container>
                                        <FieldArray name="answers">
                                            {({ push, remove }) => (
                                                <Grid item container xs={12}>
                                                    <List
                                                        sx={{
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {questions.map(
                                                            (x, index) => {
                                                                if (
                                                                    x.question
                                                                        .type ==
                                                                    "true/false"
                                                                ) {
                                                                    return (
                                                                        <ListItem
                                                                            key={
                                                                                x.id
                                                                            }
                                                                            divider
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
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
                                                                                            6
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
                                                                                                    x
                                                                                                        .question
                                                                                                        .content
                                                                                                        .stem
                                                                                                }`}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            item
                                                                                            xs={
                                                                                                12
                                                                                            }
                                                                                        >
                                                                                            <Field
                                                                                                name={`answers[${index}].answer`}
                                                                                            >
                                                                                                {({
                                                                                                    field,
                                                                                                    form,
                                                                                                    meta,
                                                                                                }) => {
                                                                                                    return (
                                                                                                        <FormikRadioGroup
                                                                                                            form={
                                                                                                                form
                                                                                                            }
                                                                                                            field={
                                                                                                                field
                                                                                                            }
                                                                                                        >
                                                                                                            <FormControlLabel
                                                                                                                value="true"
                                                                                                                control={
                                                                                                                    <Radio />
                                                                                                                }
                                                                                                                label="Točno"
                                                                                                            />
                                                                                                            <FormControlLabel
                                                                                                                value="false"
                                                                                                                control={
                                                                                                                    <Radio />
                                                                                                                }
                                                                                                                label="Netočno"
                                                                                                            />
                                                                                                        </FormikRadioGroup>
                                                                                                    );
                                                                                                }}
                                                                                            </Field>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Box>
                                                                            </Grid>
                                                                        </ListItem>
                                                                    );
                                                                }
                                                                if (
                                                                    x.question
                                                                        .type ==
                                                                    "singleChoice"
                                                                ) {
                                                                    return (
                                                                        <ListItem
                                                                            key={
                                                                                x.id
                                                                            }
                                                                            divider
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
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
                                                                                            6
                                                                                        }
                                                                                    >
                                                                                        <Grid
                                                                                            item
                                                                                            xs={
                                                                                                12
                                                                                            }
                                                                                        >
                                                                                            {" "}
                                                                                            <Typography variant="h5">
                                                                                                {`${
                                                                                                    index +
                                                                                                    1
                                                                                                }. ${
                                                                                                    x
                                                                                                        .question
                                                                                                        .content
                                                                                                        .stem
                                                                                                }`}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            item
                                                                                            xs={
                                                                                                12
                                                                                            }
                                                                                        >
                                                                                            <Field
                                                                                                name={`answers[${index}].answer`}
                                                                                            >
                                                                                                {({
                                                                                                    field,
                                                                                                    form,
                                                                                                    meta,
                                                                                                }) => {
                                                                                                    return (
                                                                                                        <FormikRadioGroup
                                                                                                            form={
                                                                                                                form
                                                                                                            }
                                                                                                            field={
                                                                                                                field
                                                                                                            }
                                                                                                        >
                                                                                                            <Grid
                                                                                                                container
                                                                                                            >
                                                                                                                {x.question.content.answers.map(
                                                                                                                    (
                                                                                                                        x,
                                                                                                                        indexA
                                                                                                                    ) => {
                                                                                                                        return (
                                                                                                                            <Grid
                                                                                                                                item
                                                                                                                                xs={
                                                                                                                                    4
                                                                                                                                }
                                                                                                                            >
                                                                                                                                <FormControlLabel
                                                                                                                                    value={
                                                                                                                                        indexA
                                                                                                                                    }
                                                                                                                                    control={
                                                                                                                                        <Radio />
                                                                                                                                    }
                                                                                                                                    label={
                                                                                                                                        x
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                        );
                                                                                                                    }
                                                                                                                )}
                                                                                                            </Grid>
                                                                                                        </FormikRadioGroup>
                                                                                                    );
                                                                                                }}
                                                                                            </Field>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Box>
                                                                            </Grid>
                                                                        </ListItem>
                                                                    );
                                                                }
                                                                if (
                                                                    x.question
                                                                        .type ==
                                                                    "singleWord"
                                                                ) {
                                                                    return (
                                                                        <ListItem
                                                                            key={
                                                                                x.id
                                                                            }
                                                                            divider
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
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
                                                                                            8
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
                                                                                                    x
                                                                                                        .question
                                                                                                        .content
                                                                                                        .stem
                                                                                                }`}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            item
                                                                                            xs={
                                                                                                12
                                                                                            }
                                                                                        >
                                                                                            <Field
                                                                                                fullWidth
                                                                                                name={`answers[${index}].answer`}
                                                                                                component={
                                                                                                    TextField
                                                                                                }
                                                                                                type="string"
                                                                                                label={`Odgovor`}
                                                                                                sx={{
                                                                                                    minWidth:
                                                                                                        "200px",
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Box>
                                                                            </Grid>
                                                                        </ListItem>
                                                                    );
                                                                }
                                                                if (
                                                                    x.question
                                                                        .type ==
                                                                    "multiChoice"
                                                                ) {
                                                                    return (
                                                                        <ListItem
                                                                            key={
                                                                                x.id
                                                                            }
                                                                            divider
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    12
                                                                                }
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
                                                                                            6
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
                                                                                                    x
                                                                                                        .question
                                                                                                        .content
                                                                                                        .stem
                                                                                                }`}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            item
                                                                                            xs={
                                                                                                12
                                                                                            }
                                                                                        >
                                                                                            <Grid
                                                                                                container
                                                                                            >
                                                                                                {x.question.content.answers.map(
                                                                                                    (
                                                                                                        x,
                                                                                                        indexA
                                                                                                    ) => {
                                                                                                        return (
                                                                                                            <Grid
                                                                                                                item
                                                                                                                xs={
                                                                                                                    4
                                                                                                                }
                                                                                                            >
                                                                                                                <Field
                                                                                                                    name={`answers[${index}].answer[${indexA}].${indexA}`}
                                                                                                                    type="checkbox"
                                                                                                                    as={
                                                                                                                        FormControlLabel
                                                                                                                    }
                                                                                                                    label={
                                                                                                                        x
                                                                                                                    }
                                                                                                                    control={
                                                                                                                        <Checkbox />
                                                                                                                    }
                                                                                                                />
                                                                                                            </Grid>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Box>
                                                                            </Grid>
                                                                        </ListItem>
                                                                    );
                                                                }
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
                                        sx={{
                                            top: "auto",
                                            bottom: 0,
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Toolbar
                                            sx={{
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Typography sx={{ mr: 20 }}>
                                                {countdown &&
                                                    moment()
                                                        .startOf("day")
                                                        .seconds(countdown)
                                                        .format("H:mm:ss")}
                                            </Typography>
                                            <Button
                                                sx={{
                                                    bgcolor:
                                                        "primary.background",
                                                    ":hover": {
                                                        backgroundColor:
                                                            "#ffffff",
                                                        color: "#000000",
                                                    },
                                                }}
                                                variant="text"
                                                type="submit"
                                            >
                                                Završi Ispit
                                            </Button>
                                        </Toolbar>
                                    </AppBar>
                                </Form>
                            )}
                        </Formik>
                    ) : null}
                </Grid>
            </Grid>
        </Box>
    );
};
