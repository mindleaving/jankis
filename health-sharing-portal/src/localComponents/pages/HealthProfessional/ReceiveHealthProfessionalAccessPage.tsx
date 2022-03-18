import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { Models } from '../../types/models';

interface ReceiveHealthProfessionalAccessPageProps {}

export const ReceiveHealthProfessionalAccessPage = (props: ReceiveHealthProfessionalAccessPageProps) => {

    const { accessRequestId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(!!accessRequestId);
    const [ accessRequest, setAccessRequest ] = useState<Models.AccessControl.HealthProfessionalAccessRequest>();
    const [ codeForSharer, setCodeForSharer ] = useState<string>('');
    const [ codeForHealthProfessional, setCodeForHealthProfessional ] = useState<string>('');

    useEffect(() => {
        const loadAccessRequest = buildLoadObjectFunc<Models.AccessControl.HealthProfessionalAccessRequest>(
            `api/accessrequests/${accessRequestId}`, {}, 
            resolveText("ReceiveAccess_CouldNotLoadAccessRequest"),
            setAccessRequest,
            () => setIsLoading(false));
        loadAccessRequest();
    }, [ accessRequestId ]);

    return (
        <>
            <h1>Receive access</h1>
            {isLoading ? <h3>{resolveText("Loading...")}</h3>
            : !accessRequest ? <h3>{resolveText("ReceiveAccess_CouldNotLoadAccessRequest")}</h3>
            : <>
                <FormGroup>
                    <FormLabel>{resolveText("ReceiveAccess_CodeForSharer")}</FormLabel>
                    <h3>{codeForSharer}</h3>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("ReceiveAccess_CodeForHealthProfessional")}</FormLabel>
                    <FormControl
                        value={codeForHealthProfessional}
                        onChange={(e:any) => setCodeForHealthProfessional(e.target.value)}
                    />
                </FormGroup>
            </>}
        </>
    );

}