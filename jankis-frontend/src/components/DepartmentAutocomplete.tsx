import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../helpers/AutocompleteRunner';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { Autocomplete } from './Autocomplete';

interface DepartmentAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Department;
    onChange: (department: Models.Department | undefined) => void;
    required?: boolean;
}

export const DepartmentAutocomplete = (props: DepartmentAutocompleteProps) => {

    const departmentAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Department>('api/departments/search', 'searchText', 10), []);

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
    return (<Autocomplete required={props.required}
        search={departmentAutocompleteRunner.search}
        displayNameSelector={x => x.name}
        onItemSelected={props.onChange}
    />);

}