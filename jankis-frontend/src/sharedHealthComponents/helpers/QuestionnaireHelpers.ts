import { Models } from "../../localComponents/types/models";
import { v4 as uuid } from 'uuid';
import { HealthRecordEntryType } from "../../localComponents/types/enums.d";
import { ViewModels } from "../../localComponents/types/viewModels";

export const questionnaireAnswersToFormData = (questionnaireAnswers: Models.Interview.QuestionAnswer[]): { [key: string]: string } => {
    const formData: { [key: string]: string } = {};
    if(!questionnaireAnswers) {
        return formData;
    }
    for (let answerIndex = 0; answerIndex < questionnaireAnswers.length; answerIndex++) {
        const answer = questionnaireAnswers[answerIndex];
        formData[`Q${answerIndex+1}`] = JSON.parse(answer.answer);
    }
    return formData;
}
export const formDataToQuestionnaireAnswers = (
    formData: { [key:string]: string }, 
    questionnaire: Models.Interview.Questionnaire,
    personId: string,
    currentUser: ViewModels.IUserViewModel,
    existingAnswer?: ViewModels.QuestionnaireAnswersViewModel)
    : Models.Interview.QuestionnaireAnswers => {

    const answers = questionnaire.questions.map((question, questionIndex) => {
        const formDataEntry = formData[`Q${questionIndex+1}`];
        if(!formDataEntry) {
            return null;
        }
        return {
            question: question,
            answer: JSON.stringify(formDataEntry)
        };
    })
    .filter(answer => answer !== null)
    .map(answer => answer as Models.Interview.QuestionAnswer);
    return {
        id: existingAnswer?.id ?? uuid(),
        type: HealthRecordEntryType.Questionnaire,
        createdBy: existingAnswer?.createdBy ?? currentUser!.accountId,
        createdTimestamp: existingAnswer?.createdTimestamp ?? new Date().toISOString() as any,
        isVerified: false,
        hasBeenSeenBySharer: currentUser.profileData.id === personId,
        personId: personId,
        questionnaireId: questionnaire.id,
        timestamp: new Date().toISOString() as any,
        answers: answers
    };
}