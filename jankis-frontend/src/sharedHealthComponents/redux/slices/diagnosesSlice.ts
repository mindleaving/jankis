import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface DiagnosesState extends RemoteState<ViewModels.DiagnosisViewModel> {
}

const initialState: DiagnosesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const diagnosesSlice = createSlice({
    name: 'diagnoses',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setDiagnoses: (state, action: PayloadAction<ViewModels.DiagnosisViewModel[]>) => {
            state.items = action.payload;
        },
        addOrUpdateDiagnosis: (state, action: PayloadAction<ViewModels.DiagnosisViewModel>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        markDiagnosisAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        },
        markDiagnosisAsVerified: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.isVerified = true;
            }
        },
        markDiagnosisAsResolved: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasResolved = true;
                matchingItem.resolvedTimestamp = new Date();
            }
        },
    }
});

export const loadDiagnoses = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/diagnoses`,
    () => resolveText("Diagnoses_CouldNotLoad"),
    diagnosesSlice.actions.setIsLoading,
    diagnosesSlice.actions.setDiagnoses
);
export const addDiagnosis = postActionBuilder(
    () => `api/diagnoses`, 
    () => resolveText("Diagnosis_CouldNotStore"),
    diagnosesSlice.actions.setIsSubmitting,
    diagnosesSlice.actions.addOrUpdateDiagnosis
);
export const markDiagnosisAsSeen = postActionBuilder(
    diagnosisId => `api/diagnoses/${diagnosisId}/seen`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
    diagnosesSlice.actions.setIsSubmitting,
    diagnosesSlice.actions.markDiagnosisAsSeen
);
export const markDiagnosisAsVerified = postActionBuilder(
    diagnosisId => `api/diagnoses/${diagnosisId}/verified`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
    diagnosesSlice.actions.setIsSubmitting,
    diagnosesSlice.actions.markDiagnosisAsVerified
);
export const markDiagnosisAsResolved = postActionBuilder(
    diagnosisId => `api/diagnoses/${diagnosisId}/resolve`, 
    () => resolveText("Diagnosis_CouldNotMarkAsResolved"),
    diagnosesSlice.actions.setIsSubmitting,
    diagnosesSlice.actions.markDiagnosisAsResolved
);