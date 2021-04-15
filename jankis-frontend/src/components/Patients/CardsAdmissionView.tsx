import React from 'react';
import { Accordion } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { AccordionCard } from '../AccordionCard';

interface CardsAdmissionViewProps {
    admission: Models.Admission;
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
                title={resolveText('Patient_Medication')}
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