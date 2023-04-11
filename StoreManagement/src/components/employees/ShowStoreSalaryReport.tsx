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

export const ShowStoreSalaryReport = () => {
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_API_URL}/stores/report/salaries/`)
            .then((response) => response.json())
            .then((data) => {
                setStores(data);
                setLoading(false);
            });
    }, []);

    return (
        <Container>
            <h1>
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
                                <TableCell>#</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Description</TableCell>
                                <TableCell align="left">Category</TableCell>
                                <TableCell align="left">
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
