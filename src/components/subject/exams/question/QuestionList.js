import {
    Button,
    Checkbox,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Toolbar,
    Typography,
} from "@mui/material";
import useAxios from "api/axios/useAxios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import _ from "lodash";
import { QuestionDetailsDialog } from "common/formsUI/questions/QuestionDetailsDialog";

export const QuestionList = () => {
    let { subjectId } = useParams();
    let options = ["true/false", "singleChoice", "multiChoice", "singleWord"];
    let [type, setType] = useState(options[0]);
    let [questions, setQuestions] = useState([]);
    let [questionsForDeletion, setQuestionsForDeletion] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState(false);
    const [modalType, setModalType] = React.useState(null);
    const handleOpen = (content, type) => {
        setModalContent(content);
        setModalType(type);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleChecked = (event, item) => {
        if (event.target.checked) {
            setQuestionsForDeletion([...questionsForDeletion, item]);
        } else {
            let index = questionsForDeletion.indexOf(item);
            let tempDeletion = [...questionsForDeletion];
            tempDeletion.splice(index, 1);
            setQuestionsForDeletion(tempDeletion);
        }
    };

    const handleDeleteSingle = async (item, index) => {
        try {
            let result = await api.delete(`/Question/delete-questions`, {
                data: {
                    questions: [{ id: item.id }],
                },
            });
            let tempDeletion = [...questions];
            tempDeletion.splice(index, 1);
            setQuestions(tempDeletion);
        } catch {}
    };

    const handleDeleteSelected = async () => {
        if (questionsForDeletion.length > 0) {
            try {
                let ids = questionsForDeletion.map(({ id }) => {
                    return { id };
                });
                let result = await api.delete(`/Question/delete-questions`, {
                    data: {
                        questions: [...ids],
                    },
                });

                let tempDeletion = [...questions];
                questionsForDeletion.map((x) => {
                    let index = tempDeletion.indexOf(x);
                    tempDeletion.splice(index, 1);
                });
                setQuestionsForDeletion([]);
                setQuestions(tempDeletion);
            } catch {}
        }
    };

    const api = useAxios();

    const findQuestions = async () => {
        try {
            let result = await api.get(
                `/Question/find-questions?subjectId=${subjectId}&type=${type}`
            );
            result.data.map((x) => {
                let tempContent = JSON.parse(x.content);
                x.content = tempContent;
            });
            result.data.sort((a, b) => {
                return a.content.stem.localeCompare(b.content.stem);
            });
            setQuestions(result.data);
        } catch {}
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    useEffect(() => {
        findQuestions();
    }, [type]);

    return (
        <Grid item sx={{ pr: 4 }} xs={9} md={9} sm={10} lg={10} xl={10}>
            <QuestionDetailsDialog
                open={open}
                handleClose={handleClose}
                type={modalType}
                content={modalContent}
            />
            <Grid item xs={12} container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" textAlign="center">
                        Baza pitanja
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6">Vrsta pitanja</Typography>

                    <Select value={type} onChange={handleTypeChange}>
                        <MenuItem value={"true/false"}>Točno/Netočno</MenuItem>
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
                    <Button
                        sx={{ m: 2 }}
                        variant="contained"
                        onClick={handleDeleteSelected}
                    >
                        Briši odabrane
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} container maxHeight={600}>
                <Grid
                    item
                    xs
                    sm={5}
                    style={{ maxHeight: "100%", overflow: "auto" }}
                >
                    <List>
                        {questions.map((x, index) => {
                            return (
                                <ListItem
                                    divider
                                    key={x.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color="error"
                                            onClick={() =>
                                                handleDeleteSingle(x, index)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={x.content.stem} />
                                    <Checkbox
                                        onChange={(event) =>
                                            handleChecked(event, x)
                                        }
                                        color="error"
                                    />
                                    <IconButton
                                        color="primary"
                                        edge="end"
                                        aria-label="delete"
                                        sx={{ pr: 2 }}
                                        onClick={() =>
                                            handleOpen(x.content, x.type)
                                        }
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
        </Grid>
    );
};
