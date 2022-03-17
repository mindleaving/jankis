import React from 'react';
import { Alert } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatPerson } from '../../../sharedHealthComponents/helpers/Formatters';
import { ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface ServiceParameterResponseProps {
    parameterResponse: Models.Services.ServiceParameterResponse;
}

export const ServiceParameterResponse = (props: ServiceParameterResponseProps) => {

    if(props.parameterResponse.valueType === ServiceParameterValueType.Text) {
        const textResponse = props.parameterResponse as Models.Services.TextServiceParameterResponse;
        return (<span>{textResponse.value}</span>);
    }
    if(props.parameterResponse.valueType === ServiceParameterValueType.Number) {
        const numberResponse = props.parameterResponse as Models.Services.NumberServiceParameterResponse;
        return (<span>{numberResponse.value}</span>);
    }
    if(props.parameterResponse.valueType === ServiceParameterValueType.Boolean) {
        const booleanResponse = props.parameterResponse as Models.Services.BooleanServiceParameterResponse;
        return (<span>{booleanResponse.isTrue ? resolveText('Yes') : resolveText('No')}</span>);
    }
    if(props.parameterResponse.valueType === ServiceParameterValueType.Option) {
        const optionResponse = props.parameterResponse as Models.Services.OptionsServiceParameterResponse;
        return (<span>{optionResponse.selectedOption}</span>);
    }
    if(props.parameterResponse.valueType === ServiceParameterValueType.Patient) {
        const patientResponse = props.parameterResponse as Models.Services.PatientServiceParameterResponse;
        return (<Alert variant="info">{formatPerson(patientResponse.patient)}</Alert>);
    }

    throw new Error(`Unsupported service parameter value type '${props.parameterResponse.valueType}'`);

}