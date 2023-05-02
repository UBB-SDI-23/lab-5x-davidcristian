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
import { getAccount, getAuthToken } from "../../auth";
import axios from "axios";

export const AllEmployees = () => {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(999999);

    const [sorting, setSorting] = useState({
        key: "column name",
        ascending: true,
    });

    function applySorting(key: string, ascending: boolean) {
        if (key !== sorting.key) {
            ascending = true;
        }

        setSorting({ key: key, ascending: ascending });
    }

    useEffect(() => {
        const account = getAccount();

        if (account && account.userProfile) {
            setPageSize(account.userProfile.pagePreference ?? 5);
        }
    }, []);

    useEffect(() => {
        if (employees.length === 0) {
            return;
        }

        const currentEmployees = [...employees];
        const sortedCurrentUsers = currentEmployees.sort((a, b) => {
            // Check if the values are numbers
            const aVal = a[sorting.key];
            const bVal = b[sorting.key];
            const isNumeric = !isNaN(aVal) && !isNaN(bVal);

            // If both values are numbers, use subtraction for comparison
            if (isNumeric) {
                return parseFloat(aVal) - parseFloat(bVal);
            } else {
                return aVal.localeCompare(bVal);
            }
        });

        setEmployees(
            sorting.ascending
                ? sortedCurrentUsers
                : sortedCurrentUsers.reverse()
        );
    }, [sorting]);

    useEffect(() => {
        // TODO: improve this func in all
        const fetchPageCount = async () => {
            const response = await axios.get<number>(
                `${BACKEND_API_URL}/storeemployees/count/${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const count = response.data;
            setTotalPages(count);
        };
        fetchPageCount();
    }, [pageSize]);

    async function fetchEmployees(page: number): Promise<Employee[]> {
        const response = await axios.get<Employee[]>(
            `${BACKEND_API_URL}/storeemployees/${page}/${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );

        return response.data;
    }

    function handlePageClick(pageNumber: number) {
        setPageIndex(pageNumber - 1);
    }

    useEffect(() => {
        setLoading(true);

        fetchEmployees(pageIndex).then((data) => {
            setEmployees(data);
            setLoading(false);
        });
    }, [pageIndex, pageSize]);

    const displayedPages = 9;

    let startPage = pageIndex - Math.floor((displayedPages - 3) / 2) + 1;
    let endPage = startPage + displayedPages - 3;

    if (startPage <= 2) {
        startPage = 1;
        endPage = displayedPages - 1;
    } else if (endPage >= totalPages - 1) {
        startPage = totalPages - displayedPages + 2;
        endPage = totalPages;
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
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    # of Shifts
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    User
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
                                    <TableCell align="left">
                                        {employee.storeShifts?.length}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Link
                                            to={`/users/${employee.user?.id}/details`}
                                            title="View user details"
                                        >
                                            {employee.user?.name}
                                        </Link>
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
                        onClick={() =>
                            setPageIndex((prevPageIndex) =>
                                Math.max(prevPageIndex - 1, 0)
                            )
                        }
                        disabled={pageIndex === 0}
                    >
                        &lt;
                    </Button>
                    {startPage > 1 && (
                        <>
                            <Button
                                variant={
                                    pageIndex === 0 ? "contained" : "outlined"
                                }
                                onClick={() => handlePageClick(1)}
                                style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                }}
                            >
                                1
                            </Button>
                            <span>...</span>
                        </>
                    )}
                    {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => i + startPage
                    ).map((number) => (
                        <Button
                            key={number}
                            variant={
                                pageIndex === number - 1
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() => handlePageClick(number)}
                            style={{
                                marginLeft: 8,
                                marginRight: 8,
                            }}
                        >
                            {number}
                        </Button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            <span>...</span>
                            <Button
                                variant={
                                    pageIndex === totalPages - 1
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handlePageClick(totalPages)}
                                style={{
                                    marginLeft: 8,
                                    marginRight: 8,
                                }}
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                    <Button
                        variant="contained"
                        onClick={() =>
                            setPageIndex((prevPageIndex) => prevPageIndex + 1)
                        }
                        disabled={pageIndex + 1 >= totalPages}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
