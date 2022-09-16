import { Outlet } from "react-router-dom";
import { Toolbar } from "@mui/material";
import LoggedInAppBar from "./LoggedInAppBar";

const LoggedInLayout = () => {
    return (
        <div>
            <LoggedInAppBar />
            <Toolbar />
            <Outlet />
        </div>
    );
};

export default LoggedInLayout;
