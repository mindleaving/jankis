import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Col, Form, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import UserContext from '../../contexts/UserContext';
import { SharedAccessType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface RequestEmergencyAccessPageProps {}

export const RequestEmergencyAccessPage = (props: RequestEmergencyAccessPageProps) => {

    const user = useContext(UserContext);
    const { emergencyToken } = useParams();
    const [ hasAgreedToTerms, setHasAgreedToTerms ] = useState<boolean>(false);
    const [ personId, setPersonId ] = useState<string>('');
    const [ personFirstName, setPersonFirstName ] = useState<string>('');
    const [ personLastName, setPersonLastName ] = useState<string>('');
    const [ personBirthdate, setPersonBirthdate ] = useState<string>('');
    const [ isEstablishingAccess, setIsEstablishingAccess ] = useState<boolean>(false);

    const navigate = useNavigate();
    const establishAccess = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsEstablishingAccess(true);
            const emergencyRequest: Models.AccessControl.EmergencyAccessRequest = {
                id: uuid(),
                type: SharedAccessType.Emergency,
                createdTimestamp: new Date(),
                isCompleted: false,
                accessReceiverUsername: user!.accountId,
                sharerPersonId: personId,
                emergencyToken: emergencyToken,
                targetPersonFirstName: personFirstName,
                targetPersonLastName: personLastName,
                targetPersonBirthdate: personBirthdate ? new Date(personBirthdate) : undefined
            };
            const response = await apiClient.instance!.post(`api/accessrequests/create/emergency`, {}, emergencyRequest);
            const emergencyAccess = await response.json() as Models.AccessControl.EmergencyAccess;
            navigate(`/healthrecord/${emergencyAccess.sharerPersonId}`);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('EmergencyAccess_CouldNotEstablishAccess'));
        } finally {
            setIsEstablishingAccess(false);
        }
    }

    useEffect(() => {
        if(!emergencyToken) {
            return;
        }
        establishAccess();
    }, [ emergencyToken ]);

    return (
        <>
            <h1>Request emergency access</h1>
            <Form onSubmit={establishAccess}>
                <FormGroup>
                    <FormCheck
                        label={resolveText("Emergency_TermsOfAccess")}
                        checked={hasAgreedToTerms}
                        onChange={(e:any) => setHasAgreedToTerms(e.target.checked)}
                    />
                </FormGroup>
                {hasAgreedToTerms
                ? <>
                    <hr />
                    <h2>Search person</h2>
                    <span>{resolveText("Emergency_PersonSearchRemarks")}</span>
                    <FormGroup>
                        <FormLabel>Person ID</FormLabel>
                        <FormControl
                            value={personId}
                            onChange={(e:any) => setPersonId(e.target.value)}
                        />
                    </FormGroup>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel>First name</FormLabel>
                                <FormControl
                                    value={personFirstName}
                                    onChange={(e:any) => setPersonFirstName(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel>Last name</FormLabel>
                                <FormControl
                                    value={personLastName}
                                    onChange={(e:any) => setPersonLastName(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel>Birthdate</FormLabel>
                                <FormControl
                                    value={personBirthdate}
                                    onChange={(e:any) => setPersonBirthdate(e.target.value)}
                                    placeholder="yyyy-MM-dd, e.g. 1989-11-17"
                                    pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <AsyncButton
                        className='m-3'
                        type='submit'
                        activeText='Get access'
                        executingText='Please wait...'
                        isExecuting={isEstablishingAccess}
                    />
                </>
                : null}
            </Form>
        </>
    );

}