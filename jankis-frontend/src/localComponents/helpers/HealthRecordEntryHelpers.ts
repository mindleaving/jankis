import { AccountType } from "../../localComponents/types/enums.d";
import { Models } from "../../localComponents/types/models";
import { ViewModels } from "../../localComponents/types/viewModels";

export const needsHiding = (entry: Models.IHealthRecordEntry, user: ViewModels.IUserViewModel) => {
    const isMyInformation = user.accountType === AccountType.Patient
        && user.profileData.id === entry.personId;
    return isMyInformation && !entry.hasBeenSeenBySharer;
}
