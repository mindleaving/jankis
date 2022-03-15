import React, { useEffect, useState } from 'react';
import { apiClient } from '../communication/ApiClient';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface AccessRequestListProps {}

export const AccessRequestList = (props: AccessRequestListProps) => {

    const [ isConnecting, setIsConnecting ] = useState<boolean>(true);
    const [ isConnected, setIsConnected ] = useState<boolean>(false);
    const [ accessRequests, setAccessRequests ] = useState<Models.AccessControl.IAccessRequest[]>([]);

    const connectToHub = async () => {
        setIsConnecting(true);
        
        try {
            const hubConnection = new HubConnectionBuilder()
                .withUrl(apiClient.buildUrl('/hubs/accessrequests', {}), { accessTokenFactory: () => apiClient.accessToken ?? '' })
                .withAutomaticReconnect()
                .build();
            await hubConnection.start();
            hubConnection.on('ReceiveAccessRequest', (accessRequest: Models.AccessControl.IAccessRequest) => {
                setAccessRequests([accessRequest].concat(accessRequests));
            });
            setIsConnected(true);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('AccessRequests_CouldNotConnect'));
            setIsConnected(false);
        } finally {
            setIsConnecting(false);
        }
    }
    useEffect(() => {
        connectToHub();
    }, []);

    const navigate = useNavigate();
    return (
        <Table>
            <thead>
                <tr>
                    <th>{resolveText("AccessRequest_Type")}</th>
                    <th>{resolveText("AccessRequest_Requester")}</th>
                    <th>{resolveText("AccessRequest_Sharer")}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {accessRequests.map(accessRequest => {
                    const id = accessRequest.id;
                    return (
                        <tr key={id}>
                            <td>{accessRequest.type}</td>
                            <td>{accessRequest.requesterId}</td>
                            <td>{accessRequest.targetPersonId}</td>
                            <td>
                                <Button onClick={() => navigate(`/accessrequest/${id}`)}>{resolveText("Open")}</Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );

}