import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Employee, Gender } from "../../models/Employee";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

export const AllEmployees = () => {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const pageSize = 5;
    const [pageIndex, setPageIndex] = useState(0);
    const [pageText, setPageText] = useState("1");

    const [sorting, setSorting] = useState({
        key: "column name",
        ascending: false,
    });

    function applySorting(key: string, ascending: boolean) {
        setSorting({ key: key, ascending: ascending });
    }

    useEffect(() => {
        if (employees.length === 0) {
            return;
        }

        const currentEmployees = [...employees];
        const sortedCurrentUsers = currentEmployees.sort((a, b) => {
            return a[sorting.key].localeCompare(b[sorting.key]);
        });

        setEmployees(
            sorting.ascending
                ? sortedCurrentUsers
                : sortedCurrentUsers.reverse()
        );
    }, [sorting]);

    function fetchEmployees(page: number): Promise<Employee[]> {
        return fetch(
            `${BACKEND_API_URL}/storeemployees/${page}/${pageSize}`
        ).then((response) => response.json());
    }

    useEffect(() => {
        setLoading(true);
        setPageText((pageIndex + 1).toString());

        fetchEmployees(pageIndex).then((data) => {
            setEmployees(data);
            setLoading(false);
        });
    }, [pageIndex, pageSize]);

    function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => prevPageIndex - 1);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.replace(/[^\d]/g, "");
        setPageText(value);
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            const intValue = parseInt(pageText, 10);

            if (intValue > 0 && intValue <= 9999999) {
                setPageIndex(intValue - 1);
            }
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
                All Employees
            </h1>

            {loading && <CircularProgress />}
            {!loading && (
                <Button
                    component={Link}
                    to={`/employees/add`}
                    variant="text"
                    size="large"
                    sx={{ mb: 2, textTransform: "none" }}
                    startIcon={<AddIcon />}
                >
                    Create
                </Button>
            )}
            {!loading && employees.length === 0 && (
                <p style={{ marginLeft: 16 }}>No employees found.</p>
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
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                    onClick={() =>
                                        applySorting(
                                            "firstName",
                                            !sorting.ascending
                                        )
                                    }
                                >
                                    First Name
                                    {sorting.key === "firstName" &&
                                        (sorting.ascending ? " ↑" : " ↓")}
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                    onClick={() =>
                                        applySorting(
                                            "lastName",
                                            !sorting.ascending
                                        )
                                    }
                                >
                                    Last Name
                                    {sorting.key === "lastName" &&
                                        (sorting.ascending ? " ↑" : " ↓")}
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
                                        {pageIndex * pageSize + index + 1}
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
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/employees/${employee.id}/delete`}
                                            >
                                                <DeleteForeverIcon
                                                    sx={{ color: "red" }}
                                                />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {!loading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 16,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handlePrevPage}
                        disabled={pageIndex === 0}
                    >
                        &lt;
                    </Button>
                    <p
                        style={{
                            marginLeft: 16,
                            marginRight: 8,
                            userSelect: "none",
                        }}
                    >
                        {`Page `}
                    </p>
                    <TextField
                        value={pageText}
                        type="text"
                        inputProps={{ min: 1, style: { textAlign: "center" } }}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
                        variant="outlined"
                        size="small"
                        style={{
                            width: 100,
                            marginRight: 16,
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleNextPage}
                        disabled={employees.length < pageSize}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
