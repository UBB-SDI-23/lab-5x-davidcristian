import {
    Box,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Button,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Store, StoreCategory } from "../../models/Store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const StoreDetails = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState<Store>();

    useEffect(() => {
        const fetchStore = async () => {
            const response = await fetch(
                `${BACKEND_API_URL}/stores/${storeId}`
            );
            const store = await response.json();
            setStore(store);
        };
        fetchStore();
    }, [storeId]);

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
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
                            Store Details
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <p>Name: {store?.name}</p>
                        <p>Description: {store?.description}</p>
                        <p>
                            Category:{" "}
                            {store == null ? "" : StoreCategory[store.category]}
                        </p>
                        <p>Address: {store?.address}</p>
                        <p>City: {store?.city}</p>
                        <p>State: {store?.state}</p>
                        <p>Zip Code: {store?.zipCode}</p>
                        <p>Country: {store?.country}</p>
                        <p>Open Date: {formatDate(store?.openDate)}</p>
                        <p>Close Date: {formatDate(store?.closeDate)}</p>
                        <p>Employee shifts:</p>
                        {store?.storeShifts?.length ? (
                            <ul style={{ marginBottom: 0 }}>
                                {store?.storeShifts?.map((shift) => (
                                    <li key={shift.storeEmployee.id}>
                                        {shift.storeEmployee.firstName}{" "}
                                        {shift.storeEmployee.lastName} -{" "}
                                        {formatDate(shift.startDate)} -{" "}
                                        {formatDate(shift.endDate)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul style={{ marginBottom: 0 }}>
                                <li>N/A</li>
                            </ul>
                        )}
                    </Box>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        component={Link}
                        to={`/stores/${storeId}/edit`}
                        variant="text"
                        size="large"
                        sx={{
                            color: "gray",
                            textTransform: "none",
                        }}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>

                    <Button
                        component={Link}
                        to={`/stores/${storeId}/delete`}
                        variant="text"
                        size="large"
                        sx={{ color: "red", textTransform: "none" }}
                        startIcon={<DeleteForeverIcon />}
                    >
                        Delete
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};
