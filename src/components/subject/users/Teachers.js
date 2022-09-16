import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
import useAxios from "api/axios/useAxios";
import Textfield from "common/formsUI/textfield";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";

export const Teachers = () => {
    let [teachers, setTeachers] = useState([]);
    let [isDeleted, setIsDeleted] = useState(false);
    let [createErrorMsg, setCreateErrorMsg] = useState(null);
    let [isLoading, setIsLoading] = useState(null);

    let { subjectId } = useParams();

    let api = useAxios();

    const getTeachers = async () => {
        try {
            let result = await api.get(
                `/Subject/get-subject-teachers?subjectId=${subjectId}`
            );

            setTeachers(result.data.items);
        } catch (error) {}
    };

    const handleSubmit = async (values) => {
        await api.post(
            `/Subject/add-teacher?email=${values.email}&subjectId=${subjectId}`
        );
        setINITIAL_FORM_STATE({
            email: "",
        });
        setIsDeleted(!isDeleted);
    };
    const handleDelete = async (id) => {
        try {
            let result = await api.delete(`/Subject/delete-teacher`, {
                data: { id: id },
            });
            setIsDeleted(!isDeleted);
        } catch (error) {}
    };

    const validationSchema = yup.object({
        email: yup
            .string()
            .email("Unesite email")
            .required("Niste unijeli email"),
    });

    const [INITIAL_FORM_STATE, setINITIAL_FORM_STATE] = useState({
        email: "",
    });

    const columns = [
        {
            field: "name",
            headerName: "Ime",
            valueGetter: (params) =>
                `${params.row.user.name} ${params.row.user.surname}`,
            width: 200,
        },
        {
            field: "email",
            headerName: "Email",
            valueGetter: (params) => `${params.row.user.email}`,
            width: 300,
        },
        {
            field: "actions",
            headerName: "Akcije",
            width: 60,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => {
                return (
                    <div key={params.row.id}>
                        {params.row.isSubjectAdmin === false ? (
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
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getTeachers();
    }, [isDeleted]);

    return (
        <Grid item xs={9} md={8} sm={9} xl={6} container spacing={2}>
            <Grid item xs={12} style={{ height: 400, width: "100%" }}>
                <DataGrid
                    disableColumnSelector
                    disableSelectionOnClick
                    rows={teachers}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                />
            </Grid>
            <Formik
                enableReinitialize
                initialValues={INITIAL_FORM_STATE}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <Grid
                            sx={{ pb: 3 }}
                            container
                            spacing={3}
                            justifyContent="center"
                        >
                            <Grid item xs={12}>
                                <Typography variant="h4" textAlign="center">
                                    Dodavanje nastavnika
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Textfield name="email" label="Email" />
                            </Grid>
                            {createErrorMsg != null ? (
                                <Grid item xs={8}>
                                    <Alert severity="error">
                                        {createErrorMsg}
                                    </Alert>
                                </Grid>
                            ) : null}
                            <Grid item xs={8}>
                                <Box sx={{ m: 1, position: "relative" }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        disabled={isLoading}
                                    >
                                        Dodaj nastavnika
                                    </Button>
                                    {isLoading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: orange[500],
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                marginTop: "-12px",
                                                marginLeft: "-12px",
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Grid>
    );
};
