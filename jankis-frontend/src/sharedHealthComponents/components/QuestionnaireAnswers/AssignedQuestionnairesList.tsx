import React, { useState } from 'react';
import { Badge, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';
import { QuestionnaireAnswersViewerModal } from '../../modals/QuestionnaireAnswersViewerModal';

interface AssignedQuestionnairesListProps {
    personId: string;
    questionnaireAnswers: ViewModels.QuestionnaireAnswersViewModel[];
}

export const AssignedQuestionnairesList = (props: AssignedQuestionnairesListProps) => {

    const [ showAnswerModal, setShowAnswerModal ] = useState<boolean>(false);
    const [ selectedAnswer, setSelectedAnswer ] = useState<ViewModels.QuestionnaireAnswersViewModel>();

    const navigate = useNavigate();
    const viewAnswer = (answerId: string) => {
        setSelectedAnswer(props.questionnaireAnswers.find(x => x.id === answerId));
        setShowAnswerModal(true);
    }
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>{resolveText("Questionnaire")}</th>
                        <th>{resolveText("Questionnaire_QuestionCount")}</th>
                        <th>{resolveText("Questionnaire_AssignmentInfo")}</th>
                        <th>{resolveText("Questionnaire_AnswerInfo")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.questionnaireAnswers.length > 0
                    ? props.questionnaireAnswers.map(questionnaireAnswer => {
                        const editUrl = `/healthrecord/${props.personId}/questionnaire/${questionnaireAnswer.questionnaireId}/answer/${questionnaireAnswer.id}`;
                        return (
                        <tr key={questionnaireAnswer.id}>
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
                                    <Button onClick={() => viewAnswer(questionnaireAnswer.id)}>{resolveText("View")}</Button>
                                    <Button variant="link" onClick={() => navigate(editUrl)}>{resolveText("Edit...")}</Button>
                                </>
                                : null}
                            </td>
                        </tr>
                    )})
                    : <tr>
                        <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                    </tr>}
                </tbody>
            </Table>
            {selectedAnswer ? <QuestionnaireAnswersViewerModal
                show={showAnswerModal}
                questionnaireAnswers={selectedAnswer}
                onRequestClose={() => setShowAnswerModal(false)}
            /> : null}
        </>
    );

}