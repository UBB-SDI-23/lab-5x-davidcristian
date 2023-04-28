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
import { BACKEND_API_URL } from "../../constants";
import { StoreShift } from "../../models/StoreShift";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";

export const ShiftUpdate = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const { storeId, employeeId } = useParams();
    const [employeeName, setEmployeeName] = useState("");
    const [storeName, setStoreName] = useState("");

    const [loading, setLoading] = useState(false);
    const [shift, setShift] = useState<StoreShift>({
        startDate: "",
        endDate: "",

        storeId: 0,
        storeEmployeeId: 0,
    });

    useEffect(() => {
        setLoading(true);
        const fetchShift = async () => {
            const response = await axios.get<StoreShift>(
                `${BACKEND_API_URL}/storeshifts/${storeId}/${employeeId}`
            );
            const data = response.data;

            setEmployeeName(
                data.storeEmployee?.firstName +
                    " " +
                    data.storeEmployee?.lastName ?? ""
            );
            setStoreName(data.store?.name ?? "");

            setShift({
                startDate: convertToInputFormat(data.startDate),
                endDate: convertToInputFormat(data.endDate),

                storeId: data.storeId,
                storeEmployeeId: data.storeEmployeeId,
            });

            setLoading(false);
        };
        fetchShift();
    }, [storeId, employeeId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/storeshifts/${storeId}/${employeeId}`,
                    shift
                )
                .then(() => {
                    openSnackbar("success", "Shift updated successfully!");
                    navigate("/shifts");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update shift!\n" + reason.response?.data
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update shift due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/shifts");
    };

    const convertToInputFormat = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const localDateString = date.toISOString().slice(0, 16);
        return localDateString;
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
                                Edit Shift
                            </h1>
                        </Box>

                        <form onSubmit={handleUpdate}>
                            <TextField
                                id="employeeName"
                                label="Employee Name"
                                value={employeeName}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                disabled={true}
                            />

                            <TextField
                                id="storeName"
                                label="Store Name"
                                value={storeName}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                disabled={true}
                            />

                            <TextField
                                id="startDate"
                                label="Start Date"
                                value={convertToInputFormat(shift.startDate)}
                                InputLabelProps={{ shrink: true }}
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setShift({
                                        ...shift,
                                        startDate: new Date(
                                            event.target.value
                                        ).toISOString(),
                                    })
                                }
                            />

                            <TextField
                                id="endDate"
                                label="End Date"
                                value={convertToInputFormat(shift.endDate)}
                                InputLabelProps={{ shrink: true }}
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) =>
                                    setShift({
                                        ...shift,
                                        endDate: new Date(
                                            event.target.value
                                        ).toISOString(),
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
