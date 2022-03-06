import React, { useState } from 'react';
import { Form } from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { AsyncButton } from '../AsyncButton';

interface PublicationFormProps {}

export const PublicationForm = (props: PublicationFormProps) => {

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const schema: any = {
        title: "Publication",
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
    const [ publication, setPublication ] = useState<{}>({});

    const onChange = (e: IChangeEvent) => {
        setPublication(e.formData);
    }
    const onSubmit = async () => {

    }

    return (
        <Form
            schema={schema}
            formData={publication}
            onChange={onChange}
            onSubmit={onSubmit}
            onError={e => {}}
        >
            <AsyncButton
                type='submit'
                activeText='Submit'
                executingText='Submitting...'
                isExecuting={isSubmitting}
            />
        </Form>
    );

}