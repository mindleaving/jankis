import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { SharedAccessType } from "../types/enums.d"
import { Models } from "../types/models";

export const formatAccessType = (accessType: SharedAccessType) => {
    switch(accessType) {
        case SharedAccessType.Emergency:
            return resolveText(`SharedAccessType_${SharedAccessType.Emergency}`);
        case SharedAccessType.HealthProfessional:
            return resolveText("Ordinary");
        default:
            return resolveText(`SharedAccessType_${SharedAccessType.Unknown}`);
    }
}
export const formatResearchStaff = (person: Models.ResearchStaff) => {
    return `${person.firstName} ${person.lastName}`;
}