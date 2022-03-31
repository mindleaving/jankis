import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { StudyEnrollementState } from '../../types/enums.d';
import { Models } from '../../types/models';

interface StudyEnrollmentActionButtonProps {
    studyId: string;
    enrollmentId: string;
    person: Models.Person;
    state: StudyEnrollementState;
    onStateChanged: (newState: StudyEnrollementState) => void;
}

export const StudyEnrollmentActionButton = (props: StudyEnrollmentActionButtonProps) => {

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    const rejectParticipant = async (force: boolean = false) => {
        if(!force) {
            confirmAlert({
                title: resolveText("StudyEnrollmentAction_ConfirmReject_Title"),
                message: resolveText("StudyEnrollmentAction_ConfirmReject_Message").replace("{0}", `${props.person.firstName} ${props.person.lastName}`),
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: resolveText("StudyEnrollment_Reject_No"),
                        onClick: () => {}
                    },
                    {
                        label: resolveText("StudyEnrollment_Reject_Yes"),
                        onClick: () => rejectParticipant(true)
                    }
                ]
            });
            return;
        }
        setIsSubmitting(true);
        await sendPostRequest(
            `api/studies/${props.studyId}/enrollments/${props.enrollmentId}/reject`,
            resolveText("StudyEnrollmentAction_CouldNotReject"),
            undefined,
            () => props.onStateChanged(StudyEnrollementState.Rejected),
            () => setIsSubmitting(false)
        );
    };
    const excludeParticipant = async (force: boolean = false) => {
        if(!force) {
            confirmAlert({
                title: resolveText("StudyEnrollmentAction_ConfirmExclude_Title"),
                message: resolveText("StudyEnrollmentAction_ConfirmExclude_Message").replace("{0}", `${props.person.firstName} ${props.person.lastName}`),
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: resolveText("StudyEnrollment_Exclude_No"),
                        onClick: () => {}
                    },
                    {
                        label: resolveText("StudyEnrollment_Exclude_Yes"),
                        onClick: () => excludeParticipant(true)
                    }
                ]
            });
            return;
        }
        setIsSubmitting(true);
        await sendPostRequest(
            `api/studies/${props.studyId}/enrollments/${props.enrollmentId}/exclude`,
            resolveText("StudyEnrollmentAction_CouldNotExclude"),
            undefined,
            () => props.onStateChanged(StudyEnrollementState.Excluded),
            () => setIsSubmitting(false)
        );
    }

    switch(props.state) {
        case StudyEnrollementState.Eligible:
            return (<>
                <AsyncButton
                    variant="danger"
                    size='sm'
                    onClick={() => rejectParticipant(false)}
                    activeText={resolveText("StudyEnrollmentAction_Reject")}
                    executingText={resolveText("Submitting...")}
                    isExecuting={isSubmitting}
                />
            </>);
        case StudyEnrollementState.Enrolled:
            return (<>
                <Button 
                    size='sm'
                    className='mx-1'
                    onClick={() => navigate(`/healthrecord/${props.person.id}`)}
                >
                    {resolveText("StudyEnrollmentAction_ShowProfile")}
                </Button>
                <AsyncButton
                    variant="danger"
                    size='sm'
                    className='mx-1'
                    onClick={() => rejectParticipant(false)}
                    activeText={resolveText("StudyEnrollmentAction_Reject")}
                    executingText={resolveText("Submitting...")}
                    isExecuting={isSubmitting}
                />
                <AsyncButton
                    variant="danger"
                    size='sm'
                    className='mx-1'
                    onClick={() => excludeParticipant(false)}
                    activeText={resolveText("StudyEnrollmentAction_Exclude")}
                    executingText={resolveText("Submitting...")}
                    isExecuting={isSubmitting}
                />
            </>);
        case StudyEnrollementState.Excluded:
        case StudyEnrollementState.Left:
        case StudyEnrollementState.Rejected:
            return null;
        case StudyEnrollementState.ParticipationOffered:
            return (<>
                <Button 
                    size='sm'
                    onClick={() => navigate(`/study/${props.studyId}/enrollment/${props.enrollmentId}/review`)}
                >
                    {resolveText("StudyEnrollmentAction_Review")}
                </Button>
            </>);
        default:
            return null;
    }
}