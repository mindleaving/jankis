import { Action, ActionCreator, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest, sendPutRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxTypes";
import { RootState } from "../store/healthRecordStore";


interface TestResultsState extends RemoteState {
    items: Models.DiagnosticTestResults.DiagnosticTestResult[];
}
const initialState: TestResultsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

const testResultsSlice = createSlice({
    name: "testResults",
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        markTestResultAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        },
        addTestResult: (state, action: PayloadAction<Models.DiagnosticTestResults.DiagnosticTestResult>) => {
            state.items.push(action.payload);
        },
        setTestResults: (state, action: PayloadAction<Models.DiagnosticTestResults.DiagnosticTestResult[]>) => {
            state.items.push(...action.payload);
        }
    }
});

type AsyncActionCreator = ActionCreator<ThunkAction<Promise<void>, RootState, void, Action>>

export const createLoadTestResultsAction: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(setIsLoading(true));
        await loadObject<Models.DiagnosticTestResults.DiagnosticTestResult[]>(
            `api/testresults/for/${personId}`, {},
            resolveText("TestResults_CouldNotLoad"),
            testResults => {
                dispatch(setTestResults(testResults));
            }
        );
        dispatch(setIsLoading(false));
    };
}
export const createStoreTestResultAction: AsyncActionCreator = (testResult: Models.DiagnosticTestResults.DiagnosticTestResult) => {
    return async (dispatch) => {
        dispatch(setIsSubmitting(true));
        await sendPutRequest(
            `api/testresults`,
            resolveText("TestResults_CouldNotStore"),
            testResult,
            () => {
                dispatch(addTestResult(testResult));
            }
        );
        dispatch(setIsSubmitting(false));
    }
}
export const createMarkTestResultAsSeenAction: AsyncActionCreator = (testResultId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/testresults/${testResultId}/seen`,
            resolveText('HealthRecordEntry_CouldNotMarkAsSeen'),
            null
        );
        dispatch(markTestResultAsSeen(testResultId));
    }
}

export const { addTestResult, setTestResults, setIsLoading, setIsSubmitting, markTestResultAsSeen } = testResultsSlice.actions;
export default testResultsSlice.reducer;