import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccountsFilterView } from '../../../sharedHealthComponents/components/Accounts/AccountsFilterView';
import { AccountsList } from '../../../sharedHealthComponents/components/Accounts/AccountsList';
import { AccountsFilter } from '../../../sharedHealthComponents/types/frontendTypes';

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