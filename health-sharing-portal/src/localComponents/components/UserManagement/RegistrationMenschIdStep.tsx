import React, { useState } from 'react';
import { FormGroup, FormLabel, Row, Col, Alert, FormControl, Button } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MenschIdVerificationModal } from '../../../sharedHealthComponents/modals/MenschIdVerificationModal';
import { Models } from '../../types/models';

interface RegistrationMenschIdStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const RegistrationMenschIdStep = (props: RegistrationMenschIdStepProps) => {

    const [ isVerified, setIsVerified ] = useState<boolean>(!!props.profileData.id);
    const [ menschId, setMenschId ] = useState<string>(props.profileData.id ?? '');
    const [ showVerifyMenschIdModal, setShowVerifyMenschIdModal] = useState<boolean>(false);
    
    const onVerified = () => {
        setIsVerified(true);
        const birthDate = menschId.substring(0, 4) + '-' + menschId.substring(4, 6) + '-' + menschId.substring(6, 8);
        props.onChange(state => ({
            ...state,
            id: menschId,
            personId: menschId,
            birthDate: birthDate as any
        }));
    }
    return (
        <>
            <h1>{resolveText("Registration_MenschIdStep_Title")}</h1>
            <h3>Step 1 - Create your 웃ID</h3>
            <Alert variant="info">
                <strong>
                    If you don't have a 웃ID already:
                </strong>
                <p>
                    To create a profile you need an ID. For that I would like to present you to one of my other projects called mensch.ID (웃ID). 
                    The mensch.ID project intends to assign a unique to all humans to enable a unambiguous exchange of data about a person, e.g. a lab and the hospital. 
                    You can read more on the mensch.ID website.
                </p>
                <a href='https://mensch.id' target="_blank" className='btn btn-primary' rel="noreferrer">
                    Go to mensch.ID (new tab/window)
                </a>
            </Alert>
            <h3>Step 2 - Enter and verify your 웃ID</h3>
            <Alert variant="info">
                <p>
                    Now that you have your own 웃ID you need to enter it below and verify it.
                    To verify that you own the entered 웃ID a challenge will be sent which you can find in your mensch.ID profile under "Actions" &gt; "My challenges" using the challenge code that you will be shown in the verification dialogue.
                </p>
            </Alert>
            <FormGroup>
                <FormLabel>{resolveText("MenschID")}</FormLabel>
                <Row>
                    <Col>
                        {isVerified
                        ? <Alert variant='success' dismissible>
                            <strong>{props.profileData.id}</strong>
                        </Alert>
                        : <FormControl
                            value={menschId}
                            onChange={(e:any) => setMenschId((e.target.value as string).toUpperCase())}
                            placeholder={"YYYYMMDD-XXXXX"}
                        />}
                    </Col>
                    {!isVerified
                    ? <Col xs="auto">
                        <Button onClick={() => setShowVerifyMenschIdModal(true)} disabled={!menschId.match("^[0-9]{8}-[0-9A-Z]{5}$")}>
                            {resolveText("Verify")}
                        </Button>
                        <MenschIdVerificationModal
                            key={menschId}
                            menschId={menschId}
                            show={showVerifyMenschIdModal}
                            onVerified={onVerified} 
                            onCloseRequested={() => setShowVerifyMenschIdModal(false)}
                        />
                    </Col> 
                    : null}
                </Row>
            </FormGroup>
            <Row className='mt-3'>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext} disabled={false && !isVerified}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}