import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';
import { QuestionnaireAnswersViewerModal } from '../../modals/QuestionnaireAnswersViewerModal';
import { deleteQuestionnaireAnswer } from '../../redux/slices/questionnaireAnswersSlice';

interface QuestionnaireAnswerTableRowProps {
    questionnaireAnswer: ViewModels.QuestionnaireAnswersViewModel;
}

export const QuestionnaireAnswerTableRow = (props: QuestionnaireAnswerTableRowProps) => {

    const questionnaireAnswer = props.questionnaireAnswer;
    const [ showAnswerModal, setShowAnswerModal ] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const editUrl = `/healthrecord/${questionnaireAnswer.personId}/questionnaire/${questionnaireAnswer.questionnaireId}/answer/${questionnaireAnswer.id}`;

    const dispatchDeleteQuestionnaireAnswer = () => {
        openConfirmDeleteAlert(
            `${questionnaireAnswer.questionnaireTitle} (${formatDate(new Date(questionnaireAnswer.timestamp))})`,
            resolveText("QuestionnaireAnswer_Delete_Title"),
            resolveText("QuestionnaireAnswer_Delete_Message"),
            () => dispatch(deleteQuestionnaireAnswer({ args: questionnaireAnswer.id }))
        );
    }

    return (
        <tr>
            <td>
                <i
                    className='fa fa-trash red clickable'
                    onClick={dispatchDeleteQuestionnaireAnswer}
                />
            </td>
            <td>
                {questionnaireAnswer.questionnaireTitle}
                <div><small>{questionnaireAnswer.questionnaireDescription}</small></div>
            </td>
            <td>{questionnaireAnswer.questionCount}</td>
            <td>
                {formatDate(new Date(questionnaireAnswer.createdTimestamp))}
                <div><small>{resolveText("by")} {questionnaireAnswer.createdBy}</small></div>
            </td>
            <td>
                {questionnaireAnswer.hasAnswered 
                ? <>
                    <Badge bg="success">{resolveText("Questionnaire_HasBeenAnswered")}</Badge>
                    <div>{formatDate(new Date(questionnaireAnswer.timestamp))}</div>
                </>
                : <>
                    <Button 
                        onClick={() => navigate(editUrl)}
                    >
                        {resolveText("Questionnaire_FillOut")}
                    </Button>
                </>}
            </td>
            <td>
                {questionnaireAnswer.hasAnswered
                ? <>
                    <Button onClick={() => setShowAnswerModal(true)}>{resolveText("View")}</Button>
                    <Button variant="link" onClick={() => navigate(editUrl)}>{resolveText("Edit...")}</Button>
                </>
                : null}
                <QuestionnaireAnswersViewerModal
                    show={showAnswerModal}
                    questionnaireAnswers={questionnaireAnswer}
                    onRequestClose={() => setShowAnswerModal(false)}
                />
            </td>
        </tr>
    );

}