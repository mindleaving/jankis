import React, { useEffect, useState } from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { PatientAutocomplete } from '../PatientAutocomplete';

interface PatientParameterResponseProps {
    required?: boolean;
    parameter: Models.PatientServiceParameter;
    value?: Models.PatientServiceParameterResponse;
    onChange: (response: Models.ServiceParameterResponse) => void;
}

export const PatientParameterResponse = (props: PatientParameterResponseProps) => {

    const [ patient, setPatient ] = useState<Models.Person>();

    const parameter = props.parameter;
    const onChange = props.onChange;
    const value = props.value;
    useEffect(() => {
        if(value?.patientId === patient?.id) return;
        const response: Models.PatientServiceParameterResponse = {
            parameterName: parameter.name,
            valueType: ServiceParameterValueType.Patient,
            patientId: patient?.id ?? ''
        };
        onChange(response);
    }, [ patient, parameter ]);
    useEffect(() => {
        if(!value?.patientId) return;
        if(value.patientId === patient?.id) return;
        const loadPatient = buildLoadObjectFunc<Models.Person>(
            `api/persons/${value.patientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setPatient
        );
        loadPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ value ]);

    return (
        <PatientAutocomplete required={props.required}
            value={patient}
            onChange={setPatient}
        />
    );

}