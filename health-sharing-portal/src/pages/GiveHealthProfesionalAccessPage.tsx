import React, { FormEvent, useState } from 'react';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { apiClient } from '../communication/ApiClient';
import { AsyncButton } from '../components/AsyncButton';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { SharedAccessType } from '../types/enums.d';

interface GiveHealthProfesionalAccessPageProps {
    userId: string;
}

export const GiveHealthProfesionalAccessPage = (props: GiveHealthProfesionalAccessPageProps) => {


    const [ codeForHealthProfessional, setCodeForHealthProfessional ] = useState<string>('');
    const [ codeForSharer, setCodeForSharer ] = useState<string>('');
    const [ healthProfessionalId, setHealthProfessionalId ] = useState<string>();
    const [ isAccessRequestSend, setIsAccessRequestSend ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const sendAccessRequest = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const accessRequest: Models.AccessControl.HealthProfessionalAccessRequest = {
                type: SharedAccessType.HealthProfessional,
                id: uuid(),
                targetPersonId: props.userId,
                requesterId: healthProfessionalId!,
                isCompleted: false,
                createdTimestamp: new Date()
            };
            await apiClient.post(`api/accessrequests/create/healthprofessional`, {}, accessRequest);
            setIsAccessRequestSend(true);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("GiveAccess_CouldNotSend"));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <h1>Give access</h1>
            <Form onSubmit={sendAccessRequest}>
                <FormGroup>
                    <FormLabel>{resolveText("GiveAccess_SearchHealthProfessional")}</FormLabel>
                    <FormControl
                        value={healthProfessionalId}
                        onChange={(e:any) => setHealthProfessionalId(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("GiveAccess_CodeForHealthProfessional")}</FormLabel>
                    <h3>{codeForHealthProfessional}</h3>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("GiveAccess_")}</FormLabel>
                    <FormControl
                        value={codeForSharer}
                        onChange={(e:any) => setCodeForSharer(e.target.value)}
                    />
                </FormGroup>
                <AsyncButton
                    type='submit'
                    activeText={resolveText("Submit")}
                    executingText={resolveText("Submitting...")}
                    isExecuting={isSubmitting}
                />
            </Form>
        </>
    );

}