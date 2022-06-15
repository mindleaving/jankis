import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';


interface ResourceAutocompleteProps {
    isLoading?: boolean;
    value?: ViewModels.ResourceViewModel;
    onChange: (item: ViewModels.ResourceViewModel | undefined) => void;
}

export const ResourceAutocomplete = (props: ResourceAutocompleteProps) => {

    const resourceAutocompleteRunner = useMemo(() => new AutocompleteRunner<ViewModels.ResourceViewModel>('api/resources/search', 'searchText', 10), []);

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
        search={resourceAutocompleteRunner.search}
        displayNameSelector={x => x.name}
        onItemSelected={props.onChange}
    />);

}