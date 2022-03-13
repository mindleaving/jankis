import React, { useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { ListFormControl } from '../components/ListFormControl';
import { resolveText } from '../helpers/Globalizer';
import { CreateEditContactPersonModal } from '../modals/CreateEditContactPersonModal';
import { CreateEditPublicationModal } from '../modals/CreateEditPublicationModal';
import { Models } from '../types/models';

interface CreateEditStudyPageProps {}

export const CreateEditStudyPage = (props: CreateEditStudyPageProps) => {

    const [ showPublicationModal, setShowPublicationModal ] = useState<boolean>(false);
    const [ showContactPersonModal, setShowContactPersonModal ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ contactPersons, setContactPersons ] = useState<Models.Contact[]>([]);
    const [ publications, setPublications ] = useState<Models.Publication[]>([]);

    const deleteContactPerson = (contactPerson: Models.Contact) => {
        setContactPersons(state => state.filter(x => x.id !== contactPerson.id));
    }
    const deletePublication = (publication: Models.Publication) => {
        setPublications(state => state.filter(x => x.title !== publication.title));
    }

    return (
        <>
            <h1>Create/edit study</h1>
            <Form>
                <FormGroup>
                    <FormLabel>{resolveText("Study_Title")}</FormLabel>
                    <FormControl
                        value={title}
                        onChange={(e:any) => setTitle(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Study_Description")}</FormLabel>
                    <FormControl
                        as="textarea"
                        value={description}
                        onChange={(e:any) => setDescription(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Study_ContactPersons")}</FormLabel>
                    <Button onClick={() => setShowContactPersonModal(true)}>{resolveText("Add")}</Button>
                    <CreateEditContactPersonModal show={showContactPersonModal} />
                    <ListFormControl
                        items={contactPersons}
                        displayFunc={x => x.name}
                        idFunc={x => x.id}
                        removeItem={deleteContactPerson}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Study_Publications")}</FormLabel>
                    <Button onClick={() => setShowPublicationModal(true)}>{resolveText("Add")}</Button>
                    <CreateEditPublicationModal show={showPublicationModal} />
                    <ListFormControl
                        items={publications}
                        displayFunc={x => x.title}
                        idFunc={x => x.title}
                        removeItem={deletePublication}
                    />
                </FormGroup>
            </Form>
        </>
    );

}