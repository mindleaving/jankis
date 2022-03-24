import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../types/models';

interface HealthProfessionalAutocompleteProps {
    isLoading?: boolean;
    value?: Models.HealthProfessionalAccount;
    onChange: (account: Models.HealthProfessionalAccount | undefined) => void;
}

export const HealthProfessionalAutocomplete = (props: HealthProfessionalAutocompleteProps) => {

    const accountAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.HealthProfessionalAccount>('api/accounts/search/HealthProfessional', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : props.value!.username}
        </Alert>);
    }
    return (<Autocomplete
        search={accountAutocompleteRunner.search}
        displayNameSelector={x => x?.username}
        onItemSelected={props.onChange}
    />);

}