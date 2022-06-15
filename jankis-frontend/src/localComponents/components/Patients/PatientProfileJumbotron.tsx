import { Button, Card, Col, Container, InputGroup, Row } from 'react-bootstrap';
import { Models } from '../../types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatAge } from '../../../sharedHealthComponents/helpers/Formatters';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';
import { isAfter, isBefore } from 'date-fns';
import { SubscriptionObjectType } from '../../types/enums';
import { subscribeToPerson, unsubscribeFromPerson } from '../../redux/slices/subscriptionsSlice';

interface PatientProfileJumbotronProps {
    personId: string;
    showSubscription?: boolean
}

export const PatientProfileJumbotron = (props: PatientProfileJumbotronProps) => {

    const profileData = useAppSelector(state => state.persons.items.find(x => x.id === props.personId));
    const firstName = profileData?.firstName ?? '';
    const lastName = profileData?.lastName ?? '';
    const birthDate = profileData?.birthDate ?? new Date();

    const now = new Date();
    const isCurrentBedOccupancy = (x: Models.BedOccupancy, personId: string, now: Date) => {
        if(!x.patient || x.patient.personId !== personId) {
            return false;
        }
        if(isBefore(now, x.startTime)) {
            return false;
        }
        if(x.endTime && isAfter(now, x.endTime)) {
            return false;
        }
        return true;
    }
    const bedOccupancy = useAppSelector(state => state.bedOccupancies.items.find(x => isCurrentBedOccupancy(x, props.personId, now)));
    const ward = bedOccupancy?.department.name ?? `(${resolveText('NotAdmitted')})`;
    const room = bedOccupancy?.room.name ?? `(${resolveText('NotAdmitted')})`;
    const bed = bedOccupancy?.bedPosition ?? `(${resolveText('NotAdmitted')})`;
    const height = "172 cm";
    const weight = "68 kg";

    const subscription = useAppSelector(state => state.subscriptions.items
        .filter(x => x.type === SubscriptionObjectType.Patient)
        .map(x => x as Models.Subscriptions.PatientSubscription)
        .find(x => x.personId === props.personId));
    const isSubscribed = !!subscription;

    const dispatch = useAppDispatch();
    const subscribe = () => {
        dispatch(subscribeToPerson(props.personId));
    }
    const unsubscribe = () => {
        dispatch(unsubscribeFromPerson(props.personId));
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