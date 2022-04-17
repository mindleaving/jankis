import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../sharedCommonComponents/helpers/StoringHelpers';
import { Models } from '../types/models';
import { ViewModels } from '../types/viewModels';
import { v4 as uuid } from 'uuid';
import { SharedAccessType } from '../types/enums.d';

interface EmergencyPageProps {
    onNewAccessToken: (authenticationResult: Models.AuthenticationResult) => void;
    onGuestLogin: (guestAccount: ViewModels.GuestViewModel, redirectUrl?: string) => void;
}

export const EmergencyPage = (props: EmergencyPageProps) => {

    const { emergencyToken } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [ isEstablishingAccess, setIsEstabilishingAccess ] = useState<boolean>();

    const onEmergencyGuestAccess = async (response: Response) => {
        const vm = await response.json() as ViewModels.GuestEmergencyAccessViewModel;
        const redirectUrl = `/healthrecord/${vm.accessInfo.sharerPersonId}`;
        sessionStorage.setItem("emergencyPersonId", vm.accessInfo.sharerPersonId);
        props.onNewAccessToken(vm.user.authenticationResult);
        props.onGuestLogin(vm.user, redirectUrl);
    }
    const establishGuestAccess = async () => {
        setIsEstabilishingAccess(true);
        const guestEmergencyAccessRequest: Models.AccessControl.EmergencyAccessRequest = {
            id: uuid(),
            type: SharedAccessType.Emergency,
            accessReceiverUsername: "guest",
            createdTimestamp: new Date(),
            emergencyToken: emergencyToken,
            isCompleted: false
        };
        await sendPostRequest(
            `api/accessrequests/guest/create/emergency`,
            resolveText("Emergency_CouldNotEstablishGuestAccess"),
            guestEmergencyAccessRequest,
            onEmergencyGuestAccess,
            () => setIsEstabilishingAccess(false)
        );
    }

    if(!emergencyToken) {
        return (<h3>{resolveText("Emergency_NoToken")}</h3>);
    }

    return (
        <>
            <h1>{resolveText("Emergency")}</h1>
            <Row className='my-2'>
                <Col className='text-center'>
                    <Button 
                        onClick={() => navigate(`/login/healthprofessional?redirectUrl=${location.pathname}`)}
                    >
                        {resolveText("LoginHealthProfessional")}
                    </Button>
                </Col>
            </Row>
            <Row className='my-2'>
                <Col className='text-center'>
                    <AsyncButton 
                        onClick={establishGuestAccess}
                        activeText={resolveText("LoginGuest")}
                        executingText={resolveText("LoggingIn...")}
                        isExecuting={isEstablishingAccess}
                    />
                </Col>
            </Row>
        </>
    );

}