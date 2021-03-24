import { ServiceAudienceType } from "../types/enums.d";
import { Models } from "../types/models";
import { resolveText } from "./Globalizer";

export const formatAudienceItem = (item: Models.ServiceAudience) => {
    if(item.type === ServiceAudienceType.All) {
        return resolveText('ServiceAudienceType_All');
    }
    if(item.type === ServiceAudienceType.Role) {
        const roleAudience = item as Models.RoleServiceAudience;
        return `${resolveText('ServiceAudienceType_Role')}: ${roleAudience.roleName}`;
    }
    if(item.type === ServiceAudienceType.Employee) {
        const employeeAudience = item as Models.EmployeeServiceAudience;
        return `${resolveText('ServiceAudienceType_Employee')}: ${employeeAudience.employeeId}`;
    }
    if(item.type === ServiceAudienceType.Patient) {
        const patientAudience = item as Models.PatientServiceAudience;
        return `${resolveText('ServiceAudienceType_Patient')}: ${patientAudience.patientId}`;
    }
    throw new Error(`Formatting of service audience type '${item.type}' not implemented`);
}