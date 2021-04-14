import React, { useState } from 'react';
import { resolveText } from '../../helpers/Globalizer';
import { AccountsList } from '../../components/Accounts/AccountsList';
import { AccountsFilter } from '../../types/frontendTypes';
import { AccountsFilterView } from '../../components/Accounts/AccountsFilterView';

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