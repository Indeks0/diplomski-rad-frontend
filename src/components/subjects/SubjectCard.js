import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Typography,
} from "@mui/material";
import useAxios from "api/axios/useAxios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SubjectCard = ({
    name,
    description,
    color,
    teachers,
    id,
    role,
    enrollmentStatus,
    ...props
}) => {
    const navigate = useNavigate();
    let api = useAxios();
    let [enrolledStatus, setEnrolledStatus] = useState(enrollmentStatus);

    let formattedTeachers = [];

    teachers.map((x) => {
        formattedTeachers.push(x.user.name + " " + x.user.surname);
    });

    const teachersJoined = formattedTeachers.join(", ");

    const StudentComponent = ({ status }) => {
        switch (status) {
            case "joined":
                return (
                    <Button size="medium" onClick={hadleOpenSubject}>
                        Otvori
                    </Button>
                );
            case "pending":
                return <Typography>Poslan zahtjev za pristup</Typography>;
            case "none":
                return (
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={hadleJoinRequest}
                    >
                        Zatraži Pristup predmetu
                    </Button>
                );
        }
    };

    const hadleOpenSubject = () => {
        navigate("/predmet/" + id);
    };

    const hadleJoinRequest = () => {
        try {
            api.post("/UserSubjectJoinRequest/create-request", {
                subjectId: id,
            });
            setEnrolledStatus("pending");
        } catch {}
    };

    return (
        <Card sx={{ height: 290 }}>
            <CardHeader
                sx={{ backgroundColor: color, minHeight: 15 }}
            ></CardHeader>
            <CardContent>
                <CardContent>
                    <Grid container spacing={1} maxHeight="140px">
                        <Grid item xs={12}>
                            <Typography variant="h5">{name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="text.secondary">
                                {description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {teachers.length > 1 ? (
                                <Typography>Nastavnici:</Typography>
                            ) : (
                                <Typography>Nastavnik:</Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{teachersJoined}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    {role === "Student" ? (
                        <StudentComponent status={enrolledStatus} />
                    ) : (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={hadleOpenSubject}
                        >
                            Otvori
                        </Button>
                    )}
                </CardActions>
            </CardContent>
        </Card>
    );
};
