import React, { FormEvent, useContext, useState } from 'react';
import { Form, FormGroup, FormLabel, FormCheck } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import UserContext from '../../contexts/UserContext';
import { AccessPermissions, SharedAccessType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { AccessPermissionsFormGroup } from './AccessPermissionsFormGroup';

interface CreateEmergencyAccessTokenFormProps {
    onEmergencyAccessTokenCreated: (token: Models.AccessControl.EmergencyAccess) => void;
}

export const CreateEmergencyAccessTokenForm = (props: CreateEmergencyAccessTokenFormProps) => {

    const user = useContext(UserContext);
    const [ hasExpiration, setHasExpiration ] = useState<boolean>(true);
    const [ expirationTime, setExpirationTime ] = useState<Date>();
    const [ permissions, setPermissions ] = useState<AccessPermissions[]>([ AccessPermissions.Read ]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


    const submit = async (e: FormEvent) => {
        e?.preventDefault();

        const emergencyTokenOptions: Models.AccessControl.EmergencyAccess = {
            id: '',
            type: SharedAccessType.Emergency,
            accessGrantedTimestamp: new Date(),
            isRevoked: false,
            accessEndTimestamp: hasExpiration ? expirationTime : undefined,
            permissions: permissions,
            sharerPersonId: user!.profileData.id
        };
        await sendPostRequest(
            `api/accesses/create/emergency`,
            resolveText("GiveAccess_CouldNotSend"),
            emergencyTokenOptions,
            async response => {
                const token = await response.json() as Models.AccessControl.EmergencyAccess;
                props.onEmergencyAccessTokenCreated(token);
            },
            () => {},
            () => setIsSubmitting(false)
        );
    }

    return (
        <Form onSubmit={submit}>
            <AccessPermissionsFormGroup
                title={resolveText("EmergencyAccess_Permissions")}
                value={permissions}
                onChange={setPermissions}
            />
            <FormGroup>
                <FormCheck
                    className='m-3'
                    checked={hasExpiration}
                    onChange={(e:any) => setHasExpiration(e.target.checked)}
                    label={resolveText("GiveAccess_HasExpiration")}
                />
            </FormGroup>
            {hasExpiration
            ? <FormGroup>
                <FormLabel>{resolveText("GiveAccess_ExpirationTime")}</FormLabel>
                <Flatpickr
                    className="form-control"
                    options={{
                        allowInput: true,
                        enableTime: true,
                        time_24hr: true,
                        mode: 'single'
                    }}
                    value={expirationTime}
                    onChange={(dates: Date[]) => setExpirationTime(dates[0])}
                />
            </FormGroup>
            : null}
            <AsyncButton
                className='m-3'
                activeText={resolveText("Submit")}
                executingText={resolveText("Submitting...")}
                isExecuting={isSubmitting}
            />
        </Form>
    );

}