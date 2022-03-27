import { differenceInSeconds } from 'date-fns';
import React from 'react';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AssignedQuestionnairesList } from './AssignedQuestionnairesList';

interface PatientQuestionnairesViewProps {
    personId: string;
    questionnaires: ViewModels.QuestionnaireAnswersViewModel[];
}

export const PatientQuestionnairesView = (props: PatientQuestionnairesViewProps) => {

    const inverseTimeOrderedQuestionnaires = props.questionnaires
        .sort((a,b) => -differenceInSeconds(
            new Date(a.lastChangeTimestamp ?? a.assignedTimestamp), 
            new Date(b.lastChangeTimestamp ?? b.assignedTimestamp)
            )
        );
    const pendingQuestionnaires = inverseTimeOrderedQuestionnaires.filter(x => !x.hasAnswered);
    const completedQuestionnaires = inverseTimeOrderedQuestionnaires.filter(x => x.hasAnswered);
    return (
        <>
            <h2>{resolveText("Questionnaires_Pending")}</h2>
            <AssignedQuestionnairesList
                personId={props.personId}
                questionnaires={pendingQuestionnaires}
            />
            <h2>{resolveText("Questionnaires_Completed")}</h2>
            <AssignedQuestionnairesList
                personId={props.personId}
                questionnaires={completedQuestionnaires}
            />
        </>
    );

}