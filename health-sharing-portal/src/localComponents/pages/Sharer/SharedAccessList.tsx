import { differenceInMinutes, isAfter } from 'date-fns';
import { useMemo, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { OrderDirection } from '../../../sharedCommonComponents/types/enums.d';
import { RevokeButton } from '../../components/RevokeButton';
import { SharedAccessesFilterView } from '../../components/Sharer/SharedAccessesFilterView';
import { formatAccessType } from '../../helpers/Formatters';
import { SharedAccessType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface SharedAccessListProps {}

export const SharedAccessList = (props: SharedAccessListProps) => {

    const [ accesses, setAccesses ] = useState<Models.AccessControl.ISharedAccess[]>([]);
    const [ filter, setFilter ] = useState<Models.Filters.SharedAccessFilter>({});
    const accessesLoader = useMemo(() => new PagedTableLoader<Models.AccessControl.ISharedAccess>(
        `api/accesses`,
        resolveText("SharedAccesses_CouldNotLoad"),
        setAccesses,
        filter
    ), [ filter ]);

    const revokeAccess = async (accessType: SharedAccessType, accessId: string) => {
        await apiClient.instance!.post(`api/accesses/${accessType}/${accessId}/revoke`, {}, null);
        setAccesses(accesses.map(x => {
            if(x.id !== accessId) {
                return x;
            }
            return {
                ...x,
                isRevoked: true,
                accessEndTimestamp: new Date().toISOString() as unknown as Date,
            };
        }));
    }
    return (
        <>
            <h1>Shared access</h1>
            <SharedAccessesFilterView onFilterChanged={setFilter} />
            <div className='mt-3' />
            <PagedTable
                onPageChanged={accessesLoader.load}
                orderBy="endTime"
                orderDirection={OrderDirection.Descending}
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
                    ? accesses.map(access => {
                        const now = new Date();
                        const endTime = !!access.accessEndTimestamp ? new Date(access.accessEndTimestamp) : null; 
                        const isExpired = !!endTime ? isAfter(now, endTime) : false;
                        const remainingTimeInMinutes = !isExpired ? differenceInMinutes(endTime!, now) : 0;
                        return (
                        <tr>
                            <td>{formatAccessType(access.type)}</td>
                            <td>{access.accessReceiverUsername}</td>
                            <td>
                                {!access.accessEndTimestamp ? resolveText("SharedAccess_NoExpiration") : new Date(access.accessEndTimestamp).toLocaleString("de")}
                                <div>
                                    {access.isRevoked   ? <Badge pill bg="danger">{resolveText("Revoked")}</Badge> 
                                    : isExpired         ? <Badge pill bg="danger">{resolveText("Expired")}</Badge> 
                                    : <small>{resolveText("Remaining")}: {remainingTimeInMinutes} min.</small>}
                                </div>
                            </td>
                            <td>
                                {!isExpired
                                ? <RevokeButton
                                    onClick={() => revokeAccess(access.type, access.id)}
                                    requireConfirm
                                    confirmDialogTitle={resolveText("SharedAccess_ConfirmRevoke_Title")}
                                    confirmDialogMessage={resolveText("SharedAccess_ConfirmRevoke_Message").replace("{0}", access.accessReceiverUsername)}
                                />
                                : null}
                            </td>
                        </tr>
                    )})
                    : <tr>
                        <td colSpan={4} className="text-center">{resolveText("NoEntries")}</td>
                    </tr>}
                </tbody>
            </PagedTable>
        </>
    );

}