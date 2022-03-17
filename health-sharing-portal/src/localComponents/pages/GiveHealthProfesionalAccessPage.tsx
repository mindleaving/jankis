import React, { FormEvent, useContext, useState } from 'react';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { Models } from '../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { SharedAccessType } from '../types/enums.d';
import UserContext from '../contexts/UserContext';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface GiveHealthProfesionalAccessPageProps {}

export const GiveHealthProfesionalAccessPage = (props: GiveHealthProfesionalAccessPageProps) => {


    const user = useContext(UserContext);
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
                targetPersonId: user!.profileData.id,
                requesterId: healthProfessionalId!,
                isCompleted: false,
                createdTimestamp: new Date()
            };
            await apiClient.instance!.post(`api/accessrequests/create/healthprofessional`, {}, accessRequest);
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
                    <FormLabel>{resolveText("GiveAccess_CodeForSharer")}</FormLabel>
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