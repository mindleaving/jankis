import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { deleteObject } from "../../../sharedCommonComponents/helpers/DeleteHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface MedicationDispensionsState extends RemoteState {
    items: Models.Medication.MedicationDispension[];
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
        addMedicationDispension : (state, action: PayloadAction<Models.Medication.MedicationDispension>) => {
            state.items.push(action.payload);
        },
        removeMedicationDispension: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id === action.payload);
        }
    }
});

export const loadMedicationDispensions: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(medicationDispensionsSlice.actions.setIsLoading(true));
        await loadObject<Models.Medication.MedicationDispension[]>(
            `api/persons/${personId}/medicationDispensions`, {},
            resolveText("MedicationDispensions_CouldNotLoad"),
            medicationDispensions => dispatch(medicationDispensionsSlice.actions.setMedicationDispensions(medicationDispensions)),
            () => dispatch(medicationDispensionsSlice.actions.setIsLoading(false))
        );
    }
}
export const addMedicationDispension: AsyncActionCreator = (medicationDispension: Models.Medication.MedicationDispension) => {
    return async (dispatch) => {
        dispatch(medicationDispensionsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/medicationDispensions`, 
            resolveText("MedicationDispension_CouldNotStore"),
            medicationDispension,
            () => dispatch(medicationDispensionsSlice.actions.addMedicationDispension(medicationDispension)),
            () => dispatch(medicationDispensionsSlice.actions.setIsSubmitting(false))
        );
    }
}
export const removeMedicationDispension: AsyncActionCreator = (medicationDispensionId: string) => {
    return async (dispatch) => {
        await deleteObject(
            `api/medicationDispensions/${medicationDispensionId}`, {},
            resolveText("MedicationDispension_SuccessfullyDeleted"),
            resolveText("MedicationDispension_CouldNotDelete"),
            () => dispatch(medicationDispensionsSlice.actions.removeMedicationDispension(medicationDispensionId)),
            () => {}
        );
    }
}
