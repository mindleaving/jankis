import React from 'react';
import { Accordion } from 'react-bootstrap';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';

interface CardsAdmissionViewProps {
    admission: ViewModels.PatientOverviewViewModel;
}

export const CardsAdmissionView = (props: CardsAdmissionViewProps) => {

    return (
        <Accordion>
            <AccordionCard
                title={resolveText('Patient_PreexistingConditions')}
                eventKey="preexistingConditions"
            >

            </AccordionCard>
            <AccordionCard
                title={resolveText('Patient_Medications')}
                eventKey="medication"
            >

            </AccordionCard>
            <AccordionCard
                title={resolveText('Patient_Treatments')}
                eventKey="treatments"
            >

            </AccordionCard>
            <AccordionCard
                title={resolveText('Patient_TestDiagnostics')}
                eventKey="tests"
            >

            </AccordionCard>
        </Accordion>
    );

}