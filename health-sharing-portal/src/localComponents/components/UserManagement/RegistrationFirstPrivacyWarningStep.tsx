import React, { useState } from 'react';
import { Row, Col, Button, FormCheck, Alert } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface RegistrationFirstPrivacyWarningStepProps {
    onPrevious: () => void;
    onNext: () => void;
}

export const RegistrationFirstPrivacyWarningStep = (props: RegistrationFirstPrivacyWarningStepProps) => {

    const [ hasConfirmed, setHasConfirmed ] = useState<boolean>(false);

    return (
        <>
            <h1>{resolveText("Registration_FirstPrivacyWarningStep_Title")}</h1>
            <Alert variant="warning">
                <strong>First warning...</strong>
                <p>
                    This website is not safe! All information you and others provide about you must be considered irrevocably public. Only provide information that you are comfortable to share with everyone on the internet.
                </p>
                <p>
                    I have put a lot of effort into building a security system that lets you control who can access your information. But this is the internet and everything that can be hacked will be hacked sooner or later.
                </p>
                <p>
                    Examples of what your data could be used for: 
                </p>
                <ul>
                    <li>Blackmailing</li>
                    <li>Rejecting health insurance</li>
                    <li>Rejecting your job application</li>
                </ul>
            </Alert>
            <FormCheck
                checked={hasConfirmed}
                onChange={(e:any) => setHasConfirmed(e.target.checked)}
                label={resolveText("Registration_ConfirmFirstPrivacyWarning")}
            />
            <Row className='mt-3'>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext} disabled={!hasConfirmed}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}