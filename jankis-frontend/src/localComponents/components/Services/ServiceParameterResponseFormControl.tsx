import React from 'react';
import { FormCheck, FormControl } from 'react-bootstrap';
import { ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { PatientParameterResponse } from './PatientParameterResponse';

interface ServiceParameterResponseFormControlProps {
    parameter: Models.Services.ServiceParameter;
    value: Models.Services.ServiceParameterResponse;
    onChange: (parameterResponse: Models.Services.ServiceParameterResponse) => void;
}

export const ServiceParameterResponseFormControl = (props: ServiceParameterResponseFormControlProps) => {

    if(props.parameter.valueType === ServiceParameterValueType.Text) {
        const textParameterResponse = props.value as Models.Services.TextServiceParameterResponse;
        const buildTextParameterResponse = (value: string) => {
            const parameterResponse: Models.Services.TextServiceParameterResponse = {
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
        const numberParameter = props.parameter as Models.Services.NumberServiceParameter;
        const numberParameterResponse = props.value as Models.Services.NumberServiceParameterResponse;
        const buildNumberParameterResponse = (value: string) => {
            const parameterResponse: Models.Services.NumberServiceParameterResponse = {
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

    if(props.parameter.valueType === ServiceParameterValueType.Boolean) {
        const booleanParameterResponse = props.value as Models.Services.BooleanServiceParameterResponse;
        const buildBooleanParameterResponse = (isTrue: boolean) => {
            const parameterResponse: Models.Services.BooleanServiceParameterResponse = {
                parameterName: props.parameter.name,
                valueType: ServiceParameterValueType.Boolean,
                isTrue: isTrue
            };
            props.onChange(parameterResponse);
        }
        return (<FormCheck required
            checked={booleanParameterResponse.isTrue}
            onChange={(e:any) => buildBooleanParameterResponse(e.target.checked)}
        />);
    }

    if(props.parameter.valueType === ServiceParameterValueType.Option) {
        const optionParameter = props.parameter as Models.Services.OptionsServiceParameter;
        const optionParameterResponse = props.value as Models.Services.OptionsServiceParameterResponse;
        const buildOptionsParameterResponse = (selectedOption: string) => {
            const parameterResponse: Models.Services.OptionsServiceParameterResponse = {
                parameterName: props.parameter.name,
                valueType: ServiceParameterValueType.Option,
                selectedOption: selectedOption
            };
            props.onChange(parameterResponse);
        }
        return (<FormControl
            as="select"
            value={optionParameterResponse.selectedOption}
            onChange={(e:any) => buildOptionsParameterResponse(e.target.value)}
        >
            {optionParameter.options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </FormControl>);
    }

    if(props.parameter.valueType === ServiceParameterValueType.Patient) {
        const patientParameterResponse = props.value as Models.Services.PatientServiceParameterResponse;
        return (
            <PatientParameterResponse required
                parameter={props.parameter}
                value={patientParameterResponse}
                onChange={props.onChange}
            />
        )
    }

    throw new Error(`Unsupported service parameter value type '${props.parameter.valueType}'`);

}