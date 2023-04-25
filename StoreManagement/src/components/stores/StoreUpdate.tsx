import {
    Box,
    Button,
    Card,
    CircularProgress,
    CardActions,
    CardContent,
    Container,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import { useCallback, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Store, StoreCategory } from "../../models/Store";
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { debounce } from "lodash";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";

export const StoreUpdate = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const { storeId } = useParams<{ storeId: string }>();

    const [loading, setLoading] = useState(false);
    const [store, setStore] = useState<Store>({
        name: "",
        description: "",

        category: 0,
        address: "",

        city: "",
        state: "",

        zipCode: "",
        country: "",

        openDate: "",
        closeDate: "",
    });

    useEffect(() => {
        const fetchStore = async () => {
            const response = await fetch(
                `${BACKEND_API_URL}/stores/${storeId}/`
            );

            const store = await response.json();
            setStore({
                id: store.id,
                name: store.name,
                description: store.description,

                category: store.category,
                address: store.address,

                city: store.city,
                state: store.state,

                zipCode: store.zipCode,
                country: store.country,

                openDate: store.openDate,
                closeDate: store.closeDate,
            });

            setLoading(false);
        };
        fetchStore();
    }, [storeId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/stores/${storeId}/`, store)
                .then(() => {
                    openSnackbar("success", "Store updated successfully!");
                    navigate("/stores");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update store!\n" + reason.response?.data
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update store due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/stores");
    };

    return (
        <Container>
            {loading && <CircularProgress />}
            {!loading && (
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        <Box
                            display="flex"
                            alignItems="flex-start"
                            sx={{ mb: 4 }}
                        >
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
                                Edit Store
                            </h1>
                        </Box>

                        <form onSubmit={handleUpdate}>
                            <TextField
                                id="name"
                                label="Name"
                                value={store.name}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        name: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="description"
                                label="Description"
                                value={store.description}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        description: event.target.value,
                                    })
                                }
                            />

                            <FormControl fullWidth>
                                <InputLabel id="categoryLabel">
                                    Category
                                </InputLabel>
                                <Select
                                    labelId="categoryLabel"
                                    id="category"
                                    label="Category"
                                    value={store.category}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    onChange={(event) =>
                                        setStore({
                                            ...store,
                                            category: event.target
                                                .value as StoreCategory,
                                        })
                                    }
                                >
                                    {getEnumValues(StoreCategory).map(
                                        (categoryValue) => (
                                            <MenuItem
                                                key={categoryValue}
                                                value={categoryValue}
                                            >
                                                {StoreCategory[categoryValue]}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
                            </FormControl>

                            <TextField
                                id="address"
                                label="Address"
                                value={store.address}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        address: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="city"
                                label="City"
                                value={store.city}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        city: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="state"
                                label="State"
                                value={store.state}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        state: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="zipCode"
                                label="Zip Code"
                                value={store.zipCode}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        zipCode: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="country"
                                label="Country"
                                value={store.country}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        country: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="openDate"
                                label="Open Date"
                                value={store.openDate}
                                InputLabelProps={{ shrink: true }}
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        openDate: new Date(
                                            event.target.value
                                        ).toISOString(),
                                    })
                                }
                            />

                            <TextField
                                id="closeDate"
                                label="Close Date"
                                value={store.closeDate}
                                InputLabelProps={{ shrink: true }}
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setStore({
                                        ...store,
                                        closeDate: new Date(
                                            event.target.value
                                        ).toISOString(),
                                    })
                                }
                            />
                        </form>
                    </CardContent>
                    <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                        <Button
                            type="submit"
                            onClick={handleUpdate}
                            variant="contained"
                            sx={{ width: 100, mr: 2 }}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="contained"
                            color="error"
                            sx={{ width: 100 }}
                        >
                            Cancel
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Container>
    );
};
