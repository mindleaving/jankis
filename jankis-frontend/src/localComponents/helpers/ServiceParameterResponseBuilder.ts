import { ServiceParameterValueType, Sex } from "../types/enums.d";
import { Models } from "../types/models";

export const buildTemporaryParameterResponse = (parameter: Models.Services.ServiceParameter): Models.Services.ServiceParameterResponse => {
    if(parameter.valueType === ServiceParameterValueType.Text) {
        const textParameterResponse: Models.Services.TextServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            value: ''
        };
        return textParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Number) {
        const numberParameter = parameter as Models.Services.NumberServiceParameter;
        const numberParameterResponse: Models.Services.NumberServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType, 
            value: numberParameter.lowerLimit ?? numberParameter.upperLimit ?? 0
        };
        return numberParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Boolean) {
        const booleanParameterResponse: Models.Services.BooleanServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            isTrue: false
        };
        return booleanParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Option) {
        const optionParameterResponse: Models.Services.OptionsServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            selectedOption: ''
        };
        return optionParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Patient) {
        const patientParameterResponse: Models.Services.PatientServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            patient: {
                id: '',
                firstName: '',
                lastName: '',
                birthDate: new Date(),
                sex: Sex.Other,
                addresses: []
            }
        };
        return patientParameterResponse;
    }
    throw new Error(`Unsupported service parameter value type '${parameter.valueType}'`);
}