import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDiagnosticTestCode } from '../../helpers/Formatters';

interface DiagnosticTestAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Services.DiagnosticTestDefinition;
    onChange: (testDefinition: Models.Services.DiagnosticTestDefinition | undefined) => void;
}

export const DiagnosticTestAutocomplete = (props: DiagnosticTestAutocompleteProps) => {

    const testAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Services.DiagnosticTestDefinition>('api/diagnosticTests/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : formatDiagnosticTestCode(props.value!)}
        </Alert>);
    }
    return (<Autocomplete
        search={testAutocompleteRunner.search}
        displayNameSelector={formatDiagnosticTestCode}
        onItemSelected={props.onChange}
        resetOnSelect
    />);

}