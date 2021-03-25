import React from 'react';
import { FormControl } from 'react-bootstrap';
import { ServiceParameterValueType } from '../../types/enums';
import { Models } from '../../types/models';

interface ServiceParameterResponseFormControlProps {
    parameter: Models.ServiceParameter;
    value: Models.ServiceParameterResponse;
    onChange: (parameterResponse: Models.ServiceParameterResponse) => void;
}

export const ServiceParameterResponseFormControl = (props: ServiceParameterResponseFormControlProps) => {

    if(props.parameter.valueType === ServiceParameterValueType.Text) {
        const textParameterResponse = props.value as Models.TextServiceParameterResponse;
        const buildTextParameterResponse = (value: string) => {
            const parameterResponse: Models.TextServiceParameterResponse = {
                parameterName: props.parameter.name,
                valueType: ServiceParameterValueType.Text,
                value: value
            };
            props.onChange(parameterResponse);
        }
        return (<FormControl required
            type="text"
            value={textParameterResponse.value}
            onChange={(e:any) => buildTextParameterResponse(e.target.value)}
        />);
    }

    if(props.parameter.valueType === ServiceParameterValueType.Number) {
        const numberParameter = props.parameter as Models.NumberServiceParameter;
        const numberParameterResponse = props.value as Models.NumberServiceParameterResponse;
        const buildNumberParameterResponse = (value: string) => {
            const parameterResponse: Models.NumberServiceParameterResponse = {
                parameterName: props.parameter.name,
                valueType: ServiceParameterValueType.Text,
                value: Number(value)
            };
            props.onChange(parameterResponse);
        }
        return (<FormControl required
            type="number"
            value={numberParameterResponse.value}
            min={numberParameter.lowerLimit ?? undefined}
            max={numberParameter.upperLimit ?? undefined}
            onChange={(e:any) => buildNumberParameterResponse(e.target.value)}
        />);
    }

    throw new Error(`Unsupported service parameter value type '${props.parameter.valueType}'`);

}