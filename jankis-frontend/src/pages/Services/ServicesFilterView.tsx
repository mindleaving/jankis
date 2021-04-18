import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { Autocomplete } from '../../components/Autocomplete';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { ServicesFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface ServicesFilterViewProps {
    filter?: ServicesFilter;
    setFilter: (filter: ServicesFilter) => void;
}

export const ServicesFilterView = (props: ServicesFilterViewProps) => {

    const departmentAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Department>('api/departments/search', 'searchText', 10), []);
    const [ searchText, setSearchText ] = useState<string>(props.filter?.searchText ?? '');
    const [ departmentId, setDepartmentId ] = useState<string | undefined>(props.filter?.departmentId);

    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: ServicesFilter = {
            searchText: searchText,
            departmentId: departmentId
        };
        setFilter(filter);
    }, [ searchText, departmentId, setFilter ]);
    return (
        <Form>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Search')}</FormLabel>
                <Col>
                    <FormControl
                        value={searchText}
                        onChange={(e:any) => setSearchText(e.target.value)}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Department')}</FormLabel>
                <Col>
                    <Autocomplete
                        search={departmentAutocompleteRunner.search}
                        displayNameSelector={x => x.name}
                        onItemSelected={x => setDepartmentId(x.id)}
                    />
                </Col>
            </FormGroup>
        </Form>
    );

} 