import { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { BasicInformationBox } from '../../components/HealthData/BasicInformationBox';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { PatientDataTabControl } from '../../../sharedHealthComponents/components/Patients/PatientDataTabControl';
import { PatientActionsCard } from '../../../sharedHealthComponents/components/Patients/PatientActionsCard';
import { HealthRecordAction } from '../../../sharedHealthComponents/types/frontendTypes';
import { useParams } from 'react-router-dom';

interface HealthRecordPageProps {}

export const HealthRecordPage = (props: HealthRecordPageProps) => {

    const { personId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ notes, setNotes ] = useState<Models.PatientNote[]>([]);
    const [ diagnoses, setDiagnoses ] = useState<ViewModels.DiagnosisViewModel[]>([]);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.Medication.MedicationSchedule[]>([]);
    const [ medicationDispensions, setMedicationDispensions ] = useState<Models.Medication.MedicationDispension[]>([]);
    const [ observations, setObservations ] = useState<Models.Observations.Observation[]>([]);
    const [ testResults, setTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ documents, setDocuments ] = useState<Models.PatientDocument[]>([]);
    const [ questionnaires, setQuestionnaires ] = useState<ViewModels.QuestionnaireAnswersViewModel[]>([]);
    
    useEffect(() => {
        if(!personId) return;
        const loadHealthData = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/viewmodels/healthdata/${personId}`,
            {},
            resolveText('HealthData_CouldNotLoad'),
            vm => {
                setProfileData(vm.profileData);
                setAdmissions(vm.admissions);
                setNotes(vm.notes);
                setDiagnoses(vm.diagnoses);
                setMedicationSchedules(vm.medicationSchedules);
                setMedicationDispensions(vm.medicationDispensions);
                setObservations(vm.observations);
                setTestResults(vm.testResults);
                setDocuments(vm.documents);
                setQuestionnaires(vm.questionnaires);
            },
            () => setIsLoading(false)
        );
        loadHealthData();
    }, [ personId ]);

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!profileData) {
        return (<h3>{resolveText("Patient_CouldNotLoad")}</h3>);
    }

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
        { path: `/healthrecord/${personId}/add/medication`, textResourceId: 'Action_AddMedication' },
        { path: `/healthrecord/${personId}/create/testresult`, textResourceId: 'Action_AddTestResult' },
        { path: `/healthrecord/${personId}/create/document`, textResourceId: 'Action_AddDocument' },
        { path: `/healthrecord/${personId}/add/questionnaire`, textResourceId: 'Action_AddQuestionnaire' },
        { path: `/healthrecord/${personId}/order/service`, textResourceId: 'Action_OrderService' },
    ]

    return (
        <>
            <Row>
                <Col xl={6}>
                    <BasicInformationBox />
                </Col>
                <Col xl={6}>
                    <PatientActionsCard actions={actions} />
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <PatientDataTabControl
                        personId={personId}
                        notes={notes}
                        documents={documents}
                        diagnoses={diagnoses}
                        observations={observations}
                        testResults={testResults}
                        questionnaires={questionnaires}
                        medicationSchedules={medicationSchedules}
                        medicationDispensions={medicationDispensions}
                        createNewMedicationSchedule={createNewMedicationSchedule}
                    />
                </Col>
            </Row>
        </>
    );

}