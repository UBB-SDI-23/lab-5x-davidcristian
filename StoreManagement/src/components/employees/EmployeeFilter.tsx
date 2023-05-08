import {
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Button,
    Box,
    TextField,
} from "@mui/material";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL, formatDate } from "../../constants";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import { isAuthorized, getAuthToken } from "../../auth";
import { Employee, Gender } from "../../models/Employee";

import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export const EmployeeFilter = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [salaryText, setSalaryText] = useState("3000");

    const fetchEmployees = async (minSalary: number) => {
        setLoading(true);
        try {
            await axios
                .get<Employee[]>(
                    `${BACKEND_API_URL}/storeemployees/Filter?minSalary=${minSalary}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setEmployees(data);

                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch employees!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch employees due to an unknown error!"
            );
        }
    };

    function parseData() {
        const value = parseInt(salaryText, 10);

        if (value > 0 && value <= 9999999) {
            fetchEmployees(value);
        } else {
            openSnackbar(
                "error",
                "Please enter a valid number (0 < n <= 9999999)"
            );
        }
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        const key = event.key;

        // Only allow digits (0-9) and Enter
        if (
            ![
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "Enter",
            ].includes(key)
        ) {
            event.preventDefault();
        } else if (key === "Enter") {
            parseData();
        }
    }

    return (
        <Container>
            <h1
                style={{
                    paddingTop: 26,
                    marginBottom: 4,
                    textAlign: "center",
                }}
            >
                Filter Employees
            </h1>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 16,
                    marginBottom: 16,
                }}
            >
                <p
                    style={{
                        marginLeft: 16,
                        marginRight: 8,
                        userSelect: "none",
                    }}
                >
                    {`Minimum salary: `}
                </p>
                <TextField
                    value={salaryText}
                    type="text"
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                    onChange={(event) => setSalaryText(event.target.value)}
                    onKeyPress={handleInputKeyPress}
                    variant="outlined"
                    size="small"
                    style={{
                        width: 100,
                        marginRight: 16,
                    }}
                />
                <Button variant="contained" onClick={parseData}>
                    Filter
                </Button>
            </div>

            {loading && <CircularProgress />}
            {!loading && employees.length === 0 && (
                <p style={{ marginLeft: 16 }}>
                    No employees found. If you haven't clicked on the filter
                    button yet, make sure to do so.
                </p>
            )}
            {!loading && employees.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ userSelect: "none" }}>
                                    #
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    First Name
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Last Name
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Gender
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Employment Date
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Termination Date
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Salary
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Role
                                </TableCell>
                                <TableCell
                                    align="center"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Operations
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow key={employee.id}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        {employee.firstName}
                                    </TableCell>
                                    <TableCell align="left">
                                        {employee.lastName}
                                    </TableCell>
                                    <TableCell align="left">
                                        {Gender[employee.gender]}
                                    </TableCell>
                                    <TableCell align="left">
                                        {formatDate(employee.employmentDate)}
                                    </TableCell>
                                    <TableCell align="left">
                                        {formatDate(employee.terminationDate)}
                                    </TableCell>
                                    <TableCell align="left">
                                        {employee.salary}
                                    </TableCell>
                                    <TableCell align="left">
                                        {employee.storeEmployeeRole?.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box
                                            display="flex"
                                            alignItems="flex-start"
                                            justifyContent="center"
                                        >
                                            <IconButton
                                                component={Link}
                                                to={`/employees/${employee.id}/details`}
                                            >
                                                <Tooltip
                                                    title="View employee details"
                                                    arrow
                                                >
                                                    <ReadMoreIcon color="primary" />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                sx={{ ml: 1, mr: 1 }}
                                                to={`/employees/${employee.id}/edit`}
                                                disabled={
                                                    !isAuthorized(
                                                        employee.user?.id
                                                    )
                                                }
                                            >
                                                <Tooltip
                                                    title="Edit employee"
                                                    arrow
                                                >
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/employees/${employee.id}/delete`}
                                                disabled={
                                                    !isAuthorized(
                                                        employee.user?.id
                                                    )
                                                }
                                            >
                                                <Tooltip
                                                    title="Delete employee"
                                                    arrow
                                                >
                                                    <DeleteForeverIcon
                                                        sx={{
                                                            color: isAuthorized(
                                                                employee.user
                                                                    ?.id
                                                            )
                                                                ? "red"
                                                                : "gray",
                                                        }}
                                                    />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};
