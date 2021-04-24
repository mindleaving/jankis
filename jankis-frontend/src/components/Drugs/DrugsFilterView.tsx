import React, { useEffect, useState } from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { DrugsFilter } from '../../types/frontendTypes';
import { RowFormGroup } from '../RowFormGroup';

interface DrugsFilterViewProps {
    setFilter: (filter: DrugsFilter) => void;
}

export const DrugsFilterView = (props: DrugsFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: DrugsFilter = {
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