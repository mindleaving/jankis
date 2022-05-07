import { differenceInSeconds } from 'date-fns';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { AssignedQuestionnairesList } from './AssignedQuestionnairesList';

interface PatientQuestionnairesViewProps {
    personId: string;
}

export const PatientQuestionnairesView = (props: PatientQuestionnairesViewProps) => {

    const questionnaires = useAppSelector(state => state.questionnaireAnswers.items);
    const inverseTimeOrderedQuestionnaires = [...questionnaires]
        .sort((a,b) => -differenceInSeconds(
            new Date(a.timestamp ?? a.createdTimestamp), 
            new Date(b.timestamp ?? b.createdTimestamp)
            )
        );
    const pendingQuestionnaires = inverseTimeOrderedQuestionnaires.filter(x => !x.hasAnswered);
    const completedQuestionnaires = inverseTimeOrderedQuestionnaires.filter(x => x.hasAnswered);
    return (
        <>
            <h2>{resolveText("Questionnaires_Pending")}</h2>
            <AssignedQuestionnairesList
                personId={props.personId}
                questionnaireAnswers={pendingQuestionnaires}
            />
            <h2>{resolveText("Questionnaires_Completed")}</h2>
            <AssignedQuestionnairesList
                personId={props.personId}
                questionnaireAnswers={completedQuestionnaires}
            />
        </>
    );

}