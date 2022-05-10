import React from 'react';
import { Button, Card, Col, Container, InputGroup, Row } from 'react-bootstrap';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { loadObject } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { formatAge } from '../../../sharedHealthComponents/helpers/Formatters';
import { useAppSelector } from '../../redux/store/healthRecordStore';

interface PatientProfileJumbotronProps {
    personId: string;
    bedOccupancy?: Models.BedOccupancy;
    showSubscription?: boolean
    subscription?: Models.Subscriptions.PatientSubscription;
    onSubscriptionChanged?: (subscription: Models.Subscriptions.PatientSubscription | undefined) => void;
}

export const PatientProfileJumbotron = (props: PatientProfileJumbotronProps) => {

    if(props.showSubscription && !props.onSubscriptionChanged) {
        throw new Error("When subscription is shown, the onSubscriptionChanged-method must be provided");
    }

    const profileData = useAppSelector(state => state.persons.items.find(x => x.id === props.personId));
    const firstName = profileData?.firstName ?? '';
    const lastName = profileData?.lastName ?? '';
    const birthDate = profileData?.birthDate ?? new Date();

    // TODO
    const ward = props.bedOccupancy?.department.name ?? `(${resolveText('NotAdmitted')})`;
    const room = props.bedOccupancy?.room.name ?? `(${resolveText('NotAdmitted')})`;
    const bed = props.bedOccupancy?.bedPosition ?? `(${resolveText('NotAdmitted')})`;
    const height = "172 cm";
    const weight = "68 kg";

    const isSubscribed = !!props.subscription;

    const subscribe = async () => {
        try {
            const response = await apiClient.instance!.post(`api/patients/${props.personId}/subscribe`, {}, {}, { handleError: false });
            if(!(response.ok || response.status === 209)) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            if(props.onSubscriptionChanged) {
                const subscriptionId = await response.text();
                await loadObject<Models.Subscriptions.PatientSubscription>(
                    `api/subscriptions/${subscriptionId}`,
                    {},
                    resolveText('Subscription_CouldNotLoad'),
                    subscription => {
                        props.onSubscriptionChanged!(subscription)
                    }
                );
            }
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Patient_CouldNotSubscribe'));
        }
    }
    const unsubscribe = async () => {
        try {
            await apiClient.instance!.post(`api/patients/${props.personId}/unsubscribe`, {}, {});
            if(props.onSubscriptionChanged) {
                props.onSubscriptionChanged(undefined);
            }
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Patient_CouldNotUnsubscribe'));
        }
    }

    return (
        <Card className="p-3" style={{ borderRadius: '10px' }}>
            <Card.Body>
            <Container>
                <Row>
                    <Col><h2>{firstName} {lastName}</h2></Col>
                    {props.showSubscription
                    ? <Col xs="auto">
                        <InputGroup>
                            <Button 
                                variant={isSubscribed ? 'light' : 'primary'}
                                onClick={isSubscribed ? unsubscribe : subscribe}>
                                {isSubscribed ? resolveText('Subscribed') : resolveText('Subscribe')}
                            </Button>
                        </InputGroup>
                    </Col>
                    : null}
                </Row>
                <Row className="mb-2">
                    <Col>
                        {resolveText('Patient_BirthDate')}: {new Date(birthDate).toLocaleDateString()} ({formatAge(birthDate)})
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ border: '2px solid black', width: '150px', height: '200px' }} className="text-center">
                            Image
                        </div>
                    </Col>
                    <Col>
                        <Row>
                            <Col><b>{resolveText('Ward')}</b></Col>
                            <Col>{ward}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Room')}</b></Col>
                            <Col>{room}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Bed')}</b></Col>
                            <Col>{bed}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Patient_Height')}</b></Col>
                            <Col>{height}</Col>
                        </Row>
                        <Row>
                            <Col><b>{resolveText('Patient_Weight')}</b></Col>
                            <Col>{weight}</Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            </Card.Body>
        </Card>
    );

}