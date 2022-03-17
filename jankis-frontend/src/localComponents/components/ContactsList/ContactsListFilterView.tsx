import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ContactsListFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface ContactsListFilterViewProps {
    setFilter: (filter: ContactsListFilter) => void;
}

export const ContactsListFilterView = (props: ContactsListFilterViewProps) => {

    const departmentAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Department>('api/departments/search', 'searchText', 10), []);
    const [ searchText, setSearchText ] = useState<string>('');
    const [ departmentId, setDepartmentId ] = useState<string>();

    const setFilter = props.setFilter;
    useEffect(() => {
        setFilter({
            searchText: searchText?.trim(), 
            departmentId: departmentId
        });
    }, [ searchText, departmentId, setFilter ]);

    return (
        <Form>
            <RowFormGroup
                label={resolveText('Search')}
                value={searchText}
                onChange={setSearchText}
            />
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Department')}</FormLabel>
                <Col>
                    <Autocomplete
                        search={departmentAutoCompleteRunner.search}
                        displayNameSelector={x => x.name}
                        onItemSelected={x => setDepartmentId(x.id)}
                    />
                </Col>
            </FormGroup>
        </Form>
    );

}