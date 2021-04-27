import React, { useEffect, useState } from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { StocksFilter } from '../../types/frontendTypes';
import { RowFormGroup } from '../RowFormGroup';

interface StocksFilterViewProps {
    setFilter: (filter: StocksFilter) => void;
}

export const StocksFilterView = (props: StocksFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: StocksFilter = {
            searchText: searchText
        };
        setFilter(filter);
    }, [ setFilter, searchText ]);
    
    return (
        <RowFormGroup
            label={resolveText('Search')}
            value={searchText}
            onChange={setSearchText}
        />
    );

}