import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { NotificationManager } from 'react-notifications';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { Models } from '../../types/models';

interface DiseaseLocksProps {
    icdCode: string;
    username?: string;
    onLockChanged: (isLockedByOtherUser: boolean) => void;
}
export const DiseaseLocks = (props: DiseaseLocksProps) => {
    const [ lock, setLock ] = useState<Models.Icd.Annotation.DiseaseLock>();

    useEffect(() => {
        const connectToHub = async () => {
            const connection = new HubConnectionBuilder()
                .withUrl(`https://${apiClient.instance!.serverAddress}:${apiClient.instance!.port}/hubs/diseaselock`)
                .withAutomaticReconnect()
                .build();
            try {
                await connection.start();
                connection.on('ReceiveLock', lock => {
                    setLock(lock);
                });
                connection.send('SubscribeToDisease', props.icdCode);
            } catch(error: any) {
                NotificationManager.error(error.message, 'Could not subscribe to locks. Other users may be editing this disease!');
            }
        }
        connectToHub();
    }, [ props.icdCode ]);
    useEffect(() => {
        if(!lock) {
            props.onLockChanged(false);
        } else if(lock.user === props.username) {
            props.onLockChanged(false);
        } else {
            props.onLockChanged(true);
        }
    }, [ props, lock ]);

    const tryCreateLock = async () => {
        if(!props.username) {
            return;
        }
        try {
            const response = await apiClient.instance!.post(`api/diseases/${props.icdCode}/lock`, { username: props.username}, {}, { handleError: false});
            if(response.status === 409) {
                NotificationManager.error("You don't have permission to unlock");
            }
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not obtain lock!');
        }
    }
    const unlock = async () => {
        if(!props.username) {
            return;
        }
        try {
            const response = await apiClient.instance!.post(`api/diseases/${props.icdCode}/unlock`, { username: props.username}, {}, { handleError: false});
            if(response.status === 409) {
                NotificationManager.error("You don't have permission to unlock");
            }
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not unlock');
        }
    }

    return (
        <Row className="align-items-center" style={{ position: 'sticky', marginBottom: 0 }}>
            <Col>
                {lock 
                ? <Alert className="m-0" variant={lock.user === props.username ? 'info' : 'danger'}>
                    {lock.user === props.username ? 'Locked by you' : `Locked by: ${lock.user}`}
                </Alert> 
                : null}
            </Col>
            <Col xs="auto">
                {props.username
                ? lock 
                    ? lock.user === props.username 
                        ? <Button variant="danger" onClick={unlock}><i className="fa fa-lock"></i> Unlock</Button> 
                        : null
                    : <Button variant="success" onClick={tryCreateLock}><i className="fa fa-unlock"></i> Lock</Button> 
                : null}
            </Col>
        </Row>
    );
}