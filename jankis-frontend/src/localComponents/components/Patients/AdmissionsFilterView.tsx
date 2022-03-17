import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AdmissionsFilter } from '../../../sharedHealthComponents/types/frontendTypes';

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