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

    const [ isVerified, setIsVerified ] = useState<boolean>(false);
    const [ menschId, setMenschId ] = useState<string>('');
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
                    <Button onClick={props.onNext} disabled={!isVerified}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}