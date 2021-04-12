import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { EmployeesFilter } from '../../types/frontendTypes';
import { RowFormGroup } from '../RowFormGroup';

interface EmployeesFilterViewProps {
    setFilter: (filter: EmployeesFilter) => void;
}

export const EmployeesFilterView = (props: EmployeesFilterViewProps) => {

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