import { MeasurementType, ServiceAudienceType, Sex } from "../types/enums.d";
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

export const formatPerson = (person: Models.Person) => {
    const genderSymbol = person.sex === Sex.Male ? '♂'
        : person.sex === Sex.Female ? '♀'
        : '⚥';
    return `${person.firstName} ${person.lastName} (${new Date(person.birthDate).toLocaleDateString()}, ${genderSymbol})`;
}

export const formatAdmission = (admission: Models.Admission) => {
    return `${new Date(admission.admissionTime).toLocaleDateString()} - ${admission.dischargeTime ? new Date(admission.dischargeTime).toLocaleDateString() : ''}`;
}
export const formatObservation = (observation: Models.Observation) => {
    if(observation.measurementType === MeasurementType.Pulse) {
        const pulseObservation = observation as Models.PulseObservation;
        return `${resolveText('MeasurementType_Pulse')}: ${pulseObservation.bpm} ${resolveText('BPM')}`;
    }
    if(observation.measurementType === MeasurementType.BloodPressure) {
        const bloodPressureObservation = observation as Models.BloodPressureObservation;
        return `${resolveText('MeasurementType_BloodPressure')}: ${bloodPressureObservation.systolic} / ${bloodPressureObservation.diastolic}`;
    }
    if(observation.measurementType === MeasurementType.Temperature) {
        const temperatureObservation = observation as Models.TemperatureObservation;
        const formattedBodyPart = temperatureObservation.bodyPart
            ? ` (${temperatureObservation.bodyPart})`
            : '';
        return `${resolveText('MeasurementType_Temperature')}: ${temperatureObservation.value}${temperatureObservation.unit}${formattedBodyPart}`;
    }
    const genericObservation = observation as Models.GenericObservation;
    return `${observation.measurementType}: ${genericObservation.value} ${genericObservation.unit}`;
}