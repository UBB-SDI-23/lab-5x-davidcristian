import { Employee } from "./Employee";
import { Store } from "./Store";

export interface StoreShift {
    startDate?: string;
    endDate?: string;

    storeId?: number;
    storeEmployeeId?: number;

    store: Store;
    storeEmployee: Employee;
}
