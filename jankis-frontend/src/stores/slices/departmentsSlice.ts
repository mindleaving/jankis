import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from '../../types/models';

export const departmentsSlice = createSlice({
    name: 'departments',
    initialState: [] as Models.Department[],
    reducers: {
        addOne: (state, action: PayloadAction<Models.Department>) => {
            state.push(action.payload);
        }
    }
})

export const DepartmentActions = departmentsSlice.actions;