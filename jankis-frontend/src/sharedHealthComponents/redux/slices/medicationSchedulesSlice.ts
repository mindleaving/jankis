import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MedicationDispensionState } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { ApiPostActionCreator } from "../../types/reduxTypes";
import { deleteActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";
import { medicationDispensionsSlice } from "./medicationDispensionsSlice";

interface MedicationSchedulesState extends RemoteState<Models.Medication.MedicationSchedule> {
}
export interface RemoveDispensionPayload {
    scheduleId: string;
    dispensionId: string;
}
export interface AddDispensionToMedicationSchedulePayload {
    scheduleId?: string;
    dispension: Models.Medication.MedicationDispension;
    scheduleItem?: Models.Medication.MedicationScheduleItem;
}
export interface PauseMedicationPayload {
    scheduleId?: string;
    itemId: string;
}
export interface DispenseMedicationPayload {
    scheduleId: string;
    dispensionId: string;
    dispensionState: MedicationDispensionState;
}
export interface MoveDispensionBackToSchedulePayload {
    dispension: Models.Medication.MedicationDispension;
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
        addOrUpdateMedicationSchedule: (state, action: PayloadAction<Models.Medication.MedicationSchedule>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
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
            const matchingSchedule = action.payload.scheduleId
                ? state.items.find(x => x.id === action.payload.scheduleId)
                : state.items.find(x => x.isActive);
            if(matchingSchedule) {
                const dispension = {
                    ...action.payload.dispension,
                    state: MedicationDispensionState.Scheduled
                };
                const existingScheduleItem = matchingSchedule.items.find(x => x.drug.id === dispension.drug.id);
                if(existingScheduleItem) {
                    existingScheduleItem.plannedDispensions.push(dispension);
                } else {
                    matchingSchedule.items.push(action.payload.scheduleItem!);
                }
            }
        },
        pauseMedication: (state, action: PayloadAction<PauseMedicationPayload>) => {
            const matchingSchedule = action.payload.scheduleId 
                ? state.items.find(x => x.id === action.payload.scheduleId)
                : state.items.find(x => x.isActive);
            if(matchingSchedule) {
                const matchingItem = matchingSchedule.items.find(x => x.id === action.payload.itemId);
                if(matchingItem) {
                    matchingItem.isPaused = true;
                }
            }
        }
    }
});

export const loadMedicationSchedules = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/medicationSchedules`,
    () => resolveText("MedicationSchedules_CouldNotLoad"),
    medicationSchedulesSlice.actions.setIsLoading,
    medicationSchedulesSlice.actions.setMedicationSchedules
);
export const addMedicationSchedule = postActionBuilder(
    () => `api/medicationSchedules`, 
    () => resolveText("MedicationSchedule_CouldNotStore"),
    medicationSchedulesSlice.actions.setIsSubmitting,
    medicationSchedulesSlice.actions.addOrUpdateMedicationSchedule
);
export const removeMedicationSchedule = deleteActionBuilder(
    scheduleId => `api/medicationSchedules/${scheduleId}`,
    () => resolveText("MedicationSchedule_SuccessfullyDeleted"),
    () => resolveText("MedicationSchedule_CouldNotDelete"),
    medicationSchedulesSlice.actions.removeMedicationSchedule
);
export const addDispensionToMedicationSchedule = postActionBuilder(
    args => `api/medicationSchedules/${args.scheduleId}/dispensions`,
    () => resolveText("MedicationDispension_CouldNotAddToSchedule"),
    medicationSchedulesSlice.actions.setIsSubmitting,
    medicationSchedulesSlice.actions.addDispensionToMedicationSchedule
);
export const removeDispensionFromMedicationSchedule = deleteActionBuilder(
    args => `api/medicationSchedules/${args.scheduleId}/dispensions/${args.dispensionId}`,
    () => resolveText("MedicationDispension_SuccessfullyRemovedFromSchedule"),
    () => resolveText("MedicationDispension_CouldNotBeRemovedFromSchedule"),
    medicationSchedulesSlice.actions.removeDispensionFromMedicationSchedule
);
export const setMedicationScheduleIsActive = postActionBuilder(
    scheduleId => `api/medicationSchedules/${scheduleId}/active`,
    () => resolveText("MedicationSchedule_CouldNotSetActive"),
    medicationSchedulesSlice.actions.setIsSubmitting,
    medicationSchedulesSlice.actions.setMedicationScheduleIsActive
);
export const pauseMedication = postActionBuilder(
    args => `api/medicationSchedules/${args.scheduleId}/items/${args.itemId}/pause`,
    () => resolveText("Medication_CouldNotPause"),
    medicationSchedulesSlice.actions.setIsSubmitting,
    medicationSchedulesSlice.actions.pauseMedication
);
export const dispenseMedication: ApiPostActionCreator<DispenseMedicationPayload, ViewModels.DispenseMedicationViewModel> = (payload) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/medicationschedules/dispense`,
            resolveText("MedicationSchedule_CouldNotDispense"),
            payload.body,
            async response => {
                const dispension = await response.json() as Models.Medication.MedicationDispension;
                dispatch(removeDispensionFromMedicationSchedule({
                    args: payload.args
                }));
                dispension.state = payload.args.dispensionState;
                dispatch(medicationDispensionsSlice.actions.addOrUpdateMedicationDispension(dispension));
            }
        );
    }
}
export const moveDispensionBackToSchedule: ApiPostActionCreator<MoveDispensionBackToSchedulePayload,unknown> = (payload) => {
    return async (dispatch) => {
        const dispension = payload.args.dispension;
        await sendPostRequest(
            `api/medicationdispensions/${dispension.id}/back-to-schedule`,
            resolveText("MedicationDispension_CouldNotMoveToSchedule"),
            payload.body,
            async response => {
                const scheduleItem = await response.json() as Models.Medication.MedicationScheduleItem;
                dispatch(medicationSchedulesSlice.actions.addDispensionToMedicationSchedule({
                    dispension: dispension,
                    scheduleItem: scheduleItem
                }));
                dispatch(medicationDispensionsSlice.actions.removeMedicationDispension(dispension.id));
            }
        );
    }
}