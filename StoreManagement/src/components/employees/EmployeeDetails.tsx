import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Employee, Gender } from "../../models/Employee";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    const fetchEmployee = async () => {
      // TODO: use axios instead of fetch
      // TODO: handle errors
      // TODO: handle loading state
      const response = await fetch(
        `${BACKEND_API_URL}/storeemployees/${employeeId}`
      );
      const employee = await response.json();
      setEmployee(employee);
    };
    fetchEmployee();
  }, [employeeId]);

  return (
    <Container>
      <Card>
        <CardContent>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/employees`}>
            <ArrowBackIcon />
          </IconButton>{" "}
          <h1>Employee Details</h1>
          <p>First Name: {employee?.firstName}</p>
          <p>Last Name: {employee?.lastName}</p>
          <p>Gender: {employee == null ? "" : Gender[employee.gender]}</p>
          <p>Employment Date: {formatDate(employee?.employmentDate)}</p>
          <p>Termination Date: {formatDate(employee?.terminationDate)}</p>
          <p>Salary: {employee?.salary}</p>
          <p>Role: {employee?.storeEmployeeRole?.name}</p>
          <p>Employee shifts:</p>
          {employee?.storeShifts?.length ? (
            <ul>
              {employee?.storeShifts?.map((shift) => (
                <li key={shift.store.id}>
                  {shift.store.name} - {formatDate(shift.startDate)} -{" "}
                  {formatDate(shift.endDate)}
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              <li>N/A</li>
            </ul>
          )}
        </CardContent>
        <CardActions>
          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/employees/${employeeId}/edit`}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            component={Link}
            sx={{ mr: 3 }}
            to={`/employees/${employeeId}/delete`}
          >
            <DeleteForeverIcon sx={{ color: "red" }} />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
