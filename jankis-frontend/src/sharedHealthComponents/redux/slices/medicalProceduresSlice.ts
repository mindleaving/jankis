import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { deleteActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface MedicalProceduresState extends RemoteState<Models.Procedures.MedicalProcedure> {
}

const initialState: MedicalProceduresState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const medicalProceduresSlice = createSlice({
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
            state.items = action.payload;
        },
        addOrUpdateMedicalProcedure: (state, action: PayloadAction<Models.Procedures.MedicalProcedure>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removeMedicalProcedure: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
        }
    }
});

export const loadMedicalProcedures = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/procedures`,
    () => resolveText("MedicalProcedures_CouldNotLoad"),
    medicalProceduresSlice.actions.setIsLoading,
    medicalProceduresSlice.actions.setMedicalProcedures
);
export const addMedicalProcedure = postActionBuilder(
    () => `api/medicalProcedures`, 
    () => resolveText("MedicalProcedure_CouldNotStore"),
    medicalProceduresSlice.actions.setIsSubmitting,
    medicalProceduresSlice.actions.addOrUpdateMedicalProcedure
);
export const deleteMedicalProcedure = deleteActionBuilder(
    args => `api/medicalProcedures/${args}`,
    () => resolveText("MedicalProcedure_SuccessfullyDeleted"),
    () => resolveText("MedicalProcedure_CouldNotDelete"),
    medicalProceduresSlice.actions.removeMedicalProcedure
);