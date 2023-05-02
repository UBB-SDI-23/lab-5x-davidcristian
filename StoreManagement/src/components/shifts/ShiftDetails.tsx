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
import { StoreShift } from "../../models/StoreShift";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAuthToken } from "../../auth";
import axios from "axios";

export const ShiftDetails = () => {
    const { storeId, employeeId } = useParams();
    const [shift, setShift] = useState<StoreShift>();

    useEffect(() => {
        const fetchShift = async () => {
            const response = await axios.get<StoreShift>(
                `${BACKEND_API_URL}/storeshifts/${storeId}/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const shift = response.data;
            setShift(shift);
        };
        fetchShift();
    }, [employeeId]);

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={`/shifts`}
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
                            Shift Details
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <p>
                            Employee Name: {shift?.storeEmployee?.firstName}{" "}
                            {shift?.storeEmployee?.lastName}
                        </p>
                        <p>Store Name: {shift?.store?.name}</p>
                        <p>Start Date: {formatDate(shift?.startDate)}</p>
                        <p>End Date: {formatDate(shift?.endDate)}</p>
                    </Box>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        component={Link}
                        to={`/shifts/${storeId}/${employeeId}/edit`}
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
                        to={`/shifts/${storeId}/${employeeId}/delete`}
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
