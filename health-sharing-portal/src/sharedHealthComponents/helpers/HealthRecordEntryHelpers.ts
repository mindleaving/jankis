import { confirmAlert } from "react-confirm-alert";
import { HealthRecordEntryType } from "../../localComponents/types/enums.d";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { markDiagnosisAsSeen } from "../redux/slices/diagnosesSlice";
import { markDocumentAsSeen } from "../redux/slices/documentsSlice";
import { markNoteAsSeen } from "../redux/slices/notesSlice";
import { markObservationAsSeen } from "../redux/slices/observationsSlice";
import { markTestResultAsSeen } from "../redux/slices/testResultsSlice";
import { AppDispatch } from "../../localComponents/redux/store/healthRecordStore";
import { Models } from "../../localComponents/types/models";
import { compareDesc } from "date-fns";

export const unhideHealthRecordEntry = (dispatch: AppDispatch, entryType: HealthRecordEntryType, entryId: string) => {
    switch(entryType) {
        case HealthRecordEntryType.Note:
            dispatch(markNoteAsSeen({ args: entryId }));
            break;
        case HealthRecordEntryType.Document:
            dispatch(markDocumentAsSeen({ args: entryId }));
            break;
        case HealthRecordEntryType.Observation:
            dispatch(markObservationAsSeen({ args: entryId }));
            break;
        case HealthRecordEntryType.Diagnosis:
            dispatch(markDiagnosisAsSeen({ args: entryId }));
            break;
        case HealthRecordEntryType.Procedure:
            // A medical procedure is never hidden
            break;
        case HealthRecordEntryType.TestResult:
            dispatch(markTestResultAsSeen({ args: entryId }));
            break;
        case HealthRecordEntryType.MedicationDispension:
            // A medication dispension is never hidden
            break;
        default:
            throw new Error(`Unhiding is not implemented for '${entryType}'`);
    }
}
export const confirmUnhide = (callback: () => void) => {
    confirmAlert({
        title: resolveText('HealthRecordEntry_ConfirmUnhide_Title'),
        message: resolveText('HealthRecordEntry_ConfirmUnhide_Message'),
        closeOnClickOutside: true,
        buttons: [
            {
                label: resolveText("HealthRecordEntry_ConfirmUnhide_Yes"),
                onClick: callback
            },
            {
                label: resolveText("HealthRecordEntry_ConfirmUnhide_No"),
                onClick: () => {}
            }
        ]
    });
}

export const confirmVerified = (callback: () => void) => {
    confirmAlert({
        title: resolveText('HealthRecordEntry_ConfirmVerify_Title'),
        message: resolveText('HealthRecordEntry_ConfirmVerify_Message'),
        closeOnClickOutside: true,
        buttons: [
            {
                label: resolveText("HealthRecordEntry_ConfirmVerify_Yes"),
                onClick: callback
            },
            {
                label: resolveText("HealthRecordEntry_ConfirmVerify_No"),
                onClick: () => {}
            }
        ]
    });
}

export const sortByTimeDescending = <T extends Models.IHealthRecordEntry>(entries: T[]): T[] => {
    return [...entries].sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp)));
}