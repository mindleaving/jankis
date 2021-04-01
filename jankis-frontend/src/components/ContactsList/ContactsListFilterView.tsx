import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { Autocomplete } from '../Autocomplete';
import { RowFormGroup } from '../RowFormGroup';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
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