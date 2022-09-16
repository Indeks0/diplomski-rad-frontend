import {
    Box,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import useAxios from "api/axios/useAxios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { selectUser } from "api/redux/authSlice";

export const StudentGrades = () => {
    const [solvedExams, setSolvedExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [averageGrade, setAverageGrade] = useState(0);
    const { subjectId } = useParams();
    const api = useAxios();

    let { role } = useSelector(selectUser);

    function roundToTwoDecimal(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    const getStudents = async () => {
        try {
            let result = await api.get(
                `/SubjectStudent?subjectId=${subjectId}&page=1&rpp=1000`
            );

            if (result.data.totalCount > 0) {
                setStudents(result.data.items);
                setSelectedStudent(result.data.items[0]);
            }
        } catch {}
    };

    const getExams = async () => {
        try {
            let result = await api.get(
                `/SolvedExam/get-student-solved-exams?studentId=${selectedStudent.id}&subjectId=${subjectId}`
            );

            let tempAverageGrade = 0;

            result.data.items.map((x) => {
                tempAverageGrade += x.grade;
            });

            if (tempAverageGrade != 0)
                tempAverageGrade = tempAverageGrade / result.data.items.length;

            setAverageGrade(roundToTwoDecimal(tempAverageGrade));
            setSolvedExams(result.data.items);
        } catch {}
    };

    const handleChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent != null) getExams();
    }, [selectedStudent]);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        ticks: {
            // forces step size to be 50 units
            stepSize: 1,
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Ocjene iz svih ispita",
            },
        },
    };

    const barChartdata = {
        labels: solvedExams.map((x) => x.examStudent.exam.name),
        datasets: [
            {
                label: "Ocjena",
                barThickness: 10,
                data: solvedExams.map((x) => x.grade),
                backgroundColor: solvedExams.map((x) => {
                    if (x.grade === 5) {
                        return "rgba(27, 235, 37, 1)";
                    } else if (x.grade === 4) {
                        return "rgba(205, 240, 58, 1)";
                    } else if (x.grade === 3) {
                        return "rgba(255, 229, 0,1)";
                    } else if (x.grade === 2) {
                        return "rgba(255, 150, 0, 1)";
                    } else {
                        return "rgba(255, 57,36 , 1)";
                    }
                }),
            },
        ],
    };

    return (
        <Grid item container xs spacing={2}>
            {role == "Teacher" ? (
                <Grid spacing={4} item xs={4}>
                    <Typography>Učenik</Typography>
                    <Select
                        onChange={handleChange}
                        label="Učenik"
                        value={selectedStudent}
                    >
                        {students.map((x) => {
                            return (
                                <MenuItem
                                    value={x}
                                >{`${x.user.name} ${x.user.surname}`}</MenuItem>
                            );
                        })}
                    </Select>
                </Grid>
            ) : null}
            <Grid
                item
                xs={3}
                container
                justifyContent="center"
                alignContent="center"
            >
                <Typography variant="h4">{`Prosječna ocjena: ${averageGrade}`}</Typography>
            </Grid>
            <Grid item xs={12}>
                <div style={{ minHeight: 300 }}>
                    <Bar options={options} data={barChartdata} />
                </div>
            </Grid>
        </Grid>
    );
};
