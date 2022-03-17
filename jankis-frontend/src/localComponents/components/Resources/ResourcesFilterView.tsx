import React, { useEffect, useState } from 'react';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ResourcessFilter } from '../../types/frontendTypes';

interface ResourcesFilterViewProps {
    setFilter: (filter: ResourcessFilter) => void;
}

export const ResourcesFilterView = (props: ResourcesFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: ResourcessFilter = {
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