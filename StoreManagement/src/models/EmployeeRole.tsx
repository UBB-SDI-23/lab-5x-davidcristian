import { Employee } from "./Employee";

export interface EmployeeRole {
    id?: number;
    name: string;
    description: string;

    roleLevel: number;

    storeEmployees?: Employee[];
}
