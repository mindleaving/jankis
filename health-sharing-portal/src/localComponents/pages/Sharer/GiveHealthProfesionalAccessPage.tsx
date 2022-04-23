import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { useNavigate, useParams } from 'react-router';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { HealthProfessionalAutocomplete } from '../../components/Autocompletes/HealthProfessionalAutocomplete';
import { AccessPermissionsFormGroup } from '../../components/Sharer/AccessPermissionsFormGroup';
import { AccessPermissions } from '../../types/enums.d';
import { Models } from '../../types/models';

interface GiveHealthProfesionalAccessPageProps {}

export const GiveHealthProfesionalAccessPage = (props: GiveHealthProfesionalAccessPageProps) => {

    const { accessInviteId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(!!accessInviteId);
    const [ healthProfessional, setHealthProfessional ] = useState<Models.HealthProfessionalAccount>();
    const [ expirationTime, setExpirationTime ] = useState<string>('PT1H');
    const [ permissions, setPermissions ] = useState<AccessPermissions[]>([ AccessPermissions.Read ]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ accessInvite, setAccessInvite ] = useState<Models.AccessControl.HealthProfessionalAccessInvite>();
    const [ codeForSharer, setCodeForSharer ] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        if(!accessInviteId) {
            return;
        }
        const loadAccessInvite = buildLoadObjectFunc(
            `api/accessrequests/healthprofessional/${accessInviteId}`,
            {},
            resolveText("ReceiveAccess_CouldNotLoadAccessInvite"),
            setAccessInvite,
            () => setIsLoading(false)
        );
        loadAccessInvite();
    }, [ accessInviteId ]);

    const createAccessRequest = async (e: FormEvent) => {
        if(!healthProfessional) {
            return;
        }
        e.preventDefault();
        try {
            const body: Models.CreateAccessInviteBody = {
                healthProfessionalAccountId: healthProfessional!.id,
                expirationDuration: expirationTime,
                permissions: permissions
            };
            const response = await apiClient.instance!.post(`api/accessrequests/create/healthprofessional`, {}, body);
            const item = await response.json() as Models.AccessControl.HealthProfessionalAccessInvite;
            setAccessInvite(item);
            //navigate(`/giveaccess/healthprofessional/${item.id}`);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("GiveAccess_CouldNotSend"));
        } finally {
            setIsSubmitting(false);
        }
    }

    const confirmAccessInvite = async (e: FormEvent) => {
        e.preventDefault();
        if(!accessInvite)
            return;
        try {
            const accessInviteWithCodes = {
                ...accessInvite,
                codeForSharer: codeForSharer,
            };
            await apiClient.instance!.post(`api/accessrequests/handshake/healthprofessional`, {}, accessInviteWithCodes);
            setAccessInvite(state => ({
                ...state!,
                sharerHasAccepted: true
            }));
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("GiveAccess_CouldNotSend"));
        } finally {
            setIsSubmitting(false);
        }
    }

    const revokeAccessInvite = async () => {
        if(!accessInvite)
            return;
        try {
            await apiClient.instance!.post(`api/accessrequests/healthprofessional/${accessInvite.id}/revoke`, {}, null);
            setAccessInvite(state => state ? {
                ...state,
                isRevoked: true,
                revokedTimestamp: new Date()
            } : state);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("GiveAccess_CouldNotRevokeInvite"));
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }

    if(!accessInvite) {
        return (
            <>
                <h1>Give access</h1>
                <Form onSubmit={createAccessRequest}>
                    <FormGroup>
                        <FormLabel>{resolveText("GiveAccess_SearchHealthProfessional")}</FormLabel>
                        <HealthProfessionalAutocomplete
                            value={healthProfessional}
                            onChange={setHealthProfessional}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>{resolveText("GiveAccess_ExpirationTime")}</FormLabel>
                        <FormControl
                            as="select"
                            value={expirationTime}
                            onChange={(e:any) => setExpirationTime(e.target.value)}
                        >
                            <option value="PT15M">15 {resolveText("Minutes")}</option>
                            <option value="PT30M">30 {resolveText("Minutes")}</option>
                            <option value="PT1H">1 {resolveText("Hours")}</option>
                            <option value="PT3H">3 {resolveText("Hours")}</option>
                            <option value="PT12H">12 {resolveText("Hours")}</option>
                            <option value="P1D">1 {resolveText("Days")}</option>
                            <option value="P3D">3 {resolveText("Days")}</option>
                            <option value="P7D">7 {resolveText("Days")}</option>
                            <option value="P1M">1 {resolveText("Months")}</option>
                            <option value="P3M">3 {resolveText("Months")}</option>
                            <option value="P6M">6 {resolveText("Months")}</option>
                        </FormControl>
                    </FormGroup>
                    <AccessPermissionsFormGroup
                        title={resolveText("GiveAccess_Permissions")}
                        value={permissions}
                        onChange={setPermissions}
                    />
                    <Row className='m-3'>
                        <Col>
                            <AsyncButton
                                type='submit'
                                activeText={resolveText("Submit")}
                                executingText={resolveText("Submitting...")}
                                isExecuting={isSubmitting}
                            />
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }

    if(accessInvite.isCompleted) {
        return (
        <>
            <Row>
                <Col>
                    <h3>{resolveText("GiveAccess_AccessWasGranted")}</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={() => navigate("/sharedaccess")}>{resolveText("GoToAccessList")}</Button>
                </Col>
            </Row>
        </>
        );
    }
    if(accessInvite.isRevoked) {
        return (<h3>{resolveText("ReceiveAccess_WasRevoked")}</h3>);
    }
    if(accessInvite.isRejected) {
        return (<h3>{resolveText("ReceiveAccess_WasRejected")}</h3>);
    }

    return (
        <>
            <h1>Give access</h1>
            <Form onSubmit={confirmAccessInvite}>
                {!!accessInvite
                ? <>
                    <FormGroup className='mt-2'>
                        <FormLabel>{resolveText("GiveAccess_CodeForHealthProfessional")}</FormLabel>
                        <h3>{accessInvite.codeForHealthProfessional}</h3>
                    </FormGroup>
                    {!accessInvite.sharerHasAccepted
                    ? <FormGroup>
                        <FormLabel>{resolveText("GiveAccess_CodeForSharer")}</FormLabel>
                        <FormControl
                            value={codeForSharer}
                            onChange={(e:any) => setCodeForSharer(e.target.value)}
                        />
                    </FormGroup>
                    : null}
                </>
                : null}
                <Row className='m-3'>
                    <Col xs="auto">
                        {accessInvite?.sharerHasAccepted
                        ? <h3>{resolveText("GiveAccess_YouHaveConfirmedTheInvite")}</h3>
                        : <AsyncButton
                            type='submit'
                            variant='success'
                            activeText={resolveText("Accept")}
                            executingText={resolveText("Submitting...")}
                            isExecuting={isSubmitting}
                        />}
                    </Col>
                    <Col xs="auto">
                        <AsyncButton
                            type='button'
                            onClick={revokeAccessInvite}
                            variant="danger"
                            activeText={resolveText("Revoke")}
                            executingText={resolveText("Submitting...")}
                            isExecuting={isSubmitting}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );

}