import { useEffect, useState } from 'react';
import { Alert, Button, FormControl, InputGroup } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import { PatientProfileJumbotron } from '../../components/Patients/PatientProfileJumbotron';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { v4 as uuid } from 'uuid';
import { NotificationManager } from 'react-notifications';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { formatAdmission } from '../../../sharedHealthComponents/helpers/Formatters';
import { PatientDataTabControl } from '../../../sharedHealthComponents/components/Patients/PatientDataTabControl';
import { PatientActionsCard } from '../../../sharedHealthComponents/components/Patients/PatientActionsCard';
import { HealthRecordAction } from '../../../sharedHealthComponents/types/frontendTypes';

import '../../../sharedHealthComponents/styles/healthrecord.css';

interface PatientPageProps {}

export const PatientPage = (props: PatientPageProps) => {

    const { personId } = useParams();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ currentBedOccupancy, setBedOccupancy ] = useState<Models.BedOccupancy>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ selectedAdmissionId, setSelectedAdmissionId ] = useState<string>();
    const [ notes, setNotes ] = useState<Models.PatientNote[]>([]);
    const [ diagnoses, setDiagnoses ] = useState<ViewModels.DiagnosisViewModel[]>([]);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.Medication.MedicationSchedule[]>([]);
    const [ medicationDispensions, setMedicationDispensions ] = useState<Models.Medication.MedicationDispension[]>([]);
    const [ observations, setObservations ] = useState<Models.Observations.Observation[]>([]);
    const [ testResults, setTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ documents, setDocuments ] = useState<Models.PatientDocument[]>([]);
    const [ questionnaires, setQuestionnaires ] = useState<ViewModels.QuestionnaireAnswersViewModel[]>([]);
    const [ subscription, setSubscription ] = useState<Models.Subscriptions.PatientSubscription>();
    const isHistoricAdmission = selectedAdmissionId && admissions.find(x => x.id === selectedAdmissionId)?.dischargeTime;

    const loadHealthData = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
        `api/viewmodels/healthdata/${personId}`,
        {},
        resolveText('Patient_CouldNotLoad'),
        vm => {
            setProfileData(vm.profileData);
            setBedOccupancy(vm.currentBedOccupancy);
            setAdmissions(vm.admissions ?? []);
            setSelectedAdmissionId(vm.admissions.length > 0 ? vm.admissions[vm.admissions.length-1].id : undefined);
            setNotes(vm.notes ?? []);
            setDiagnoses(vm.diagnoses ?? []);
            setMedicationSchedules(vm.medicationSchedules ?? []);
            setMedicationDispensions(vm.medicationDispensions ?? []);
            setObservations(vm.observations ?? []);
            setTestResults(vm.testResults ?? []);
            setDocuments(vm.documents ?? []);
            setSubscription(vm.subscription);
            setQuestionnaires(vm.questionnaires ?? []);
        },
        () => setIsLoading(false)
    );

    useEffect(() => {
        if(!personId) {
            return;
        }
        loadHealthData();
    }, [ personId ]);

    const createNewMedicationSchedule = async () => {
        NotificationManager.info(resolveText('MedicationSchedule_Creating...'));
        const medicationSchedule: Models.Medication.MedicationSchedule = {
            id: uuid(),
            personId: personId!,
            note: '',
            isPaused: false,
            isDispendedByPatient: false,
            items: []
        };
        await buildAndStoreObject<Models.Medication.MedicationSchedule>(
            `api/medicationschedules/${medicationSchedule.id}`,
            resolveText('MedicationSchedule_SuccessfullyStored'),
            resolveText('MedicationSchedule_CouldNotStore'),
            () => medicationSchedule,
            () => setMedicationSchedules(medicationSchedules.concat(medicationSchedule))
        );
    }

    const onDiagnosisMarkedAsResolved = (diagnosisId: string) => {
        setDiagnoses(state => state.map(diagnosis => {
            if(diagnosis.id === diagnosisId) {
                return {
                    ...diagnosis,
                    hasResolved: true,
                    resolvedTimestamp: new Date()
                }
            }
            return diagnosis;
        }));
    }

    if(!personId) {
        return (<h1>{resolveText('MissingID')}</h1>);
    }
    if(isLoading || !profileData) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    const actions: HealthRecordAction[] = [
        { path: `/healthrecord/${personId}/create/note`, textResourceId: 'Action_AddNote' },
        { path: `/healthrecord/${personId}/create/observation`, textResourceId: 'Action_AddObservation' },
        { path: `/healthrecord/${personId}/create/diagnosis`, textResourceId: 'Action_AddDiagnosis' },
        { path: `/healthrecord/${personId}/nursing`, textResourceId: 'Action_AddEquipment' },
        { path: `/healthrecord/${personId}/create/testresult`, textResourceId: 'Action_AddTestResult' },
        { path: `/healthrecord/${personId}/create/document`, textResourceId: 'Action_AddDocument' },
        { path: `/healthrecord/${personId}/add/questionnaire`, textResourceId: 'Action_AddQuestionnaire' },
        { path: `/healthrecord/${personId}/order/service`, textResourceId: 'Action_OrderService' },
        { path: `/healthrecord/${personId}/nursing`, textResourceId: 'Action_Nursing' },
    ]

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
                    <PatientActionsCard 
                        personId={personId}
                        actions={actions}
                        onCommandSuccessful={loadHealthData}
                    />
                </Col>
            </Row>
            <PatientDataTabControl
                personId={personId}
                notes={notes}
                documents={documents}
                questionnaires={questionnaires}
                diagnoses={diagnoses}
                observations={observations}
                testResults={testResults}
                medicationSchedules={medicationSchedules}
                medicationDispensions={medicationDispensions}
                createNewMedicationSchedule={createNewMedicationSchedule}
                onDiagnosisMarkedAsResolved={onDiagnosisMarkedAsResolved}
            />
        </>
    );

}