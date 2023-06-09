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
import { EmployeeRole } from "../../models/EmployeeRole";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const RoleDetails = () => {
    const { roleId } = useParams();
    const [role, setRole] = useState<EmployeeRole>();

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(
                `${BACKEND_API_URL}/storeemployeeroles/${roleId}`
            );
            const employee = await response.json();
            setRole(employee);
        };
        fetchEmployee();
    }, [roleId]);

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={`/roles`}
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
                            Role Details
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <p>Name: {role?.name}</p>
                        <p>Description: {role?.description}</p>
                        <p>Level: {role?.roleLevel}</p>
                        <p>Employees:</p>
                        {role?.storeEmployees?.length ? (
                            <ul style={{ marginBottom: 0 }}>
                                {role?.storeEmployees?.map((employee) => (
                                    <li key={employee.id}>
                                        {employee.firstName} {employee.lastName}
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
                        to={`/roles/${roleId}/edit`}
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
                        to={`/roles/${roleId}/delete`}
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
