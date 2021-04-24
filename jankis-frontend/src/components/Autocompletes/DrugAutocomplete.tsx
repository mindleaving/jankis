import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { Autocomplete } from './Autocomplete';

interface DrugAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Drug;
    onChange: (service: Models.Drug | undefined) => void;
}

export const DrugAutocomplete = (props: DrugAutocompleteProps) => {

    const drugAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Drug>('api/drugs/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : props.value!.productName}
        </Alert>);
    }
    return (<Autocomplete
        search={drugAutocompleteRunner.search}
        displayNameSelector={x => x?.productName}
        onItemSelected={props.onChange}
    />);

}