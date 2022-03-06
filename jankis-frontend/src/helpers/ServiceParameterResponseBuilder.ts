import { ServiceParameterValueType, Sex } from "../types/enums.d";
import { Models } from "../types/models";

export const buildTemporaryParameterResponse = (parameter: Models.ServiceParameter): Models.ServiceParameterResponse => {
    if(parameter.valueType === ServiceParameterValueType.Text) {
        const textParameterResponse: Models.TextServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            value: ''
        };
        return textParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Number) {
        const numberParameter = parameter as Models.NumberServiceParameter;
        const numberParameterResponse: Models.NumberServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType, 
            value: numberParameter.lowerLimit ?? numberParameter.upperLimit ?? 0
        };
        return numberParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Boolean) {
        const booleanParameterResponse: Models.BooleanServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            isTrue: false
        };
        return booleanParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Option) {
        const optionParameterResponse: Models.OptionsServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: parameter.valueType,
            selectedOption: ''
        };
        return optionParameterResponse;
    }
    if(parameter.valueType === ServiceParameterValueType.Patient) {
        const patientParameterResponse: Models.PatientServiceParameterResponse = {
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