import { LocationType, MeasurementType, ServiceAudienceType, Sex } from "../types/enums.d";
import { Models } from "../types/models";
import { resolveText } from "./Globalizer";
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { ViewModels } from "../types/viewModels";

export const formatServiceAudience = (item: ViewModels.ServiceAudienceViewModel) => {
    if(item.type === ServiceAudienceType.All) {
        return resolveText('ServiceAudienceType_All');
    }
    if(item.type === ServiceAudienceType.Role) {
        return `${resolveText('ServiceAudienceType_Role')}: ${item.role!.name}`;
    }
    if(item.type === ServiceAudienceType.Person) {
        return `${resolveText('ServiceAudienceType_Person')}: ${formatPerson(item.person!)}`;
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
export const formatObservationValue = (observation: Models.Observation) => {
    if(observation.measurementType === MeasurementType.Pulse) {
        const pulseObservation = observation as Models.PulseObservation;
        return `${pulseObservation.bpm} ${resolveText('BPM')}`;
    }
    if(observation.measurementType === MeasurementType.BloodPressure) {
        const bloodPressureObservation = observation as Models.BloodPressureObservation;
        return `${bloodPressureObservation.systolic} / ${bloodPressureObservation.diastolic}`;
    }
    if(observation.measurementType === MeasurementType.Temperature) {
        const temperatureObservation = observation as Models.TemperatureObservation;
        const formattedBodyPart = temperatureObservation.bodyPart
            ? ` (${temperatureObservation.bodyPart})`
            : '';
        return `${temperatureObservation.value}${temperatureObservation.unit}${formattedBodyPart}`;
    }
    const genericObservation = observation as Models.GenericObservation;
    if(genericObservation.unit) {
        return `${genericObservation.value} ${genericObservation.unit}`;
    }
    return genericObservation.value;
}
export const formatMeasurementType = (measurementType: string) => {
    const knownMeasurementType =  Object.keys(MeasurementType).find(x => x === measurementType);
    if(knownMeasurementType) {
        return resolveText(`MeasurementType_${measurementType}`);
    }
    return measurementType;
}
export const formatObservation = (observation: Models.Observation) => {
    return `${formatMeasurementType(observation.measurementType)}: ${formatObservationValue(observation)}`;
}
export const formatAge = (birthDate: Date) => {
    let now = new Date();
    let convertedDate = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
    const years = differenceInYears(now, convertedDate);
    if(years >= 2) {
        return `${years} ${resolveText('Years')}`;
    }
    const months = differenceInMonths(now, convertedDate);
    if(months >= 1) {
        return `${months} ${resolveText('Months')}`;
    }
    const days = differenceInDays(now, convertedDate);
    return `${days} ${resolveText('Days')}`;
}
export const formatDrug = (drug: Models.Drug) => {
    return `${drug.productName}`;
}
export const formatLocation = (location: ViewModels.LocationViewModel) => {
    switch(location.type) {
        case LocationType.Department:
            return `${resolveText(`LocationType_${location.type}`)} ${location.department?.name ?? location.id}`;
        case LocationType.Room:
            return `${resolveText(`LocationType_${location.type}`)} ${location.room?.name ?? location.id}`;
    }
    return `${resolveText(`LocationType_${location.type}`)} ${location.id}`;
}
export const formatStock = (stock: ViewModels.StockViewModel) => {
    return `${stock.name} (${resolveText('Department')} ${stock.department.name})`;
}
export const formatBed = (room: Models.Room, bedPosition: string) => {
    return `${room.name}${bedPosition}`;
}