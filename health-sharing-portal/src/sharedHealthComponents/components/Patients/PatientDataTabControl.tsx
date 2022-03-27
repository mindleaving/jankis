import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientDocumentsView } from './PatientDocumentsView';
import { HealthRecordOverview } from './HealthRecordOverview';
import { PatientMedicationView } from './PatientMedicationView';
import { PatientNotesView } from './PatientNotesView';
import { PatientObservationsView } from './PatientObservationsView';
import { PatientTestResultsView } from './PatientTestResultsView';
import { PatientDiagnosesView } from './PatientDiagnosesView';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { PatientQuestionnairesView } from './PatientQuestionnairesView';

interface PatientDataTabControlProps {
    personId: string;
    notes: Models.PatientNote[];
    diagnoses: ViewModels.DiagnosisViewModel[];
    observations: Models.Observations.Observation[];
    documents: Models.PatientDocument[];
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
    questionnaires: ViewModels.QuestionnaireAnswersViewModel[];
    medicationSchedules: Models.Medication.MedicationSchedule[];
    medicationDispensions: Models.Medication.MedicationDispension[];
    createNewMedicationSchedule: () => void;
    onDiagnosisMarkedAsResolved: (diagnosisId: string) => void;
}

export const PatientDataTabControl = (props: PatientDataTabControlProps) => {

    const { notes, diagnoses, observations, documents, testResults, medicationSchedules, medicationDispensions, questionnaires }  = props;

    return (
        <Tabs defaultActiveKey="overview">
            <Tab eventKey="overview" title={resolveText('Patient_Overview')}>
                <HealthRecordOverview
                    events={(notes as Models.IHealthRecordEntry[]).concat(diagnoses).concat(observations).concat(documents).concat(testResults)}
                />
            </Tab>
            <Tab eventKey="notes" title={resolveText('Patient_Notes')}>
                <PatientNotesView notes={notes} />
            </Tab>
            <Tab eventKey="diagnosis" title={resolveText("Patient_Diagnosis")}>
                <PatientDiagnosesView 
                    personId={props.personId}
                    diagnoses={diagnoses} 
                    onMarkAsResolved={props.onDiagnosisMarkedAsResolved}
                />
            </Tab>
            <Tab eventKey="observations" title={resolveText('Patient_Observations')}>
                <PatientObservationsView observations={observations} />
            </Tab>
            <Tab eventKey="medications" title={resolveText('Patient_Medications')}>
                <PatientMedicationView
                    medicationSchedules={medicationSchedules}
                    medicationDispensions={medicationDispensions}
                    onCreateNewMedicationSchedule={props.createNewMedicationSchedule}
                />
            </Tab>
            <Tab eventKey="equipment" title={resolveText('Patient_Equipment')}>

            </Tab>
            <Tab eventKey="questionnaires" title={resolveText('Patient_Questionnaires')}>
                <PatientQuestionnairesView
                    personId={props.personId}
                    questionnaires={questionnaires}
                />
            </Tab>
            <Tab eventKey="testResults" title={resolveText('Patient_TestResults')}>
                <PatientTestResultsView testResults={testResults} />
            </Tab>
            <Tab eventKey="documents" title={resolveText('Patient_Documents')}>
                <PatientDocumentsView documents={documents} />
            </Tab>
        </Tabs>
    );

}