import React, { FormEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { AsyncButton } from '../../components/AsyncButton';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';

interface ContactParams {
    contactId?: string;
}
interface ContactEditPageProps extends RouteComponentProps<ContactParams> {}

export const ContactEditPage = (props: ContactEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    const id = props.match.params.contactId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>('');
    const [ phoneNumber, setPhoneNumber ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ note, setNote ] = useState<string>('');

    const history = useHistory();

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
        buidlAndStoreObject<Models.Contact>(
            `api/contacts/${id}`,
            resolveText('Contact_SuccessfullyStored'),
            resolveText('Contact_CouldNotStore'),
            buildContact,
            () => history.push('/contacts'),
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