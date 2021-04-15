import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { AdmissionsFilter } from '../../types/frontendTypes';
import { RowFormGroup } from '../RowFormGroup';

interface AdmissionsFilterViewProps {
    setFilter: (filter: AdmissionsFilter) => void;
}

export const AdmissionsFilterView = (props: AdmissionsFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');

    const setFilter = props.setFilter;
    useEffect(() => {
        setFilter({
            searchText: searchText?.trim()
        });
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