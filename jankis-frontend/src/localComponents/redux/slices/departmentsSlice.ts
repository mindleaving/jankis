import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { postActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from '../../types/models';

export interface DepartmentsState extends RemoteState<Models.Department> {
}

const initialState: DepartmentsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setDepartments: (state, action: PayloadAction<Models.Department[]>) => {
            state.items = action.payload;
        },
        addOrUpdateDepartment: (state, action: PayloadAction<Models.Department>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const addDepartment = postActionBuilder(
    () => `api/departments`, 
    () => resolveText("Department_CouldNotStore"),
    departmentsSlice.actions.setIsSubmitting,
    departmentsSlice.actions.addOrUpdateDepartment
);