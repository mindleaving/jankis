import Form from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import React, { useContext, useEffect, useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { translateSchema } from '../../../sharedCommonComponents/helpers/SchemaTranslator';
import { formDataToQuestionnaireAnswers, questionnaireAnswersToFormData } from '../../helpers/QuestionnaireHelpers';
import { Models } from '../../../localComponents/types/models';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import UserContext from '../../../localComponents/contexts/UserContext';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

interface QuestionnaireFormProps {
    questionnaireId: string;
    personId: string;
    answerId?: string;
}

export const QuestionnaireForm = (props: QuestionnaireFormProps) => {

    const user = useContext(UserContext);
    const [ isLoadingSchema, setIsLoadingSchema ] = useState<boolean>(true);
    const [ isLoadingQuestionnaire, setIsLoadingQuestionnaire ] = useState<boolean>(true);
    const [ isLoadingAnswer, setIsLoadingAnswer ] = useState<boolean>(!!props.answerId);
    const [ schema, setSchema ] = useState<any>();
    const [ questionnaire, setQuestionnaire ] = useState<Models.Interview.Questionnaire>();
    const [ answers, setAnswers ] = useState<any>({});
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoadingSchema(true);
        const loadSchema = buildLoadObjectFunc(
            `api/questionnaires/${props.questionnaireId}/schema`,
            {},
            resolveText("Questionnaire_CouldNotLoad"),
            item => {
                const translatedSchema = translateSchema(item);
                setSchema(translatedSchema);
            },
            () => setIsLoadingSchema(false)
        );
        loadSchema();

        setIsLoadingQuestionnaire(true);
        const loadQuestionnaire = buildLoadObjectFunc<Models.Interview.Questionnaire>(
            `api/questionnaires/${props.questionnaireId}`,
            {},
            resolveText("Questionnaire_CouldNotLoad"),
            setQuestionnaire,
            () => setIsLoadingQuestionnaire(false)
        );
        loadQuestionnaire();
    }, [ props.questionnaireId ]);

    useEffect(() => {
        if(!props.answerId) {
            return;
        }
        setIsLoadingAnswer(true);
        const loadAnswers = buildLoadObjectFunc<Models.Interview.QuestionnaireAnswers>(
            `api/questionnaires/${props.questionnaireId}/answers/${props.answerId}`,
            {},
            resolveText("Questionnaire_CouldNotLoadAnswers"),
            item => {
                const formData = questionnaireAnswersToFormData(item);
                setAnswers(formData);
            },
            () => setIsLoadingAnswer(false)
        );
        loadAnswers();
    }, [ props.questionnaireId, props.answerId ]);

    const onChange = (e: IChangeEvent) => {
        setAnswers(e.formData);
    }

    const onSubmit = async () => {
        setIsSubmitting(true);
        const answerId = props.answerId ?? uuid();
        buildAndStoreObject(
            `api/questionnaires/${props.questionnaireId}/answers/${answerId}`,
            resolveText("Questionnaire_SuccessfullyStored"),
            resolveText("Questionnaire_CouldNotSubmit"),
            () => {
                const questionnaireAnswers = formDataToQuestionnaireAnswers(answers, questionnaire!, props.personId, user!.username);
                questionnaireAnswers.id = answerId;
                return questionnaireAnswers;
            },
            () => { navigate(-1); },
            () => setIsSubmitting(false)
        );
    }

    if(isLoadingSchema || isLoadingQuestionnaire || isLoadingAnswer) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!schema || !questionnaire) {
        return (<h3>{resolveText("Questionnaire_CouldNotLoad")}</h3>);
    }
    if(!!props.answerId && !answers) {
        return (<h3>{resolveText("Questionnaire_CouldNotLoadAnswers")}</h3>);
    }

    return (
        <Form
            schema={schema}
            formData={answers}
            onChange={onChange}
            onSubmit={onSubmit}
        >
            <StoreButton
                type='submit'
                isStoring={isSubmitting}
            />
        </Form>
    );

}