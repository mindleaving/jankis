import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { resolveText } from '../../helpers/Globalizer';
import { ContactsListFilter, OrderDirection } from '../../types/frontendTypes';
import { Models } from '../../types/models';
import { PagedTable } from '../PagedTable';
import { NotificationManager } from 'react-notifications';
import { Button } from 'react-bootstrap';

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
    return (
        <PagedTable
            onPageChanged={loadContacts}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/contact')}
        >
            <thead>
                <tr>
                    <th>{resolveText('Contacts_Name')}</th>
                    <th>{resolveText('Contacts_PhoneNumber')}</th>
                    <th>{resolveText('Contacts_Email')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {contacts.length > 0
                ? contacts.map(contact => (
                    <tr>
                        <td>{contact.name}</td>
                        <td>{contact.phoneNumber}</td>
                        <td>{contact.email}</td>
                        <td><Button variant="link">{resolveText('Edit...')}</Button></td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={4}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}