import { useEffect, useState } from 'react';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../sharedCommonComponents/helpers/LoadingHelpers';

interface AccessRequestListProps { }

export const AccessRequestList = (props: AccessRequestListProps) => {

    const [ isConnecting, setIsConnecting ] = useState<boolean>(true);
    const [ isConnected, setIsConnected ] = useState<boolean>(false);
    const [ accessRequests, setAccessRequests ] = useState<Models.AccessControl.IAccessRequest[]>([]);

    const connectToHub = async () => {
        setIsConnecting(true);
        
        try {
            const hubConnection = new HubConnectionBuilder()
                .withUrl(apiClient.instance!.buildUrl('/hubs/accessrequests', {}), { accessTokenFactory: () => apiClient.instance!.accessToken ?? '' })
                .withAutomaticReconnect()
                .build();
            await hubConnection.start();
            hubConnection.on('ReceiveAccessInvite', (accessRequest: Models.AccessControl.IAccessRequest) => {
                setAccessRequests([accessRequest].concat(accessRequests));
                NotificationManager.info(resolveText("NewAccessInvite"));
            });
            hubConnection.on('ReceiveGrantedAccess', (access: Models.AccessControl.ISharedAccess) => {
                NotificationManager.info(resolveText("AccessGranted"));
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

    useEffect(() => {
        const loadAccessRequests = buildLoadObjectFunc(
            `api/accessrequests`,
            {},
            resolveText("AccessRequests_CouldNotLoad"),
            setAccessRequests
        );
        loadAccessRequests();
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
                {accessRequests.length > 0
                ? accessRequests.map(accessRequest => {
                    const id = accessRequest.id;
                    return (
                        <tr key={id}>
                            <td>{accessRequest.type}</td>
                            <td>{accessRequest.accessReceiverUsername}</td>
                            <td>{accessRequest.sharerPersonId}</td>
                            <td>
                                <Button onClick={() => navigate(`/accessinvites/${id}`)}>{resolveText("Open")}</Button>
                            </td>
                        </tr>
                    );
                })
                : <tr>
                    <td colSpan={4} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}