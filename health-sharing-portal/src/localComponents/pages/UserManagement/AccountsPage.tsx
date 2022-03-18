import React, { useMemo, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { Models } from '../../types/models';

interface AccountsPageProps {}
interface AccountFilter {
    searchText?: string;
}

export const AccountsPage = (props: AccountsPageProps) => {

    const [ filter, setFilter ] = useState<AccountFilter>({});
    const accountLoader = useMemo(() => new PagedTableLoader<Models.Account>(
        'api/accounts', 
        resolveText("Accounts_CouldNotLoad"),
        setAccounts,
        filter
    ), [ filter ]);
    const [ accounts, setAccounts ] = useState<Models.Account[]>([]);
    const navigate = useNavigate();

    return (
        <>
            <h1>Accounts</h1>
            <FormGroup>
                <FormLabel>{resolveText("Search")}</FormLabel>
                <FormControl
                    value={filter.searchText ?? ''}
                    onChange={(e:any) => setFilter({ searchText: e.target.value })}
                    placeholder={resolveText("Search")}
                />
            </FormGroup>
            <PagedTable
                onPageChanged={accountLoader.load}
            >
                <thead>
                    <tr>
                        <th>{resolveText("Account_ID")}</th>
                        <th>{resolveText("Account_Name")}</th>
                        <th>{resolveText("Account_AccountType")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map(account => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>{account.username}</td>
                            <td>{resolveText(account.accountType)}</td>
                            <td>
                                <Button onClick={() => navigate(`/account/${account.id}`)}>{resolveText("Open")}</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </PagedTable>
        </>
    );

}