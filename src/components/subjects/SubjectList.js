import SearchIcon from "@mui/icons-material/Search";
import {
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Input,
    Pagination,
    Paper,
} from "@mui/material";
import useAxios from "api/axios/useAxios";

import { orange } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "api/redux/authSlice";
import { SubjectCard } from "./SubjectCard";

export const SubjectList = ({ userOnly }) => {
    let [page, setPage] = useState(1);
    let [pageCount, setPageCount] = useState(1);
    let [searchQuery, setSearchQuery] = useState("");
    let [searchQueryFromClick, setSearchQueryFromClick] = useState("");
    let [subjects, setSubjects] = useState([]);
    let [isLoading, setIsLoading] = useState(true);

    let { role } = useSelector(selectUser);
    let api = useAxios();

    const handlePageChange = async (event, value) => {
        try {
            setIsLoading(true);
            let result;
            if (userOnly || role === "Teacher") {
                result = await api.get(
                    `/Subject/find-subjects-by-user?page=${value}&rpp=6&searchQuery=${searchQuery}`
                );
            } else {
                result = await api.get(
                    `/Subject/find-subjects-with-joinStatus?page=${value}&rpp=6&searchQuery=${searchQuery}`
                );
            }

            setIsLoading(false);
            setPage(value);

            setSubjects(result.data.items);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        setSearchQueryFromClick(searchQuery);
        setPage(1);
    };

    const handleQueryInput = (event) => {
        setSearchQuery(event.target.value);
    };

    const getSubjects = async () => {
        try {
            setIsLoading(true);
            let result;
            if (userOnly || role === "Teacher") {
                result = await api.get(
                    `/Subject/find-subjects-by-user?page=${page}&rpp=6&searchQuery=${searchQuery}`
                );
            } else {
                result = await api.get(
                    `/Subject/find-subjects-with-joinStatus?page=${page}&rpp=6&searchQuery=${searchQuery}`
                );
            }

            setSubjects(result.data.items);
            if (result.data.totalCount % 6 > 0) {
                setPageCount(parseInt(result.data.totalCount / 6 + 1));
            } else {
                setPageCount(parseInt(result.data.totalCount / 6));
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSubjects();
    }, [searchQueryFromClick, userOnly]);

    return (
        <Grid item xs={9} md={9} sm={10} lg={10} xl={10}>
            <Grid container spacing={4} item>
                <Grid item>
                    <form onSubmit={handleSearchClick}>
                        <Paper
                            elevation={10}
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
            </Grid>

            {isLoading == true ? (
                <Grid
                    item
                    container
                    justifyContent="center"
                    alignContent="center"
                >
                    <CircularProgress
                        sx={{
                            color: orange[500],
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                        }}
                    />
                </Grid>
            ) : (
                <div key={"subjects"}>
                    <Grid item container>
                        <Grid item container sx={{ p: 3 }} spacing={10}>
                            {subjects.map((x) => {
                                return (
                                    <Grid
                                        key={x.id}
                                        item
                                        xs={10}
                                        lg={4}
                                        md={6}
                                        sm={6}
                                    >
                                        <SubjectCard
                                            name={x.name}
                                            description={x.description}
                                            color={x.color}
                                            teachers={x.subjectTeachers}
                                            id={x.id}
                                            enrollmentStatus={
                                                x.enrollmentStatus
                                            }
                                            role={role}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Pagination
                            count={pageCount}
                            onChange={handlePageChange}
                            page={page}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Grid>
                </div>
            )}
        </Grid>
    );
};
