import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { ServiceRequestsFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { DepartmentAutocomplete } from '../Autocompletes/DepartmentAutocomplete';
import { ServiceAutocomplete } from '../../../sharedHealthComponents/components/Autocompletes/ServiceAutocomplete';

interface ServiceRequestsFilterViewProps {
    filter?: ServiceRequestsFilter;
    setFilter: (filter: ServiceRequestsFilter) => void;
}

export const ServiceRequestsFilterView = (props: ServiceRequestsFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>(props.filter?.searchText ?? '');
    const [ department, setDepartment ] = useState<Models.Department>();
    const [ service, setService ] = useState<Models.Services.ServiceDefinition>();

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

    useEffect(() => {
        if(!props.filter?.serviceId) return;
        const loadService = buildLoadObjectFunc<Models.Services.ServiceDefinition>(
            `api/services/${props.filter.serviceId}`,
            {},
            resolveText('Service_CouldNotLoad'),
            setService
        );
        loadService();
    }, [ props.filter?.serviceId ]);
    
    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: ServiceRequestsFilter = {
            searchText: searchText,
            departmentId: department?.id,
            serviceId: service?.id
        };
        setFilter(filter);
    }, [ searchText, department, service, setFilter ]);
    
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
                    <DepartmentAutocomplete
                        value={department}
                        onChange={setDepartment}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Service')}</FormLabel>
                <Col>
                    <ServiceAutocomplete
                        value={service}
                        onChange={setService}
                    />
                </Col>
            </FormGroup>
        </Form>
    );

}