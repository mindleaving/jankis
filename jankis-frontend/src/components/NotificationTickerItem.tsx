import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { apiClient } from '../communication/ApiClient';
import { formatPerson } from '../helpers/Formatters';
import { resolveText } from '../helpers/Globalizer';
import { NotificationType } from '../types/enums.d';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router';

interface NotificationTickerItemProps {
    item: Models.Subscriptions.NotificationBase;
    onDismiss: (notificationId: string) => void;
}

export const NotificationTickerItem = (props: NotificationTickerItemProps) => {

    const history = useHistory();
    const dismiss = async (notificationId: string) => {
        try {
            await apiClient.post(`api/notifications/${notificationId}/dismiss`, {}, {});
            props.onDismiss(notificationId);
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Notification_CouldNotDismiss'));
        }
    }
    const notificationType = props.item.notificationType;
    if(notificationType === NotificationType.NewPatientEvent) {
        const patientEventNotification = props.item as Models.Subscriptions.PatientEventNotification;
        return (<Alert
            className="py-0 px-2 my-2"
            variant="info"
            dismissible
            onClose={() => dismiss(props.item.id)}
        >
            <div><small>{new Date(props.item.timestamp).toLocaleString()} {resolveText('by')} {props.item.submitter}</small></div>
            {resolveText('Notification_NewPatientEvent_Text')
                .replace('{username}', patientEventNotification.submitter.toLowerCase())
                .replace('{storageOperation}', patientEventNotification.storageOperation.toLowerCase())
                .replace('{eventType}', resolveText(`PatientEventType_${patientEventNotification.eventType}`).toLowerCase())
                .replace('{patient}', formatPerson(patientEventNotification.patient))
            } <Button variant="link" onClick={() => history.push(`/patients/${patientEventNotification.patient.id}`)}>{resolveText('Open')}</Button>
        </Alert>);
    }
    return (<Alert
        className="py-0 px-2 my-2"
        dismissible
        onClose={dismiss}
    >
        <div><small>{new Date(props.item.timestamp).toLocaleString()} {resolveText('by')} {props.item.submitter}</small></div>
        {props.item.notificationType}: {resolveText('Loading...')}
    </Alert>);

}