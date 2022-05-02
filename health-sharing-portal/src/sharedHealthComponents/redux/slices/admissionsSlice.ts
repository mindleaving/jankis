import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface AdmissionsState extends RemoteState {
    items: Models.Admission[];
}
const initialState: AdmissionsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

const admissionsSlice = createSlice({
    name: 'admissions',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setAdmissions: (state, action: PayloadAction<Models.Admission[]>) => {
            state.items.push(...action.payload);
        },
        addAdmission : (state, action: PayloadAction<Models.Admission>) => {
            state.items.push(action.payload);
        }
    }
});

export const { setIsLoading, setIsSubmitting, setAdmissions, addAdmission } = admissionsSlice.actions;
export default admissionsSlice.reducer;