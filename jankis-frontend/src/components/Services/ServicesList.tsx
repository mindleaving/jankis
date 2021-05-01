import { useMemo, useState } from 'react';
import { PagedTable } from '../PagedTable';
import { resolveText } from '../../helpers/Globalizer';
import { ServicesFilter } from '../../types/frontendTypes.d';
import { formatServiceAudience } from '../../helpers/Formatters';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { deleteObject } from '../../helpers/DeleteHelpers';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { OrderDirection } from '../../types/enums.d';
import { ViewModels } from '../../types/viewModels';

interface ServicesListProps {
    filter: ServicesFilter;
}

export const ServicesList = (props: ServicesListProps) => {

    const history = useHistory();
    const [ services, setServices ] = useState<ViewModels.ServiceViewModel[]>([]);
    const [ orderBy, setOrderBy ] = useState<string>('id');
    const [ orderDirection, setOrderDirection ] = useState<OrderDirection>(OrderDirection.Ascending);

    const setOrderByOrDirection = (newOrderBy: string) => {
        if(orderBy !== newOrderBy) {
            setOrderBy(newOrderBy);
            return;
        }
        setOrderDirection(orderDirection === OrderDirection.Ascending ? OrderDirection.Descending : OrderDirection.Ascending);
    }
    const servicesLoader = useMemo(() => {
        return new PagedTableLoader<ViewModels.ServiceViewModel>(
            'api/services', 
            resolveText('Services_CouldNotLoad'),
            setServices,
            props.filter
        );
    }, [ props.filter ]);

    const deleteService = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmAlert(
                id, 
                name,
                resolveText('Service_ConfirmDelete_Title'),
                resolveText('Service_ConfirmDelete_Message'),
                () => deleteService(id, name, true)
            );
            return;
        }
        await deleteObject(
            `api/services/${id}`,
            {},
            resolveText('Service_SuccessfullyDeleted'),
            resolveText('Service_CouldNotDelete'),
            () => setServices(services.filter(x => x.id !== id))
        );
    }

    return (
        <PagedTable
            onPageChanged={servicesLoader.load}
            orderBy={orderBy}
            orderDirection={orderDirection}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/service')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th onClick={() => setOrderByOrDirection('name')}>{resolveText('Service_Name')}</th>
                    <th onClick={() => setOrderByOrDirection('department')}>{resolveText('Service_Department')}</th>
                    <th>{resolveText('Service_Audience')}</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {services.length > 0
                ? services.map(service => (
                    <tr key={service.id}>
                        <td><i className="fa fa-trash red clickable" onClick={() => deleteService(service.id, service.name)}/></td>
                        <td>{service.name}</td>
                        <td>{service.department?.name ?? service.departmentId}</td>
                        <td>{service.audienceViewModels.map(formatServiceAudience).join(", ")}</td>
                        <td><Button variant="primary" onClick={() => history.push(`/services/${service.id}/request`)}>{resolveText('Service_Request')}</Button></td>
                        <td><Button variant="link" onClick={() => history.push(`/services/${service.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={5}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}