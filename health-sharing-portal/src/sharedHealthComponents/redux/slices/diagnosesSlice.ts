import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { RemoteState } from "../../types/reduxTypes";

interface DiagnosesState extends RemoteState {
    items: ViewModels.DiagnosisViewModel[];
}

const initialState: DiagnosesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

const diagnosesSlice = createSlice({
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
            state.items.push(...action.payload);
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
        markDiagnosisAsResolved: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasResolved = true;
                matchingItem.resolvedTimestamp = new Date();
            }
        },
    }
});

export const { setIsLoading, setIsSubmitting, setDiagnoses, addDiagnosis, markDiagnosisAsSeen, markDiagnosisAsResolved } = diagnosesSlice.actions;
export default diagnosesSlice.reducer;