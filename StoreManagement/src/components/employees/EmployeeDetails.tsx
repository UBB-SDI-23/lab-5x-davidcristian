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
import { Employee, Gender } from "../../models/Employee";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import axios from "axios";
import { getAuthToken } from "../../auth";

export const EmployeeDetails = () => {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState<Employee>();

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await axios.get<Employee>(
                `${BACKEND_API_URL}/storeemployees/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            const employee = response.data;
            setEmployee(employee);
        };
        fetchEmployee();
    }, [employeeId]);

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            component={Link}
                            sx={{ mb: 2, mr: 3 }}
                            to={`/employees`}
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
                            Employee Details
                        </h1>
                    </Box>

                    <Box sx={{ ml: 1 }}>
                        <p>First Name: {employee?.firstName}</p>
                        <p>Last Name: {employee?.lastName}</p>
                        <p>
                            Gender:{" "}
                            {employee == null ? "" : Gender[employee.gender]}
                        </p>
                        <p>
                            Employment Date:{" "}
                            {formatDate(employee?.employmentDate)}
                        </p>
                        <p>
                            Termination Date:{" "}
                            {formatDate(employee?.terminationDate)}
                        </p>
                        <p>Salary: {employee?.salary}</p>
                        <p>Role: {employee?.storeEmployeeRole?.name}</p>
                        <p>Employee shifts:</p>
                        {employee?.storeShifts?.length ? (
                            <ul style={{ marginBottom: 0 }}>
                                {employee?.storeShifts?.map((shift) => (
                                    <li key={shift.store?.id}>
                                        {shift.store?.name} -{" "}
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

                    <Button
                        component={Link}
                        to={`/employees/${employeeId}/addshift`}
                        variant="text"
                        size="large"
                        sx={{
                            color: "green",
                            textTransform: "none",
                            mt: 1,
                            ml: 2.4,
                        }}
                        startIcon={<AccessTimeFilledIcon />}
                    >
                        Add Shift
                    </Button>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        component={Link}
                        to={`/employees/${employeeId}/edit`}
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
                        to={`/employees/${employeeId}/delete`}
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
