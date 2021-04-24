import React, { useMemo, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { ServiceAudienceType, ServiceParameterValueType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { Autocomplete } from '../Autocompletes/Autocomplete';

interface ServiceAudienceEditFormProps {
    addAudience: (item: Models.ServiceAudience) => void;
}

export const ServiceAudienceEditForm = (props: ServiceAudienceEditFormProps) => {

    const roleAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Role>('api/roles/search', 'searchText', 10), []);
    const personsAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);

    const [ type, setType ] = useState<ServiceAudienceType>(ServiceAudienceType.Role);
    const [ selectedRole, setSelectedRole ] = useState<Models.Role>();
    const [ selectedPerson, setSelectedPerson ] = useState<Models.Person>();

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
                roleId: selectedRole!.id
            }
            audience = roleAudience;
        }else if(type === ServiceAudienceType.Person) {
            const patientAudience: Models.PersonServiceAudience = {
                type: type,
                personId: selectedPerson!.id
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
                <FormLabel>{resolveText('ServiceAudienceType_Role')}</FormLabel>
                <Autocomplete
                    search={roleAutoCompleteRunner.search}
                    displayNameSelector={x => x.name}
                    onItemSelected={setSelectedRole}
                />
            </FormGroup>
        );
    }else if(type === ServiceAudienceType.Person) {
        typeSpecificFormElements = (
            <FormGroup>
                <FormLabel>{resolveText('ServiceAudienceType_Person')}</FormLabel>
                <Autocomplete
                    search={personsAutoCompleteRunner.search}
                    displayNameSelector={x => `${x.firstName} ${x.lastName} (${x.id})`}
                    onItemSelected={setSelectedPerson}
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
                    {Object.keys(ServiceAudienceType).map(x => (
                        <option key={x} value={x}>{resolveText(`ServiceAudienceType_${x}`)}</option>
                    ))}
                </FormControl>
            </FormGroup>
            {typeSpecificFormElements}
            <Button onClick={createAudience}>{resolveText('Add')}</Button>
        </>
    );

}