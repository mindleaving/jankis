import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface MedicationDispensionsState extends RemoteState {
    items: Models.Medication.MedicationDispension[];
}

const initialState: MedicationDispensionsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

const medicationDispensionsSlice = createSlice({
    name: 'medicationDispensions',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setMedicationDispensions: (state, action: PayloadAction<Models.Medication.MedicationDispension[]>) => {
            state.items.push(...action.payload);
        },
        addMedicationDispension : (state, action: PayloadAction<Models.Medication.MedicationDispension>) => {
            state.items.push(action.payload);
        },
        removeMedicationDispension: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id === action.payload);
        }
    }
});

export const { 
    setIsLoading, 
    setIsSubmitting, 
    setMedicationDispensions, 
    addMedicationDispension,
    removeMedicationDispension
} = medicationDispensionsSlice.actions;
export default medicationDispensionsSlice.reducer;