import { confirmAlert } from "react-confirm-alert";
import { AccountType } from "../../localComponents/types/enums.d";
import { Models } from "../../localComponents/types/models";
import { ViewModels } from "../../localComponents/types/viewModels";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { MarkHealthRecordEntryAsSeenCallback } from "../types/frontendTypes";

export const unhideHealthRecordEntry = (
    healthRecordEntry: Models.IHealthRecordEntry, 
    onMarkAsSeen: MarkHealthRecordEntryAsSeenCallback) => {
    const update = (x: Models.PatientDocument) => ({
        ...x,
        hasBeenSeenBySharer: true
    });
    onMarkAsSeen(healthRecordEntry.type, healthRecordEntry.id, update);
}
export const needsHiding = (entry: Models.IHealthRecordEntry, user: ViewModels.LoggedInUserViewModel) => {
    const isMyInformation = user.accountType === AccountType.Sharer
        && user.profileData.id === entry.personId;
    return isMyInformation && !entry.hasBeenSeenBySharer;
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