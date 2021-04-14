import React, { useEffect, useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { AccordionCard } from '../../components/AccordionCard';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Sex } from '../../types/enums.d';
import { Models } from '../../types/models';

interface PatientParams {
    patientId?: string;
}
interface PatientPageProps extends RouteComponentProps<PatientParams> { }

export const PatientPage = (props: PatientPageProps) => {

    const id = props.match.params.patientId;

    const [person, setPerson] = useState<Models.Person>();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        const loadPerson = buildLoadObjectFunc<Models.Person>(
            `api/persons/${id}`,
            {},
            resolveText('Person_CouldNotLoad'),
            setPerson,
            () => setIsLoading(false)
        );
        loadPerson();
    }, [ id ]);

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    if(!person) {
        return (<h1>{resolveText('NotFound')}</h1>);
    }

    return (
        <>
            <h1>{resolveText(person.sex === Sex.Male ? 'Patient_PatientMale' : 'Patient_PatientFemale')} {person.firstName} {person.lastName}</h1>
            <h2>{resolveText('Patient_Birthday')}: {person.birthDate.toString()}</h2>
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