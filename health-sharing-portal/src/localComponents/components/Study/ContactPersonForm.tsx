import React, { useState } from 'react';
import { Form } from '@rjsf/bootstrap-4';
import { IChangeEvent } from '@rjsf/core';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';

interface ContactPersonFormProps {
    contactPerson?: Models.Contact;
    onSubmit: (contactPerson: Models.Contact) => void;
}

export const ContactPersonForm = (props: ContactPersonFormProps) => {

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ contactPerson, setContactPerson ] = useState<Models.Contact>(props.contactPerson ?? {
        id: uuid(),
        name: '',
        note: ''
    });

    const schema: any = {
        type: "object",
        properties: {
            name: {
                type: "string",
                title: "Name"
            },
            telephone: {
                type: "string",
                title: "Telephone"
            },
            relation: {
                type: "string",
                enum: [ "Family", "Friend", "Guardian" ],
                title: "Relation"
            },
            note: {
                type: "string",
                title: "Note"
            }
        },
        required: [ "name", "telephone", "relation" ]
    };
    

    const onChange = (e: IChangeEvent) => {
        setContactPerson(e.formData);
    }
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            props.onSubmit(contactPerson as Models.Contact);
        } catch(error: any) {

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form
            id='contactPersonForm'
            schema={schema}
            formData={contactPerson}
            onChange={onChange}
            onSubmit={onSubmit}
            onError={e => {}}
        >
            <AsyncButton
                type='submit'
                form='contactPersonForm'
                activeText='Submit'
                executingText='Submitting...'
                isExecuting={isSubmitting}
            />
        </Form>
    );

}