import React, { useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import { AccordionCard } from '../../components/AccordionCard';
import { resolveText } from '../../helpers/Globalizer';

interface PatientPageProps { }

export const PatientPage = (props: PatientPageProps) => {


    const [data, setData] = useState<Models.Patient>(null);

    return (
        <>
            <h1>{resolveText('Patient_PatientMale')} {data.firstName} {data.lastName}</h1>
            <h2>{resolveText('Patient_Birthday')}: {data.birthday.toString()}</h2>
            <Row>
                <Col>
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
                </Col>
                <Col>
                </Col>
            </Row>
        </>
    );

}