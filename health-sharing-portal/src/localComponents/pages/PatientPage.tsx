import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../sharedCommonComponents/helpers/LoadingHelpers';
import { BasicInformationBox } from '../components/HealthData/BasicInformationBox';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { isAfter, isBefore } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { buildAndStoreObject } from '../../sharedCommonComponents/helpers/StoringHelpers';
import { ViewModels } from '../types/viewModels';
import { PatientDataTabControl } from '../../sharedHealthComponents/components/Patients/PatientDataTabControl';

interface PatientPageProps {}

export const PatientPage = (props: PatientPageProps) => {

    const { patientId } = useParams();
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
        if(!patientId) return;
        const loadPatient = buildLoadObjectFunc<ViewModels.PatientOverviewViewModel>(
            `api/viewmodels/healthdata/${patientId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
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
        loadPatient();
    }, [ patientId ]);

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!profileData) {
        return (<h3>{resolveText("Patient_CouldNotLoad")}</h3>);
    }

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
            <h1>{profileData.firstName} {profileData.lastName}</h1>
            <Row>
                <Col>
                    <BasicInformationBox />
                </Col>
            </Row>
            <Row>
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