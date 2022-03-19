import React, { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { confirmAlert } from 'react-confirm-alert';

interface ReceiveHealthProfessionalAccessPageProps {}

export const ReceiveHealthProfessionalAccessPage = (props: ReceiveHealthProfessionalAccessPageProps) => {

    const { accessInviteId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(!!accessInviteId);
    const [ accessInvite, setAccessInvite ] = useState<Models.AccessControl.HealthProfessionalAccessInvite>();
    const [ codeForHealthProfessional, setCodeForHealthProfessional ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        const loadAccessRequest = buildLoadObjectFunc<Models.AccessControl.HealthProfessionalAccessInvite>(
            `api/accessrequests/healthprofessional/${accessInviteId}`, {}, 
            resolveText("ReceiveAccess_CouldNotLoadAccessInvite"),
            setAccessInvite,
            () => setIsLoading(false));
        loadAccessRequest();
    }, [ accessInviteId ]);

    const navigate = useNavigate();

    const acceptInvite = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsSubmitting(true);
        try {
            const accessInviteWithCodes = {
                ...accessInvite,
                codeForHealthProfessional: codeForHealthProfessional
            };
            await apiClient.instance!.post(`api/accessrequests/handshake/healthprofessional`, {}, accessInviteWithCodes);
            setAccessInvite(state => ({
                ...state!,
                healthProfessionalHasAccepted: true
            }));
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("ReceiveAccess_CouldNotAcceptInvite"));
        } finally {
            setIsSubmitting(false);
        }
    }

    const rejectInvite = async (force: boolean = false) => {
        if(!force) {
            confirmAlert({
                title: resolveText("ReceiveAccess_ConfirmReject_Title"),
                message: resolveText("ReceiveAccess_ConfirmReject_Message"),
                buttons: [
                    {
                        label: resolveText("ReceiveAccess_ConfirmReject_Yes"),
                        onClick: () => rejectInvite(true)
                    },
                    {
                        label: resolveText("ReceiveAccess_ConfirmReject_No"),
                        onClick: () => {}
                    },
                ]
            });
            return;
        }
        setIsSubmitting(true);
        try {
            await apiClient.instance!.post(`api/accessrequests/healthprofessional/${accessInviteId}/reject`, {}, null);
            navigate(-1);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("ReceiveAccess_CouldNotRejectInvite"));
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!accessInvite) {
        return (<h3>{resolveText("ReceiveAccess_CouldNotLoadAccessInvite")}</h3>);
    }
    if(accessInvite.isCompleted) {
        navigate(`/healthrecord/${accessInvite.sharerPersonId}`);
        return (<h3>{resolveText("Redirecting...")}</h3>);
    }
    if(accessInvite.isRevoked) {
        return (<h3>{resolveText("ReceiveAccess_WasRevoked")}</h3>);
    }
    if(accessInvite.isRejected) {
        return (<h3>{resolveText("ReceiveAccess_WasRejected")}</h3>);
    }
    return (
        <>
            <h1>Receive access</h1>
            <Form onSubmit={acceptInvite}>
                <FormGroup>
                    <FormLabel>{resolveText("ReceiveAccess_CodeForSharer")}</FormLabel>
                    <h3>{accessInvite.codeForSharer}</h3>
                </FormGroup>
                {!accessInvite.healthProfessionalHasAccepted
                ? <>
                    <FormGroup>
                        <FormLabel>{resolveText("ReceiveAccess_CodeForHealthProfessional")}</FormLabel>
                        <FormControl
                            value={codeForHealthProfessional}
                            onChange={(e:any) => setCodeForHealthProfessional(e.target.value)}
                        />
                    </FormGroup>
                    <Row className='m-3'>
                        <Col xs="auto">
                            <AsyncButton
                                type='submit'
                                variant="success"
                                activeText={resolveText("Accept")}
                                executingText={resolveText("Submitting...")}
                                isExecuting={isSubmitting}
                            />
                        </Col>
                        <Col xs="auto">
                            <AsyncButton
                                onClick={rejectInvite}
                                variant="danger"
                                activeText={resolveText("Reject")}
                                executingText={resolveText("Submitting...")}
                                isExecuting={isSubmitting}
                            />
                        </Col>
                    </Row>
                </>
                : <Row className='m-3'>
                    <Col>
                        <h4>{resolveText("ReceiveAccess_YouHaveAccepted")}</h4>
                    </Col>
                </Row>}
            </Form>
        </>
    );

}