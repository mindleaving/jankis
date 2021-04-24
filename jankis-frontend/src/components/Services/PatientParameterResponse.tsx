import { ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { PatientAutocomplete } from '../Autocompletes/PatientAutocomplete';

interface PatientParameterResponseProps {
    required?: boolean;
    parameter: Models.PatientServiceParameter;
    value?: Models.PatientServiceParameterResponse;
    onChange: (response: Models.ServiceParameterResponse) => void;
}

export const PatientParameterResponse = (props: PatientParameterResponseProps) => {

    const onChange = (patient: Models.Person | undefined) => {
        if(!patient) {
            return;
        }
        const response: Models.PatientServiceParameterResponse = {
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