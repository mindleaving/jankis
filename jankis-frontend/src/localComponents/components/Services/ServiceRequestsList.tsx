import React, { useMemo, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { ServiceRequestState } from '../../types/enums.d';
import { ServiceRequestsFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';

interface ServiceRequestsListProps {
    filter?: ServiceRequestsFilter;
}

export const ServiceRequestsList = (props: ServiceRequestsListProps) => {

    const [ requests, setRequests ] = useState<Models.Services.ServiceRequest[]>([]);

    const filter = props.filter
    const serviceRequestLoader = useMemo(() => new PagedTableLoader<Models.Services.ServiceRequest>(
        'api/servicerequests',
        resolveText('ServiceRequest_CouldNotLoad'),
        setRequests,
        filter 
    ), [filter]);
    const navigate = useNavigate();

    return (
        <PagedTable
            onPageChanged={serviceRequestLoader.load}
            hasCreateNewButton
            onCreateNew={() => navigate('/create/servicerequest')}
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
                        <td>{new Date(request.timestamps.find(x => x.newState === ServiceRequestState.Requested)!.timestamp), 'yyyy-MM-dd HH:mm')}</td>
                        <td>{request.service.name}</td>
                        <td>{request.requester}</td>
                        <td>
                            {resolveText(`ServiceRequestState_${request.state}`)}
                            {request.handlerNote
                            ? <div>
                                    <Badge bg="secondary">
                                    {resolveText('ServiceRequest_HandlerNote').toLocaleUpperCase()}: {request.handlerNote}
                                </Badge>
                            </div>: null}
                        </td>
                        <td>{request.assignedTo}</td>
                        <td>
                            <Button size="sm" onClick={() => navigate(`/servicerequests/${request.id}`)}>{resolveText('Open')}</Button>
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