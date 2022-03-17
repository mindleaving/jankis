import { PatientAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PatientAutocomplete';
import { ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface PatientParameterResponseProps {
    required?: boolean;
    parameter: Models.Services.PatientServiceParameter;
    value?: Models.Services.PatientServiceParameterResponse;
    onChange: (response: Models.Services.ServiceParameterResponse) => void;
}

export const PatientParameterResponse = (props: PatientParameterResponseProps) => {

    const onChange = (patient: Models.Person | undefined) => {
        if(!patient) {
            return;
        }
        const response: Models.Services.PatientServiceParameterResponse = {
            parameterName: props.parameter.name,
            valueType: ServiceParameterValueType.Patient,
            patient: patient
        };
        props.onChange(response);
    }

    return (
        <PatientAutocomplete required={props.required}
            value={props.value?.patient?.id ? props.value?.patient : undefined}
            onChange={onChange}
        />
    );

}