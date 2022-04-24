import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface DrugAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Medication.Drug;
    onChange: (drug: Models.Medication.Drug | undefined) => void;
    required?: boolean;
}

export const DrugAutocomplete = (props: DrugAutocompleteProps) => {

    const drugAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Medication.Drug>('api/drugs/search', 'searchText', 10), []);

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
        required={props.required}
    />);

}