import { useContext, useMemo, useState } from 'react';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { OrderDirection } from '../../../sharedCommonComponents/types/enums.d';
import { SharedAccessesFilterView } from '../../components/Sharer/SharedAccessesFilterView';
import UserContext from '../../contexts/UserContext';
import { AccountType, SharedAccessType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { SharedAccessTableRow } from './SharedAccessTableRow';

interface SharedAccessListProps {
    hasCreateNewButton?: boolean;
    onCreateNew?: () => void;
}

export const SharedAccessList = (props: SharedAccessListProps) => {

    const user = useContext(UserContext);
    const defaultFilter: Models.Filters.SharedAccessFilter = user!.accountType === AccountType.HealthProfessional
        ? { onlyActive: true }
        : {};
    const [ accesses, setAccesses ] = useState<ViewModels.AccessViewModel[]>([]);
    const [ filter, setFilter ] = useState<Models.Filters.SharedAccessFilter>(defaultFilter);
    const accessesLoader = useMemo(() => new PagedTableLoader<ViewModels.AccessViewModel>(
        `api/accesses`,
        resolveText("SharedAccesses_CouldNotLoad"),
        setAccesses,
        Object.assign(filter, { orderBy: "endtime", orderDirection: OrderDirection.Descending })
    ), [ filter ]);

    const revokeAccess = async (accessType: SharedAccessType, accessId: string) => {
        await apiClient.instance!.post(`api/accesses/${accessType}/${accessId}/revoke`, {}, null);
        setAccesses(accesses.map(x => {
            if(x.access.id !== accessId) {
                return x;
            }
            return {
                ...x,
                access: {
                    ...x.access,
                    isRevoked: true,
                    accessEndTimestamp: new Date().toISOString() as unknown as Date
                }
            };
        }));
    }

    return (
        <>
            <SharedAccessesFilterView filter={filter} onFilterChanged={setFilter} />
            <div className='mt-3' />
            <PagedTable
                onPageChanged={accessesLoader.load}
                orderBy="endTime"
                orderDirection={OrderDirection.Descending}
                hasCreateNewButton={props.hasCreateNewButton}
                onCreateNew={props.onCreateNew}
            >
                <thead>
                    <tr>
                        <th>{resolveText("SharedAccess_Type")}</th>
                        <th>{resolveText("SharedAccess_Receiver")}</th>
                        <th>{resolveText("SharedAccess_ExpirationTime")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {accesses.length > 0
                    ? accesses.map(vm => (
                        <SharedAccessTableRow
                            key={vm.access.id}
                            access={vm}
                            onRevokeAccess={revokeAccess}
                        />
                    ))
                    : <tr>
                        <td colSpan={4} className="text-center">{resolveText("NoEntries")}</td>
                    </tr>}
                </tbody>
            </PagedTable>
        </>
    );

}