import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import * as React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppHome } from "./components/AppHome";
import { AppMenu } from "./components/AppMenu";
import { AllEmployees } from "./components/employees/AllEmployees";
import { EmployeeDetails } from "./components/employees/EmployeeDetails";
import { EmployeeDelete } from "./components/employees/EmployeeDelete";
import { EmployeeAdd } from "./components/employees/EmployeeAdd";
import { EmployeeUpdate } from "./components/employees/EmployeeUpdate";
import { ShowStoreSalaryReport } from "./components/employees/ShowStoreSalaryReport";

function App() {
    return (
        <React.Fragment>
            <Router>
                <AppMenu />

                <Routes>
                    <Route path="/" element={<AppHome />} />
                    <Route path="/employees" element={<AllEmployees />} />
                    <Route
                        path="/salaryreport"
                        element={<ShowStoreSalaryReport />}
                    />

                    <Route
                        path="/employees/:employeeId/details"
                        element={<EmployeeDetails />}
                    />
                    <Route
                        path="/employees/:employeeId/edit"
                        element={<EmployeeUpdate />}
                    />
                    <Route
                        path="/employees/:employeeId/delete"
                        element={<EmployeeDelete />}
                    />
                    <Route path="/employees/add" element={<EmployeeAdd />} />
                </Routes>
            </Router>
        </React.Fragment>
    );
}

export default App;
