import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { Models } from '../../types/models';
import Form from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { NotificationManager } from 'react-notifications';
import { ViewModels } from '../../types/viewModels.d';
import { v4 as uuid } from 'uuid';
import UserContext from '../../contexts/UserContext';
import { StudyEnrollementState } from '../../types/enums.d';
import { formDataToQuestionnaireAnswers, questionnaireAnswersToFormData } from '../../helpers/QuestionnaireHelpers';

interface OfferStudyParticipationPageProps {}

export const OfferStudyParticipationPage = (props: OfferStudyParticipationPageProps) => {

    const { studyId } = useParams();
    const user = useContext(UserContext);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ study, setStudy ] = useState<Models.Study>();
    const [ inclusionCriteriaQuestionnaires, setInclusionCriteriaQuestionnaires ] = useState<Models.Interview.Questionnaire[]>([]);
    const [ inclusionCriteriaSchemas, setInclusionCriteriaSchemas ] = useState<ViewModels.QuestionnaireSchema[]>([]);
    const [ inclusionCriteriaDatas, setInclusionCriteriaDatas ] = useState<any[]>([]);
    const [ exclusionCriteriaQuestionnaires, setExclusionCriteriaQuestionnaires ] = useState<Models.Interview.Questionnaire[]>([]);
    const [ exclusionCriteriaSchemas, setExclusionCriteriaSchemas ] = useState<ViewModels.QuestionnaireSchema[]>([]);
    const [ exclusionCriteriaDatas, setExclusionCriteriaDatas ] = useState<any[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadStudy = buildLoadObjectFunc<ViewModels.StudyParticipationOfferViewModel>(
            `api/viewmodels/studies/${studyId}/offerparticipation`,
            {},
            resolveText("Study_CouldNotLoad"),
            vm => {
                setStudy(vm.study);
                setInclusionCriteriaQuestionnaires(vm.inclusionCriteriaQuestionnaires);
                setInclusionCriteriaSchemas(vm.inclusionCriteriaSchemas);
                setInclusionCriteriaDatas(vm.inclusionCriteriaAnswers.map(questionnaireAnswersToFormData));
                setExclusionCriteriaQuestionnaires(vm.exclusionCriteriaQuestionnaires);
                setExclusionCriteriaSchemas(vm.exclusionCriteriaSchemas);
                setExclusionCriteriaDatas(vm.exclusionCriteriaAnswers.map(questionnaireAnswersToFormData));
            },
            () => setIsLoading(false)
        );
        loadStudy();
    }, [ studyId ]);

    const onInclusionCriteriaDataChange = (questionnaireIndex: number, e: IChangeEvent) => {
        setInclusionCriteriaDatas(state => state.map((formData, index) => {
            if(index === questionnaireIndex) {
                return e.formData;
            }
            return formData;
        }));
    }
    const onExclusionCriteriaDataChange = (questionnaireIndex: number, e: IChangeEvent) => {
        setExclusionCriteriaDatas(state => state.map((formData, index) => {
            if(index === questionnaireIndex) {
                return e.formData;
            }
            return formData;
        }));
    }

    const submit = async () => {
        setIsSubmitting(true);
        try {
            const personId = user!.profileData.id;
            const enrollment: Models.StudyEnrollment = {
                id: uuid(), // Is being ignored by API
                personId: user!.profileData.id,
                state: StudyEnrollementState.ParticipationOffered,
                studyId: studyId!,
                timestamps: [ { 
                    newEnrollmentState: StudyEnrollementState.ParticipationOffered, 
                    timestamp: new Date() 
                }],
                inclusionCriteriaQuestionnaireAnswers: inclusionCriteriaQuestionnaires.map((questionnaire, questionnaireIndex) => {
                    const formData = inclusionCriteriaDatas[questionnaireIndex];
                    return formDataToQuestionnaireAnswers(formData, questionnaire, personId);
                }),
                exclusionCriteriaQuestionnaireAnswers: exclusionCriteriaQuestionnaires.map((questionnaire, questionnaireIndex) => {
                    const formData = exclusionCriteriaDatas[questionnaireIndex];
                    return formDataToQuestionnaireAnswers(formData, questionnaire, personId);
                })
            };
            await apiClient.instance!.post(`api/studies/${studyId}/offerparticipation`, {}, enrollment);
            navigate(`/study/${studyId}`);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("Study_OfferParticipation_CouldNotSubmit"));
        } finally {
            setIsSubmitting(false);
        }
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!study) {
        return (<h3>{resolveText("Study_CouldNotLoad")}</h3>);
    }

    return (
        <>
            <h1>{resolveText("Study_OfferParticipation")} - {resolveText("Study")} '{study.title}'</h1>
            <h2>{resolveText("Study_InclusionCriteria")}</h2>
            {inclusionCriteriaSchemas.map((schema,index) => (
                <Form
                    key={index}
                    schema={schema.schema}
                    formData={inclusionCriteriaDatas[index]}
                    onChange={(e: IChangeEvent) => onInclusionCriteriaDataChange(index, e)}
                    onSubmit={() => {}}
                >
                    <></>
                </Form>
            ))}
            <h2>{resolveText("Study_ExclusionCriteria")}</h2>
            {exclusionCriteriaSchemas.map((schema,index) => (
                <Form
                    key={index}
                    schema={schema.schema}
                    formData={exclusionCriteriaDatas[index]}
                    onChange={(e: IChangeEvent) => onExclusionCriteriaDataChange(index, e)}
                    onSubmit={() => {}}
                >
                    <></>
                </Form>
            ))}
            <AsyncButton
                onClick={submit}
                activeText={resolveText('Submit')}
                executingText={resolveText('Submitting...')}
                isExecuting={isSubmitting}
            />
        </>
    );

}