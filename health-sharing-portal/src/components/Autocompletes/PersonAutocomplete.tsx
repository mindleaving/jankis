import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { formatPerson } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { Autocomplete } from './Autocomplete';

interface PersonAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Person;
    onChange: (person: Models.Person | undefined) => void;
    required?: boolean;
}

export const PersonAutocomplete = (props: PersonAutocompleteProps) => {

    const personAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : formatPerson(props.value!)}
        </Alert>);
    }
    return (<Autocomplete required={props.required}
        search={personAutocompleteRunner.search}
        displayNameSelector={formatPerson}
        onItemSelected={props.onChange}
    />);

}