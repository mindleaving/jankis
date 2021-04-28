import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { formatStock } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';
import { Autocomplete } from './Autocomplete';

interface StockAutocompleteProps {
    isLoading?: boolean;
    value?: ViewModels.StockViewModel;
    onChange: (stock: ViewModels.StockViewModel | undefined) => void;
    required?: boolean;
}

export const StockAutocomplete = (props: StockAutocompleteProps) => {

    const stockAutocompleteRunner = useMemo(() => new AutocompleteRunner<ViewModels.StockViewModel>('api/stocks/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : formatStock(props.value!)}
        </Alert>);
    }
    return (<Autocomplete required={props.required}
        search={stockAutocompleteRunner.search}
        displayNameSelector={formatStock}
        onItemSelected={props.onChange}
    />);

}