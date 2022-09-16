import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useAxios from "api/axios/useAxios";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { confirmAlert } from "react-confirm-alert";

export const GradingCriterion = () => {
    const { subjectId } = useParams();
    const [criteria, setCriteria] = useState([]);

    const columns = [
        {
            field: "name",
            headerName: "Ime",
            width: 100,
        },
        {
            field: "gradeA",
            headerName: "5",
            width: 100,
        },
        {
            field: "gradeB",
            headerName: "4",
            width: 100,
        },
        {
            field: "gradeC",
            headerName: "3",
            width: 100,
        },
        {
            field: "gradeD",
            headerName: "2",
            width: 100,
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
                    <Tooltip
                        sx={{ mr: 4 }}
                        title={<h2 style={{ color: "white" }}>Brisanje</h2>}
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
                );
            },
        },
    ];

    const api = useAxios();

    const getCriteria = async () => {
        try {
            let result = await api.get(
                `/SubjectGradingCriteria/get-by-subject?subjectId=${subjectId}`
            );
            setCriteria(result.data);
        } catch {}
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: `Brisanje kriterija ocjenjivanja`,
            message: `Želite li obrisati kriterij ocjenjivanja?`,
            buttons: [
                {
                    label: "Obriši",
                    onClick: async () => {
                        try {
                            api.delete(
                                `/SubjectGradingCriteria/delete?id=${id}`
                            ).then((res) => {
                                alert("Obrisali ste kriterij ocjenjivanja");
                                getCriteria();
                            });
                        } catch {}
                    },
                },
                {
                    label: "Odustani",
                },
            ],
        });
    };

    const handleSubmit = async (values) => {
        try {
            let response = await api.post("/SubjectGradingCriteria/create", {
                ...values,
            });
            await getCriteria();
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
            }
        }
    };

    useEffect(() => {
        getCriteria();
    }, []);

    return (
        <Grid item container xs spacing={2}>
            <Grid item xs={4}>
                <Formik
                    initialValues={{
                        name: "",
                        subjectId: subjectId,
                        gradeA: "",
                        gradeB: "",
                        gradeC: "",
                        gradeD: "",
                    }}
                    validationSchema={yup.object({
                        name: yup.string().required("Unesite naziv"),
                        subjectId: yup.string().required(),
                        gradeA: yup.number().required(),
                        gradeB: yup.number().required(),
                        gradeC: yup.number().required(),
                        gradeD: yup.number().required(),
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
                            <Grid item container xs={12}>
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    spacing={4}
                                    sx={{ pt: 4, pb: 4 }}
                                >
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h4"
                                            textAlign="center"
                                        >
                                            Kreiranje kriterija ocjenjivanja
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} container spacing={4}>
                                        <Grid item xs={5}>
                                            <Field
                                                name="name"
                                                label="Ime kriterija"
                                                component={TextField}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Field
                                                name="gradeA"
                                                label="Ocjena 5"
                                                type="number"
                                                component={TextField}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Field
                                                name="gradeB"
                                                label="Ocjena 4"
                                                type="number"
                                                component={TextField}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Field
                                                name="gradeC"
                                                label="Ocjena 3"
                                                type="number"
                                                component={TextField}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <Field
                                                name="gradeD"
                                                label="Ocjena 2"
                                                type="number"
                                                component={TextField}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="center">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            type="submit"
                                        >
                                            Kreiraj
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Grid>
            <Grid item xs={8} style={{ height: 400, width: "100%" }}>
                <DataGrid
                    disableColumnSelector
                    disableSelectionOnClick
                    rows={criteria}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Grid>
        </Grid>
    );
};
