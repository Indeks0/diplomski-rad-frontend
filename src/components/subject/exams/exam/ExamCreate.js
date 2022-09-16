import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Modal,
    Select,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { arrayMoveImmutable } from "array-move";
import InfoIcon from "@mui/icons-material/Info";
import { Box } from "@mui/system";
import useAxios from "api/axios/useAxios";
import { useParams } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import _ from "lodash";
import { Select as SelectFormik } from "formik-mui";
import {
    ErrorMessage,
    Field,
    FieldArray,
    Form,
    Formik,
    yupToFormErrors,
} from "formik";
import Datetime from "react-datetime";
import Textfield from "common/formsUI/textfield";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import "moment/locale/hr";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { QuestionDetailsDialog } from "common/formsUI/questions/QuestionDetailsDialog";

export const ExamCreate = () => {
    let api = useAxios();
    let { subjectId } = useParams();
    let options = ["true/false", "singleChoice", "multiChoice", "singleWord"];
    let [criteriaOptions, setCriteriaOptions] = useState([]);
    let [type, setType] = useState(options[0]);
    let [questions, setQuestions] = useState([]);
    let [questionsExam, setQuestionsExam] = useState([]);
    const [modalContent, setModalContent] = React.useState(false);
    const [modalType, setModalType] = React.useState(null);
    const [subject, setSubject] = useState(null);

    let yesterdayDate = moment().subtract(1, "day");
    let validDate = function (current) {
        return current.isAfter(yesterdayDate);
    };

    let inputProps = {
        placeholder: "Odaberite datum",
    };

    const findQuestions = async () => {
        try {
            let result = await api.get(
                `/Question/find-questions?subjectId=${subjectId}&type=${type}`
            );
            let criteria = await api.get(
                `/SubjectGradingCriteria/get-by-subject?subjectId=${subjectId}`
            );

            result.data.map((x) => {
                let tempContent = JSON.parse(x.content);
                x.content = tempContent;
            });

            setCriteriaOptions(criteria.data);

            result.data.sort((a, b) => {
                return a.content.stem.localeCompare(b.content.stem);
            });

            let temp = result.data.filter(function (x) {
                return _.findIndex(questionsExam, [`id`, x.id]) === -1;
            });
            setQuestions(temp);
        } catch {}
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    const handleSubmit = async (values) => {
        values.subjectName = subject.name;
        try {
            var students = await api.get(
                `/SubjectStudent?subjectId=${subjectId}&page=1&rpp=1000`
            );
            values.students = [];
            students.data.items.map((x) => {
                values.students.push({ studentId: x.id });
            });
            let response = await api.post("/Exam/create-exam", {
                ...values,
            });
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
            }
        }
    };

    const getSubject = async () => {
        try {
            let result = await api.get(`/Subject/${subjectId}`);
            setSubject(result.data);
        } catch (error) {}
    };

    useEffect(() => {
        getSubject();
    }, []);

    useEffect(() => {
        findQuestions();
    }, [type]);

    //Stari kod ispod
    const [open, setOpen] = React.useState(false);
    const handleOpen = (content, type) => {
        setModalContent(content);
        setModalType(type);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const onDrop = (removedIndex, addedIndex) => {
        setQuestionsExam((items) =>
            arrayMoveImmutable(items, removedIndex, addedIndex)
        );
    };

    const handleAddToExam = (item, index) => {
        let tempQuestions = [...questions];
        let tempQuestionsExam = [...questionsExam];

        tempQuestions.splice(index, 1);
        tempQuestionsExam.push(item);

        setQuestions(tempQuestions);
        setQuestionsExam(tempQuestionsExam);
    };

    const handleRemoveFromExam = (item, index) => {
        let tempQuestions = [...questions];
        let tempQuestionsExam = [...questionsExam];

        tempQuestions.push(item);
        tempQuestionsExam.splice(index, 1);

        setQuestions(tempQuestions);
        setQuestionsExam(tempQuestionsExam);
    };

    return (
        <Grid item sx={{ pr: 4 }} xs={9} md={9} sm={10} lg={10} xl={10}>
            <QuestionDetailsDialog
                open={open}
                handleClose={handleClose}
                type={modalType}
                content={modalContent}
            />
            <Formik
                initialValues={{
                    subjectId: subjectId,
                    subjectGradingCriteriaId: "",
                    name: "",
                    subjectName: "",
                    description: "",
                    durationInMins: 0,
                    dateOpenStart: null,
                    dateOpenEnd: null,
                    sendNotification: false,
                    randomizedQuestionsOrder: false,
                    questions: [],
                }}
                validationSchema={yup.object({
                    name: yup.string().required("Unesite opis ispita"),
                    subjectId: yup.string().required(),
                    subjectGradingCriteriaId: yup.string().required(),
                    description: yup.string().required("Unesite opis ispita"),
                    durationInMins: yup
                        .number()
                        .required("Unesite trajanje ispita"),
                    dateOpenStart: yup
                        .date("Unesite vrijeme početka ispita")
                        .required("Unesite vrijeme početka ispita")
                        .typeError("Unesite vrijeme početka ispita"),
                    dateOpenEnd: yup
                        .date("Unesite vrijeme roka za prijavu ispita")
                        .required("Unesite vrijeme roka za prijavu ispita")
                        .typeError("Unesite vrijeme roka za prijavu ispita"),

                    sendNotification: yup.bool(),
                    randomizedQuestionsOrder: yup.bool(),
                    questions: yup.array().of(
                        yup.object().shape({
                            questionId: yup.string().required(),
                            points: yup
                                .number()
                                .required("Unesite broj bodova pitanja")
                                .min(1, "Broj bodova mora biti veći od 0"),
                        })
                    ),
                })}
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
                    <Form autoComplete="off">
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h4" textAlign="center">
                                    Kreiranje ispita
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                container
                                spacing={4}
                                sx={{ pt: 4, pb: 4 }}
                            >
                                <Grid item xs={12} container spacing={4}>
                                    <Grid item>
                                        <Field
                                            name="name"
                                            label="Ime ispita"
                                            component={TextField}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Field
                                            name="durationInMins"
                                            label="Trajanje ispita (minute)"
                                            type="number"
                                            component={TextField}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Field
                                            name={`subjectGradingCriteriaId`}
                                            options={criteriaOptions}
                                            component={SelectFormik}
                                            label="Kriterij ocjenjivanja"
                                            sx={{ minWidth: "300px" }}
                                        >
                                            {criteriaOptions.map((x, index) => {
                                                return (
                                                    <MenuItem value={x.id}>
                                                        {x.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={4} container>
                                        <Grid item xs={12}>
                                            <Typography textAlign="center">
                                                Vrijeme mogućnosti pristupa
                                                ispitu:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            Od:
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Field
                                                name="dateOpenStart"
                                                render={({
                                                    field,
                                                    form: { isSubmitting },
                                                }) => (
                                                    <div
                                                        key={"dateStartRender"}
                                                    >
                                                        <Datetime
                                                            isValidDate={
                                                                validDate
                                                            }
                                                            inputProps={{
                                                                placeholder:
                                                                    "Odaberite datum i vrijeme",
                                                            }}
                                                            locale="hr"
                                                            onChange={(
                                                                time
                                                            ) => {
                                                                setFieldValue(
                                                                    "dateOpenStart",
                                                                    time
                                                                );
                                                            }}
                                                        />

                                                        {touched.dateOpenEnd &&
                                                            errors.dateOpenEnd && (
                                                                <span className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1wc848c-MuiFormHelperText-root">
                                                                    {
                                                                        errors.dateOpenEnd
                                                                    }
                                                                </span>
                                                            )}
                                                    </div>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            Do:
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Field
                                                name="dateOpenEnd"
                                                render={({
                                                    field,
                                                    form: { isSubmitting },
                                                }) => (
                                                    <div key={"dateEndRender"}>
                                                        <Datetime
                                                            className={
                                                                "form-control " +
                                                                (touched.dateOpenStart &&
                                                                    errors.dateOpenStart)
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }
                                                            isValidDate={
                                                                validDate
                                                            }
                                                            inputProps={{
                                                                placeholder:
                                                                    "Odaberite datum i vrijeme",
                                                            }}
                                                            locale="hr"
                                                            onChange={(
                                                                time
                                                            ) => {
                                                                setFieldValue(
                                                                    "dateOpenEnd",
                                                                    time
                                                                );
                                                            }}
                                                        />
                                                        {touched.dateOpenStart &&
                                                            errors.dateOpenStart && (
                                                                <span className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1wc848c-MuiFormHelperText-root">
                                                                    {
                                                                        errors.dateOpenStart
                                                                    }
                                                                </span>
                                                            )}
                                                    </div>
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Textfield
                                            name="description"
                                            label="Opis"
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Field
                                            name="sendNotification"
                                            type="checkbox"
                                            as={FormControlLabel}
                                            label="Poslati obavijest mailom"
                                            control={<Checkbox />}
                                        />
                                        <Field
                                            name="randomizedQuestionsOrder"
                                            type="checkbox"
                                            as={FormControlLabel}
                                            label="Nasumičan redoslijed pitanja"
                                            control={<Checkbox />}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container spacing={4}>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" variant="h4">
                                        Moguća pitanja
                                    </Typography>
                                    <Typography variant="h6">
                                        Vrsta pitanja
                                    </Typography>

                                    <Select
                                        value={type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value={"true/false"}>
                                            Točno/Netočno
                                        </MenuItem>
                                        <MenuItem value={"singleChoice"}>
                                            Točan odgovor
                                        </MenuItem>
                                        <MenuItem value={"multiChoice"}>
                                            Višestruki izbor
                                        </MenuItem>
                                        <MenuItem value={"singleWord"}>
                                            Popuni prazninu
                                        </MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" variant="h4">
                                        Pitanja u ispitu
                                    </Typography>
                                </Grid>
                            </Grid>
                            <FieldArray name="questions">
                                {({ push, remove }) => (
                                    <Grid container>
                                        <Grid
                                            item
                                            xs={6}
                                            justifyContent="center"
                                            container
                                            maxHeight={600}
                                        >
                                            <Grid
                                                item
                                                xs={10}
                                                style={{
                                                    height: 350,
                                                    overflow: "auto",
                                                }}
                                            >
                                                <List>
                                                    {questions.map(
                                                        (x, index) => {
                                                            return (
                                                                <ListItem
                                                                    divider
                                                                    key={x.id}
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
                                                                                8
                                                                            }
                                                                        >
                                                                            <ListItemText
                                                                                primary={
                                                                                    x
                                                                                        .content
                                                                                        .stem
                                                                                }
                                                                            />
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                2
                                                                            }
                                                                        >
                                                                            <IconButton
                                                                                color="success"
                                                                                onClick={() => {
                                                                                    handleAddToExam(
                                                                                        x,
                                                                                        index
                                                                                    );
                                                                                    push(
                                                                                        {
                                                                                            questionId:
                                                                                                x.id,
                                                                                            points: 1,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <AddCircleIcon />
                                                                            </IconButton>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                2
                                                                            }
                                                                        >
                                                                            <IconButton
                                                                                color="primary"
                                                                                edge="end"
                                                                                aria-label="delete"
                                                                                sx={{
                                                                                    pr: 2,
                                                                                }}
                                                                                onClick={() =>
                                                                                    handleOpen(
                                                                                        x.content,
                                                                                        x.type
                                                                                    )
                                                                                }
                                                                            >
                                                                                <InfoIcon />
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </ListItem>
                                                            );
                                                        }
                                                    )}
                                                </List>
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={6}
                                            justifyContent="center"
                                            container
                                            maxHeight={600}
                                        >
                                            <Grid
                                                item
                                                xs={10}
                                                style={{
                                                    height: 350,
                                                    overflow: "auto",
                                                }}
                                            >
                                                <List>
                                                    <Container
                                                        dragHandleSelector=".drag-handle"
                                                        lockAxis="y"
                                                        onDrop={({
                                                            removedIndex,
                                                            addedIndex,
                                                        }) => {
                                                            onDrop(
                                                                removedIndex,
                                                                addedIndex
                                                            );
                                                            setFieldValue(
                                                                "questions",
                                                                arrayMoveImmutable(
                                                                    values.questions,
                                                                    removedIndex,
                                                                    addedIndex
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        {questionsExam.map(
                                                            (x, index) => (
                                                                <Draggable
                                                                    key={x.id}
                                                                >
                                                                    <ListItem
                                                                        className="drag-handle"
                                                                        divider
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
                                                                                    6
                                                                                }
                                                                            >
                                                                                <Typography>
                                                                                    {`${
                                                                                        index +
                                                                                        1
                                                                                    }. ${
                                                                                        x
                                                                                            .content
                                                                                            .stem
                                                                                    }`}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    4
                                                                                }
                                                                            >
                                                                                <Field
                                                                                    placeholder="Broj bodova"
                                                                                    name={`questions[${index}].points`}
                                                                                    label="Broj bodova"
                                                                                    type="number"
                                                                                    InputProps={{
                                                                                        inputProps:
                                                                                            {
                                                                                                min: 1,
                                                                                            },
                                                                                    }}
                                                                                    component={
                                                                                        TextField
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    1
                                                                                }
                                                                            >
                                                                                <IconButton
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        handleRemoveFromExam(
                                                                                            x,
                                                                                            index
                                                                                        );
                                                                                        remove(
                                                                                            index
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <RemoveCircleIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={
                                                                                    1
                                                                                }
                                                                            >
                                                                                <IconButton
                                                                                    color="primary"
                                                                                    edge="end"
                                                                                    aria-label="delete"
                                                                                    sx={{
                                                                                        pr: 2,
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        handleOpen(
                                                                                            x.content,
                                                                                            x.type
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <InfoIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </ListItem>
                                                                </Draggable>
                                                            )
                                                        )}
                                                    </Container>
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                            </FieldArray>

                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                    >
                                        Kreiraj ispit
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Grid>
    );
};
