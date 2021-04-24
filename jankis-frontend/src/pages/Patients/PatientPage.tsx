import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, FormControl, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { PatientMedicationView } from '../../components/Patients/PatientMedicationView';
import { PatientObservationsView } from '../../components/Patients/PatientObservationsView';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { formatAdmission } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { PatientParams } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { v4 as uuid } from 'uuid';
import { isAfter, isBefore } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';

interface PatientPageProps extends RouteComponentProps<PatientParams> {}

export const PatientPage = (props: PatientPageProps) => {

    const id = props.match.params.patientId;

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ currentBedOccupancy, setBedOccupancy ] = useState<Models.BedOccupancy>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ selectedAdmissionId, setSelectedAdmissionId ] = useState<string>();
    const [ notes, setNotes ] = useState<Models.PatientNote[]>([]);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.MedicationSchedule[]>([]);
    const [ medicationDispensions, setMedicationDispensions ] = useState<Models.MedicationDispension[]>([]);
    const [ observations, setObservations ] = useState<Models.Observation[]>([]);
    const [ testResults, setTestResults ] = useState<Models.IDiagnosticTestResult[]>([]);
    const [ documents, setDocuments ] = useState<Models.PatientDocument[]>([]);
    const [ subscription, setSubscription ] = useState<Models.Subscriptions.PatientSubscription>();
    const isHistoricAdmission = selectedAdmissionId && admissions.find(x => x.id === selectedAdmissionId)?.dischargeTime;
    const history = useHistory();

    useEffect(() => {
        if(!id) return;
        const loadPatient = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${id}/overviewviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            vm => {
                setProfileData(vm.profileData);
                setBedOccupancy(vm.currentBedOccupancy);
                setAdmissions(vm.admissions);
                setSelectedAdmissionId(vm.admissions.length > 0 ? vm.admissions[vm.admissions.length-1].id : undefined);
                setNotes(vm.notes);
                setMedicationSchedules(vm.medicationSchedules);
                setMedicationDispensions(vm.medicationDispensions);
                setObservations(vm.observations);
                setTestResults(vm.testResults);
                setDocuments(vm.documents);
                setSubscription(vm.subscription);
            },
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ id ]);

    const createNewMedicationSchedule = async () => {
        NotificationManager.info(resolveText('MedicationSchedule_Creating...'));
        const now = new Date();
        const currentAdmission = admissions.find(x => isAfter(now, new Date(x.admissionTime)) && (!x.dischargeTime || isBefore(now, x.dischargeTime)));
        const medicationSchedule: Models.MedicationSchedule = {
            id: uuid(),
            patientId: id!,
            note: '',
            isPaused: false,
            isDispendedByPatient: false,
            items: [],
            admissionId: currentAdmission?.id
        };
        await buidlAndStoreObject<Models.MedicationSchedule>(
            `api/medicationschedules/${medicationSchedule.id}`,
            resolveText('MedicationSchedule_SuccessfullyStored'),
            resolveText('MedicationSchedule_CouldNotStore'),
            () => medicationSchedule,
            () => setMedicationSchedules(medicationSchedules.concat(medicationSchedule))
        );
    }

    if(!id) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }
    if(isLoading || !profileData) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <Row className="mb-1">
                <Col></Col>
                <Col xs="auto">
                    <InputGroup>
                        <Button className="mx-1">&lt;</Button>
                        <FormControl
                            as="select"
                            value={selectedAdmissionId ?? ''}
                            onChange={(e:any) => setSelectedAdmissionId(e.target.value)}
                        >
                            {admissions.length > 0 
                            ? admissions.map(admission => (
                                <option key={admission.id} value={admission.id}>{formatAdmission(admission)}</option>
                            ))
                            : <option value="" disabled>{resolveText('NoAdmissions')}</option>}
                        </FormControl>
                        <Button className="mx-1">&gt;</Button>
                    </InputGroup>
                </Col>
            </Row>
            {isHistoricAdmission
            ? <Alert style={{ position: 'sticky' }} variant="danger">
                {resolveText('HistoricAdmissionAlert')}
                <Button className="mx-1" variant="link" onClick={() => setSelectedAdmissionId(admissions[admissions.length-1].id)}>{resolveText('GoToLatestAdmission')}</Button>
            </Alert>
            : null}
            <Row>
                <Col lg={6}>
                    <PatientProfileJumbotron
                        profileData={profileData}
                        bedOccupancy={currentBedOccupancy}
                        showSubscription
                        subscription={subscription}
                        onSubscriptionChanged={setSubscription}
                    />
                </Col>
                <Col lg={6}>
                    <Card>
                        <Card.Header>{resolveText('Patient_Actions')}</Card.Header>
                        <Card.Body>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/note`)}>{resolveText('Action_AddNote')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/observation`)}>{resolveText('Action_AddObservation')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/add/medication`)}>{resolveText('Action_AddMedication')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/add/equipment`)}>{resolveText('Action_AddEquipment')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/testresult`)}>{resolveText('Action_AddTestResult')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/create/document`)}>{resolveText('Action_AddDocument')}</Button>
                            <Button className="m-1" onClick={() => history.push(`/patients/${id}/order/service`)}>{resolveText('Action_OrderService')}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Tabs defaultActiveKey="overview">
                <Tab eventKey="overview" title={resolveText('Patient_Overview')}>

                </Tab>
                <Tab eventKey="notes" title={resolveText('Patient_Notes')}>

                </Tab>
                <Tab eventKey="observations" title={resolveText('Patient_Observations')}>
                    <PatientObservationsView observations={observations} />
                </Tab>
                <Tab eventKey="medications" title={resolveText('Patient_Medications')}>
                    <PatientMedicationView
                        medicationSchedules={medicationSchedules}
                        medicationDispensions={medicationDispensions}
                        onCreateNewMedicationSchedule={createNewMedicationSchedule}
                    />
                </Tab>
                <Tab eventKey="equipment" title={resolveText('Patient_Equipment')}>

                </Tab>
                <Tab eventKey="testResults" title={resolveText('Patient_TestResults')}>

                </Tab>
                <Tab eventKey="documents" title={resolveText('Patient_Documents')}>

                </Tab>
            </Tabs>
        </>
    );

}