import {
    Box,
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
    Autocomplete,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { Employee, Gender } from "../../models/Employee";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { EmployeeRole } from "../../models/EmployeeRole";
import { debounce } from "lodash";

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
                    `${BACKEND_API_URL}/storeemployeeroles/0/10`
                );
                const data = await response.json();
                setEmployeeRoles(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchEmployeeRoles();
    }, []);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<EmployeeRole[]>(
                `${BACKEND_API_URL}/storeemployeeroles/Search?query=${query}`
            );
            const data = await response.data;
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
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start" sx={{ mb: 4 }}>
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
                            Add Employee
                        </h1>
                    </Box>
                    <form id="addEmployeeForm" onSubmit={addEmployee}>
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

                        <Autocomplete
                            id="storeEmployeeRoleId"
                            options={employeeRoles}
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
                        variant="contained"
                        type="submit"
                        form="addEmployeeForm"
                    >
                        Add Employee
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};
