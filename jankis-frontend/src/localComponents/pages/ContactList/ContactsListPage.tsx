import React, { useState } from 'react';
import { ContactsList } from '../../components/ContactsList/ContactsList';
import { ContactsListFilter } from '../../types/frontendTypes';
import { ContactsListFilterView } from '../../components/ContactsList/ContactsListFilterView';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface ContactsListPageProps {}

export const ContactsListPage = (props: ContactsListPageProps) => {

    const [ filter, setFilter ] = useState<ContactsListFilter>();
    return (
        <>
            <h1>{resolveText('ContactList')}</h1>
            <ContactsListFilterView setFilter={setFilter} />
            <ContactsList filter={filter} />
        </>
    );

}