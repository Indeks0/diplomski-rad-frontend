import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { selectUser, setCredentials } from "api/redux/authSlice";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const pages = ["Predmeti"];

const LoggedInAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let { token, refreshToken, expiration, role, name, surname } =
        useSelector(selectUser);

    const logout = () => {
        handleCloseUserMenu();
        dispatch(
            setCredentials({
                email: null,
                token: null,
                refreshToken: null,
                expiration: null,
            })
        );
        navigate("/login");
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleNavButtonClicked = (event) => {
        const page = event.currentTarget.value;
        switch (page) {
            case "Predmeti":
                return navigate("/predmeti/user-only");
        }

        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        navigate("predmeti/reset-password");
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: 1400 }}>
            <Container maxWidth="1600px">
                <Toolbar disableGutters>
                    <Box
                        sx={{
                            flexGrow: 1,
                            pl: 0,
                            ml: 0,
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page}
                                value={page}
                                onClick={handleNavButtonClicked}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Typography>
                            {role == "Student" ? (
                                <Typography>{`Učenik: ${name} ${surname}`}</Typography>
                            ) : (
                                <Typography>{`Nastavnik: ${name} ${surname}`}</Typography>
                            )}
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 1 }}
                            >
                                <Avatar>{`${name[0]}${surname[0]}`}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                key={"postavke"}
                                onClick={handleCloseUserMenu}
                            >
                                <Typography textAlign="center">
                                    Postavke
                                </Typography>
                            </MenuItem>
                            <MenuItem key={"odjava"} onClick={logout}>
                                <Typography textAlign="center">
                                    Odjava
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default LoggedInAppBar;
