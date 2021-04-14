import { ServiceAudienceType } from "../types/enums.d";
import { Models } from "../types/models";
import { resolveText } from "./Globalizer";

export const formatServiceAudience = (item: Models.ServiceAudience) => {
    if(item.type === ServiceAudienceType.All) {
        return resolveText('ServiceAudienceType_All');
    }
    if(item.type === ServiceAudienceType.Role) {
        const roleAudience = item as Models.RoleServiceAudience;
        return `${resolveText('ServiceAudienceType_Role')}: ${roleAudience.roleId}`;
    }
    if(item.type === ServiceAudienceType.Person) {
        const patientAudience = item as Models.PersonServiceAudience;
        return `${resolveText('ServiceAudienceType_Person')}: ${patientAudience.personId}`;
    }
    throw new Error(`Formatting of service audience type '${item.type}' not implemented`);
}