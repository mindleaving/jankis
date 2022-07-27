import React, { useContext, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { downloadFile } from '../../../sharedCommonComponents/communication/FileDownloader';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import UserContext from '../../contexts/UserContext';
import { AccountType } from '../../types/enums.d';
import { SharerPrivacySettings } from '../../components/UserManagement/SharerPrivacySettings';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';

interface AccountPageProps {
    onAccountDeleted: () => void;
}

export const AccountPage = (props: AccountPageProps) => {

    const user = useContext(UserContext);
    const [ isDownloading, setIsDownloading ] = useState<boolean>(false);
    const downloadAccount = async () => {
        try {
            setIsDownloading(true);
            await downloadFile('/api/accounts/me/download');
        } finally {
            setIsDownloading(false);
        }
    }
    const deleteAccount = async (force?: boolean) => {
        if(!force) {
            confirmAlert({
                title: resolveText("Account_Delete_Title"),
                message: resolveText("Account_Delete_Message"),
                closeOnClickOutside: true,
                closeOnEscape: true,
                buttons: [
                    {
                        label: resolveText('Delete_No'),
                        onClick: () => {}
                    },
                    {
                        label: resolveText("Delete_Yes"),
                        onClick: () => deleteAccount(true)
                    },
                ]
            });
            return;
        }
        try {
            await apiClient.instance!.delete('/api/accounts/me', {});
            NotificationManager.success(resolveText("Account_SuccessfullyDeleted"));
            props.onAccountDeleted();
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("Account_CouldNotDelete"));
        }
    }
    return (
        <>
            <h1>{resolveText("Account_ManageAccount")}</h1>
            <Accordion>
                {user!.accountType === AccountType.Sharer
                ? <AccordionCard
                    eventKey='privacy'
                    title={resolveText("Account_PrivacySettings")}
                >
                    <SharerPrivacySettings />
                </AccordionCard>
                : null}
                <AccordionCard
                    eventKey='download'
                    title={resolveText("Account_Download")}
                >
                    <AsyncButton
                        variant='primary'
                        onClick={downloadAccount}
                        className='my-2'
                        activeText={resolveText("Account_Download")}
                        executingText={resolveText("Account_Download")}
                        isExecuting={isDownloading}
                    />
                </AccordionCard>
                <AccordionCard
                    eventKey='delete'
                    title={resolveText("Account_Delete")}
                >
                    <Button
                        variant='danger'
                        onClick={() => deleteAccount()}
                        className='my-2'
                    >
                        {resolveText("Account_Delete")}
                    </Button>
                </AccordionCard>
            </Accordion>
        </>
    );

}