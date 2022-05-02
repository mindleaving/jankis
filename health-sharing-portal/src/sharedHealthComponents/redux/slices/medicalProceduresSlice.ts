import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface MedicalProceduresState extends RemoteState {
    items: Models.Procedures.MedicalProcedure[];
}

const initialState: MedicalProceduresState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

const medicalProceduresSlice = createSlice({
    name: 'medicalProcedures',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setMedicalProcedures: (state, action: PayloadAction<Models.Procedures.MedicalProcedure[]>) => {
            state.items.push(...action.payload);
        },
        addMedicalProcedure : (state, action: PayloadAction<Models.Procedures.MedicalProcedure>) => {
            state.items.push(action.payload);
        }
    }
});

export const { setIsLoading, setIsSubmitting, setMedicalProcedures, addMedicalProcedure } = medicalProceduresSlice.actions;
export default medicalProceduresSlice.reducer;