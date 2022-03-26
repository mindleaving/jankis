import { WidgetProps } from '@rjsf/core';
import { useEffect, useState } from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { PersonAutocomplete } from '../Autocompletes/PersonAutocomplete';

export const PersonAutocompleteWidget = (props: WidgetProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>();
    const [ person, setPerson ] = useState<Models.Person>();

    useEffect(() => {
        if(!props.value || props.value === person?.id) {
            return;
        }
        setIsLoading(true);
        const loadProfileData = buildLoadObjectFunc<Models.Person>(
            `api/persons/${props.value}`,
            {},
            resolveText('Person_CouldNotLoad'),
            setPerson,
            () => setIsLoading(false)
        );
        loadProfileData();
    }, [ props.value ]);

    useEffect(() => {
        props.onChange(person?.id);
    }, [ person ]);
    
    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <PersonAutocomplete
                isLoading={isLoading}
                value={person}
                onChange={setPerson}
            />
        </FormGroup>
    );

}