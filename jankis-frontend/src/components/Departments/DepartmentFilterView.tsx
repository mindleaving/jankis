import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { DepartmentsFilter } from '../../types/frontendTypes';
import { RowFormGroup } from '../RowFormGroup';

interface DepartmentFilterViewProps {
    setFilter: (filter: DepartmentsFilter) => void;
}

export const DepartmentFilterView = (props: DepartmentFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');

    const setFilter = props.setFilter;
    useEffect(() => setFilter({ searchText }), [ setFilter, searchText ]);
    return (
        <Form onSubmit={e => e.preventDefault()}>
            <RowFormGroup
                label={resolveText('Search')}
                value={searchText}
                onChange={setSearchText}
            />
        </Form>
    );

}