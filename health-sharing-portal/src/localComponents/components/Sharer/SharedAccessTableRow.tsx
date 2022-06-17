import { isAfter, differenceInMinutes } from 'date-fns';
import React, { ReactNode, useContext } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../../sharedHealthComponents/helpers/Formatters';
import UserContext from '../../contexts/UserContext';
import { formatAccessType } from '../../helpers/Formatters';
import { AccountType, SharedAccessType } from '../../types/enums.d';
import { ViewModels } from '../../types/viewModels';
import { RevokeButton } from '../RevokeButton';

interface SharedAccessTableRowProps {
    access: ViewModels.AccessViewModel;
    onRevokeAccess: (accessType: SharedAccessType, accessId: string) => Promise<void>;
}

export const SharedAccessTableRow = (props: SharedAccessTableRowProps) => {

    const user = useContext(UserContext);
    const access = props.access.access;
    const formattedAccessType = formatAccessType(access.type);
    const now = new Date();
    const endTime = !!access.accessEndTimestamp ? new Date(access.accessEndTimestamp) : null; 
    const isExpired = !!endTime ? isAfter(now, endTime) : false;
    const remainingTimeInMinutes = !isExpired && endTime ? differenceInMinutes(endTime!, now) : 0;
    const iAmSharer = user!.accountType === AccountType.Sharer && access.sharerPersonId === user!.profileData.id;
    const iAmReceiver = access.accessReceiverAccountId === user!.accountId;

    const navigate = useNavigate();

    let buttons: ReactNode[] = [];
    if(iAmSharer) {
        if(!isExpired) {
            buttons.push(
                <RevokeButton
                    key={`${access.id}_revoke`}
                    onClick={() => props.onRevokeAccess(access.type, access.id)}
                    requireConfirm
                    confirmDialogTitle={resolveText("SharedAccess_ConfirmRevoke_Title")}
                    confirmDialogMessage={resolveText("SharedAccess_ConfirmRevoke_Message").replace("{0}", access.accessReceiverAccountId ?? '')}
                />
            );
        }
    }
    if(iAmReceiver) {
        if(!isExpired) {
            buttons.push(
                <Button 
                    key={`${access.id}_open`}
                    onClick={() => navigate(`/healthrecord/${access.sharerPersonId}`)}
                >
                    {resolveText("Open")}
                </Button>
            );
        }
    }

    return (
    <tr>
        <td>
            {access.type === SharedAccessType.Emergency
            ? <b className='red'>{formattedAccessType}</b>
            : formattedAccessType}
        </td>
        <td>{access.accessReceiverAccountId}</td>
        <td>
            {!endTime ? resolveText("SharedAccess_NoExpiration") : formatDate(endTime)}
            {endTime 
            ? <div>
                {access.isRevoked   ? <Badge pill bg="danger">{resolveText("Revoked")}</Badge> 
                : isExpired         ? <Badge pill bg="danger">{resolveText("Expired")}</Badge> 
                : <small>{resolveText("Remaining")}: {remainingTimeInMinutes} min.</small>}
            </div>
            : null}
            {props.access.hasEmergencyToken && !props.access.access.isRevoked && !isExpired
            ? <div>
                <Button
                    className="py-0"
                    size="sm"
                    onClick={() => navigate(`/show/emergencytoken/${access.id}`)}
                >
                    {resolveText("EmergencyAccess_ShowToken")}
                </Button>
            </div> 
            : null}
        </td>
        <td>
            {buttons}
        </td>
    </tr>
    );

}