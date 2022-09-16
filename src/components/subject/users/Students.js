import {
    Button,
    Divider,
    Grid,
    IconButton,
    Input,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Pagination,
    Paper,
    Typography,
} from "@mui/material";
import useAxios from "api/axios/useAxios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SearchIcon from "@mui/icons-material/Search";

export const Students = () => {
    let [page, setPage] = useState(1);
    let [pageCount, setPageCount] = useState(1);
    let [searchQuery, setSearchQuery] = useState("");
    let [searchQueryFromClick, setSearchQueryFromClick] = useState("");
    let [ucenici, setUcenici] = useState([]);
    let [deleted, setDeleted] = useState(false);

    let { subjectId } = useParams();

    let api = useAxios();

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        setSearchQueryFromClick(searchQuery);
        setPage(1);
    };

    const handleQueryInput = (event) => {
        setSearchQuery(event.target.value);
    };

    const getUcenici = async () => {
        try {
            let result = await api.get(
                `/SubjectStudent?subjectId=${subjectId}&page=${page}&rpp=10&searchQuery=${searchQuery}`
            );

            setUcenici(result.data.items);

            if (result.data.totalCount % 10 > 0) {
                setPageCount(parseInt(result.data.totalCount / 6 + 1));
            } else {
                setPageCount(parseInt(result.data.totalCount / 6));
            }
        } catch (error) {}
    };

    const handleDelete = async (id) => {
        try {
            let result = await api.delete(`/SubjectStudent/delete-student`, {
                data: { id: id },
            });
            setDeleted(!deleted);
        } catch (error) {}
    };

    useEffect(() => {
        getUcenici();
    }, [page, searchQueryFromClick, deleted]);

    return (
        <Grid item xs={9} md={8} sm={9} xl={6} spacing={2}>
            <Paper
                sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                }}
            >
                <Grid item container sx={{ p: 3 }} spacing={2}>
                    <Grid item xs={12}>
                        <Typography textAlign="center" variant="h4">
                            Popis učenika
                        </Typography>
                    </Grid>
                    <Grid container item xs={6}>
                        <form onSubmit={handleSearchClick}>
                            <Paper
                                elevation={5}
                                sx={{
                                    p: "2px 4px",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "auto",
                                }}
                            >
                                <Input
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Pretražite"
                                    onChange={handleQueryInput}
                                />
                                <IconButton
                                    type="submit"
                                    sx={{ p: "10px" }}
                                    aria-label="search"
                                >
                                    <SearchIcon />
                                </IconButton>
                                <Divider
                                    sx={{ height: 28, m: 0.5 }}
                                    orientation="vertical"
                                />
                            </Paper>
                        </form>
                    </Grid>
                    <Grid item xs>
                        <List>
                            {ucenici.map((x) => {
                                return (
                                    <ListItem divider>
                                        <ListItemText>
                                            <Typography>
                                                učenik: {x.user.name}{" "}
                                                {x.user.surname}
                                            </Typography>
                                            <Typography>
                                                email: {x.user.email}
                                            </Typography>
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(x.id)
                                                }
                                            >
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                    <Grid item container justifyContent="center">
                        <Pagination
                            count={pageCount}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};
