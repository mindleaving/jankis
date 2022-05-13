import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Accordion, Alert, Button, ButtonGroup, Card, Col, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ObservationsForm } from '../../../sharedHealthComponents/components/Observations/ObservationsForm';
import { formatPerson, formatMeasurementType, formatObservationValue } from '../../../sharedHealthComponents/helpers/Formatters';
import { loadObservations } from '../../../sharedHealthComponents/redux/slices/observationsSlice';
import { loadPerson } from '../../../sharedHealthComponents/redux/slices/personsSlice';
import { formatEquipmentMaterial } from '../../helpers/Formatters';
import { loadAttachedEquipments } from '../../redux/slices/attachedEquipmentsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';

interface PatientNursingPageProps {}

enum BodyViewType {
    Front,
    Back
}
export const PatientNursingPage = (props: PatientNursingPageProps) => {

    const { personId } = useParams();

    const isLoading = useAppSelector(state => state.persons.isLoading || state.attachedEquipments.isLoading || state.observations.isLoading);
    const profileData = useAppSelector(x => x.persons.items.find(x => x.id === personId));
    const equipments = useAppSelector(x => x.attachedEquipments.items.filter(x => x.personId === personId));
    const observations = useAppSelector(x => x.observations.items.filter(x => x.personId === personId));
    const [ bodyViewType, setBodyViewType ] = useState<BodyViewType>(BodyViewType.Front);
    const [ showAddEquipmentModal, setShowAddEquipmentModal] = useState<boolean>(false);
    const [ showObservationForm, setShowObservationForm ] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) {
            return;
        }
        dispatch(loadPerson({ personId }));
        dispatch(loadAttachedEquipments({ personId }));
        dispatch(loadObservations({ personId }));
    }, [ personId ]);

    if(isLoading || !personId || !profileData) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <Row>
                <Col>
                    <Alert variant="info">
                        <Button variant="info" size="sm" className="me-3" onClick={() => navigate(`/healthrecord/${personId}`)}>&lt; {resolveText('BackToOverview')}</Button>
                        <b>{formatPerson(profileData)}</b>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col xs="7" lg="4">
                    <h3>{resolveText('Equipment')}</h3>
                    {equipments.map(equipment => (
                        <Card>
                            <Card.Header>{equipment.equipmentType}</Card.Header>
                            <Card.Body>
                                <h4>{resolveText('Equipment_Materials')}</h4>
                                <li className="bulletFreeList">
                                {equipment.materialViewModels.map(material => (
                                    <ul>{formatEquipmentMaterial(material)}</ul>
                                ))}
                                </li>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button onClick={() => setShowAddEquipmentModal(true)}>{resolveText('Action_AddEquipment')}</Button>
                </Col>
                <Col xs="5" lg="3">
                    <ButtonGroup className="mb-2">
                        <Button 
                            variant={bodyViewType === BodyViewType.Front ? 'primary' : 'light'} 
                            onClick={() => setBodyViewType(BodyViewType.Front)}
                        >
                            {resolveText('Body_Front')}
                        </Button>
                        <Button 
                            variant={bodyViewType === BodyViewType.Back ? 'primary' : 'light'} 
                            onClick={() => setBodyViewType(BodyViewType.Back)}
                        >
                            {resolveText('Body_Back')}
                        </Button>
                    </ButtonGroup>
                    <div className="mb-3" style={{ background: '#ccf', height: '600px' }}>
                        Image of {BodyViewType[bodyViewType]}
                    </div>
                </Col>
                <Col lg="4">
                    <Accordion defaultActiveKey="Actions">
                        <AccordionCard
                            title={resolveText('Patient_Actions')}
                            eventKey="Actions"
                            className="my-2"
                        >
                            <Button className="m-1" onClick={() => setShowObservationForm(true)}>{resolveText('Action_AddObservation')}</Button>
                        </AccordionCard>
                    </Accordion>
                    {showObservationForm
                    ? <Card className="my-2">
                        <Card.Header>
                            <Row>
                                <Col>{resolveText('Observations_Create')}</Col>
                                <Col xs="auto">
                                    <i className="fa fa-close clickable" onClick={() => setShowObservationForm(false)} />
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <ObservationsForm
                                personId={personId}
                                onStore={() => setShowObservationForm(false)}
                            />
                        </Card.Body>
                    </Card>
                    : null}
                    <Accordion defaultActiveKey="Observations">
                        <AccordionCard
                            title={resolveText('Observations')}
                            eventKey="Observations"
                        >
                            <Table>
                                <thead>
                                    <tr>
                                        <th>{resolveText('Observation_Timestamp')}</th>
                                        <th>{resolveText('Observation_MeasurementType')}</th>
                                        <th>{resolveText('Observation_Value')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {observations.length > 0
                                        ? observations.map(observation => (
                                            <tr key={observation.id}>
                                                <td>{format(new Date(observation.timestamp), 'yyyy-MM-dd HH:mm')}</td>
                                                <td>{formatMeasurementType(observation.measurementType)}</td>
                                                <td>{formatObservationValue(observation)}</td>
                                            </tr>
                                        ))
                                        : <tr>
                                            <td colSpan={3} className="text-center">{resolveText('NoEntriesLastXDays').replace('{0}', '3')}</td>
                                        </tr>}
                                </tbody>
                            </Table>
                        </AccordionCard>
                    </Accordion>
                </Col>
            </Row>
        </>
    );

}