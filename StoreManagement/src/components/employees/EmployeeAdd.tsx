import {
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { Employee, Gender } from "../../models/Employee";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { EmployeeRole } from "../../models/EmployeeRole";

export const EmployeeAdd = () => {
    const navigate = useNavigate();
    const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>([]);

    const [employee, setEmployee] = useState<Employee>({
        firstName: "",
        lastName: "",

        gender: 0,

        employmentDate: "",
        terminationDate: "",
        salary: 0,

        storeEmployeeRoleId: 1,
    });

    const addEmployee = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/storeemployees/`, employee)
                .then(() => {
                    alert("Employee added successfully!");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    alert("Failed to add employee!");
                });
            navigate("/employees");
        } catch (error) {
            console.log(error);
            alert("Failed to add employee!");
        }
    };

    useEffect(() => {
        const fetchEmployeeRoles = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_API_URL}/storeemployeeroles/`
                );
                const data = await response.json();
                setEmployeeRoles(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchEmployeeRoles();
    }, []);

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton
                        component={Link}
                        sx={{ mr: 3 }}
                        to={`/employees`}
                    >
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addEmployee}>
                        <TextField
                            id="firstName"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setEmployee({
                                    ...employee,
                                    firstName: event.target.value,
                                })
                            }
                        />
                        <TextField
                            id="lastName"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setEmployee({
                                    ...employee,
                                    lastName: event.target.value,
                                })
                            }
                        />

                        <FormControl fullWidth>
                            <InputLabel id="genderLabel">Gender</InputLabel>
                            <Select
                                labelId="genderLabel"
                                id="gender"
                                label="Gender"
                                value={employee.gender}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setEmployee({
                                        ...employee,
                                        gender: event.target.value as Gender,
                                    })
                                }
                            >
                                {getEnumValues(Gender).map((genderValue) => (
                                    <MenuItem
                                        key={genderValue}
                                        value={genderValue}
                                    >
                                        {Gender[genderValue]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            id="employmentDate"
                            label="Employment Date"
                            InputLabelProps={{ shrink: true }}
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setEmployee({
                                    ...employee,
                                    employmentDate: new Date(
                                        event.target.value
                                    ).toISOString(),
                                })
                            }
                        />

                        <TextField
                            id="terminationDate"
                            label="Termination Date"
                            InputLabelProps={{ shrink: true }}
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setEmployee({
                                    ...employee,
                                    terminationDate: new Date(
                                        event.target.value
                                    ).toISOString(),
                                })
                            }
                        />

                        <TextField
                            id="salary"
                            label="Salary"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setEmployee({
                                    ...employee,
                                    salary: Number(event.target.value),
                                })
                            }
                        />

                        <FormControl fullWidth>
                            <InputLabel id="roleLabel">Role</InputLabel>
                            <Select
                                labelId="roleLabel"
                                id="storeEmployeeRoleId"
                                label="Role"
                                value={employee.storeEmployeeRoleId}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setEmployee({
                                        ...employee,
                                        storeEmployeeRoleId: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                            >
                                {employeeRoles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button type="submit">Add Employee</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};
