import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatPerson } from '../../helpers/Formatters';

interface PatientAutocompleteProps {
    required?: boolean;
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
    return (<Autocomplete required={props.required}
        search={patientAutocompleteRunner.search}
        displayNameSelector={formatPerson}
        onItemSelected={props.onChange}
    />);

}