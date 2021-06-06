import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { formatDiagnosticTest } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { Autocomplete } from './Autocomplete';

interface DiagnosticTestAutocompleteProps {
    isLoading?: boolean;
    value?: Models.DiagnosticTestDefinition;
    onChange: (testDefinition: Models.DiagnosticTestDefinition | undefined) => void;
}

export const DiagnosticTestAutocomplete = (props: DiagnosticTestAutocompleteProps) => {

    const testAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.DiagnosticTestDefinition>('api/diagnosticTests/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : formatDiagnosticTest(props.value!)}
        </Alert>);
    }
    return (<Autocomplete
        search={testAutocompleteRunner.search}
        displayNameSelector={formatDiagnosticTest}
        onItemSelected={props.onChange}
        resetOnSelect
    />);

}