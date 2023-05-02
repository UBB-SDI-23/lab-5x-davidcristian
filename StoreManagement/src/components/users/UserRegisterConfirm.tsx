import {
    Container,
    Card,
    CardContent,
    IconButton,
    CardActions,
    Button,
    Box,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";
import jwt_decode from "jwt-decode";

interface DecodedToken {
    exp: number;
}

export const UserRegisterConfirm = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const { token } = useParams();
    const decodedToken = jwt_decode<DecodedToken>(token ?? "");
    const expirationDate = new Date(decodedToken.exp * 1000).toLocaleString();

    const handleConfirm = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/users/register/confirm/${token}`)
                .then(() => {
                    openSnackbar("success", "Account confirmed successfully!");
                    navigate("/login");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to confirm account!\n" +
                            (String(reason.response?.data).length > 255
                                ? reason.message
                                : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to confirm account due to an unknown error!"
            );
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/");
    };

    return (
        <Container>
            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="flex-start">
                        <IconButton
                            component={Link}
                            sx={{ mr: 3 }}
                            to={`/register`}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <h1
                            style={{
                                flex: 1,
                                textAlign: "center",
                                marginTop: -4,
                                marginLeft: -64,
                            }}
                        >
                            Confirm Account
                        </h1>
                    </Box>

                    <p style={{ marginBottom: 0, textAlign: "center" }}>
                        Would you like to confirm your account?
                        <br />
                        <br />
                        Token expires on: {expirationDate}
                    </p>
                </CardContent>
                <CardActions
                    sx={{
                        mb: 1,
                        mt: 1,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: 100, mr: 2 }}
                        onClick={handleConfirm}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ width: 100 }}
                        onClick={handleCancel}
                    >
                        No
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};
