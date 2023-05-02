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
    IconButton,
    Tooltip,
} from "@mui/material";

import { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../../constants";
import { StoreSalaryReport } from "../../models/StoreSalaryReport";
import { StoreCategory } from "../../models/Store";
import axios from "axios";
import { getAuthToken } from "../../auth";

export const ShowStoreSalaryReport = () => {
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        setLoading(true);

        const fetchStores = async () => {
            const response = await axios.get<[]>(
                `${BACKEND_API_URL}/stores/report/salaries`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );

            setStores(response.data);
            setLoading(false);
        };
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
                Stores ordered in descending order by the average salary of
                their employees
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
                                    Average Salary
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stores.map((store: StoreSalaryReport, index) => (
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
                                        {store.averageSalary}
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
