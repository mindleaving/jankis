import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PersonsFilter } from '../../types/frontendTypes';

interface PersonsFilterViewProps {
    filter?: PersonsFilter;
    setFilter: (filter: PersonsFilter) => void;
}

let publishFilterTimer: NodeJS.Timeout;
export const PersonsFilterView = (props: PersonsFilterViewProps) => {

    const [ searchText, setSearchText]  = useState<string>(props.filter?.searchText ?? '');
    

    const setFilter = props.setFilter;
    useEffect(() => {
        if(publishFilterTimer) {
            clearTimeout(publishFilterTimer);
        }
        publishFilterTimer = setTimeout(() => {
            const filter: PersonsFilter = {
                searchText: searchText
            };
            setFilter(filter);
        }, 200);
    }, [ searchText, setFilter ]);

    return (
        <Form>
            <RowFormGroup
                label={resolveText('Search')}
                value={searchText}
                onChange={setSearchText}
            />
        </Form>
    );

}