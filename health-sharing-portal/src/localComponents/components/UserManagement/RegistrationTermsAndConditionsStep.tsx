import React, { useState } from 'react';
import { Accordion, Button, Col, FormCheck, Row } from 'react-bootstrap';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface RegistrationTermsAndConditionsStepProps {
    onPrevious: () => void;
    onNext: () => void;
}

export const RegistrationTermsAndConditionsStep = (props: RegistrationTermsAndConditionsStepProps) => {

    const [ hasAcceptedTerms, setHasAcceptedTerms ] = useState<boolean>(false);
    const [ hasAcceptedPrivacyStatement, setHasAcceptedPrivacyStatement ] = useState<boolean>(false);

    return (
        <>
            <h1>{resolveText("Registration_TermsAndConditionsStep_Title")}</h1>
            <Accordion alwaysOpen>
                <AccordionCard
                    eventKey='terms'
                    isOpenAtCreate
                    title={resolveText("TermsAndConditions")}
                >
                    Lorem ipsum...
                </AccordionCard>
                <AccordionCard
                    eventKey='privacy'
                    isOpenAtCreate
                    title={resolveText("PrivacyStatement")}
                >
                    Lorem ipsum...
                </AccordionCard>
            </Accordion>
            <FormCheck
                label={resolveText("Registration_AcceptTermsAndConditions")}
                checked={hasAcceptedTerms}
                onChange={(e:any) => setHasAcceptedTerms(e.target.checked)}
            />
            <FormCheck
                label={resolveText("Registration_AcceptPrivacyStatement")}
                checked={hasAcceptedPrivacyStatement}
                onChange={(e:any) => setHasAcceptedPrivacyStatement(e.target.checked)}
            />

            <Row className='mt-3'>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext} disabled={!hasAcceptedTerms || !hasAcceptedPrivacyStatement}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}