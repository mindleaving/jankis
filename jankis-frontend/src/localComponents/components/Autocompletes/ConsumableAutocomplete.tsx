import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';


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