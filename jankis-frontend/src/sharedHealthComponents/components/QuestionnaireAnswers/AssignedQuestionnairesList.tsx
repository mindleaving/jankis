import { Table } from 'react-bootstrap';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { QuestionnaireAnswerTableRow } from './QuestionnaireAnswerTableRow';

interface AssignedQuestionnairesListProps {
    personId: string;
    questionnaireAnswers: ViewModels.QuestionnaireAnswersViewModel[];
}

export const AssignedQuestionnairesList = (props: AssignedQuestionnairesListProps) => {
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th></th>
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
                        return (
                        <QuestionnaireAnswerTableRow
                            key={questionnaireAnswer.id}
                            questionnaireAnswer={questionnaireAnswer}
                        />
                    )})
                    : <tr>
                        <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                    </tr>}
                </tbody>
            </Table>
        </>
    );

}