import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, FormControl, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { v4 as uuid } from 'uuid';
import { isAfter, isBefore } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { PatientDocumentsView } from '../../../sharedHealthComponents/components/Patients/PatientDocumentsView';
import { PatientEventsOverview } from '../../../sharedHealthComponents/components/Patients/PatientEventsOverview';
import { PatientMedicationView } from '../../../sharedHealthComponents/components/Patients/PatientMedicationView';
import { PatientNotesView } from '../../../sharedHealthComponents/components/Patients/PatientNotesView';
import { PatientObservationsView } from '../../../sharedHealthComponents/components/Patients/PatientObservationsView';
import { PatientTestResultsView } from '../../../sharedHealthComponents/components/Patients/PatientTestResultsView';
import { formatAdmission } from '../../../sharedHealthComponents/helpers/Formatters';

interface PatientPageProps {}

export const PatientPage = (props: PatientPageProps) => {

    const { patientId } = useParams();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ currentBedOccupancy, setBedOccupancy ] = useState<Models.BedOccupancy>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ selectedAdmissionId, setSelectedAdmissionId ] = useState<string>();
    const [ notes, setNotes ] = useState<Models.PatientNote[]>([]);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.Medication.MedicationSchedule[]>([]);
    const [ medicationDispensions, setMedicationDispensions ] = useState<Models.Medication.MedicationDispension[]>([]);
    const [ observations, setObservations ] = useState<Models.Observations.Observation[]>([]);
    const [ testResults, setTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ documents, setDocuments ] = useState<Models.PatientDocument[]>([]);
    const [ subscription, setSubscription ] = useState<Models.Subscriptions.PatientSubscription>();
    const isHistoricAdmission = selectedAdmissionId && admissions.find(x => x.patientId === selectedAdmissionId)?.dischargeTime;
    const navigate = useNavigate();

    useEffect(() => {
        if(!patientId) return;
        const loadPatient = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/patients/${patientId}/overviewviewmodel`,
            {},
            resolveText('Patient_CouldNotLoad'),
            vm => {
                setProfileData(vm.profileData);
                setBedOccupancy(vm.currentBedOccupancy);
                setAdmissions(vm.admissions);
                setSelectedAdmissionId(vm.admissions.length > 0 ? vm.admissions[vm.admissions.length-1].patientId : undefined);
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
    }, [ patientId ]);

    const createNewMedicationSchedule = async () => {
        NotificationManager.info(resolveText('MedicationSchedule_Creating...'));
        const now = new Date();
        const currentAdmission = admissions.find(x => isAfter(now, new Date(x.admissionTime)) && (!x.dischargeTime || isBefore(now, x.dischargeTime)));
        const medicationSchedule: Models.Medication.MedicationSchedule = {
            id: uuid(),
            patientId: patientId!,
            note: '',
            isPaused: false,
            isDispendedByPatient: false,
            items: [],
            admissionId: currentAdmission?.patientId
        };
        await buildAndStoreObject<Models.Medication.MedicationSchedule>(
            `api/medicationschedules/${medicationSchedule.patientId}`,
            resolveText('MedicationSchedule_SuccessfullyStored'),
            resolveText('MedicationSchedule_CouldNotStore'),
            () => medicationSchedule,
            () => setMedicationSchedules(medicationSchedules.concat(medicationSchedule))
        );
    }

    if(!patientId) {
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
                                <option key={admission.patientId} value={admission.patientId}>{formatAdmission(admission)}</option>
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
                <Button className="mx-1" variant="link" onClick={() => setSelectedAdmissionId(admissions[admissions.length-1].patientId)}>{resolveText('GoToLatestAdmission')}</Button>
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
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/create/note`)}>{resolveText('Action_AddNote')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/create/observation`)}>{resolveText('Action_AddObservation')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/add/medication`)}>{resolveText('Action_AddMedication')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/nursing`)}>{resolveText('Action_AddEquipment')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/create/testresult`)}>{resolveText('Action_AddTestResult')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/create/document`)}>{resolveText('Action_AddDocument')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/order/service`)}>{resolveText('Action_OrderService')}</Button>
                            <Button className="m-1" onClick={() => navigate(`/patients/${patientId}/nursing`)}>{resolveText('Action_Nursing')}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Tabs defaultActiveKey="overview">
                <Tab eventKey="overview" title={resolveText('Patient_Overview')}>
                    <PatientEventsOverview
                        events={(notes as Models.IPatientEvent[]).concat(observations).concat(documents).concat(testResults)}
                    />
                </Tab>
                <Tab eventKey="notes" title={resolveText('Patient_Notes')}>
                    <PatientNotesView notes={notes} />
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
                    <PatientTestResultsView testResults={testResults} />
                </Tab>
                <Tab eventKey="documents" title={resolveText('Patient_Documents')}>
                    <PatientDocumentsView documents={documents} />
                </Tab>
            </Tabs>
        </>
    );

}