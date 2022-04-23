import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface MedicalProcedureAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Procedures.MedicalProcedureDefinition;
    onChange: (service: Models.Procedures.MedicalProcedureDefinition | undefined) => void;
}

export const MedicalProcedureAutocomplete = (props: MedicalProcedureAutocompleteProps) => {

    const procedureAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Procedures.MedicalProcedureDefinition>('api/medicalproceduredefinitions', 'searchText', 10), []);

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
        search={procedureAutocompleteRunner.search}
        displayNameSelector={x => x.name}
        onItemSelected={props.onChange}
    />);

}