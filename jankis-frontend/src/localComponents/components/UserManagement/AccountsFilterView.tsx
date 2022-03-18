import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccountsFilter } from '../../types/frontendTypes';

interface AccountsFilterViewProps {
    setFilter: (filter: AccountsFilter) => void;
}

export const AccountsFilterView = (props: AccountsFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');

    const setFilter = props.setFilter;
    useEffect(() => {
        setFilter({
            searchText: searchText
        });
    }, [ setFilter, searchText ]);
    
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