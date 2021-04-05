import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../types/models";

export const stocksSlice = createSlice({
    name: 'stocks',
    initialState: [] as Models.Stock[],
    reducers: {
        addOne: (state, action: PayloadAction<Models.Stock>) => {
            state.push(action.payload);
        }
    }
});