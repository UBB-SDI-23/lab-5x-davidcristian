import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

export const AppMenu = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <Box sx={{ flexGrow: 1, position: "sticky", top: "0" }}>
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
                        Filter Employees
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
                        Salary Report
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
                        Headcount Report
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
