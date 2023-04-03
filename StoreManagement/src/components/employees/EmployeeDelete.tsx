import {
  Container,
  Card,
  CardContent,
  IconButton,
  CardActions,
  Button,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";

export const EmployeeDelete = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const handleDelete = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    await axios
      .delete(`${BACKEND_API_URL}/storeemployees/${employeeId}`)
      .then(() => {
        alert("Employee deleted successfully!");
      })
      .catch((reason: AxiosError) => {
        console.log(reason.message);
        alert("Failed to delete employee!");
      });
    // go to employees list
    navigate("/employees");
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // go to employees list
    navigate("/employees");
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/employees`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          Are you sure you want to delete this employee? This cannot be undone!
        </CardContent>
        <CardActions>
          <Button onClick={handleDelete}>Delete it</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </CardActions>
      </Card>
    </Container>
  );
};
