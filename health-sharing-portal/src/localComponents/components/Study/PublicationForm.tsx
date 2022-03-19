import React, { useState } from 'react';
import { Form } from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';

interface PublicationFormProps {
    publication?: Models.Publication;
    onSubmit: (publication: Models.Publication) => void;
}

export const PublicationForm = (props: PublicationFormProps) => {

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ publication, setPublication ] = useState<{}>(props.publication ?? {
        id: uuid()
    });

    const schema: any = {
        type: "object",
        properties: {
            title: {
                type: "string",
                title: "Title"
            },
            abstract: {
                type: "string",
                title: "Abstract"
            },
            authors: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            title: "Name"
                        },
                        organization: {
                            type: "string",
                            title: "Organization"
                        }
                    },
                    required: [ "name" ]
                }
            }
        },
        required: [ "title", "authors" ]
    }

    const onChange = (e: IChangeEvent) => {
        setPublication(e.formData);
    }
    const onSubmit = async () => {
        setIsSubmitting(true);
        props.onSubmit(publication as Models.Publication);
        setIsSubmitting(false);
    }

    return (
        <Form
            id='publicationForm'
            schema={schema}
            formData={publication}
            onChange={onChange}
            onSubmit={onSubmit}
            onError={e => {}}
        >
            <AsyncButton
                type='submit'
                form='publicationForm'
                activeText='Submit'
                executingText='Submitting...'
                isExecuting={isSubmitting}
            />
        </Form>
    );

}