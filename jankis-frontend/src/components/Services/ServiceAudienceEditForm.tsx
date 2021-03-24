import React, { useMemo, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { ServiceAudienceType, ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { Autocomplete } from '../Autocomplete';

interface ServiceAudienceEditFormProps {
    addAudience: (item: Models.ServiceAudience) => void;
}

export const ServiceAudienceEditForm = (props: ServiceAudienceEditFormProps) => {

    const roleAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Role>('api/roles/search', 'searchText', 10), []);
    const employeeAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Employee>('api/employees/search', 'searchText', 10), []);
    const patientAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Patient>('api/patients/search', 'searchText', 10), []);

    const [ type, setType ] = useState<ServiceAudienceType>(ServiceAudienceType.Role);
    const [ selectedRole, setSelectedRole ] = useState<Models.Role>();
    const [ selectedEmployee, setSelectedEmployee ] = useState<Models.Employee>();
    const [ selectedPatient, setSelectedPatient ] = useState<Models.Patient>();

    const createAudience = () => {
        let audience: Models.ServiceAudience;
        if(type === ServiceAudienceType.All) {
            const allAudience: Models.AllServiceAudience = {
                type: type
            };
            audience = allAudience;
        } else if(type === ServiceAudienceType.Role) {
            const roleAudience: Models.RoleServiceAudience = {
                type: type,
                roleName: selectedRole!.id
            }
            audience = roleAudience;
        } else if(type === ServiceAudienceType.Employee) {
            const employeeAudience: Models.EmployeeServiceAudience = {
                type: type,
                employeeId: selectedEmployee!.id
            };
            audience = employeeAudience;
        } else if(type === ServiceAudienceType.Patient) {
            const patientAudience: Models.PatientServiceAudience = {
                type: type,
                patientId: selectedPatient!.id
            };
            audience = patientAudience;
        } else {
            throw new Error(`Cannot create audience for service audience type '${type}'`);
        }
        props.addAudience(audience);
    }

    let typeSpecificFormElements = null;
    if(type === ServiceAudienceType.Role) {
        typeSpecificFormElements = (
            <FormGroup>
                <FormLabel>{resolveText('Service_Audience_RoleName')}</FormLabel>
                <Autocomplete
                    search={roleAutoCompleteRunner.search}
                    displayNameSelector={x => x.name}
                    onItemSelected={setSelectedRole}
                />
            </FormGroup>
        );
    } else if(type === ServiceAudienceType.Employee) {
        typeSpecificFormElements = (
            <FormGroup>
                <FormLabel>{resolveText('Service_Audience_Employee')}</FormLabel>
                <Autocomplete
                    search={employeeAutoCompleteRunner.search}
                    displayNameSelector={x => `${x.firstName} ${x.lastName} (${x.id})`}
                    onItemSelected={setSelectedEmployee}
                />
            </FormGroup>
        );
    } else if(type === ServiceAudienceType.Patient) {
        typeSpecificFormElements = (
            <FormGroup>
                <FormLabel>{resolveText('Service_Audience_Patient')}</FormLabel>
                <Autocomplete
                    search={patientAutoCompleteRunner.search}
                    displayNameSelector={x => `${x.firstName} ${x.lastName} (${x.id})`}
                    onItemSelected={setSelectedPatient}
                />
            </FormGroup>
        );
    }

    

    return (
        <>
            <FormGroup>
                <FormLabel>{resolveText('Service_Audience_Type')}</FormLabel>
                <FormControl
                    as="select"
                    value={type}
                    onChange={(e:any) => setType(e.target.value)}
                >
                    {Object.keys(ServiceParameterValueType).map(x => (
                        <option key={x} value={x}>{resolveText(`ServiceParameterValueType_${x}`)}</option>
                    ))}
                </FormControl>
            </FormGroup>
            {typeSpecificFormElements}
            <Button onClick={createAudience}></Button>
        </>
    );

}