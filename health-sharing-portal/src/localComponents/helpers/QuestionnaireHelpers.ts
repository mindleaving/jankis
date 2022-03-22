import { Models } from "../types/models";
import { v4 as uuid } from 'uuid';

export const questionnaireAnswersToFormData = (questionnaireAnswers: Models.Interview.QuestionnaireAnswers): { [key: string]: string } => {
    const formData: { [key: string]: string } = {};
    if(!questionnaireAnswers) {
        return formData;
    }
    for (const answer of questionnaireAnswers.answers) {
        formData[answer.question.title] = answer.answer;
    }
    return formData;
}
export const formDataToQuestionnaireAnswers = (
    formData: { [key:string]: string }, 
    questionnaire: Models.Interview.Questionnaire,
    personId: string)
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
        id: uuid(),
        personId: personId,
        questionnaireId: questionnaire.id,
        timestamp: new Date(),
        answers: answers
    };
}