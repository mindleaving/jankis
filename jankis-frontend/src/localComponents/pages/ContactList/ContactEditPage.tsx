import React, { FormEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface ContactEditPageProps{}

export const ContactEditPage = (props: ContactEditPageProps) => {

    const location = useLocation();
    const { contactId } = useParams();
    const isNew = location.pathname.toLowerCase().startsWith('/create');
    if(!isNew && !contactId) {
        throw new Error('Invalid link');
    }
    const id = contactId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>('');
    const [ phoneNumber, setPhoneNumber ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ note, setNote ] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadContact = buildLoadObjectFunc<Models.Contact>(
            `api/contacts/${id}`,
            {},
            resolveText('Contact_CouldNotLoad'),
            contact => {
                setName(contact.name);
                setPhoneNumber(contact.phoneNumber ?? '');
                setEmail(contact.email ?? '');
                setNote(contact.note ?? '');
            },
            () => setIsLoading(false)
        );
        loadContact();
    }, [ isNew, id ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        buildAndStoreObject<Models.Contact>(
            `api/contacts/${id}`,
            resolveText('Contact_SuccessfullyStored'),
            resolveText('Contact_CouldNotStore'),
            buildContact,
            () => navigate('/contacts'),
            () => setIsStoring(false)
        );
    }

    const buildContact = (): Models.Contact => {
        return {
            id: id,
            name,
            phoneNumber,
            email,
            note
        }
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('Contact')}</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Contact_Name')}
                    value={name}
                    onChange={setName}
                />
                <RowFormGroup
                    label={resolveText('Contact_PhoneNumber')}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                />
                <RowFormGroup
                    label={resolveText('Contact_Email')}
                    value={email}
                    onChange={setEmail}
                />
                <RowFormGroup
                    label={resolveText('Contact_Note')}
                    as="textarea"
                    value={note}
                    onChange={setNote}
                />
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Store')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}