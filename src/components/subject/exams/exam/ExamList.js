import {
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    MenuItem,
    Select,
    Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useAxios from "api/axios/useAxios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";

export const ExamList = () => {
    const { subjectId } = useParams();
    const [selectedType, setSelectedType] = useState("locked");
    const [exams, setExams] = useState([]);

    const navigate = useNavigate();

    function formatOpenStartDate(params) {
        return `${moment(params.row.dateCreated).format(
            "DD. MM. YYYY., HH:mm"
        )}`;
    }

    function formatOpenEndDate(params) {
        return `${moment(params.row.dateOpenEnd).format(
            "DD. MM. YYYY., HH:mm"
        )}`;
    }

    const columns = [
        { field: "name", headerName: "Naziv", width: 100 },
        { field: "description", headerName: "Opis", width: 300 },
        {
            field: "dateOpenStart",
            headerName: "Datum otvaranja",
            valueGetter: formatOpenStartDate,
            width: 200,
        },
        {
            field: "dateOpenEnd",
            headerName: "Datum zatvaranja",
            valueGetter: formatOpenEndDate,
            width: 200,
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
                    <div key={params.row.id}>
                        {selectedType == "future" || "locked" ? (
                            <Tooltip
                                sx={{ mr: 4 }}
                                title={
                                    <h2 style={{ color: "white" }}>Brisanje</h2>
                                }
                            >
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleDelete(params.row.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                        {selectedType == "locked" ? (
                            <Tooltip
                                title={
                                    <h2 style={{ color: "white" }}>
                                        Pregled ispita
                                    </h2>
                                }
                            >
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    color="success"
                                    onClick={() => handleExamine(params.id)}
                                >
                                    <KeyboardArrowRightIcon />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    </div>
                );
            },
        },
        { hide: true },
    ];

    const api = useAxios();

    const handleTypeChange = async (event) => {
        setSelectedType(event.target.value);
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: `Brisanje ispita`,
            message: `Želite li obrisati ispit?`,
            buttons: [
                {
                    label: "Obriši",
                    onClick: async () => {
                        try {
                            api.delete(`/Exam/delete-exam?id=${id}`).then(
                                (res) => {
                                    getExams();
                                }
                            );
                            alert("Obrisali ste ispit");
                        } catch (error) {}
                    },
                },
                {
                    label: "Odustani",
                },
            ],
        });
    };

    const handleExamine = async (examId) => {
        navigate("/predmet/" + subjectId + "/ispiti/detalji-ispita/" + examId);
    };

    const getExams = async () => {
        if (selectedType == "future") {
            try {
                let result = await api.get(
                    `/Exam/get-future-exams?subjectId=${subjectId}`
                );
                setExams(result.data);
            } catch {}
        } else if (selectedType == "open") {
            try {
                let result = await api.get(
                    `/Exam/get-open-exams?subjectId=${subjectId}`
                );
                setExams(result.data);
            } catch {}
        } else if (selectedType == "locked") {
            try {
                let result = await api.get(
                    `/Exam/get-locked-exams?subjectId=${subjectId}`
                );
                setExams(result.data);
            } catch {}
        }
    };

    useEffect(() => {
        getExams();
    }, [selectedType]);

    return (
        <Grid item sx={{ pr: 4 }} xs={9} md={9} sm={10} lg={10} xl={10}>
            <Grid item xs={12}>
                <Select
                    value={selectedType}
                    sx={{ minWidth: 200 }}
                    onChange={handleTypeChange}
                >
                    <MenuItem value={"locked"}>Obavljeni ispiti</MenuItem>
                    <MenuItem value={"open"}>Otvoreni ispiti</MenuItem>
                    <MenuItem value={"future"}>Budući ispiti</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12} style={{ height: 400, width: "100%" }}>
                <DataGrid
                    disableColumnSelector
                    disableSelectionOnClick
                    rows={exams}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Grid>
        </Grid>
    );
};
