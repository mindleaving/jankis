import { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { BasicInformationBox } from '../../components/HealthData/BasicInformationBox';
import UserContext from '../../contexts/UserContext';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { PatientDataTabControl } from '../../../sharedHealthComponents/components/Patients/PatientDataTabControl';
import { PatientActionsCard } from '../../../sharedHealthComponents/components/Patients/PatientActionsCard';

interface HealthRecordPageProps {}

export const HealthRecordPage = (props: HealthRecordPageProps) => {

    const user = useContext(UserContext);
    const personId = user!.profileData.id;
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ admissions, setAdmissions ] = useState<Models.Admission[]>([]);
    const [ notes, setNotes ] = useState<Models.PatientNote[]>([]);
    const [ medicationSchedules, setMedicationSchedules ] = useState<Models.Medication.MedicationSchedule[]>([]);
    const [ medicationDispensions, setMedicationDispensions ] = useState<Models.Medication.MedicationDispension[]>([]);
    const [ observations, setObservations ] = useState<Models.Observations.Observation[]>([]);
    const [ testResults, setTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ documents, setDocuments ] = useState<Models.PatientDocument[]>([]);
    
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
                setMedicationSchedules(vm.medicationSchedules);
                setMedicationDispensions(vm.medicationDispensions);
                setObservations(vm.observations);
                setTestResults(vm.testResults);
                setDocuments(vm.documents);
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

    return (
        <>
            <Row>
                <Col xl={6}>
                    <BasicInformationBox />
                </Col>
                <Col xl={6}>
                    <PatientActionsCard personId={personId} />
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col>
                    <PatientDataTabControl
                        notes={notes}
                        documents={documents}
                        observations={observations}
                        testResults={testResults}
                        medicationSchedules={medicationSchedules}
                        medicationDispensions={medicationDispensions}
                        createNewMedicationSchedule={createNewMedicationSchedule}
                    />
                </Col>
            </Row>
        </>
    );

}