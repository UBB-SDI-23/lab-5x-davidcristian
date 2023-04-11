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
    const [hasNextPage, setHasNextPage] = useState(true);

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

        // TODO: fix redundant request
        fetchEmployees(pageIndex)
            .then((data) => {
                setEmployees(data);
            })
            .then(() => {
                fetchEmployees(pageIndex + 1).then((data) => {
                    setHasNextPage(data.length > 0);
                    setLoading(false);
                });
            });
    }, [pageIndex, pageSize]);

    function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => prevPageIndex - 1);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        // TODO: this function
        const value = event.target.value;
        const intValue = parseInt(value, 10);

        if (intValue > 0) {
            setPageIndex(intValue - 1);
        }
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        // TODO: this function
        if (event.key === "Enter") {
            setPageIndex(0);
        }
    }

    return (
        <Container>
            <h1>All employees</h1>

            {loading && <CircularProgress />}
            {!loading && employees.length === 0 && <p>No employees found</p>}
            {!loading && (
                <Box display="flex">
                    <IconButton
                        component={Link}
                        sx={{ mb: 3 }}
                        to={`/employees/add`}
                    >
                        <Tooltip title="Add a new employee" arrow>
                            <AddIcon color="primary" />
                        </Tooltip>
                    </IconButton>
                    <p
                        style={{
                            margin: 0,
                            marginTop: 8,
                            padding: 0,
                            fontWeight: "bold",
                            color: "#1976d2",
                        }}
                    >
                        {`Create`}
                    </p>
                </Box>
            )}
            {!loading && employees.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
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
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Gender
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Employment Date
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Termination Date
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Salary
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Role
                                </TableCell>
                                <TableCell
                                    align="center"
                                    style={{ whiteSpace: "nowrap" }}
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
                        }}
                    >
                        {`Page `}
                    </p>
                    <TextField
                        value={pageIndex + 1}
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
                        disabled={!hasNextPage}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
