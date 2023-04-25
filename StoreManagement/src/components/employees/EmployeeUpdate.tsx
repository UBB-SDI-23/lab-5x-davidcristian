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
import { Employee, Gender } from "../../models/Employee";
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { EmployeeRole } from "../../models/EmployeeRole";
import { debounce } from "lodash";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";

export const EmployeeUpdate = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>([]);
    const { employeeId } = useParams<{ employeeId: string }>();

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

    const employeeRole = useRef<EmployeeRole>({
        name: "",
        description: "",

        roleLevel: 0,
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(
                `${BACKEND_API_URL}/storeemployees/${employeeId}/`
            );

            const employee = await response.json();
            const fetchedEmployeeRole = {
                id: employee.storeEmployeeRole.id,
                name: employee.storeEmployeeRole.name,
                description: employee.storeEmployeeRole.description,
                roleLevel: employee.storeEmployeeRole.roleLevel,
            };
            employeeRole.current = fetchedEmployeeRole;
            setEmployeeRoles([employeeRole.current]);

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
                    openSnackbar("success", "Employee updated successfully!");
                    navigate("/employees");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update employee!\n" + reason.response?.data
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update employee due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/employees");
    };

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<EmployeeRole[]>(
                `${BACKEND_API_URL}/storeemployeeroles/Search?query=${query}`
            );
            const data = await response.data;
            data.unshift(employeeRole.current);
            const removedDupes = data.filter(
                (v, i, a) => a.findIndex((v2) => v2.name === v.name) === i
            );

            setEmployeeRoles(removedDupes);
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
                                Edit Employee
                            </h1>
                        </Box>

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
                                            gender: event.target
                                                .value as Gender,
                                        })
                                    }
                                >
                                    {getEnumValues(Gender).map(
                                        (genderValue) => (
                                            <MenuItem
                                                key={genderValue}
                                                value={genderValue}
                                            >
                                                {Gender[genderValue]}
                                            </MenuItem>
                                        )
                                    )}
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

                            <Autocomplete
                                id="storeEmployeeRoleId"
                                options={employeeRoles}
                                value={employeeRole.current}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Role"
                                        variant="outlined"
                                    />
                                )}
                                filterOptions={(x) => x}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        employeeRole.current = value;

                                        setEmployee({
                                            ...employee,
                                            storeEmployeeRoleId: value.id,
                                        });
                                    }
                                }}
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
