import {
    Button,
    Divider,
    Grid,
    IconButton,
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
import CheckIcon from "@mui/icons-material/Check";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export const JoinRequests = () => {
    let [page, setPage] = useState(1);
    let [pageCount, setPageCount] = useState(1);
    let [zahtjevi, setZahtjevi] = useState([]);
    let [zahtjeviChanged, setZahtjeviChanged] = useState(false);

    let { subjectId } = useParams();

    let api = useAxios();

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleAccept = async (id, userId) => {
        try {
            let result = await api.post(
                `/UserSubjectJoinRequest/accept-request`,
                {
                    id,
                    userId,
                    subjectId,
                }
            );
            setZahtjeviChanged(!zahtjeviChanged);
        } catch (error) {}
    };

    const handleDecline = async (id) => {
        try {
            let result = await api.delete(
                `/UserSubjectJoinRequest/decline-request`,
                { data: { id: id } }
            );
            setZahtjeviChanged(!zahtjeviChanged);
        } catch (error) {}
    };

    const getZahtjevi = async () => {
        try {
            let result = await api.get(
                `/UserSubjectJoinRequest/get-requests?subjectId=${subjectId}&page=${page}&rpp=10`
            );

            setZahtjevi(result.data.items);

            if (result.data.totalCount % 10 > 0) {
                setPageCount(parseInt(result.data.totalCount / 6 + 1));
            } else {
                setPageCount(parseInt(result.data.totalCount / 6));
            }
        } catch (error) {}
    };

    useEffect(() => {
        getZahtjevi();
    }, [page, zahtjeviChanged]);

    return (
        <Grid item xs={9} md={6} sm={8} xl={4}>
            <Paper
                sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                }}
            >
                <Grid item container sx={{ p: 3 }} spacing={10}>
                    <Grid item xs={12}>
                        <Typography textAlign="center" variant="h4">
                            Aktivni zahtjevi
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <List>
                            {zahtjevi.map((x) => {
                                return (
                                    <div key={x.id}>
                                        <ListItem>
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
                                                    color="success"
                                                    onClick={() =>
                                                        handleAccept(
                                                            x.id,
                                                            x.userId
                                                        )
                                                    }
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDecline(x.id)
                                                    }
                                                >
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </div>
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
