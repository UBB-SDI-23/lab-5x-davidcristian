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

export const AllStores = () => {
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);

    const pageSize = 5;
    const [pageIndex, setPageIndex] = useState(0);
    const [pageText, setPageText] = useState("1");

    function fetchStores(page: number): Promise<Store[]> {
        return fetch(`${BACKEND_API_URL}/stores/${page}/${pageSize}`).then(
            (response) => response.json()
        );
    }

    useEffect(() => {
        setLoading(true);
        setPageText((pageIndex + 1).toString());

        fetchStores(pageIndex).then((data) => {
            setStores(data);
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
                        disabled={stores.length < pageSize}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
