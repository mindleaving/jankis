import { createSlice } from "@reduxjs/toolkit";

export const departmentsReducer = createSlice({
    name: 'departments',
    initialState: [],
    reducers: {
        addOne: (state, action) => {
            state.push(action.payload);
        }
    }
})