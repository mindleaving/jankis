import React from 'react';
import { Accordion } from 'react-bootstrap';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ViewModels } from '../../types/viewModels';

interface CardsAdmissionViewProps {
    admission: ViewModels.HealthRecordViewModel;
}

export const CardsAdmissionView = (props: CardsAdmissionViewProps) => {

    return (
        <Accordion>
            <AccordionCard
                title={resolveText('PreexistingConditions')}
                eventKey="preexistingConditions"
            >

            </AccordionCard>
            <AccordionCard
                title={resolveText('Medications')}
                eventKey="medication"
            >

            </AccordionCard>
            <AccordionCard
                title={resolveText('Treatments')}
                eventKey="treatments"
            >

            </AccordionCard>
            <AccordionCard
                title={resolveText('TestDiagnostics')}
                eventKey="tests"
            >

            </AccordionCard>
        </Accordion>
    );

}