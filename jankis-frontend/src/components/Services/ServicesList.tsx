import React, { useState } from 'react';
import { PagedTable } from '../PagedTable';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { OrderDirection, ServicesFilter } from '../../types/frontendTypes.d';
import { formatServiceAudience } from '../../helpers/Formatters';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../communication/ApiClient';

interface ServicesListProps {
    filter: ServicesFilter;
}

export const ServicesList = (props: ServicesListProps) => {

    const history = useHistory();
    const [ services, setServices ] = useState<Models.ServiceDefinition[]>([]);
    const [ orderBy, setOrderBy ] = useState<string>('id');
    const [ orderDirection, setOrderDirection ] = useState<OrderDirection>(OrderDirection.Ascending);

    const setOrderByOrDirection = (newOrderBy: string) => {
        if(orderBy !== newOrderBy) {
            setOrderBy(newOrderBy);
            return;
        }
        setOrderDirection(orderDirection === OrderDirection.Ascending ? OrderDirection.Descending : OrderDirection.Ascending);
    }
    const loadServices = async (pageIndex: number, entriesPerPage: number, orderBy?: string, orderDirection?: OrderDirection) => {
        try {
            let apiPath;
            if(props.filter?.searchText) {
                if(props.filter.departmentId) {
                    apiPath = `api/departments/${props.filter.departmentId}/services/search`;
                } else {
                    apiPath = 'api/services/search';
                }
            } else if(props.filter?.departmentId) {
                apiPath = `api/departments/${props.filter.departmentId}/services`;
            } else {
                apiPath = 'api/services';
            }
            const response = await apiClient.get(apiPath, {
                count: entriesPerPage + '',
                skip: (pageIndex * entriesPerPage) + ''
            });
            const items = await response.json() as Models.ServiceDefinition[];
            setServices(items);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Services_CouldNotLoad'));
        }
    }

    return (
        <PagedTable
            onPageChanged={loadServices}
            orderBy={orderBy}
            orderDirection={orderDirection}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/service')}
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