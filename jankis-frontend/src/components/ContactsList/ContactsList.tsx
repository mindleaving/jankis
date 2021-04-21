import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { ContactsListFilter } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';
import { NotificationManager } from 'react-notifications';
import { Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { OrderDirection } from '../../types/enums.d';

interface ContactsListProps {
    filter?: ContactsListFilter
}

export const ContactsList = (props: ContactsListProps) => {

    const history = useHistory();
    const [ contacts, setContacts] = useState<Models.Contact[]>([]);
    const filter = props.filter;
    const loadContacts = useCallback(async (pageIndex: number, entriesPerPage: number, orderBy?: string, orderDirection?: OrderDirection) => {
        try {
            if(filter?.searchText) {
                const response = await apiClient.get('api/contacts/search', {
                    searchText: filter.searchText,
                    count: entriesPerPage + '',
                    skip: (pageIndex * entriesPerPage) + ''
                });
                const items = await response.json() as Models.Contact[];
                setContacts(items);
            } else {
                const response = await apiClient.get('api/contacts', {
                    count: entriesPerPage + '',
                    skip: (pageIndex * entriesPerPage) + '',
                    orderBy: orderBy ?? '',
                    orderDirection: orderDirection ?? ''
                });
                const items = await response.json() as Models.Contact[];
                setContacts(items);
            }
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Contacts_CouldNotLoad'));
        }
    }, [ filter]);

    const confirmDeleteContact = (id: string, name: string) => {
        confirmAlert({
            title: resolveText('Contact_ConfirmDelete_Title'),
            message: resolveText('Contact_ConfirmDelete_Message').replace('{0}', name),
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('Delete_No'),
                    onClick: () => {}
                },
                {
                    label: resolveText('Delete_Yes'),
                    onClick: () => deleteContact(id, name, true)
                }
            ]
        })
    }
    const deleteContact = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            confirmDeleteContact(id, name);
            return;
        }
        await deleteObject(
            `api/contacts/${id}`,
            {},
            resolveText('Contact_SuccessfullyDeleted'),
            resolveText('Contact_CouldNotDelete'),
            () => setContacts(contacts.filter(x => x.id !== id))
        )
    }
    return (
        <PagedTable
            onPageChanged={loadContacts}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/contact')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Contacts_Name')}</th>
                    <th>{resolveText('Contacts_PhoneNumber')}</th>
                    <th>{resolveText('Contacts_Email')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {contacts.length > 0
                ? contacts.map(contact => (
                    <tr key={contact.id}>
                        <td><i className="fa fa-trash red clickable" onClick={() => deleteContact(contact.id, contact.name)}/></td>
                        <td>{contact.name}</td>
                        <td>{contact.phoneNumber}</td>
                        <td>{contact.email}</td>
                        <td><Button variant="link" onClick={() => history.push(`/contacts/${contact.id}/edit`)}>{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={4}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}