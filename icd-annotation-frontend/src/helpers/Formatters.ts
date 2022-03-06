import { Models } from "../types/models";
import * as Enums from "../types/enums.d";

export const formatIncidenceDataPoint = (dataPoint: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint) => {
    let str = `${dataPoint.incidence}/100.000/year (${dataPoint.location.name})`;
    if(dataPoint.sex && dataPoint.sex !== Enums.Sex.Both) {
        str += `, ${dataPoint.sex}`;
    }
    if(dataPoint.ageRange) {
        str += `, Age: ${dataPoint.ageRange.from}-${dataPoint.ageRange.to}`;
    }
    if(dataPoint.timeOfYear) {
        str += `, ${dataPoint.timeOfYear.join(', ')}`; 
    }
    return str;
}
export const formatPrevalenceDataPoint = (dataPoint: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint) => {
    let str = `${dataPoint.prevalence}/100.000 (${dataPoint.location.name})`;
    if(dataPoint.sex && dataPoint.sex !== Enums.Sex.Both) {
        str += `, ${dataPoint.sex}`;
    }
    if(dataPoint.ageRange) {
        str += `, Age: ${dataPoint.ageRange.from}-${dataPoint.ageRange.to}`;
    }
    return str;
}

export const formatMortalityDataPoint = (dataPoint: Models.Icd.Annotation.Epidemiology.MortalityDataPoint) => {
    let str = `${(dataPoint.mortality/1000).toPrecision(2)}% after ${dataPoint.yearsAfterDiagnosis} years`;
    if(dataPoint.sex && dataPoint.sex !== Enums.Sex.Both) {
        str += `, ${dataPoint.sex}`;
    }
    if(dataPoint.ageRange) {
        str += `, Age: ${dataPoint.ageRange.from}-${dataPoint.ageRange.to}`;
    }
    return str;
}

export const formatBodyStructure = (bodyStructure: Models.Symptoms.BodyStructure) => {
    return `${bodyStructure.name}`;
}
export const formatDiagnosticCriteria = (diagnosticCriteria: Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria) => {
    let str = `${diagnosticCriteria.diagnosticTestName}: `;
    switch(diagnosticCriteria.scaleType) {
        case Enums.DiagnosticTestScaleType.Document:
        case Enums.DiagnosticTestScaleType.Freetext:
            str += `(${diagnosticCriteria.scaleType})`;
            break;
        case Enums.DiagnosticTestScaleType.Nominal:
            const nominalCriteria = diagnosticCriteria as Models.Icd.Annotation.Diagnostics.NominalDiagnosticCriteria;
            str += nominalCriteria.expectedResponses.join(', ');
            break;
        case Enums.DiagnosticTestScaleType.Ordinal:
            const ordinalCriteria = diagnosticCriteria as Models.Icd.Annotation.Diagnostics.OrdinalDiagnosticCriteria;
            str += ordinalCriteria.expectedResponses.join(', ');
            break;
        case Enums.DiagnosticTestScaleType.OrdinalOrQuantitative:
            const ordinalQuantativeCriteria = diagnosticCriteria as Models.Icd.Annotation.Diagnostics.OrdinalQuantativeDiagnosticCriteria;
            str += formatQuantativeDiagnosticCriteriaRange(ordinalQuantativeCriteria);
            str += ' or ' + ordinalQuantativeCriteria.expectedResponses.join(', ');
            break;
        case Enums.DiagnosticTestScaleType.Quantitative:
            const quantativeCriteria = diagnosticCriteria as Models.Icd.Annotation.Diagnostics.QuantativeDiagnosticCriteria;
            str += formatQuantativeDiagnosticCriteriaRange(quantativeCriteria);
            break;
        case Enums.DiagnosticTestScaleType.Set:
            const setCriteria = diagnosticCriteria as Models.Icd.Annotation.Diagnostics.SetDiagnosticCriteria;
            str += setCriteria.expectedResponses.join(', ');
            break;
    }
    return str;
}
const formatQuantativeDiagnosticCriteriaRange = (quantativeDiagnosticCriteria: Models.Icd.Annotation.Diagnostics.QuantativeDiagnosticCriteria | Models.Icd.Annotation.Diagnostics.OrdinalQuantativeDiagnosticCriteria) => {
    const rangeStart = quantativeDiagnosticCriteria.rangeStart;
    const rangeEnd = quantativeDiagnosticCriteria.rangeEnd;
    if(rangeStart && rangeEnd) {
        return `${rangeStart} to ${rangeEnd}`;
    }
    if(rangeStart) {
        return `>${rangeStart}`;
    }
    if(rangeEnd) {
        return `<${rangeEnd}`;
    }
    return ''; // Should never happen, but this isn't the place to fuss about it if range is not properly set
}