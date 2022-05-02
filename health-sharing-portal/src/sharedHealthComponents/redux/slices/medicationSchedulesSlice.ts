import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface MedicationSchedulesState extends RemoteState {
    items: Models.Medication.MedicationSchedule[];
}
export interface RemoveDispensionPayload {
    scheduleId: string;
    dispensionId: string;
}
export interface SetMedicationScheduleIsActivePayload {
    scheduleId: string;
    isActive: boolean;
}
export interface AddDispensionToMedicationSchedulePayload {
    scheduleId: string;
    dispension: Models.Medication.MedicationDispension;
}

const initialState: MedicationSchedulesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

const medicationSchedulesSlice = createSlice({
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
            state.items.push(...action.payload);
        },
        addMedicationSchedule : (state, action: PayloadAction<Models.Medication.MedicationSchedule>) => {
            state.items.push(action.payload);
        },
        removeDispensionFromMedicationSchedule: (state, action: PayloadAction<RemoveDispensionPayload>) => {
            const matchingSchedule = state.items.find(x => x.id === action.payload.scheduleId);
            if(matchingSchedule) {
                for (const item of matchingSchedule.items) {
                    item.plannedDispensions = item.plannedDispensions.filter(dispension => dispension.id !== action.payload.dispensionId);
                }
            }
        },
        setMedicationScheduleIsActive: (state, action: PayloadAction<SetMedicationScheduleIsActivePayload>) => {
            const matchingSchedule = state.items.find(x => x.id === action.payload.scheduleId);
            if(matchingSchedule) {
                matchingSchedule.isActive = action.payload.isActive;
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
                    return;
                    // const newScheduleItem: Models.Medication.MedicationScheduleItem = {
                    //     id: uuid(),
                    //     drug: dispension.drug,
                    //     isDispendedByPatient: false,
                    //     isPaused: false,
                    //     note: '',
                    //     plannedDispensions: [ dispension ]
                    // };
                    // matchingSchedule.items.push(newScheduleItem);
                }
            }
        }
    }
});

export const { 
    setIsLoading, 
    setIsSubmitting, 
    setMedicationSchedules, 
    addMedicationSchedule, 
    removeDispensionFromMedicationSchedule,
    setMedicationScheduleIsActive,
    addDispensionToMedicationSchedule
} = medicationSchedulesSlice.actions;
export default medicationSchedulesSlice.reducer;