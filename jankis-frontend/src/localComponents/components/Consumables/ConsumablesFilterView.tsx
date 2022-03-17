import React, { useEffect, useState } from 'react';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ConsumablesFilter } from '../../types/frontendTypes';

interface ConsumablesFilterViewProps {
    setFilter: (filter: ConsumablesFilter) => void;
}

export const ConsumablesFilterView = (props: ConsumablesFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: ConsumablesFilter = {
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