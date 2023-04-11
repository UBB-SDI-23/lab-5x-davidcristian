import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Employee, Gender } from "../../models/Employee";
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { EmployeeRole } from "../../models/EmployeeRole";

export const EmployeeUpdate = () => {
    const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>([]);
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState<Employee>({
        firstName: "",
        lastName: "",

        gender: 0,

        employmentDate: "",
        terminationDate: "",
        salary: 0,

        storeEmployeeRoleId: 1,
    });

    const [searchString, setSearchString] = useState("");

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

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(
                `${BACKEND_API_URL}/storeemployees/${employeeId}/`
            );
            const employee = await response.json();
            setEmployee({
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,

                gender: employee.gender,

                employmentDate: employee.employmentDate,
                terminationDate: employee.terminationDate,
                salary: employee.salary,

                storeEmployeeRoleId: employee.storeEmployeeRoleId,
            });
            setLoading(false);
        };
        fetchEmployee();
    }, [employeeId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/storeemployees/${employeeId}/`,
                    employee
                )
                .then(() => {
                    alert("Employee updated successfully!");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    alert("Failed to update employee!");
                });
            navigate("/employees");
        } catch (error) {
            console.log(error);
            alert("Failed to update employee!");
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/employees");
    };

    useEffect(() => {
        const fetchEmployeeRolesBySearchString = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_API_URL}/storeemployeeroles/search?query=${searchString}`
                );
                const data = await response.json();
                console.log(data);
                setEmployeeRoles(data);
            } catch (error) {
                console.log(error);
            }
        };

        const timer = setTimeout(() => {
            if (searchString.length < 3) return;

            fetchEmployeeRolesBySearchString();
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchString]);

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
                    <form onSubmit={handleUpdate}>
                        <TextField
                            id="firstName"
                            label="First Name"
                            value={employee.firstName}
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
                            value={employee.lastName}
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
                            value={employee.employmentDate}
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
                            value={employee.terminationDate}
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
                            value={employee.salary}
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

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Autocomplete
                                id="storeEmployeeRoleId"
                                options={employeeRoles}
                                value={employeeRoles.find(
                                    (role) =>
                                        role.id === employee.storeEmployeeRoleId
                                )}
                                getOptionLabel={(option) => option.name}
                                onInputChange={(event, value) =>
                                    setSearchString(value)
                                }
                                onChange={(event) =>
                                    setEmployee({
                                        ...employee,
                                        storeEmployeeRoleId: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Role"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </FormControl>
                    </form>
                </CardContent>
                <CardActions>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button
                            type="submit"
                            onClick={handleUpdate}
                            variant="contained"
                        >
                            Update
                        </Button>
                        <Button onClick={handleCancel} variant="contained">
                            Cancel
                        </Button>
                    </CardActions>
                </CardActions>
            </Card>
        </Container>
    );
};
