import React, { useMemo, useState } from 'react';
import { PagedTable } from '../PagedTable';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { OrderDirection } from '../../types/frontendTypes.d';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { formatServiceAudience } from '../../helpers/Formatters';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';

interface ServicesListProps {}

export const ServicesList = (props: ServicesListProps) => {

    const history = useHistory();
    const [ services, setServices ] = useState<Models.ServiceDefinition[]>([]);
    const [ orderBy, setOrderBy ] = useState<string>('id');
    const [ orderDirection, setOrderDirection ] = useState<OrderDirection>(OrderDirection.Ascending);
    const servicesLoader = useMemo(() => new PagedTableLoader<Models.ServiceDefinition>('api/services', resolveText('Service_CouldNotLoad'), setServices), []);

    const setOrderByOrDirection = (newOrderBy: string) => {
        if(orderBy !== newOrderBy) {
            setOrderBy(newOrderBy);
            return;
        }
        setOrderDirection(orderDirection === OrderDirection.Ascending ? OrderDirection.Descending : OrderDirection.Ascending);
    }

    return (
        <PagedTable
            onPageChanged={servicesLoader.load}
            orderBy={orderBy}
            orderDirection={orderDirection}
        >
            <thead>
                <tr>
                    <th onClick={() => setOrderByOrDirection('id')}>{resolveText('Service_ID')}</th>
                    <th onClick={() => setOrderByOrDirection('name')}>{resolveText('Service_Name')}</th>
                    <th onClick={() => setOrderByOrDirection('department')}>{resolveText('Service_Department')}</th>
                    <th>{resolveText('Service_Audience')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {services.map(service => (
                    <tr>
                        <td>{service.id}</td>
                        <td>{service.name}</td>
                        <td>{service.departmentId}</td>
                        <td>{service.audience.map(formatServiceAudience).join(", ")}</td>
                        <td><Button variant="link" onClick={() => history.push(`/services/${service.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))}
            </tbody>
        </PagedTable>
    );

}