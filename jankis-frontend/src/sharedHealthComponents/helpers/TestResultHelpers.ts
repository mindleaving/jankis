import { AppDispatch } from "../../localComponents/redux/store/healthRecordStore";
import { Models } from "../../localComponents/types/models";
import { openConfirmDeleteAlert } from "../../sharedCommonComponents/helpers/AlertHelpers";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { deleteTestResult } from "../redux/slices/testResultsSlice";
import { formatDate } from "./Formatters";

export const dispatchDeleteTestResult = (testResult: Models.DiagnosticTestResults.DiagnosticTestResult, dispatch: AppDispatch) => {
    openConfirmDeleteAlert(
        `${testResult.testName} (${formatDate(new Date(testResult.timestamp))})`,
        resolveText("TestResult_Delete_Title"),
        resolveText("TestResult_Delete_Message"),
        () => dispatch(deleteTestResult({ args: testResult.id }))
    );
}