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
import { BACKEND_API_URL, getEnumValues } from "../../constants";
import { EmployeeRole } from "../../models/EmployeeRole";
import { debounce } from "lodash";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";

export const RoleUpdate = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const { roleId } = useParams<{ roleId: string }>();

    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<EmployeeRole>({
        name: "",
        description: "",

        roleLevel: -1,
    });

    useEffect(() => {
        const fetchRole = async () => {
            const response = await fetch(
                `${BACKEND_API_URL}/storeemployeeroles/${roleId}/`
            );
            const role = await response.json();

            setRole({
                id: role.id,
                name: role.name,
                description: role.description,
                roleLevel: role.roleLevel,
            });

            setLoading(false); // todo check if setloading is true in every file before
        };
        fetchRole();
    }, [roleId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/storeemployeeroles/${roleId}/`, role)
                .then(() => {
                    openSnackbar("success", "Role updated successfully!");
                    navigate("/roles");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update role!\n" + reason.response?.data
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update role due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/roles");
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
                                Edit Role
                            </h1>
                        </Box>

                        <form onSubmit={handleUpdate}>
                            <TextField
                                id="name"
                                label="Name"
                                value={role.name}
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
                                value={role.description}
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
                                value={role.roleLevel}
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
