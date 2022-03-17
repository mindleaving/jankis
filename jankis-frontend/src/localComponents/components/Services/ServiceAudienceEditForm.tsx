import React, { useMemo, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PersonAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/PersonAutocomplete';
import { ServiceAudienceType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface ServiceAudienceEditFormProps {
    addAudience: (item: ViewModels.ServiceAudienceViewModel) => void;
}

export const ServiceAudienceEditForm = (props: ServiceAudienceEditFormProps) => {

    const roleAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Role>('api/roles/search', 'searchText', 10), []);

    const [ type, setType ] = useState<ServiceAudienceType>(ServiceAudienceType.Role);
    const [ selectedRole, setSelectedRole ] = useState<Models.Role>();
    const [ selectedPerson, setSelectedPerson ] = useState<Models.Person>();

    const createAudience = () => {
        const audience: ViewModels.ServiceAudienceViewModel = {
            type: type,
            role: type === ServiceAudienceType.Role ? selectedRole : undefined,
            person: type === ServiceAudienceType.Person ? selectedPerson : undefined
        };
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
    } else if(type === ServiceAudienceType.Person) {
        typeSpecificFormElements = (
            <FormGroup>
                <FormLabel>{resolveText('ServiceAudienceType_Person')}</FormLabel>
                <PersonAutocomplete
                    onChange={setSelectedPerson}
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