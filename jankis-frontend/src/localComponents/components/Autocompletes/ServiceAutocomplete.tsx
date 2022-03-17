import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../types/models';

interface ServiceAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Services.ServiceDefinition;
    onChange: (service: Models.Services.ServiceDefinition | undefined) => void;
}

export const ServiceAutocomplete = (props: ServiceAutocompleteProps) => {

    const serviceAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Services.ServiceDefinition>('api/services/search', 'searchText', 10), []);

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