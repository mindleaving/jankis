import React, { useState } from 'react';
import { Form, FormControl, FormGroup, FormLabel, InputGroup, Modal } from 'react-bootstrap';
import { ViewModels } from '../../localComponents/types/viewModels';
import { apiClient } from '../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../sharedCommonComponents/helpers/StoringHelpers';
import { NotificationManager } from 'react-notifications';
import { CopyButton } from '../../sharedCommonComponents/components/CopyButton';
import { Models } from '../../localComponents/types/models';

interface MenschIdVerificationModalProps {
    menschId: string;
    show: boolean;
    onVerified: () => void;
    onCloseRequested: () => void;
}

export const MenschIdVerificationModal = (props: MenschIdVerificationModalProps) => {

    const [ isCreating, setIsCreating ] = useState<boolean>(false);
    const [ challengeInfo, setChallengeInfo ] = useState<ViewModels.MenschIdChallengeViewModel>();
    const [ challengeSecret, setChallengeSecret ] = useState<string>('');
    const [ isVerifying, setIsVerifying ] = useState<boolean>(false);

    const createChallenge = async () => {
        setIsCreating(true);
        try {
            const response = await apiClient.instance!.get(`api/menschid/${props.menschId}/challenge/create`, {});
            const challengeInfo = await response.json() as ViewModels.MenschIdChallengeViewModel;
            setChallengeInfo(challengeInfo);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("MenschIdChallenge_CouldNotCreate"));
        } finally {
            setIsCreating(false);
        }
    }
    const verify = async () => {
        if(!challengeInfo) {
            return;
        }
        setIsVerifying(true);
        const body: Models.RequestBodies.MenschIdChallengeAnswer = {
            challengeId: challengeInfo.challengeId,
            secret: challengeSecret
        };
        await sendPostRequest(
            `api/menschid/${props.menschId}/challenges/${challengeInfo.challengeShortId}/answer`,
            resolveText("MenschIdChallenge_CouldNotVerify"),
            body,
            () => {
                props.onVerified();
                props.onCloseRequested();
            },
            () => setIsVerifying(false)
        );
    }

    return (
        <Modal show={props.show} onHide={props.onCloseRequested}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!!challengeInfo
                ? <Form>
                    <FormGroup>
                        <FormLabel>{resolveText("MenschIdChallenge_ChallengeId")}</FormLabel>
                        <InputGroup>
                            <FormControl readOnly
                                size="lg"
                                value={challengeInfo.challengeShortId}
                                onChange={() => {}}
                            />
                            <CopyButton
                                value={challengeInfo.challengeShortId}
                            />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>{resolveText("MenschIdChallenge_Secret")}</FormLabel>
                        <FormControl
                            size="lg"
                            value={challengeSecret}
                            onChange={(e:any) => setChallengeSecret(e.target.value.toUpperCase())}
                        />
                    </FormGroup>
                </Form>
                : resolveText("MenschIdChallenge_ClickCreateButton")}
            </Modal.Body>
            <Modal.Footer>
                {!challengeInfo
                ? <AsyncButton
                    onClick={createChallenge}
                    activeText={resolveText("CreateChallenge")}
                    executingText={resolveText("Creating...")}
                    isExecuting={isCreating}
                />
                : <AsyncButton
                    onClick={verify}
                    activeText={resolveText("Verify")}
                    executingText={resolveText("Verifying...")}
                    isExecuting={isVerifying}
                />}
            </Modal.Footer>
        </Modal>
    );

}