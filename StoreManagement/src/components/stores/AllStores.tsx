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
import { Store, StoreCategory } from "../../models/Store";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import axios from "axios";
import { getAccount, getAuthToken } from "../../auth";

export const AllStores = () => {
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);

    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(999999);

    useEffect(() => {
        const account = getAccount();

        if (account && account.userProfile) {
            setPageSize(account.userProfile.pagePreference ?? 5);
        }
    }, []);

    async function fetchStores(page: number): Promise<Store[]> {
        const response = await axios.get<Store[]>(
            `${BACKEND_API_URL}/stores/${page}/${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );

        return response.data;
    }

    useEffect(() => {
        setLoading(true);

        fetchStores(pageIndex).then((data) => {
            setStores(data);
            setLoading(false);
        });
    }, [pageIndex, pageSize]);

    useEffect(() => {
        const fetchPageCount = async () => {
            const response = await axios.get<number>(
                `${BACKEND_API_URL}/stores/count/${pageSize}`,
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

    useEffect(() => {
        setLoading(true);

        fetchStores(pageIndex).then((data) => {
            setStores(data);
            setLoading(false);
        });
    }, [pageIndex, pageSize]);

    function handlePageClick(pageNumber: number) {
        setPageIndex(pageNumber - 1);
    }

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
                All Stores
            </h1>

            {loading && <CircularProgress />}
            {!loading && (
                <Button
                    component={Link}
                    to={`/stores/add`}
                    variant="text"
                    size="large"
                    sx={{ mb: 2, textTransform: "none" }}
                    startIcon={<AddIcon />}
                >
                    Create
                </Button>
            )}
            {!loading && stores.length === 0 && (
                <p style={{ marginLeft: 16 }}>No stores found.</p>
            )}
            {!loading && stores.length > 0 && (
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
                                    Name
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        userSelect: "none",
                                    }}
                                >
                                    Category
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
                            {stores.map((store, index) => (
                                <TableRow key={store.id}>
                                    <TableCell component="th" scope="row">
                                        {pageIndex * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        {store.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {store.description}
                                    </TableCell>
                                    <TableCell align="left">
                                        {[StoreCategory[store.category]]}
                                    </TableCell>
                                    <TableCell align="left">
                                        {store.storeShifts?.length}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Link
                                            to={`/users/${store.user?.id}/details`}
                                            title="View user details"
                                        >
                                            {store.user?.name}
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
                                                to={`/stores/${store.id}/details`}
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
                                                to={`/stores/${store.id}/edit`}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                component={Link}
                                                to={`/stores/${store.id}/delete`}
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
