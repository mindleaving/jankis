import React, { useMemo } from 'react';
import { AutocompleteRunner } from '../helpers/AutocompleteRunner';
import { Autocomplete } from './Autocomplete';

interface MemoryFormControlProps {
    context: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minSearchTextLength?: number;
    required?: boolean;
}

export const MemoryFormControl = (props: MemoryFormControlProps) => {

    const autocompleteRunner = useMemo(() => new AutocompleteRunner<string>(`api/autocomplete/${props.context}`, 'searchText', 10), [ props.context ]);
    return (
        <Autocomplete required={props.required}
            search={autocompleteRunner.search}
            displayNameSelector={x => x}
            onItemSelected={props.onChange}
            onChange={props.onChange}
            placeholder={props.placeholder}
            minSearchTextLength={props.minSearchTextLength}
        />
    );

}