import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { DrugBrowser } from '../../components/Drugs/DrugBrowser';
import { PastMedicationForm } from '../../components/Medication/PastMedicationForm';

interface AddMedicationPageProps {}

export const AddMedicationPage = (props: AddMedicationPageProps) => {

    const { personId } = useParams();
    
    return (
        <>
            <h1>{resolveText("Medication")}</h1>
            <Tabs defaultActiveKey="future">
                <Tab eventKey="future" title={resolveText("Medication_ComingDays")}>
                    
                </Tab>
                <Tab eventKey="past" title={resolveText("Medication_PastMedication")}>
                    <PastMedicationForm personId={personId} />
                </Tab>
                <Tab eventKey="drugs" title={resolveText("Drugs")}>
                    <DrugBrowser />
                </Tab>
            </Tabs>
        </>
    );

}