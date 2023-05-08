import {
    Box,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { Container } from "@mui/system";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const AdminPanel = () => {
    const openSnackbar = useContext(SnackbarContext);

    const [rolesText, setRolesText] = useState("");
    const [employeesText, setEmployeesText] = useState("");
    const [storesText, setStoresText] = useState("");
    const [shiftsText, setShiftsText] = useState("");

    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingStores, setLoadingStores] = useState(false);
    const [loadingShifts, setLoadingShifts] = useState(false);

    const anyLoading =
        loadingRoles || loadingEmployees || loadingStores || loadingShifts;

    const deleteData = async (route: string) => {
        try {
            await axios
                .delete(`${BACKEND_API_URL}/users/${route}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    openSnackbar("success", data);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to bulk delete!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to bulk delete due to an unknown error!"
            );
        }
    };

    const seedData = async (route: string, count: number) => {
        try {
            await axios
                .post(
                    `${BACKEND_API_URL}/users/${route}/${count}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    openSnackbar("success", data);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to generate data!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to generate data due to an unknown error!"
            );
        }
    };

    async function executeOperation(
        type: string,
        operation: string,
        setLoading: (loading: boolean) => void,
        count: number
    ) {
        setLoading(true);
        try {
            if (operation === "insert") {
                await seedData(type, count);
            } else {
                await deleteData(type);
            }
        } finally {
            setLoading(false);
        }
    }

    function parseData(
        type: string,
        operation: string,
        setLoading: (loading: boolean) => void,
        inputValue?: string
    ) {
        const value = parseInt(inputValue ?? "1", 10);

        if (value > 0 && value <= 9999999) {
            executeOperation(type, operation, setLoading, value);
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
        }
    }

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            disabled={anyLoading}
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={`/`}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <h1
                            style={{
                                flex: 1,
                                textAlign: "center",
                                marginLeft: -64,
                                marginTop: -4,
                            }}
                        >
                            Admin Panel
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <div style={{ textAlign: "center" }}>
                            <Button
                                component={Link}
                                to={"/users"}
                                variant="contained"
                                color="primary"
                                disabled={anyLoading}
                            >
                                Users List
                            </Button>
                        </div>

                        <div
                            style={{
                                display: "flex",
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
                                {`Roles: `}
                            </p>
                            <TextField
                                disabled={anyLoading}
                                value={rolesText}
                                type="text"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                }}
                                onChange={(event) =>
                                    setRolesText(event.target.value)
                                }
                                onKeyPress={handleInputKeyPress}
                                variant="outlined"
                                size="small"
                                style={{
                                    width: 100,
                                    marginRight: 16,
                                }}
                            />
                            <Button
                                disabled={anyLoading}
                                sx={{ mr: 2 }}
                                variant="contained"
                                onClick={() =>
                                    parseData(
                                        "storeemployeeroles",
                                        "insert",
                                        setLoadingRoles,
                                        rolesText
                                    )
                                }
                            >
                                Insert
                            </Button>

                            <Button
                                disabled={anyLoading}
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    parseData(
                                        "storeemployeeroles",
                                        "delete",
                                        setLoadingRoles
                                    )
                                }
                            >
                                Bulk Delete
                            </Button>
                            {loadingRoles && (
                                <CircularProgress sx={{ ml: 4 }} />
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
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
                                {`Employees: `}
                            </p>
                            <TextField
                                disabled={anyLoading}
                                value={employeesText}
                                type="text"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                }}
                                onChange={(event) =>
                                    setEmployeesText(event.target.value)
                                }
                                onKeyPress={handleInputKeyPress}
                                variant="outlined"
                                size="small"
                                style={{
                                    width: 100,
                                    marginRight: 16,
                                }}
                            />
                            <Button
                                disabled={anyLoading}
                                sx={{ mr: 2 }}
                                variant="contained"
                                onClick={() =>
                                    parseData(
                                        "storeemployees",
                                        "insert",
                                        setLoadingEmployees,
                                        employeesText
                                    )
                                }
                            >
                                Insert
                            </Button>

                            <Button
                                disabled={anyLoading}
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    parseData(
                                        "storeemployees",
                                        "delete",
                                        setLoadingEmployees
                                    )
                                }
                            >
                                Bulk Delete
                            </Button>
                            {loadingEmployees && (
                                <CircularProgress sx={{ ml: 4 }} />
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
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
                                {`Stores: `}
                            </p>
                            <TextField
                                disabled={anyLoading}
                                value={storesText}
                                type="text"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                }}
                                onChange={(event) =>
                                    setStoresText(event.target.value)
                                }
                                onKeyPress={handleInputKeyPress}
                                variant="outlined"
                                size="small"
                                style={{
                                    width: 100,
                                    marginRight: 16,
                                }}
                            />
                            <Button
                                disabled={anyLoading}
                                sx={{ mr: 2 }}
                                variant="contained"
                                onClick={() =>
                                    parseData(
                                        "stores",
                                        "insert",
                                        setLoadingStores,
                                        storesText
                                    )
                                }
                            >
                                Insert
                            </Button>

                            <Button
                                disabled={anyLoading}
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    parseData(
                                        "stores",
                                        "delete",
                                        setLoadingStores
                                    )
                                }
                            >
                                Bulk Delete
                            </Button>
                            {loadingStores && (
                                <CircularProgress sx={{ ml: 4 }} />
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
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
                                {`Shifts: `}
                            </p>
                            <TextField
                                disabled={anyLoading}
                                value={shiftsText}
                                type="text"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: "center" },
                                }}
                                onChange={(event) =>
                                    setShiftsText(event.target.value)
                                }
                                onKeyPress={handleInputKeyPress}
                                variant="outlined"
                                size="small"
                                style={{
                                    width: 100,
                                    marginRight: 16,
                                }}
                            />
                            <Button
                                disabled={anyLoading}
                                sx={{ mr: 2 }}
                                variant="contained"
                                onClick={() =>
                                    parseData(
                                        "storeshifts",
                                        "insert",
                                        setLoadingShifts,
                                        shiftsText
                                    )
                                }
                            >
                                Insert
                            </Button>

                            <Button
                                disabled={anyLoading}
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    parseData(
                                        "storeshifts",
                                        "delete",
                                        setLoadingShifts
                                    )
                                }
                            >
                                Bulk Delete
                            </Button>
                            {loadingShifts && (
                                <CircularProgress sx={{ ml: 4 }} />
                            )}
                        </div>
                    </Box>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};
