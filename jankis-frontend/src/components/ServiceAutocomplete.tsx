import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../helpers/AutocompleteRunner';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { Autocomplete } from './Autocomplete';

interface ServiceAutocompleteProps {
    isLoading?: boolean;
    value?: Models.ServiceDefinition;
    onChange: (service: Models.ServiceDefinition | undefined) => void;
}

export const ServiceAutocomplete = (props: ServiceAutocompleteProps) => {

    const serviceAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.ServiceDefinition>('api/services/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : props.value!.name}
        </Alert>);
    }
    return (<Autocomplete
        search={serviceAutocompleteRunner.search}
        displayNameSelector={x => x.name}
        onItemSelected={props.onChange}
    />);

}