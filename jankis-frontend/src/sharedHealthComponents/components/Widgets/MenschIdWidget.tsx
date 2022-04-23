import { WidgetProps } from '@rjsf/core';
import { useState } from 'react';
import { Alert, Button, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MenschIdVerificationModal } from '../../modals/MenschIdVerificationModal';

export const MenschIdWidget = (props: WidgetProps) => {

    const [ showVerifyMenschIdModal, setShowVerifyMenschIdModal] = useState<boolean>(false);
    const [ isVerified, setIsVerified ] = useState<boolean>();
    const onVerified = () => {
        setIsVerified(true);
    }

    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <Row>
                <Col>
                    {isVerified
                    ? <Alert dismissible>
                        <strong>{props.value}</strong>
                    </Alert>
                    : <FormControl
                        value={props.value}
                        onChange={(e:any) => props.onChange(e.target.value)}
                    />}
                </Col>
                <Col xs="auto">
                    <Button onClick={() => setShowVerifyMenschIdModal(true)}>
                        {resolveText("Verify")}
                    </Button>
                    <MenschIdVerificationModal
                        key={props.value}
                        menschId={props.value}
                        show={showVerifyMenschIdModal}
                        onVerified={onVerified} 
                        onCloseRequested={() => setShowVerifyMenschIdModal(false)}
                    />
                </Col>
            </Row>
        </FormGroup>
    );

}