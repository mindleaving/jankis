import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface DiagnosesState extends RemoteState {
    items: ViewModels.DiagnosisViewModel[];
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
        addDiagnosis : (state, action: PayloadAction<ViewModels.DiagnosisViewModel>) => {
            state.items.push(action.payload);
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

export const loadDiagnoses: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(diagnosesSlice.actions.setIsLoading(true));
        await loadObject<ViewModels.DiagnosisViewModel[]>(
            `api/persons/${personId}/diagnoses`, {},
            resolveText("Diagnoses_CouldNotLoad"),
            diagnoses => dispatch(diagnosesSlice.actions.setDiagnoses(diagnoses)),
            () => dispatch(diagnosesSlice.actions.setIsLoading(false))
        );
    }
}
export const addDiagnosis: AsyncActionCreator = (diagnosis: ViewModels.DiagnosisViewModel) => {
    return async (dispatch) => {
        dispatch(diagnosesSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/diagnoses`, 
            resolveText("Diagnosis_CouldNotStore"),
            diagnosis,
            () => dispatch(diagnosesSlice.actions.addDiagnosis(diagnosis)),
            () => dispatch(diagnosesSlice.actions.setIsSubmitting(false))
        );
    }
}
export const markDiagnosisAsSeen: AsyncActionCreator = (diagnosisId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/diagnoses/${diagnosisId}/seen`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
            null,
            () => dispatch(diagnosesSlice.actions.markDiagnosisAsSeen(diagnosisId)),
            () => {}
        );
    }
}
export const markDiagnosisAsVerified: AsyncActionCreator = (diagnosisId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/diagnoses/${diagnosisId}/verified`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
            null,
            () => dispatch(diagnosesSlice.actions.markDiagnosisAsVerified(diagnosisId)),
            () => {}
        );
    }
}
export const markDiagnosisAsResolved: AsyncActionCreator = (diagnosisId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/diagnoses/${diagnosisId}/resolve`, 
            resolveText("Diagnosis_CouldNotMarkAsResolved"),
            null,
            () => dispatch(diagnosesSlice.actions.markDiagnosisAsResolved(diagnosisId)),
            () => {}
        );
    }
}