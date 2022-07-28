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
        <Tabs defaultActiveKey="overview" className='nav-fill'>
            <Tab eventKey="overview" title={resolveText('Overview')}>
                <HealthRecordOverview
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="notes" title={resolveText('Notes')}>
                <PatientNotesView
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="diagnosis" title={resolveText("Diagnosis")}>
                <PatientDiagnosesView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="observations" title={resolveText('Observations')}>
                <PatientObservationsView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="medications" title={resolveText('Medications')}>
                <PatientMedicationView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="equipment" title={resolveText('Equipment')}>

            </Tab>
            <Tab eventKey="questionnaires" title={resolveText('Questionnaires')}>
                <PatientQuestionnairesView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="testResults" title={resolveText('TestResults')}>
                <PatientTestResultsView 
                    personId={props.personId} 
                />
            </Tab>
            <Tab eventKey="procedures" title={resolveText('MedicalProcedures')}>
                <PatientMedicalProceduresView 
                    personId={props.personId}
                />
            </Tab>
            <Tab eventKey="documents" title={resolveText('Documents')}>
                <PatientDocumentsView 
                    personId={props.personId}
                />
            </Tab>
        </Tabs>
    );

}