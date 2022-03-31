import { compareDesc, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Button, ButtonGroup, Card, Col, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { ObservationsForm } from '../../../sharedHealthComponents/components/Patients/ObservationsForm';
import { formatPerson, formatMeasurementType, formatObservationValue } from '../../../sharedHealthComponents/helpers/Formatters';
import { formatEquipmentMaterial } from '../../helpers/Formatters';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface PatientNursingPageProps {}

enum BodyViewType {
    Front,
    Back
}
export const PatientNursingPage = (props: PatientNursingPageProps) => {

    const { personId } = useParams();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ equipments, setEquipments ] = useState<ViewModels.AttachedEquipmentViewModel[]>([]);
    const [ observations, setObservations ] = useState<Models.Observations.Observation[]>([]);
    const [ bodyViewType, setBodyViewType ] = useState<BodyViewType>(BodyViewType.Front);
    const [ showAddEquipmentModal, setShowAddEquipmentModal] = useState<boolean>(false);
    const [ showObservationForm, setShowObservationForm ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!personId) return;
        setIsLoading(true);
        const loadPatient = buildLoadObjectFunc<ViewModels.PatientNursingViewModel>(
            `api/patients/${personId}/nursingviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            patient => {
                setProfileData(patient.profileData);
                setEquipments(patient.equipments);
                setObservations(patient.observations);
            },
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ personId ]);

    const onObservationsAdded = (newObservations: Models.Observations.Observation[]) => {
        setObservations(observations.concat(newObservations).sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp))));
        setShowObservationForm(false);
    }

    if(isLoading || !personId || !profileData) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <Row>
                <Col>
                    <Alert variant="info">
                        <Button variant="info" size="sm" className="mr-3" onClick={() => navigate(`/patients/${personId}`)}>&lt; {resolveText('BackToOverview')}</Button>
                        <b>{formatPerson(profileData)}</b>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col xs="7" lg="4">
                    <h3>{resolveText('Patient_Equipment')}</h3>
                    {equipments.map(equipment => (
                        <Card>
                            <Card.Header>{equipment.equipmentType}</Card.Header>
                            <Card.Body>
                                <h4>{resolveText('Patient_Equipment_Materials')}</h4>
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
                                onStore={onObservationsAdded}
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