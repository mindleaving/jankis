import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccountsFilterView } from '../../components/UserManagement/AccountsFilterView';
import { AccountsList } from '../../components/UserManagement/AccountsList';
import { AccountsFilter } from '../../types/frontendTypes';

interface AccountsListPageProps {
    
}

export const AccountsListPage = (props: AccountsListPageProps) => {

    const [ filter, setFilter ] = useState<AccountsFilter>({});
    return (
        <>
            <h1>{resolveText('Accounts')}</h1>
            <AccountsFilterView setFilter={setFilter} />
            <AccountsList filter={filter} />
        </>
    );

}