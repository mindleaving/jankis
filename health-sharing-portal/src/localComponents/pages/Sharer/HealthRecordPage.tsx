import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Col, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject, sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { BasicInformationBox } from '../../components/Sharer/BasicInformationBox';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { PatientDataTabControl } from '../../../sharedHealthComponents/components/Patients/PatientDataTabControl';
import { PatientActionsCard } from '../../../sharedHealthComponents/components/Patients/PatientActionsCard';
import { HealthRecordAction } from '../../../sharedHealthComponents/types/frontendTypes';
import { useParams } from 'react-router-dom';
import { HealthRecordEntryType } from '../../types/enums.d';
import { confirmUnhide } from '../../../sharedHealthComponents/helpers/HealthRecordEntryHelpers';

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

    useEffect(() => {
        if(!personId) {
            return;
        }
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
    const markHealthRecordEntryAsSeen = async (
        entryType: HealthRecordEntryType, 
        entryId: string, 
        update: Update<Models.IHealthRecordEntry>, 
        force: boolean = false) => {
        if(!force) {
            confirmUnhide(() => markHealthRecordEntryAsSeen(entryType, entryId, update, true));
            return;
        }
        await sendPostRequest(
            `api/${getControllerName(entryType)}/${entryId}/seen`,
            resolveText('HealthRecordEntry_CouldNotMarkAsSeen'),
            null
        );
        updateHealthRecordEntry(entryType, entryId, update);
    }
    const markHealthRecordEntryAsVerified = async (
        entryType: HealthRecordEntryType, 
        entryId: string, 
        update: Update<Models.IHealthRecordEntry>, 
        force: boolean = false) => {
        if(!force) {
            confirmUnhide(() => markHealthRecordEntryAsVerified(entryType, entryId, update, true));
            return;
        }
        await sendPostRequest(
            `api/${getControllerName(entryType)}/${entryId}/verified`,
            resolveText('HealthRecordEntry_CouldNotMarkAsVerified'),
            null
        );
        updateHealthRecordEntry(entryType, entryId, update);
    }
    const updateHealthRecordEntry = (entryType: HealthRecordEntryType, entryId: string, update: Update<Models.IHealthRecordEntry>) => {
        const setFunction = getSetFunction(entryType);
        if(setFunction) {
            setFunction((state: Models.IHealthRecordEntry[]) => state.map(x => {
                if(x.type === entryType && x.id === entryId) {
                    return update(x);
                }
                return x;
            }));
        }
    }
    const getSetFunction = (entryType: HealthRecordEntryType): Dispatch<SetStateAction<any>> | null => {
        switch(entryType) {
            case HealthRecordEntryType.Diagnosis:
                return setDiagnoses;
            case HealthRecordEntryType.Document:
                return setDocuments;
            case HealthRecordEntryType.Equipment:
                return null;
            case HealthRecordEntryType.Note:
                return setNotes;
            case HealthRecordEntryType.Observation:
                return setObservations;
            case HealthRecordEntryType.Questionnaire:
                return setQuestionnaires;
            case HealthRecordEntryType.TestResult:
                return setTestResults;
            default:
                throw new Error(`HealthRecordEntryType '${entryType}' has no set-function in HealthRecordPage`);
        }
    }
    const getControllerName = (entryType: HealthRecordEntryType) => {
        switch(entryType) {
            case HealthRecordEntryType.Diagnosis:
                return "diagnoses";
            case HealthRecordEntryType.Document:
                return "documents";
            case HealthRecordEntryType.Equipment:
                return "patientequipment";
            case HealthRecordEntryType.Note:
                return "patientnotes";
            case HealthRecordEntryType.Observation:
                return "observations";
            case HealthRecordEntryType.Questionnaire:
                return "questionnaires";
            case HealthRecordEntryType.TestResult:
                return "testresults";
            default:
                throw new Error(`HealthRecordEntryType '${entryType}' cannot be converted to controller name`);
        }
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
        { path: `/healthrecord/${personId}/create/testresult`, textResourceId: 'Action_AddTestResult' },
        { path: `/healthrecord/${personId}/create/document`, textResourceId: 'Action_AddDocument' },
        { path: `/healthrecord/${personId}/add/questionnaire`, textResourceId: 'Action_AddQuestionnaire' },
        { path: `/healthrecord/${personId}/order/service`, textResourceId: 'Action_OrderService' },
    ]

    return (
        <>
            <Row>
                <Col xl={6} className="mb-2">
                    <BasicInformationBox 
                        profileData={profileData}
                    />
                </Col>
                <Col xl={6}>
                    <PatientActionsCard 
                        personId={personId}
                        actions={actions} 
                        onCommandSuccessful={loadHealthData}
                    />
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
                        onDiagnosisMarkedAsResolved={onDiagnosisMarkedAsResolved}
                        onMarkAsSeen={markHealthRecordEntryAsSeen}
                    />
                </Col>
            </Row>
        </>
    );

}