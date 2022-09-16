import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useAxios from "api/axios/useAxios";
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip as ChartTooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";

export const ExamSolvedList = () => {
    const { subjectId, examId } = useParams();
    const [gradingSystem, setGradingSystem] = useState([]);
    const [solvedExams, setSolvedExams] = useState([]);
    const [chartGradesData, setChartGradesData] = useState([0, 0, 0, 0, 0]);
    const [averageGrade, setAverageGrade] = useState(0);

    ChartJS.register(ArcElement, ChartTooltip, Legend);

    const navigate = useNavigate();

    const handlePregledIspita = (solvedExamId) => {
        navigate(
            "/predmet/" +
                subjectId +
                "/ispiti/exam-manual-grading/" +
                examId +
                "/" +
                solvedExamId
        );
    };

    function roundToTwoDecimal(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    const columns = [
        {
            field: "name",
            headerName: "Ime",
            width: 100,
            valueGetter: (params) => params.row?.student?.user?.name,
        },
        {
            field: "surname",
            headerName: "Prezime",
            width: 100,
            valueGetter: (params) => params.row?.student?.user?.surname,
        },
        {
            field: "grade",
            headerName: "Ocjena",
            valueGetter: (params) => `${params.row?.solvedExam?.grade}`,
            width: 100,
        },
        {
            field: "points",
            headerName: "Bodovi",
            valueGetter: (params) =>
                `${params.row?.solvedExam?.scoredPoints}/${params.row?.solvedExam?.maximumPoints}`,
            width: 100,
        },
        {
            field: "percentage",
            headerName: "Postotak",
            valueGetter: (params) =>
                `${params.row?.solvedExam?.scoredPercentage}%`,
            width: 100,
        },
        {
            field: "isLocked",
            headerName: "Status ispita",
            width: 120,
            valueGetter: (params) =>
                `${
                    params.row?.solvedExam?.isLocked === true
                        ? "Zaključan"
                        : "Otključan"
                }`,
        },
        {
            field: "actions",
            headerName: "Akcije",
            width: 200,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => {
                return (
                    <div key={params.row?.solvedExam?.id}>
                        {params.row?.solvedExam?.isLocked == false ? (
                            <Tooltip
                                sx={{ mr: 4 }}
                                title={
                                    <h2 style={{ color: "white" }}>
                                        Ispravljanje ispita
                                    </h2>
                                }
                            >
                                <IconButton
                                    edge="end"
                                    aria-label="pregled"
                                    color="success"
                                    onClick={() =>
                                        handlePregledIspita(
                                            params.row?.solvedExam?.id
                                        )
                                    }
                                >
                                    <ModeEditIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip
                                sx={{ mr: 4 }}
                                title={
                                    <h2 style={{ color: "white" }}>
                                        Pregled ispita
                                    </h2>
                                }
                            >
                                <IconButton
                                    edge="end"
                                    aria-label="pregled"
                                    color="success"
                                    onClick={() =>
                                        handlePregledIspita(
                                            params.row?.solvedExam?.id
                                        )
                                    }
                                >
                                    <ModeEditIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        { hide: true },
    ];

    const api = useAxios();

    const pieChartData = {
        labels: ["Ocjena 5", "Ocjena 4", "Ocjena 3", "Ocjena 2", "Ocjena 1"],
        datasets: [
            {
                label: "Broj ocjena",
                data: chartGradesData,
                backgroundColor: [
                    "rgba(27, 235, 37, 1)",
                    "rgba(205, 240, 58, 1)",
                    "rgba(255, 229, 0,1)",
                    "rgba(255, 150, 0, 1)",
                    "rgba(255, 57,36 , 1)",
                ],
                borderColor: [
                    "rgba(1,14, 175, 1)",
                    "rgba(1,14, 175, 1)",
                    "rgba(1,14, 175, 1)",
                    "rgba(1,14, 175, 1)",
                    "rgba(1,14, 175, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const getSolvedExams = async () => {
        try {
            let result = await api.get(
                `/Exam/get-solved-exams?examId=${examId}`
            );

            const tempChartGradesData = [0, 0, 0, 0, 0];
            let tempAverageGrade = 0;

            result.data.items.students.map((x) => {
                tempAverageGrade += x.solvedExam.grade;

                if (x.solvedExam.grade == 5) {
                    tempChartGradesData[0]++;
                } else if (x.solvedExam.grade == 4) {
                    tempChartGradesData[1]++;
                } else if (x.solvedExam.grade == 3) {
                    tempChartGradesData[2]++;
                } else if (x.solvedExam.grade == 2) {
                    tempChartGradesData[3]++;
                } else if (x.solvedExam.grade == 1) {
                    tempChartGradesData[4]++;
                }
            });

            tempAverageGrade =
                tempAverageGrade / result.data.items.students.length;

            setAverageGrade(roundToTwoDecimal(tempAverageGrade));
            setChartGradesData(tempChartGradesData);
            setSolvedExams(result.data.items.students);
        } catch {}
    };
    const handleZakljucavanjeIspita = async () => {
        try {
            let result = await api.post(
                `/Exam/lock-solved-exams?examId=${examId}`
            );

            getSolvedExams();
        } catch {}
    };

    useEffect(() => {
        getSolvedExams();
    }, []);

    return (
        <Grid item container xs spacing={2}>
            <Grid item xs={12}>
                <Button onClick={handleZakljucavanjeIspita} variant="contained">
                    Zaključaj sve ispite
                </Button>
            </Grid>
            <Grid item xs={12} style={{ height: 400, width: "100%" }}>
                <DataGrid
                    disableColumnSelector
                    disableSelectionOnClick
                    rows={solvedExams}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Grid>
            <Grid
                item
                xs={6}
                style={{ height: 400, width: "100%" }}
                container
                justifyContent="center"
                alignContent="center"
            >
                <Typography variant="h4">{`Prosječna ocjena: ${averageGrade}`}</Typography>
            </Grid>
            <Grid
                item
                xs={5}
                style={{ height: 400, width: "100%" }}
                container
                justifyContent="center"
            >
                <div
                    style={{
                        height: 350,
                        width: 350,
                    }}
                >
                    <Pie data={pieChartData} />
                </div>
            </Grid>
        </Grid>
    );
};
