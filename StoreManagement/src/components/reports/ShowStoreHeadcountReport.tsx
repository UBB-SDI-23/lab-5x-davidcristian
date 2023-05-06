import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Container,
} from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { BACKEND_API_URL } from "../../constants";
import axios from "axios";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

import { StoreHeadcountReport } from "../../models/StoreHeadcountReport";
import { StoreCategory } from "../../models/Store";

export const ShowStoreHeadcountReport = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);

    const fetchStores = async () => {
        setLoading(true);

        try {
            await axios
                .get<[]>(`${BACKEND_API_URL}/stores/report/headcount`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then((response) => {
                    const stores = response.data;
                    setStores(stores);
                    setLoading(false);
                })
                .catch((reason) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch stores!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch stores due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <Container>
            <h1
                style={{
                    paddingTop: 26,
                    marginBottom: 32,
                    textAlign: "center",
                }}
            >
                Stores ordered in descending order by the number of employees
            </h1>
            {loading && <CircularProgress />}
            {!loading && stores.length == 0 && <div>No stores found!</div>}
            {!loading && stores.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 900 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ userSelect: "none" }}>
                                    #
                                </TableCell>
                                <TableCell
                                    style={{ userSelect: "none" }}
                                    align="left"
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    style={{ userSelect: "none" }}
                                    align="left"
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    style={{ userSelect: "none" }}
                                    align="left"
                                >
                                    Category
                                </TableCell>
                                <TableCell
                                    style={{ userSelect: "none" }}
                                    align="left"
                                >
                                    Headcount
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stores.map(
                                (store: StoreHeadcountReport, index) => (
                                    <TableRow key={store.id}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">
                                            {store.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {store.description}
                                        </TableCell>
                                        <TableCell align="left">
                                            {StoreCategory[store.category]}
                                        </TableCell>
                                        <TableCell align="left">
                                            {store.headcount}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};
