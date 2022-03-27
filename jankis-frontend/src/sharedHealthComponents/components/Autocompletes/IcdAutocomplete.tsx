import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface IcdAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Icd.IcdCategory;
    onChange: (service: Models.Icd.IcdCategory | undefined) => void;
}

export const IcdAutocomplete = (props: IcdAutocompleteProps) => {

    const icdAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.IcdCategory>('api/classifications/icd11', 'searchText', 10), []);

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
        search={icdAutocompleteRunner.search}
        displayNameSelector={x => x.name}
        onItemSelected={props.onChange}
    />);

}