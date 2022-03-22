import Form from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import React, { useEffect, useState } from 'react';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../sharedCommonComponents/helpers/LoadingHelpers';
import { translateSchema } from '../../sharedCommonComponents/helpers/SchemaTranslator';

interface QuestionnaireFormProps {
    questionnaireId: string;
}

export const QuestionnaireForm = (props: QuestionnaireFormProps) => {

    const [ isLoadingSchema, setIsLoadingSchema ] = useState<boolean>(true);
    const [ schema, setSchema ] = useState<any>();
    const [ answers, setAnswers ] = useState<any>({});

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
    }, [ props.questionnaireId ]);

    const onChange = (e: IChangeEvent) => {
        setAnswers(e.formData);
    }

    if(isLoadingSchema) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!schema) {
        return (<h3>{resolveText("Questionnaire_CouldNotLoad")}</h3>);
    }

    return (
        <Form
            schema={schema}
            formData={answers}
            onChange={onChange}
            onSubmit={() => {}}
        >
            <></>
        </Form>
    );

}