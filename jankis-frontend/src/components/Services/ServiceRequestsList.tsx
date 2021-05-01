import React, { useMemo, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { ServiceRequestState } from '../../types/enums.d';
import { ServiceRequestsFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';

interface ServiceRequestsListProps {
    filter?: ServiceRequestsFilter;
}

export const ServiceRequestsList = (props: ServiceRequestsListProps) => {

    const [ requests, setRequests ] = useState<Models.ServiceRequest[]>([]);

    const filter = props.filter
    const serviceRequestLoader = useMemo(() => new PagedTableLoader<Models.ServiceRequest>(
        'api/servicerequests',
        resolveText('ServiceRequest_CouldNotLoad'),
        setRequests,
        filter 
    ), [filter]);
    const history = useHistory();

    return (
        <PagedTable
            onPageChanged={serviceRequestLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/servicerequest')}
        >
            <thead>
                <tr>
                    <th>{resolveText('ServiceRequest_RequestTime')}</th>
                    <th>{resolveText('Service')}</th>
                    <th>{resolveText('ServiceRequest_Requester')}</th>
                    <th>{resolveText('ServiceRequest_State')}</th>
                    <th>{resolveText('ServiceRequest_AssignedTo')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {requests.length > 0
                ? requests.map(request => (
                    <tr>
                        <td>{new Date(request.timestamps.find(x => x.newState === ServiceRequestState.Requested)!.timestamp).toLocaleString()}</td>
                        <td>{request.service.name}</td>
                        <td>{request.requester}</td>
                        <td>
                            {resolveText(`ServiceRequestState_${request.state}`)}
                            {request.handlerNote
                            ? <div>
                                    <Badge variant="secondary">
                                    {resolveText('ServiceRequest_HandlerNote').toLocaleUpperCase()}: {request.handlerNote}
                                </Badge>
                            </div>: null}
                        </td>
                        <td>{request.assignedTo}</td>
                        <td>
                            <Button size="sm" onClick={() => history.push(`/servicerequests/${request.id}`)}>{resolveText('Open')}</Button>
                        </td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={4}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}