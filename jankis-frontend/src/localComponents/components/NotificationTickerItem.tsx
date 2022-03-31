import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { NotificationType } from '../types/enums.d';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { formatDate, formatPerson } from '../../sharedHealthComponents/helpers/Formatters';

interface NotificationTickerItemProps {
    item: Models.Subscriptions.NotificationBase;
    onDismiss: (notificationId: string) => void;
}

export const NotificationTickerItem = (props: NotificationTickerItemProps) => {

    const navigate = useNavigate();
    const dismiss = async (notificationId: string) => {
        try {
            await apiClient.instance!.post(`api/notifications/${notificationId}/dismiss`, {}, {});
            props.onDismiss(notificationId);
        } catch(error: any) {
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
            <div><small>{formatDate(new Date(props.item.timestamp))} {resolveText('by')} {props.item.submitter}</small></div>
            {resolveText('Notification_NewHealthRecordEntry_Text')
                .replace('{username}', patientEventNotification.submitter.toLowerCase())
                .replace('{storageOperation}', patientEventNotification.storageOperation.toLowerCase())
                .replace('{eventType}', resolveText(`HealthRecordEntryType_${patientEventNotification.eventType}`).toLowerCase())
                .replace('{patient}', formatPerson(patientEventNotification.patient))
            } <Button variant="link" onClick={() => navigate(`/healthrecord/${patientEventNotification.patient.id}`)}>{resolveText('Open')}</Button>
        </Alert>);
    }
    return (<Alert
        className="py-0 px-2 my-2"
        dismissible
        onClose={dismiss}
    >
        <div><small>{formatDate(new Date(props.item.timestamp))} {resolveText('by')} {props.item.submitter}</small></div>
        {props.item.notificationType}: {resolveText('Loading...')}
    </Alert>);

}