import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { deleteActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";


interface TestResultsState extends RemoteState<Models.DiagnosticTestResults.DiagnosticTestResult> {
}
const initialState: TestResultsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const testResultsSlice = createSlice({
    name: "testResults",
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setTestResults: (state, action: PayloadAction<Models.DiagnosticTestResults.DiagnosticTestResult[]>) => {
            state.items = action.payload;
        },
        addOrUpdateTestResult: (state, action: PayloadAction<Models.DiagnosticTestResults.DiagnosticTestResult>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removeTestResult: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
        },
        markTestResultAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        },
        markTestResultAsVerified: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.isVerified = true;
            }
        },
    }
});

export const loadTestResults = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/testResults`,
    () => resolveText("TestResults_CouldNotLoad"),
    testResultsSlice.actions.setIsLoading,
    testResultsSlice.actions.setTestResults
);
export const addTestResult = postActionBuilder(
    () => `api/testResults`, 
    () => resolveText("TestResult_CouldNotStore"),
    testResultsSlice.actions.setIsSubmitting,
    testResultsSlice.actions.addOrUpdateTestResult
);
export const deleteTestResult = deleteActionBuilder(
    args => `api/testResults/${args}`,
    () => resolveText("TestResult_SuccessfullyDeleted"),
    () => resolveText("TestResult_CouldNotDelete"),
    testResultsSlice.actions.removeTestResult
);
export const markTestResultAsSeen = postActionBuilder(
    testResultId => `api/testResults/${testResultId}/seen`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
    testResultsSlice.actions.setIsSubmitting,
    testResultsSlice.actions.markTestResultAsSeen
);
export const markTestResultAsVerified = postActionBuilder(
    testResultId => `api/testResults/${testResultId}/verified`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
    testResultsSlice.actions.setIsSubmitting,
    testResultsSlice.actions.markTestResultAsVerified
);