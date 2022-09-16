import { Outlet } from "react-router-dom";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";

const LoggedOutLayout = () => {
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Web aplikacija za ocjenjivanje ispita
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet />
        </div>
    );
};

export default LoggedOutLayout;
