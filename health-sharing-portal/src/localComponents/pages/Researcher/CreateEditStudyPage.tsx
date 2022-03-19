import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { CreateEditContactPersonModal } from '../../modals/CreateEditContactPersonModal';
import { CreateEditPublicationModal } from '../../modals/CreateEditPublicationModal';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { v4 as uuid } from 'uuid';
import UserContext from '../../contexts/UserContext';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';

interface CreateEditStudyPageProps {}

export const CreateEditStudyPage = (props: CreateEditStudyPageProps) => {

    const user = useContext(UserContext);
    const { studyId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(!!studyId);
    const [ showPublicationModal, setShowPublicationModal ] = useState<boolean>(false);
    const [ showContactPersonModal, setShowContactPersonModal ] = useState<boolean>(false);
    const [ createdBy, setCreatedBy ] = useState<string>();
    const [ title, setTitle ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ contactPersons, setContactPersons ] = useState<Models.Contact[]>([]);
    const [ publications, setPublications ] = useState<Models.Publication[]>([]);
    const [ isAcceptingEnrollments, setIsAcceptingEnrollments ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        if(!studyId) {
            return;
        }
        setIsLoading(true);
        const loadStudy = buildLoadObjectFunc(
            `api/studies/${studyId}`,
            {},
            resolveText("CreateStudy_CouldNotLoad"),
            (item: Models.Study) => {
                setCreatedBy(item.createdBy);
                setTitle(item.title);
                setDescription(item.description);
                setContactPersons(item.contactPersons);
                setPublications(item.publications);
                setIsAcceptingEnrollments(item.isAcceptingEnrollments);
            },
            () => setIsLoading(false)
        );
        loadStudy();
    }, [ studyId ]);

    const navigate = useNavigate();
    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const study: Models.Study = {
                id: studyId ?? uuid(),
                createdBy: createdBy ?? user!.username,
                title: title,
                description: description,
                contactPersons: contactPersons,
                publications: publications,
                isAcceptingEnrollments: isAcceptingEnrollments
            };
            console.log(study);
            await apiClient.instance!.put(`api/studies/${study.id}`, {}, study);
            navigate(`/study/${study.id}`);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("CreateStudy_CouldNotStore"));
        } finally {
            setIsSubmitting(false);
        }
    }

    const addContactPerson = (contactPerson: Models.Contact) => {
        if(contactPersons.some(x => x.id === contactPerson.id)) {
            setContactPersons(state => state.map(x => {
                if(x.id !== contactPerson.id) {
                    return x;
                }
                return contactPerson;
            }));
        } else {
            setContactPersons(state => state.concat(contactPerson));
        }
        setShowContactPersonModal(false);
    }
    const removeContactPerson = (contactPerson: Models.Contact, force: boolean = false) => {
        if(!force) {
            openConfirmDeleteAlert(
                contactPerson.id, 
                contactPerson.name, 
                resolveText("Publication_ConfirmDelete_Title"),
                resolveText("Publication_ConfirmDelete_Message"),
                () => removeContactPerson(contactPerson, true)
            );
            return;
        }
        setContactPersons(state => state.filter(x => x.id !== contactPerson.id));
    }

    const addPublication = (publication: Models.Publication) => {
        if(publications.some(x => x.id === publication.id)) {
            setPublications(state => state.map(x => {
                if(x.id !== publication.id) {
                    return x;
                }
                return publication;
            }));
        } else {
            setPublications(state => state.concat(publication));
        }
        setShowPublicationModal(false);
    }
    const removePublication = (publication: Models.Publication, force: boolean = false) => {
        if(!force) {
            openConfirmDeleteAlert(
                publication.id, 
                publication.title, 
                resolveText("Publication_ConfirmDelete_Title"),
                resolveText("Publication_ConfirmDelete_Message"),
                () => removePublication(publication, true)
            );
            return;
        }
        setPublications(state => state.filter(x => x.id !== publication.id));
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }

    return (
        <>
            <h1>Create/edit study</h1>
            <Form id='studyForm' onSubmit={submit}>
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
                <FormGroup as={Row} className="mt-2">
                    <FormLabel column xs={2}>{resolveText("Study_ContactPersons")}</FormLabel>
                    <Col>
                        <ListFormControl
                            items={contactPersons}
                            displayFunc={x => x.name}
                            idFunc={x => x.id}
                            removeItem={removeContactPerson}
                        />
                        <Button className='m-2' onClick={() => setShowContactPersonModal(true)}>{resolveText("Add")}</Button>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mt-3">
                    <FormLabel column xs={2}>{resolveText("Study_Publications")}</FormLabel>
                    <Col>
                        <ListFormControl
                            items={publications}
                            displayFunc={x => x.title}
                            idFunc={x => x.title}
                            removeItem={removePublication}
                        />
                        <Button className='m-2' onClick={() => setShowPublicationModal(true)}>{resolveText("Add")}</Button>
                    </Col>
                </FormGroup>
                <Row className='mt-3'>
                    <Col>
                        <AsyncButton
                            type='submit'
                            form='studyForm'
                            className='m-3'
                            activeText={resolveText("Submit")}
                            executingText={resolveText("Submitting...")}
                            isExecuting={isSubmitting}
                        />
                    </Col>
                </Row>
            </Form>
            <CreateEditPublicationModal 
                show={showPublicationModal}
                onCloseRequested={() => setShowPublicationModal(false)}
                onPublicationCreated={addPublication}
            />
            <CreateEditContactPersonModal 
                show={showContactPersonModal} 
                onCloseRequested={() => setShowContactPersonModal(false)}
                onContactPersonCreated={addContactPerson}
            />
        </>
    );

}