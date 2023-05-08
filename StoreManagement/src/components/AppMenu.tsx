import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from "@mui/material";

import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SnackbarContext } from "./SnackbarContext";
import { getAccount, logOut } from "../auth";

import HomeIcon from "@mui/icons-material/Home";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";

import LogoutIcon from "@mui/icons-material/Logout";

export const AppMenu = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const location = useLocation();
    const path = location.pathname;

    const accountNameClick = (event: { preventDefault: () => void }) => {
        event.preventDefault();

        const account = getAccount();
        if (account !== null) {
            navigate(`/users/${account.id}/details`);
        } else {
            navigate("/users/login");
        }
    };

    const logOutClick = (event: { preventDefault: () => void }) => {
        event.preventDefault();

        logOut();
        navigate("/");
        openSnackbar("info", "Logged out successfully!");
    };

    return (
        <Box sx={{ flexGrow: 1, position: "sticky", top: "0", zIndex: "9" }}>
            <AppBar position="static" sx={{ marginBottom: "20px" }}>
                <Toolbar>
                    <IconButton
                        component={Link}
                        to="/"
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="school"
                        sx={{ mr: 2 }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ mr: 5 }}>
                        Store Management
                    </Typography>

                    <Button
                        variant={
                            path.startsWith("/filteremployees")
                                ? "outlined"
                                : "text"
                        }
                        to="/filteremployees"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<PersonSearchIcon />}
                    >
                        Filter
                    </Button>

                    <Button
                        variant={
                            path.startsWith("/employees") ? "outlined" : "text"
                        }
                        to="/employees"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<EmojiEmotionsIcon />}
                    >
                        Employees
                    </Button>

                    <Button
                        variant={
                            path.startsWith("/roles") ? "outlined" : "text"
                        }
                        to="/roles"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<ShieldIcon />}
                    >
                        Roles
                    </Button>

                    <Button
                        variant={
                            path.startsWith("/stores") ? "outlined" : "text"
                        }
                        to="/stores"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<LocalOfferIcon />}
                    >
                        Stores
                    </Button>

                    <Button
                        variant={
                            path.startsWith("/shifts") ? "outlined" : "text"
                        }
                        to="/shifts"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<AccessTimeFilledIcon />}
                    >
                        Shifts
                    </Button>

                    <Button
                        variant={
                            path.startsWith("/salaryreport")
                                ? "outlined"
                                : "text"
                        }
                        to="/salaryreport"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<AttachMoneyIcon />}
                    >
                        Salaries
                    </Button>

                    <Button
                        variant={
                            path.startsWith("/headcountreport")
                                ? "outlined"
                                : "text"
                        }
                        to="/headcountreport"
                        component={Link}
                        color="inherit"
                        sx={{ mr: 5 }}
                        startIcon={<GroupIcon />}
                    >
                        Headcount
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="text"
                        color="inherit"
                        sx={{ mr: 2 }}
                        onClick={accountNameClick}
                    >
                        {getAccount()?.name ?? "Log In"}
                    </Button>

                    <Button
                        variant="text"
                        to="/users/register"
                        component={Link}
                        color="inherit"
                        sx={{
                            mr: 0,
                            display: getAccount() !== null ? "none" : "inline",
                        }}
                    >
                        Register
                    </Button>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="school"
                        sx={{
                            mr: 0,
                            display: getAccount() !== null ? "inline" : "none",
                        }}
                        onClick={logOutClick}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
