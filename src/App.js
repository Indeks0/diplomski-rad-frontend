import RequireAuth from "common/requireAuth/RequireAuth";
import LoggedInLayout from "common/appLayouts/LoggedInLayout";
import LoggedOutLayout from "common/appLayouts/LoggedOutLayout";
import { ConfirmAccount } from "components/auth/ConfirmAccount";
import Login from "components/auth/Login";
import Register from "components/auth/Register";
import { ResetPassword } from "components/auth/ResetPassword";
import { Exam } from "components/exam/Exam";
import { ExamManualGrading } from "components/exam/ExamManulGrading";
import { ExamCreate } from "components/subject/exams/exam/ExamCreate";
import { ExamLayout } from "components/subject/exams/exam/ExamLayout";
import { ExamList } from "components/subject/exams/exam/ExamList";
import { ExamSolvedList } from "components/subject/exams/exam/ExamSolvedList";
import { StudentGrades } from "components/subject/exams/grades/StudentGrades";
import { GradingCriterion } from "components/subject/exams/gradingCriterion/GradingCriterion";
import { QuestionCreate } from "components/subject/exams/question/QuestionCreate";
import { QuestionList } from "components/subject/exams/question/QuestionList";
import { BasicInformation } from "components/subject/settings/BasicInformation";
import { SettingsLayout } from "components/subject/settings/SettingsLayout";
import { SubjectDetails } from "components/subject/SubjectDetails";
import { JoinRequests } from "components/subject/users/JoinRequests";
import { Students } from "components/subject/users/Students";
import { Teachers } from "components/subject/users/Teachers";
import { UsersLayout } from "components/subject/users/UsersLayout";
import { MenuItems } from "components/subjects/MenuItems";
import { SubjectCreate } from "components/subjects/SubjectCreate";
import { SubjectList } from "components/subjects/SubjectList";
import { Route, Routes } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { ResetPasswordLoggedIn } from "components/subjects/ResetPasswordLoggedIn";

function App() {
    const _ = require("lodash");
    return (
        <Box height="100vh" sx={{ bgcolor: "primary.background" }}>
            <Routes>
                <Route path="/" element={<LoggedOutLayout />}>
                    <Route index element={<Login />} />
                    <Route path="login" element={<Login />}>
                        <Route
                            path="confirm-email/:token/:email"
                            exact
                            element={<ConfirmAccount />}
                        />
                    </Route>
                    <Route path="register" element={<Register />} />

                    <Route
                        path="reset-password"
                        exact
                        element={<ResetPassword />}
                    />
                </Route>

                <Route path="/" element={<LoggedInLayout />}>
                    <Route element={<RequireAuth />}>
                        <Route path="predmeti" element={<MenuItems />}>
                            <Route
                                path="all"
                                index
                                element={<SubjectList userOnly={false} />}
                            />
                            <Route
                                path="user-only"
                                index
                                element={<SubjectList userOnly={true} />}
                            />
                            <Route
                                path="kreiranje"
                                element={<SubjectCreate />}
                            />
                            <Route
                                path="reset-password"
                                element={<ResetPasswordLoggedIn />}
                            />
                        </Route>
                    </Route>
                    <Route
                        path="predmet/:subjectId"
                        exact
                        element={<SubjectDetails />}
                    />
                    <Route
                        path="predmet/:subjectId/ispiti"
                        exact
                        element={<ExamLayout />}
                    >
                        <Route index path="pregled" element={<ExamList />} />
                        <Route
                            path="detalji-ispita/:examId"
                            element={<ExamSolvedList />}
                        />
                        <Route
                            path="exam-manual-grading/:examId/:solvedExamId"
                            element={<ExamManualGrading />}
                        />
                        <Route path="kreiranje" element={<ExamCreate />} />
                        <Route
                            path="pitanja-pregled"
                            element={<QuestionList />}
                        />
                        <Route
                            path="pitanja-kreiranje"
                            element={<QuestionCreate />}
                        />
                        <Route
                            path="kriterij-ocjenjivanja"
                            element={<GradingCriterion />}
                        />
                        <Route path="ocjene" element={<StudentGrades />} />
                    </Route>
                    <Route
                        path="predmet/:subjectId/korisnici"
                        exact
                        element={<UsersLayout />}
                    >
                        <Route
                            index
                            path="zahtjevi"
                            element={<JoinRequests />}
                        />
                        <Route path="ucenici" element={<Students />} />
                        <Route path="nastavnici" element={<Teachers />} />
                    </Route>
                    <Route
                        path="predmet/:subjectId/postavke"
                        exact
                        element={<SettingsLayout />}
                    >
                        <Route index path="*" element={<BasicInformation />} />
                    </Route>
                </Route>

                <Route path="/exam/:examId/:studentId" element={<Exam />} />
            </Routes>
        </Box>
    );
}

export default App;
