import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';

interface DepartmentAutocompleteProps {
    isLoading?: boolean;
    value?: ViewModels.DepartmentViewModel;
    onChange: (department: ViewModels.DepartmentViewModel | undefined) => void;
    required?: boolean;
}

export const DepartmentAutocomplete = (props: DepartmentAutocompleteProps) => {

    const departmentAutocompleteRunner = useMemo(() => new AutocompleteRunner<ViewModels.DepartmentViewModel>('api/departments/search', 'searchText', 10), []);

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
    return (<>
        <Autocomplete required={props.required}
            search={departmentAutocompleteRunner.search}
            displayNameSelector={x => x.name}
            onItemSelected={props.onChange}
        />
    </>);

}