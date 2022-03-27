import React from 'react';
import { Badge, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate } from '../../helpers/Formatters';

interface AssignedQuestionnairesListProps {
    personId: string;
    questionnaires: ViewModels.QuestionnaireAnswersViewModel[];
}

export const AssignedQuestionnairesList = (props: AssignedQuestionnairesListProps) => {

    const navigate = useNavigate();
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
                    {props.questionnaires.length > 0
                    ? props.questionnaires.map(questionnaire => {
                        const editUrl = `/healthrecord/${props.personId}/questionnaire/${questionnaire.questionnaireId}/answer/${questionnaire.answersId}`;
                        return (
                        <tr key={questionnaire.answersId}>
                            <td>
                                {questionnaire.questionnaireTitle}
                                <div><small>{questionnaire.questionnaireDescription}</small></div>
                            </td>
                            <td>{questionnaire.questionCount}</td>
                            <td>
                                {formatDate(new Date(questionnaire.assignedTimestamp))}
                                <div><small>{resolveText("by")} {questionnaire.assignedBy}</small></div>
                            </td>
                            <td>
                                {questionnaire.hasAnswered 
                                ? <>
                                    <Badge bg="success">{resolveText("Questionnaire_HasBeenAnswered")}</Badge>
                                    <div>{formatDate(new Date(questionnaire.lastChangeTimestamp))}</div>
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
                                {questionnaire.hasAnswered
                                ? <Button variant="link" onClick={() => navigate(editUrl)}>{resolveText("Edit...")}</Button>
                                : null}
                            </td>
                        </tr>
                    )})
                    : <tr>
                        <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                    </tr>}
                </tbody>
            </Table>
        </>
    );

}