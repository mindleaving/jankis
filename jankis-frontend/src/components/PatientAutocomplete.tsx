import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../helpers/AutocompleteRunner';
import { formatPerson } from '../helpers/Formatters';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { Autocomplete } from './Autocomplete';

interface PatientAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Person;
    onChange: (patient: Models.Person | undefined) => void;
}

export const PatientAutocomplete = (props: PatientAutocompleteProps) => {

    const patientAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Person>('api/persons/search', 'searchText', 10), []);

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
    return (<Autocomplete
        search={patientAutocompleteRunner.search}
        displayNameSelector={formatPerson}
        onItemSelected={props.onChange}
    />);

}