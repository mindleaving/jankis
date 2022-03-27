import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate, useParams } from 'react-router-dom';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { submitPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { formatPerson } from '../../../sharedHealthComponents/helpers/Formatters';
import { QuestionnaireAnswersViewer } from '../../../sharedHealthComponents/components/Patients/QuestionnaireAnswersViewer';
import { ViewModels } from '../../types/viewModels';

interface StudyEnrollmentReviewPageProps {}

export const StudyEnrollmentReviewPage = (props: StudyEnrollmentReviewPageProps) => {

    const { studyId, enrollmentId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ enrollment, setEnrollment ] = useState<ViewModels.StudyEnrollmentViewModel>();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadEnrollment = buildLoadObjectFunc<ViewModels.StudyEnrollmentViewModel>(
            `api/studies/${studyId}/enrollments/${enrollmentId}`, {},
            resolveText("StudyEnrollment_CouldNotLoad"),
            setEnrollment,
            () => setIsLoading(false)
        );
        loadEnrollment();
    }, [ studyId, enrollmentId ]);


    const markParticipantAsEligible = async () => {
        setIsSubmitting(true);
        await submitPostRequest(
            `api/studies/${studyId}/enrollments/${enrollmentId}/invite`,
            resolveText("StudyEnrollment_CouldNotMarkEligible"),
            undefined,
            () => navigate(`/study/${studyId}`),
            () => setIsSubmitting(false)
        );
    }

    const excludeParticipant = async (force: boolean = false) => {
        if(!force) {
            confirmAlert({
                title: resolveText("StudyEnrollmentAction_ConfirmExclude_Title"),
                message: resolveText("StudyEnrollmentAction_ConfirmExclude_Message").replace("{0}", `${enrollment!.person.firstName} ${enrollment!.person.lastName}`),
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
        await submitPostRequest(
            `api/studies/${studyId}/enrollments/${enrollmentId}/exclude`,
            resolveText("StudyEnrollment_CouldNotExclude"),
            undefined,
            () => navigate(`/study/${studyId}`),
            () => setIsSubmitting(false)
        );
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!enrollment) {
        return (<h3>{resolveText("StudyEnrollment_CouldNotLoad")}</h3>);
    }

    return (
        <>
            <h2>{resolveText("StudyEnrollment_Person")}</h2>
            <Row>
                <Col>{formatPerson(enrollment.person)}</Col>
            </Row>
            {/* <FormGroup as={Row}>
                <FormLabel column xs={3}>{resolveText("Person_Name")}</FormLabel>
                <Col>{``}</Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column xs={3}>{resolveText("Person_BirthDate")}</FormLabel>
                <Col>{new Date(person.birthDate).toISOString().substring(0, 10)}</Col>
            </FormGroup> */}
            <h2 className='mt-3'>{resolveText("Study_InclusionCriteria")}</h2>
            {enrollment.enrollment.inclusionCriteriaQuestionnaireAnswers?.length > 0
            ? enrollment.enrollment.inclusionCriteriaQuestionnaireAnswers.map(questionnaireAnswers => (
                <QuestionnaireAnswersViewer
                    key={questionnaireAnswers.id}
                    answers={questionnaireAnswers}
                />
            ))
            : <Row>
                <Col>{resolveText("None")}</Col>
            </Row>}
            <h2 className='mt-3'>{resolveText("Study_ExclusionCriteria")}</h2>
            {enrollment.enrollment.exclusionCriteriaQuestionnaireAnswers?.length > 0
            ? enrollment.enrollment.exclusionCriteriaQuestionnaireAnswers.map(questionnaireAnswers => (
                <QuestionnaireAnswersViewer
                    key={questionnaireAnswers.id}
                    answers={questionnaireAnswers}
                />
            ))
            : <Row>
                <Col>{resolveText("None")}</Col>
            </Row>}
            <Row className='mt-3'>
                <Col>
                    <AsyncButton
                        variant="success"
                        onClick={markParticipantAsEligible}
                        activeText={resolveText("StudyEnrollmentAction_MarkAsEligible")}
                        executingText={resolveText("Submitting...")}
                        isExecuting={isSubmitting}
                    />
                </Col>
                <Col>
                    <AsyncButton
                        variant="danger"
                        onClick={() => excludeParticipant(false)}
                        activeText={resolveText("StudyEnrollmentAction_Exclude")}
                        executingText={resolveText("Submitting...")}
                        isExecuting={isSubmitting}
                    />
                </Col>
            </Row>
        </>
    );

}