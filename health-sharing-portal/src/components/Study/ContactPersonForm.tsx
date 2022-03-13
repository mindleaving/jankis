import React, { useState } from 'react';
import { Form } from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { AsyncButton } from '../AsyncButton';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';

interface ContactPersonFormProps {}

export const ContactPersonForm = (props: ContactPersonFormProps) => {

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const schema: any = {
        title: "Contact person",
        type: "object",
        properties: {
            name: {
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
        required: [ "name" ]
    }
    const [ contactPerson, setContactPerson ] = useState<Models.Contact>({
        id: uuid(),
        name: ''
    });

    const onChange = (e: IChangeEvent) => {
        setContactPerson(e.formData);
    }
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {

        } catch(error: any) {

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form
            schema={schema}
            formData={contactPerson}
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