import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { deleteActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface MedicationDispensionsState extends RemoteState<Models.Medication.MedicationDispension> {
}

const initialState: MedicationDispensionsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const medicationDispensionsSlice = createSlice({
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
            state.items = action.payload;
        },
        addOrUpdateMedicationDispension: (state, action: PayloadAction<Models.Medication.MedicationDispension>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removeMedicationDispension: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
        }
    }
});

export const loadMedicationDispensions = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/medicationDispensions`,
    () => resolveText("MedicationDispensions_CouldNotLoad"),
    medicationDispensionsSlice.actions.setIsLoading,
    medicationDispensionsSlice.actions.setMedicationDispensions
);
export const addMedicationDispension = postActionBuilder(
    () => `api/medicationDispensions`, 
    () => resolveText("MedicationDispension_CouldNotStore"),
    medicationDispensionsSlice.actions.setIsSubmitting,
    medicationDispensionsSlice.actions.addOrUpdateMedicationDispension
);
export const removeMedicationDispension = deleteActionBuilder(
    medicationDispensionId => `api/medicationDispensions/${medicationDispensionId}`,
    () => resolveText("MedicationDispension_SuccessfullyDeleted"),
    () => resolveText("MedicationDispension_CouldNotDelete"),
    medicationDispensionsSlice.actions.removeMedicationDispension
);
