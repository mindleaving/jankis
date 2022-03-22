import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { GenericTypeCreateEditPage } from '../../../sharedCommonComponents/pages/GenericTypeCreateEditPage';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';

interface CreateEditQuestionnairePageProps {}

export const CreateEditQuestionnairePage = (props: CreateEditQuestionnairePageProps) => {

    const navigate = useNavigate();
    const questionnaireLoader = async (id: string) => {
        const response = await apiClient.instance!.get(`api/studies/${id}`, {})
        return await response.json();
    };
    const questionnaireSubmitter = async (questionnaire: Models.Interview.Questionnaire) => {
        questionnaire.questions.forEach(question => question.id = uuid());
        await apiClient.instance!.put(`api/questionnaires/${questionnaire.id}`, {}, questionnaire);
        navigate(-1);
    };

    return (
        <GenericTypeCreateEditPage<Models.Interview.Questionnaire>
            typeName='questionnaire'
            itemLoader={questionnaireLoader}
            onSubmit={questionnaireSubmitter}
            uiSchema={{
                questions: {
                    items: {
                        id: {
                            "ui:readonly": true
                        }
                    }
                }
            }}
        />
    );

}