import { ServiceParameterValueType } from "../types/enums.d";
import { Models } from "../types/models";

export const buildParameterResponse = (parameter: Models.ServiceParameter): Models.ServiceParameterResponse => {
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
    throw new Error(`Unsupported service parameter value type '${parameter.valueType}'`);
}