import { confirmAlert } from "react-confirm-alert";
import { Models } from "../../localComponents/types/models";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { MarkHealthRecordEntryAsSeenCallback, MarkHealthRecordEntryAsVerifiedCallback } from "../types/frontendTypes";

export const unhideHealthRecordEntry = (
    healthRecordEntry: Models.IHealthRecordEntry, 
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback) => {
    const update = (x: Models.PatientDocument) => ({
        ...x,
        hasBeenSeenBySharer: true
    });
    onMarkAsSeen(healthRecordEntry.type, healthRecordEntry.id, update);
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

export const verifyHealthRecordEntry = (
    healthRecordEntry: Models.IHealthRecordEntry, 
    onMarkAsVerified: MarkHealthRecordEntryAsVerifiedCallback) => {
    const update = (x: Models.PatientDocument) => ({
        ...x,
        isVerified: true
    });
    onMarkAsVerified(healthRecordEntry.type, healthRecordEntry.id, update);
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