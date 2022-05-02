import { useParams } from 'react-router-dom';
import { QuestionnaireForm } from '../../components/QuestionnaireAnswers/QuestionnaireForm';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface AnswerQuestionnairePageProps {}

export const AnswerQuestionnairePage = (props: AnswerQuestionnairePageProps) => {

    const { questionnaireId, answerId, personId } = useParams();

    if(!questionnaireId) {
        return (<h3>{resolveText("Questionnaire_NoQuestionnaireIdSpecified")}</h3>);
    }
    if(!personId) {
        return (<h3>{resolveText("Questionnaire_NoPersonIdSpecified")}</h3>);
    }

    return (
        <QuestionnaireForm
            questionnaireId={questionnaireId}
            personId={personId}
            answerId={answerId}
        />
    );

}