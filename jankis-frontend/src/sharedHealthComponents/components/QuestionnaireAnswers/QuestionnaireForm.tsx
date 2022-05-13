import Form from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { useContext, useEffect, useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { translateSchema } from '../../../sharedCommonComponents/helpers/SchemaTranslator';
import { formDataToQuestionnaireAnswers, questionnaireAnswersToFormData } from '../../helpers/QuestionnaireHelpers';
import { Models } from '../../../localComponents/types/models';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import UserContext from '../../../localComponents/contexts/UserContext';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { addQuestionnaireAnswer } from '../../redux/slices/questionnaireAnswersSlice';

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
    const [ loadedQuestionnaireAnswers, setLoadedQuestionnaireAnswers ] = useState<ViewModels.QuestionnaireAnswersViewModel>();
    const [ answers, setAnswers ] = useState<any>({});
    const isSubmitting = useAppSelector(state => state.questionnaireAnswers.isSubmitting);
    const dispatch = useAppDispatch();
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
            () => {},
            () => setIsLoadingSchema(false)
        );
        loadSchema();

        setIsLoadingQuestionnaire(true);
        const loadQuestionnaire = buildLoadObjectFunc<Models.Interview.Questionnaire>(
            `api/questionnaires/${props.questionnaireId}`,
            {},
            resolveText("Questionnaire_CouldNotLoad"),
            setQuestionnaire,
            () => {},
            () => setIsLoadingQuestionnaire(false)
        );
        loadQuestionnaire();
    }, [ props.questionnaireId ]);

    useEffect(() => {
        if(!props.answerId) {
            return;
        }
        setIsLoadingAnswer(true);
        const loadAnswers = buildLoadObjectFunc<ViewModels.QuestionnaireAnswersViewModel>(
            `api/questionnaires/${props.questionnaireId}/answers/${props.answerId}`,
            {},
            resolveText("Questionnaire_CouldNotLoadAnswers"),
            item => {
                setLoadedQuestionnaireAnswers(item);
                const formData = questionnaireAnswersToFormData(item.answers);
                setAnswers(formData);
            },
            () => {},
            () => setIsLoadingAnswer(false)
        );
        loadAnswers();
    }, [ props.questionnaireId, props.answerId ]);

    const onChange = (e: IChangeEvent) => {
        setAnswers(e.formData);
    }

    const onSubmit = async () => {
        const questionnaireAnswers = formDataToQuestionnaireAnswers(
            answers, 
            questionnaire!, 
            props.personId, 
            user!, 
            loadedQuestionnaireAnswers);
        const questionnaireAnswersVM: ViewModels.QuestionnaireAnswersViewModel = {
            id: questionnaireAnswers.id,
            answers: questionnaireAnswers.answers,
            createdBy: questionnaireAnswers.createdBy,
            createdTimestamp: questionnaireAnswers.createdTimestamp,
            hasAnswered: true,
            hasBeenSeenBySharer: questionnaireAnswers.hasBeenSeenBySharer,
            isVerified: questionnaireAnswers.isVerified,
            personId: questionnaireAnswers.personId,
            questionCount: questionnaire!.questions.length,
            questionnaireDescription: questionnaire!.description,
            questionnaireId: questionnaire!.id,
            questionnaireLanguage: questionnaire!.language,
            questionnaireTitle: questionnaire!.title,
            timestamp: questionnaireAnswers.timestamp,
            type: questionnaireAnswers.type
        };
        dispatch(addQuestionnaireAnswer({
            args: questionnaireAnswersVM,
            body: questionnaireAnswers,
            onSuccess: () => navigate(-1)
        }));
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