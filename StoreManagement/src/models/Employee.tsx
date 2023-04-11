import { EmployeeRole } from "./EmployeeRole";
import { StoreShift } from "./StoreShift";

export enum Gender {
    Female,
    Male,
    Other,
}

export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;

    gender: Gender;

    employmentDate?: string;
    terminationDate?: string;
    salary: number;

    storeEmployeeRoleId?: number;

    storeEmployeeRole?: EmployeeRole;
    storeShifts?: StoreShift[];
    [key: string]: any;
}
