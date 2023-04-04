import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Employee, Gender } from "../../models/Employee";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

export const AllEmployees = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sorting, setSorting] = useState({
    key: "firstName",
    ascending: true,
  });

  function applySorting(key: string, ascending: boolean) {
    setSorting({ key: key, ascending: ascending });
  }

  useEffect(() => {
    if (employees.length === 0) {
      return;
    }

    const currentEmployees = [...employees];

    const sortedCurrentUsers = currentEmployees.sort((a, b) => {
      console.log(sorting.key);
      return a[sorting.key].localeCompare(b[sorting.key]);
    });

    setEmployees(
      sorting.ascending ? sortedCurrentUsers : sortedCurrentUsers.reverse()
    );
  }, [sorting]);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_API_URL}/storeemployees`)
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <h1>All employees</h1>

      {loading && <CircularProgress />}
      {!loading && employees.length === 0 && <p>No employees found</p>}
      {!loading && (
        <IconButton component={Link} sx={{ mr: 3 }} to={`/employees/add`}>
          <Tooltip title="Add a new employee" arrow>
            <AddIcon color="primary" />
          </Tooltip>
        </IconButton>
      )}
      {!loading && employees.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell
                  align="left"
                  style={{ cursor: "pointer" }}
                  onClick={() => applySorting("firstName", !sorting.ascending)}
                >
                  First Name
                </TableCell>
                <TableCell
                  align="left"
                  style={{ cursor: "pointer" }}
                  onClick={() => applySorting("lastName", !sorting.ascending)}
                >
                  Last Name
                </TableCell>
                <TableCell align="left">Gender</TableCell>
                <TableCell align="left">EmploymentDate</TableCell>
                <TableCell align="left">TerminationDate</TableCell>
                <TableCell align="left">Salary</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="center">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{employee.firstName}</TableCell>
                  <TableCell align="left">{employee.lastName}</TableCell>
                  <TableCell align="left">{Gender[employee.gender]}</TableCell>
                  <TableCell align="left">
                    {formatDate(employee.employmentDate)}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(employee.terminationDate)}
                  </TableCell>
                  <TableCell align="left">{employee.salary}</TableCell>
                  <TableCell align="left">
                    {employee.storeEmployeeRole?.name}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/employees/${employee.id}/details`}
                    >
                      <Tooltip title="View employee details" arrow>
                        <ReadMoreIcon color="primary" />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/employees/${employee.id}/edit`}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      component={Link}
                      sx={{ mr: 3 }}
                      to={`/employees/${employee.id}/delete`}
                    >
                      <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
