import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { ObservationsForm } from '../../components/Patients/ObservationsForm';
import { formatEquipmentMaterial } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';

interface PatientNursingPageProps extends RouteComponentProps<PatientParams> {}

enum BodyViewType {
    Front,
    Back
}
export const PatientNursingPage = (props: PatientNursingPageProps) => {

    const patientId = props.match.params.patientId;

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ patient, setPatient ] = useState<ViewModels.PatientNursingViewModel>();
    const [ bodyViewType, setBodyViewType ] = useState<BodyViewType>(BodyViewType.Front);
    const [ showAddEquipmentModal, setShowAddEquipmentModal] = useState<boolean>(false);
    const [ showObservationForm, setShowObservationForm ] = useState<boolean>(false);

    useEffect(() => {
        if(!patientId) return;
        setIsLoading(true);
        const loadPatient = buildLoadObjectFunc<ViewModels.PatientNursingViewModel>(
            `api/patients/${patientId}/nursingviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setPatient,
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ patientId ]);

    if(isLoading || !patientId || !patient) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <Row>
                <Col xs="7" lg="4">
                    <h3>{resolveText('Patient_Equipment')}</h3>
                    {patient.equipments.map(equipment => (
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
                    <Card>
                        <Card.Header>{resolveText('Patient_Actions')}</Card.Header>
                        <Card.Body>
                            <Button className="m-1" onClick={() => setShowObservationForm(true)}>{resolveText('Action_AddObservation')}</Button>
                        </Card.Body>
                    </Card>
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
                                patientId={patientId}
                                admissionId={patient.currentAdmission?.id}
                                onStore={() => setShowObservationForm(false)}
                            />
                        </Card.Body>
                    </Card>
                    : null}
                </Col>
            </Row>
        </>
    );

}