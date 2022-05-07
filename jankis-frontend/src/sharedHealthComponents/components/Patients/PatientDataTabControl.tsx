import { Tabs, Tab } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientDocumentsView } from '../Documents/PatientDocumentsView';
import { HealthRecordOverview } from './HealthRecordOverview';
import { PatientMedicationView } from '../Medication/PatientMedicationView';
import { PatientNotesView } from '../Notes/PatientNotesView';
import { PatientObservationsView } from '../Observations/PatientObservationsView';
import { PatientTestResultsView } from '../TestResults/PatientTestResultsView';
import { PatientDiagnosesView } from '../Diagnoses/PatientDiagnosesView';
import { PatientQuestionnairesView } from '../QuestionnaireAnswers/PatientQuestionnairesView';
import { PatientMedicalProceduresView } from '../MedicalProcedures/PatientMedicalProceduresView';

interface PatientDataTabControlProps {
    personId: string;
}

export const PatientDataTabControl = (props: PatientDataTabControlProps) => {

    return (
        <Tabs defaultActiveKey="overview">
            <Tab eventKey="overview" title={resolveText('Patient_Overview')}>
                <HealthRecordOverview
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="notes" title={resolveText('Patient_Notes')}>
                <PatientNotesView
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="diagnosis" title={resolveText("Patient_Diagnosis")}>
                <PatientDiagnosesView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="observations" title={resolveText('Patient_Observations')}>
                <PatientObservationsView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="medications" title={resolveText('Patient_Medications')}>
                <PatientMedicationView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="equipment" title={resolveText('Patient_Equipment')}>

            </Tab>
            <Tab eventKey="questionnaires" title={resolveText('Patient_Questionnaires')}>
                <PatientQuestionnairesView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="testResults" title={resolveText('Patient_TestResults')}>
                <PatientTestResultsView 
                    personId={props.personId} 
                />
            </Tab>
            <Tab eventKey="procedures" title={resolveText('Patient_MedicalProcedures')}>
                <PatientMedicalProceduresView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="documents" title={resolveText('Patient_Documents')}>
                <PatientDocumentsView 
                    personId={props.personId}
                />
            </Tab>
        </Tabs>
    );

}