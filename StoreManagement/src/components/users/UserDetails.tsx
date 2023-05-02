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
import { User } from "../../models/User";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Employee, Gender } from "../../models/Employee";
import { MaritalStatus } from "../../models/UserProfile";

import { getAuthToken } from "../../auth";
import axios from "axios";

export const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get<User>(
                `${BACKEND_API_URL}/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );

            const user = response.data;
            setUser(user);
        };
        fetchUser();
    }, [userId]);

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            disabled
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={``}
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
                            User Details
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <p>Name: {user?.name}</p>
                        <p>Bio: {user?.userProfile?.bio}</p>
                        <p>Location: {user?.userProfile?.location}</p>
                        <p>
                            Birthday: {formatDate(user?.userProfile?.birthday)}
                        </p>
                        <p>
                            Gender:{" "}
                            {user == null || user.userProfile == null
                                ? ""
                                : Gender[user.userProfile.gender]}
                        </p>
                        <p>
                            Marital Status:{" "}
                            {user == null || user.userProfile == null
                                ? ""
                                : MaritalStatus[user.userProfile.gender]}
                        </p>
                        <p>User insertion stats:</p>
                        <ul style={{ marginBottom: 0 }}>
                            <li key={0}>Roles: {user?.roleCount}</li>
                            <li key={1}>Employees: {user?.employeeCount}</li>
                            <li key={2}>Stores: {user?.storeCount}</li>
                            <li key={3}>Shifts: {user?.shiftCount}</li>
                        </ul>
                    </Box>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        component={Link}
                        to={`/users/${userId}/edit`}
                        disabled={true}
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
                        to={`/users/${userId}/delete`}
                        disabled={true}
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
