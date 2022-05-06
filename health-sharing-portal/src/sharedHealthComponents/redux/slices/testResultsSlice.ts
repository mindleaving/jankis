import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";


interface TestResultsState extends RemoteState {
    items: Models.DiagnosticTestResults.DiagnosticTestResult[];
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
        addTestResult: (state, action: PayloadAction<Models.DiagnosticTestResults.DiagnosticTestResult>) => {
            state.items.push(action.payload);
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

export const loadTestResults: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(testResultsSlice.actions.setIsLoading(true));
        await loadObject<Models.DiagnosticTestResults.DiagnosticTestResult[]>(
            `api/persons/${personId}/testresults`, {},
            resolveText("TestResults_CouldNotLoad"),
            testResults => {
                dispatch(testResultsSlice.actions.setTestResults(testResults));
            },
            () => dispatch(testResultsSlice.actions.setIsLoading(false))
        );
    };
}
export const addTestResult: AsyncActionCreator = (testResult: Models.DiagnosticTestResults.DiagnosticTestResult) => {
    return async (dispatch) => {
        dispatch(testResultsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/testresults`,
            resolveText("TestResults_CouldNotStore"),
            testResult,
            () => {
                dispatch(testResultsSlice.actions.addTestResult(testResult));
            },
            () => dispatch(testResultsSlice.actions.setIsSubmitting(false))
        );
    }
}
export const markTestResultAsSeen: AsyncActionCreator = (testResultId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/testresults/${testResultId}/seen`,
            resolveText('HealthRecordEntry_CouldNotMarkAsSeen'),
            null,
            () => dispatch(testResultsSlice.actions.markTestResultAsSeen(testResultId))
        );
    }
}
export const markTestResultAsVerified: AsyncActionCreator = (testResultId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/testresults/${testResultId}/verified`,
            resolveText('HealthRecordEntry_CouldNotMarkAsVerified'),
            null,
            () => dispatch(testResultsSlice.actions.markTestResultAsVerified(testResultId))
        );
    }
}