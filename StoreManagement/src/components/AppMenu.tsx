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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export const AppMenu = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            variant={path.startsWith("/employees") ? "outlined" : "text"}
            to="/employees"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<AccountCircleIcon />}
          >
            Employees
          </Button>

          <Button
            variant={path.startsWith("/salaryreport") ? "outlined" : "text"}
            to="/salaryreport"
            component={Link}
            color="inherit"
            sx={{ mr: 5 }}
            startIcon={<AttachMoneyIcon />}
          >
            Salary Report
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
