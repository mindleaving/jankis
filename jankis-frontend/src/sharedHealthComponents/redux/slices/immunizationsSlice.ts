import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { deleteActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

export interface ImmunizationsState extends RemoteState<Models.Medication.Immunization> {
}

const initialState: ImmunizationsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const immunizationsSlice = createSlice({
    name: 'immunizations',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setImmunizations: (state, action: PayloadAction<Models.Medication.Immunization[]>) => {
            state.items = action.payload;
        },
        addOrUpdateImmunization: (state, action: PayloadAction<Models.Medication.Immunization>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removeImmunization: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
        }
    }
});

export const loadImmunizations = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/immunizations`,
    () => resolveText("Immunizations_CouldNotLoad"),
    immunizationsSlice.actions.setIsLoading,
    immunizationsSlice.actions.setImmunizations
);
export const addOrUpdateImmunization = postActionBuilder(
    () => `api/immunizations`,
    () => resolveText("Immunization_CouldNotStore"),
    immunizationsSlice.actions.setIsSubmitting,
    immunizationsSlice.actions.addOrUpdateImmunization
);
export const deleteImmunization = deleteActionBuilder(
    args => `api/immunizations/${args}`,
    () => resolveText("Immunization_SuccessfullyDeleted"),
    () => resolveText("Immunization_CouldNotDelete"),
    immunizationsSlice.actions.removeImmunization
);