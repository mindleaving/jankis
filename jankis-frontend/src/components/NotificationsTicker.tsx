import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, FormCheck, FormGroup, Row } from 'react-bootstrap';
import { apiClient } from '../communication/ApiClient';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { NotificationTickerItem } from './NotificationTickerItem';
import { NotificationManager } from 'react-notifications';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { buildLoadObjectFunc } from '../helpers/LoadingHelpers';

interface NotificationsTickerProps {
}

export const NotificationsTicker = (props: NotificationsTickerProps) => {

    const [ isConnecting, setIsConnecting ] = useState<boolean>(true);
    const [ isConnected, setIsConnected ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ notifications, setNotifications ] = useState<Models.Subscriptions.NotificationBase[]>([]);
    const [ includeDismissed, setIncludeDismissed ] = useState<boolean>();

    const connectToHub = async () => {
        setIsConnecting(true);
        
        try {
            const notificationsConnection = new HubConnectionBuilder()
                .withUrl(apiClient.buildUrl('/hubs/notifications', {}), { accessTokenFactory: () => apiClient.accessToken ?? '' })
                .withAutomaticReconnect()
                .build();
            await notificationsConnection.start();
            notificationsConnection.on('ReceiveNotification', (notification: Models.Subscriptions.NotificationBase) => {
                setNotifications([notification].concat(notifications));
            });
            setIsConnected(true);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Notifications_CouldNotConnect'));
            setIsConnected(false);
        } finally {
            setIsConnecting(false);
        }
    }
    useEffect(() => {
        connectToHub();
    }, []);
    useEffect(() => {   
        setIsLoading(true);
        const loadNotifications = buildLoadObjectFunc<Models.Subscriptions.NotificationBase[]>(
            'api/notifications',
            { 
                count: 30 + '', 
                includeDismissed: includeDismissed ? 'true' : 'false' 
            },
            resolveText('Notifications_CouldNotLoad'),
            setNotifications,
            () => setIsLoading(false)
        );
        loadNotifications();
    }, [ includeDismissed ]);

    const dismissNotification = (notificationId: string) => {
        setNotifications(notifications.filter(x => x.id !== notificationId));
    }

    return (
        <Card>
            <Card.Header>
                {resolveText('Notifications')}
                <Badge className="float-right" variant={isConnecting ? 'warning' : isConnected ? 'success' : 'danger'}>
                    {isConnecting ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> {resolveText('Connecting...')}</>
                    : isConnected ? resolveText('Connected')
                    : resolveText('NotConnected')}
                </Badge>
            </Card.Header>
            <Card.Body>
                {isLoading ? resolveText('Loading...')
                : notifications.length > 0
                ? notifications.map(notification => (
                    <NotificationTickerItem
                        item={notification}
                        onDismiss={dismissNotification}
                    />
                ))
                : resolveText('NoEntries')}
                <Row>
                    <Col></Col>
                    <Col xs="auto">{resolveText('IncludeDismissed')}</Col>
                    <Col xs="auto">
                        <FormCheck
                            checked={includeDismissed}
                            onChange={(e:any) => setIncludeDismissed(e.target.checked)}
                        /> 
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

}