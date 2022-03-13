import React, { FormEvent, useState } from 'react';
import { Button, Col, Form, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { AsyncButton } from '../components/AsyncButton';
import { NotificationManager } from 'react-notifications';
import { resolveText } from '../helpers/Globalizer';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../communication/ApiClient';
import { v4 as uuid } from 'uuid';

interface RequestEmergencyAccessPageProps {
    userId: string;
}

export const RequestEmergencyAccessPage = (props: RequestEmergencyAccessPageProps) => {

    const [ hasAgreedToTerms, setHasAgreedToTerms ] = useState<boolean>(false);
    const [ personId, setPersonId ] = useState<string>('');
    const [ personFirstName, setPersonFirstName ] = useState<string>('');
    const [ personLastName, setPersonLastName ] = useState<string>('');
    const [ personBirthdate, setPersonBirthdate ] = useState<string>('');
    const [ isEstablishingAccess, setIsEstablishingAccess ] = useState<boolean>(false);

    const navigate = useNavigate();
    const establishAccess = async (e:FormEvent) => {
        e.preventDefault();
        try {
            setIsEstablishingAccess(true);
            const emergencyRequest = {
                id: uuid(),
                requesterId: props.userId,
                targetPersonId: personId
            };
            const emergencyId = await apiClient.post(`api/accessrequest/create/emergency`, {}, emergencyRequest);
            navigate(`/emergency/${emergencyId}`);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('EmergencyAccess_CouldNotEstablishAccess'));
        } finally {
            setIsEstablishingAccess(false);
        }
    }

    return (
        <>
            <h1>Request emergency access</h1>
            <Form onSubmit={establishAccess}>
                <FormGroup>
                    <FormCheck
                        checked={hasAgreedToTerms}
                        onChange={(e:any) => setHasAgreedToTerms(e.target.checked)}
                    >
                        {resolveText("Emergency_TermsOfAccess")}
                    </FormCheck>
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