import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    TextField,
    Autocomplete,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { Employee } from "../../models/Employee";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { StoreShift } from "../../models/StoreShift";
import { debounce } from "lodash";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";

export const StoreShiftAdd = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const { storeId } = useParams();
    const [storeName, setStoreName] = useState("");
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [shift, setShift] = useState<StoreShift>({
        startDate: "",
        endDate: "",

        storeId: 0,
        storeEmployeeId: 0,
    });

    const addShift = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/storeshifts/`, shift)
                .then(() => {
                    openSnackbar("success", "Shift added successfully!");
                    navigate("/stores");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to add shift!\n" + reason.response?.data
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to add shift due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_API_URL}/stores/${storeId}`
                );
                const data = await response.json();
                setStoreName(data.name ?? "");
                setShift({
                    ...shift,
                    storeId: data.id,
                });

                const response2 = await fetch(
                    `${BACKEND_API_URL}/storeemployees/0/10`
                );
                const data2 = await response2.json();
                setEmployees(data2);
            } catch (error) {
                console.log(error);
            }
        };
        fetchStores();
    }, []);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Employee[]>(
                `${BACKEND_API_URL}/storeemployees/search?query=${query}`
            );
            const data = await response.data;
            const removedDupes = data.filter(
                (v, i, a) => a.findIndex((v2) => v2.name === v.name) === i
            );

            setEmployees(removedDupes);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const debouncedFetchSuggestions = useCallback(
        debounce(fetchSuggestions, 250),
        []
    );

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [debouncedFetchSuggestions]);

    const handleInputChange = (event: any, value: any, reason: any) => {
        if (value.length < 3) return;
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchSuggestions(value);
        }
    };

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start" sx={{ mb: 4 }}>
                        <IconButton
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={`/stores`}
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
                            Add Shift
                        </h1>
                    </Box>
                    <form id="addShiftForm" onSubmit={addShift}>
                        <Autocomplete
                            id="employeeName"
                            sx={{ mb: 2 }}
                            options={employees}
                            getOptionLabel={(option) =>
                                option.firstName + " " + option.lastName
                            }
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.firstName} {option.lastName}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Employee Name"
                                    variant="outlined"
                                />
                            )}
                            filterOptions={(x) => x}
                            onInputChange={handleInputChange}
                            onChange={(event, value) => {
                                if (value) {
                                    console.log(value);
                                    setShift({
                                        ...shift,
                                        storeEmployeeId: value.id ?? 0,
                                    });
                                }
                            }}
                        />

                        <TextField
                            id="storeName"
                            label="Store Name"
                            value={storeName}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={true}
                        />

                        <TextField
                            id="startDate"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setShift({
                                    ...shift,
                                    startDate: new Date(
                                        event.target.value
                                    ).toISOString(),
                                })
                            }
                        />

                        <TextField
                            id="endDate"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setShift({
                                    ...shift,
                                    endDate: new Date(
                                        event.target.value
                                    ).toISOString(),
                                })
                            }
                        />
                    </form>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        variant="contained"
                        type="submit"
                        form="addShiftForm"
                    >
                        Add Shift
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};
