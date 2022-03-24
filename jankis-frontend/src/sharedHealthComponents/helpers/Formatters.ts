import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { Sex, MeasurementType, DiagnosticTestScaleType } from '../../localComponents/types/enums.d';
import { Models } from '../../localComponents/types/models';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

export const formatPerson = (person: Models.Person) => {
    const genderSymbol = person.sex === Sex.Male ? '♂'
        : person.sex === Sex.Female ? '♀'
        : '⚥';
    return `${person.firstName} ${person.lastName} (${new Date(person.birthDate).toISOString().substring(0,10)}, ${genderSymbol})`;
}

export const formatAdmission = (admission: Models.Admission) => {
    return `${new Date(admission.admissionTime).toLocaleDateString()} - ${admission.dischargeTime ? new Date(admission.dischargeTime).toLocaleDateString() : ''}`;
}
export const formatObservationValue = (observation: Models.Observations.Observation) => {
    if(observation.measurementType === MeasurementType.Pulse) {
        const pulseObservation = observation as Models.Observations.PulseObservation;
        return `${pulseObservation.bpm} ${resolveText('BPM')}`;
    }
    if(observation.measurementType === MeasurementType.BloodPressure) {
        const bloodPressureObservation = observation as Models.Observations.BloodPressureObservation;
        return `${bloodPressureObservation.systolic} / ${bloodPressureObservation.diastolic}`;
    }
    if(observation.measurementType === MeasurementType.Temperature) {
        const temperatureObservation = observation as Models.Observations.TemperatureObservation;
        const formattedBodyPart = temperatureObservation.bodyPart
            ? ` (${temperatureObservation.bodyPart})`
            : '';
        return `${temperatureObservation.value}${temperatureObservation.unit}${formattedBodyPart}`;
    }
    const genericObservation = observation as Models.Observations.GenericObservation;
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
export const formatObservation = (observation: Models.Observations.Observation) => {
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
export const formatDrug = (drug: Models.Medication.Drug) => {
    return `${drug.productName}`;
}
export const formatReferenceRange = (testResult: Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult) => {
    if(testResult.referenceRangeStart && testResult.referenceRangeEnd) {
        return `${testResult.referenceRangeStart}-${testResult.referenceRangeEnd}`;
    }
    if(testResult.referenceRangeStart) {
        return `>${testResult.referenceRangeStart}`;
    }
    if(testResult.referenceRangeEnd) {
        return `<${testResult.referenceRangeEnd}`;
    }
    return '';
}
export const formatDiagnosticTestCode = (testDefinition: Models.Services.DiagnosticTestDefinition) => {
    let code = '';
    if(testDefinition.testCodeLoinc) {
        code += `LOINC:${testDefinition.testCodeLoinc}`;
    }
    if(testDefinition.testCodeLocal) {
        if(code !== '') code += '/';
        code += `${resolveText('Local')}:${testDefinition.testCodeLocal}`;
    }
    return `${testDefinition.name} (${code})`;
}
export const formatDiagnosticTestNameOfResult = (testResult: Models.DiagnosticTestResults.DiagnosticTestResult) => {
    let code = '';
    if(testResult.testCodeLoinc) {
        code += `LOINC:${testResult.testCodeLoinc}`;
    }
    if(testResult.testCodeLocal) {
        if(code !== '') code += '/';
        code += `${resolveText('Local')}:${testResult.testCodeLocal}`;
    }
    return `${testResult.testName} (${code})`;
}
export const formatDiagnosticTestValue = (testResult: Models.DiagnosticTestResults.DiagnosticTestResult) => {
    switch(testResult.scaleType) {
        case DiagnosticTestScaleType.Quantitative:
            const quantitativeTestResult = testResult as Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult;
            return `${quantitativeTestResult.value} ${quantitativeTestResult.unit}`;
    }
}