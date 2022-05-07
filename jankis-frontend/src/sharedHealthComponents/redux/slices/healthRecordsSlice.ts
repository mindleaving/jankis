import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HealthRecordsState {
    isLoading: boolean;
    personId?: string;
};
const initialState: HealthRecordsState = {
    isLoading: false
};
export const healthRecordsSlice = createSlice({
    name: 'healthRecords',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setPersonId: (state, action: PayloadAction<string>) => {
            state.personId = action.payload;
        }
    }
});
