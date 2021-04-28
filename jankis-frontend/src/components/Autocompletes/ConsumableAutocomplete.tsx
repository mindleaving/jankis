import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';
import { Autocomplete } from './Autocomplete';

interface ConsumableAutocompleteProps {
    isLoading?: boolean;
    value?: ViewModels.ConsumableViewModel;
    onChange: (item: ViewModels.ConsumableViewModel | undefined) => void;
}

export const ConsumableAutocomplete = (props: ConsumableAutocompleteProps) => {

    const serviceAutocompleteRunner = useMemo(() => new AutocompleteRunner<ViewModels.ConsumableViewModel>('api/consumables/search', 'searchText', 10), []);

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