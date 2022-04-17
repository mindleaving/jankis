import React, { FormEvent, useState } from 'react';
import { Form } from 'react-bootstrap';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { NotificationManager } from 'react-notifications';

interface CreateLocalAccountFormProps {
    onLoginCreated: () => void;
}

export const CreateLocalAccountForm = (props: CreateLocalAccountFormProps) => {

    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ passwordRepeat, setPasswordRepeat ] = useState<string>('');
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const createLogin = async (e?: FormEvent) => {
        e?.preventDefault();
        if(passwordRepeat !== password) {
            NotificationManager.error(resolveText("Register_PasswordsDontMatch"));
            return;
        }
        setIsSubmitting(true);
        try {
            const loginCreationInfo = {
                username: username,
                password: password
            };
            await apiClient.instance!.post('api/logins', {}, loginCreationInfo);
            props.onLoginCreated();
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("Register_CouldNotCreateLocalLogin"));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form onSubmit={createLogin}>
            <RowFormGroup required
                label={resolveText("Username")}
                value={username}
                onChange={setUsername}
            />
            <RowFormGroup required
                type='password'
                label={resolveText("Password")}
                value={password}
                onChange={setPassword}
            />
            <RowFormGroup required
                type='password'
                label={resolveText("PasswordRepeat")}
                value={passwordRepeat}
                onChange={setPasswordRepeat}
            />
            <AsyncButton
                type='submit'
                activeText={resolveText("Register")}
                executingText={resolveText("Submitting...")}
                isExecuting={isSubmitting}
            />
        </Form>
    );

}