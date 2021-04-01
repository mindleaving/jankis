import { configureStore } from "@reduxjs/toolkit";
import { departmentsReducer } from "./reducers/departmentReducer";

export const store = configureStore({
    reducer: {
        departments: departmentsReducer
    }
})