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
import { StoreShift } from "../../models/StoreShift";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

export const AllShifts = () => {
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState<StoreShift[]>([]);

    const pageSize = 5;
    const [pageIndex, setPageIndex] = useState(0);
    const [pageText, setPageText] = useState("1");

    function fetchStores(page: number): Promise<StoreShift[]> {
        return fetch(
            `${BACKEND_API_URL}/storeshifts/pages/${page}/${pageSize}`
        ).then((response) => response.json());
    }

    useEffect(() => {
        setLoading(true);
        setPageText((pageIndex + 1).toString());

        fetchStores(pageIndex).then((data) => {
            setShifts(data);
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
                All Shifts
            </h1>

            {loading && <CircularProgress />}
            {!loading && (
                <Button
                    component={Link}
                    to={`/shifts/add`}
                    variant="text"
                    size="large"
                    sx={{ mb: 2, textTransform: "none" }}
                    startIcon={<AddIcon />}
                >
                    Create
                </Button>
            )}
            {!loading && shifts.length === 0 && (
                <p style={{ marginLeft: 16 }}>No shifts found.</p>
            )}
            {!loading && shifts.length > 0 && (
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
                                    Employee Name
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Store Name
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Start Date
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    End Date
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
                            {shifts.map((shift, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {pageIndex * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        {shift.storeEmployee.firstName}{" "}
                                        {shift.storeEmployee.lastName}
                                    </TableCell>
                                    <TableCell align="left">
                                        {shift.store.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {formatDate(shift.startDate)}
                                    </TableCell>
                                    <TableCell align="left">
                                        {formatDate(shift.endDate)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box
                                            display="flex"
                                            alignItems="flex-start"
                                            justifyContent="center"
                                        >
                                            <IconButton
                                                component={Link}
                                                to={`/shifts/${shift.storeId}/${shift.storeEmployeeId}/details`}
                                            >
                                                <Tooltip
                                                    title="View store details"
                                                    arrow
                                                >
                                                    <ReadMoreIcon color="primary" />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                sx={{ ml: 1, mr: 1 }}
                                                to={`/shifts/${shift.storeId}/${shift.storeEmployeeId}/edit`}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/shifts/${shift.storeId}/${shift.storeEmployeeId}/delete`}
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
                        disabled={shifts.length < pageSize}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
