import React, { useEffect, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { DepartmentAutocomplete } from '../DepartmentAutocomplete';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { ServicesFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface ServicesFilterViewProps {
    filter?: ServicesFilter;
    setFilter: (filter: ServicesFilter) => void;
}

export const ServicesFilterView = (props: ServicesFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>(props.filter?.searchText ?? '');
    const [ department, setDepartment ] = useState<Models.Department>();

    useEffect(() => {
        if(!props.filter?.departmentId) return;
        const loadDepartment = buildLoadObjectFunc<Models.Department>(
            `api/departments/${props.filter.departmentId}`,
            {},
            resolveText('Department_CouldNotLoad'),
            setDepartment
        );
        loadDepartment();
    }, [ props.filter?.departmentId ]);

    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: ServicesFilter = {
            searchText: searchText,
            departmentId: department?.id
        };
        setFilter(filter);
    }, [ searchText, department, setFilter ]);

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
                    <DepartmentAutocomplete
                        value={department}
                        onChange={setDepartment}
                    />
                </Col>
            </FormGroup>
        </Form>
    );

} 