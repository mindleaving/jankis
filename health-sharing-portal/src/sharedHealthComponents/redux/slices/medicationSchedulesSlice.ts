import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { deleteObject } from "../../../sharedCommonComponents/helpers/DeleteHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface MedicationSchedulesState extends RemoteState {
    items: Models.Medication.MedicationSchedule[];
}
export interface RemoveDispensionPayload {
    scheduleId: string;
    dispensionId: string;
}
export interface AddDispensionToMedicationSchedulePayload {
    scheduleId: string;
    dispension: Models.Medication.MedicationDispension;
    scheduleItem?: Models.Medication.MedicationScheduleItem;
}

const initialState: MedicationSchedulesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const medicationSchedulesSlice = createSlice({
    name: 'medicationSchedules',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setMedicationSchedules: (state, action: PayloadAction<Models.Medication.MedicationSchedule[]>) => {
            state.items = action.payload;
        },
        addMedicationSchedule : (state, action: PayloadAction<Models.Medication.MedicationSchedule>) => {
            state.items.push(action.payload);
        },
        removeMedicationSchedule : (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
        },
        removeDispensionFromMedicationSchedule: (state, action: PayloadAction<RemoveDispensionPayload>) => {
            const matchingSchedule = state.items.find(x => x.id === action.payload.scheduleId);
            if(matchingSchedule) {
                for (const item of matchingSchedule.items) {
                    item.plannedDispensions = item.plannedDispensions.filter(dispension => dispension.id !== action.payload.dispensionId);
                }
            }
        },
        setMedicationScheduleIsActive: (state, action: PayloadAction<string>) => {
            for (const item of state.items) {
                item.isActive = item.id === action.payload;
            }
        },
        addDispensionToMedicationSchedule: (state, action: PayloadAction<AddDispensionToMedicationSchedulePayload>) => {
            const matchingSchedule = state.items.find(x => x.id === action.payload.scheduleId);
            if(matchingSchedule) {
                const dispension = action.payload.dispension;
                const existingScheduleItem = matchingSchedule.items.find(x => x.drug.id === dispension.drug.id);
                if(existingScheduleItem) {
                    existingScheduleItem.plannedDispensions.push(dispension);
                } else {
                    matchingSchedule.items.push(action.payload.scheduleItem!);
                }
            }
        }
    }
});

export const loadMedicationSchedules: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(medicationSchedulesSlice.actions.setIsLoading(true));
        await loadObject<Models.Medication.MedicationSchedule[]>(
            `api/persons/${personId}/medicationSchedules`, {},
            resolveText("MedicationSchedules_CouldNotLoad"),
            medicationSchedules => dispatch(medicationSchedulesSlice.actions.setMedicationSchedules(medicationSchedules)),
            () => dispatch(medicationSchedulesSlice.actions.setIsLoading(false))
        );
    }
}
export const addMedicationSchedule: AsyncActionCreator = (medicationSchedule: Models.Medication.MedicationSchedule) => {
    return async (dispatch) => {
        dispatch(medicationSchedulesSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/medicationSchedules`, 
            resolveText("MedicationSchedule_CouldNotStore"),
            medicationSchedule,
            () => dispatch(medicationSchedulesSlice.actions.addMedicationSchedule(medicationSchedule)),
            () => dispatch(medicationSchedulesSlice.actions.setIsSubmitting(false))
        );
    }
}
export const removeMedicationSchedule: AsyncActionCreator = (medicationDispensionId: string) => {
    return async (dispatch) => {
        await deleteObject(
            `api/medicationSchedules/${medicationDispensionId}`, {},
            resolveText("MedicationSchedule_SuccessfullyDeleted"),
            resolveText("MedicationSchedule_CouldNotDelete"),
            () => dispatch(medicationSchedulesSlice.actions.removeMedicationSchedule(medicationDispensionId)),
            () => {}
        );
    }
}
export const addDispensionToMedicationSchedule: AsyncActionCreator = (payload: AddDispensionToMedicationSchedulePayload) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/medicationSchedules/${payload.scheduleId}/dispensions`,
            resolveText("MedicationDispension_CouldNotAddToSchedule"),
            payload.dispension,
            async response => {
                const scheduleItem = await response.json() as Models.Medication.MedicationScheduleItem;
                payload.scheduleItem = scheduleItem;
                dispatch(medicationSchedulesSlice.actions.addDispensionToMedicationSchedule(payload));
            }
        );
    }
}
export const removeDispensionFromMedicationSchedule: AsyncActionCreator = (payload: RemoveDispensionPayload) => {
    return async (dispatch) => {
        await deleteObject(
            `api/medicationSchedules/${payload.scheduleId}/dispensions/${payload.dispensionId}`, {},
            resolveText("MedicationDispension_SuccessfullyRemovedFromSchedule"),
            resolveText("MedicationDispension_CouldNotBeRemovedFromSchedule"),
            () => dispatch(medicationSchedulesSlice.actions.removeDispensionFromMedicationSchedule(payload))
        );
    }
}
export const setMedicationScheduleIsActive: AsyncActionCreator = (scheduleId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/medicationSchedules/${scheduleId}/active`,
            resolveText("MedicationSchedule_CouldNotSetActive"),
            null,
            () => dispatch(medicationSchedulesSlice.actions.setMedicationScheduleIsActive(scheduleId))
        );
    }
}
