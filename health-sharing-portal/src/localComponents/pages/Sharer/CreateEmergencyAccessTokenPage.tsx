import { useEffect, useState } from 'react';
import { Row, Col, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { CreateEmergencyAccessTokenForm } from '../../components/Sharer/CreateEmergencyAccessTokenForm';
import { Models } from '../../types/models';
import QRCode from 'react-qr-code';
import { CopyButton } from '../../../sharedCommonComponents/components/CopyButton';
import { useParams } from 'react-router-dom';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { showSuccessAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';

interface CreateEmergencyAccessTokenPageProps {}

export const CreateEmergencyAccessTokenPage = (props: CreateEmergencyAccessTokenPageProps) => {

    const { accessId } = useParams();
    const [ emergencyToken, setEmergencyToken ] = useState<Models.AccessControl.EmergencyAccess>();
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    useEffect(() => {
        if(!accessId) {
            return;
        }
        const loadEmergencyAccess = buildLoadObjectFunc(
            `api/accesses/emergency/${accessId}`, { includeToken: "true" },
            resolveText("EmergencyAccess_CouldNotLoad"),
            setEmergencyToken
        );
        loadEmergencyAccess();
    }, [ accessId ]);

    const setName = (name: string) => {
        setEmergencyToken(state => state ? {
            ...state,
            name: name
        } : undefined);
    }

    const storeName = async () => {
        if(!emergencyToken) {
            return;
        }
        setIsStoring(true);
        sendPostRequest(
            `api/accesses/emergency/${emergencyToken.id}`,
            resolveText("EmergencyAccess_CouldNotStore"),
            emergencyToken,
            () => showSuccessAlert(resolveText("EmergencyAccess_SuccessfullyStored")),
            undefined,
            () => setIsStoring(false)
        );
    }

    if(!!emergencyToken) {
        const tokenUrl = `${window.location.protocol}//${window.location.host}/emergency/${emergencyToken.token}`;
        return (<>
            <h1>{resolveText("CreateEmergencyToken")}</h1>
            {/* <Row>
                <Col>
                    <Button onClick={() => setEmergencyToken(undefined)}>{resolveText("CreateNew")}</Button>
                </Col>
            </Row>
            <hr /> */}
            <FormGroup>
                <FormLabel>{resolveText("EmergencyAccess_Name")}</FormLabel>
                <Row>
                    <Col>
                        <FormControl
                            value={emergencyToken.name ?? ''}
                            onChange={(e:any) => setName(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <StoreButton
                            onClick={storeName}
                            isStoring={isStoring}
                            className='m-0'
                        />
                    </Col>
                </Row>
            </FormGroup>
            <Row>
                <Col className='text-center'>
                    <QRCode
                        className='m-3'
                        value={tokenUrl} 
                    />
                </Col>
            </Row>
            <Row className='align-items-center'>
                <Col>
                    <FormControl
                        readOnly
                        className='m-3'
                        defaultValue={tokenUrl}
                        onFocus={(e) => e.target.select()}
                    />
                </Col>
                <Col xs="auto">
                    <CopyButton
                        value={tokenUrl}
                    />
                </Col>
            </Row>
        </>);
    }

    return (
        <>
            <h1>{resolveText("CreateEmergencyToken")}</h1>
            <CreateEmergencyAccessTokenForm
                onEmergencyAccessTokenCreated={setEmergencyToken}
            />
        </>
    );

}