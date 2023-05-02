import { Employee } from "./Employee";
import { EmployeeRole } from "./EmployeeRole";
import { Store } from "./Store";
import { StoreShift } from "./StoreShift";
import { UserProfile } from "./UserProfile";

export interface User {
    id?: number;
    name: string;
    password: string;

    accessLevel?: number;
    userProfile?: UserProfile;

    roleCount?: number;
    employeeCount?: number;
    storeCount?: number;
    shiftCount?: number;
}
