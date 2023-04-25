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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { EmployeeRole } from "../../models/EmployeeRole";
import { debounce } from "lodash";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";

export const RoleAdd = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const [role, setRole] = useState<EmployeeRole>({
        name: "",
        description: "",

        roleLevel: -1,
    });

    const addRole = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/storeemployeeroles/`, role)
                .then(() => {
                    openSnackbar("success", "Role added successfully!");
                    navigate("/roles");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to add role!\n" + reason.response?.data
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to add role due to an unknown error!"
            );
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
                            Add Role
                        </h1>
                    </Box>
                    <form id="addRoleForm" onSubmit={addRole}>
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setRole({
                                    ...role,
                                    name: event.target.value,
                                })
                            }
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setRole({
                                    ...role,
                                    description: event.target.value,
                                })
                            }
                        />

                        <TextField
                            id="roleLevel"
                            label="Level"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) =>
                                setRole({
                                    ...role,
                                    roleLevel: Number(event.target.value),
                                })
                            }
                        />
                    </form>
                </CardContent>
                <CardActions sx={{ mb: 1, ml: 1, mt: 1 }}>
                    <Button
                        variant="contained"
                        type="submit"
                        form="addRoleForm"
                    >
                        Add Role
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};
