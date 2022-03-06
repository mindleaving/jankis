import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Models } from '../types/models';
import Container from 'react-bootstrap/Container';
import { Autocomplete } from '../components/Autocomplete';
import { AutocompleteRunner } from '../helpers/AutocompleteRunner';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import { apiClient } from '../communication/ApiClient';
import { NotificationManager } from 'react-notifications';

interface ObservationModalProps {
    observation?: Models.Icd.Annotation.Diagnostics.Observation;
    show: boolean;
    onObservationCreated: (observation: Models.Icd.Annotation.Diagnostics.Observation) => void;
    onCancel: () => void;
}

export const ObservationModal = (props: ObservationModalProps) => {

    const bodyStructureAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Symptoms.BodyStructure>('api/bodystructures/search', 'searchText', 10), []);

    const [ name, setName ] = useState<string>(props.observation?.name ?? '');
    const [ bodyPart, setBodyPart ] = useState<Models.Symptoms.BodyStructure | undefined>(props.observation?.bodyStructure);
    useEffect(() => {
        if(props.observation) {
            setName(props.observation.name);
            setBodyPart(props.observation.bodyStructure);
        } else {
            reset();
        }
    }, [ props.observation ]);

    const createObservation = async (event: React.FormEvent) => {
        event.preventDefault();
        let observation: Models.Icd.Annotation.Diagnostics.Observation = {
            id: props.observation?.id ?? uuid(),
            name: name,
            bodyStructure: bodyPart
        };
        try {
            await apiClient.put(`api/observations/${observation.id}`, {}, observation);
            NotificationManager.success('Observation updated!');
            props.onObservationCreated(observation);
            reset();
        } catch(error){
            NotificationManager.error(error.message, 'Could not store observation');
        }
    }

    const reset = () => {
        setName('');
        setBodyPart(undefined);
    }

    return (
        <Modal show={props.show} onHide={props.onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>{props.observation ? 'Edit' : 'Add'} observation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                    className="needs-validation was-validated" 
                    id="ObservationModalForm" 
                    onSubmit={createObservation}>
                <Container>
                    <Form.Group as={Row}>
                        <Form.Label column>Name</Form.Label>
                        <Col>
                            <Form.Control required
                                type="text"
                                value={name}
                                onChange={(e:any) => setName(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column>Body part:</Form.Label>
                        <Col>
                            <Autocomplete 
                                search={bodyStructureAutocompleteRunner.search}
                                displayNameSelector={bodyPart => `${bodyPart.name}`}
                                onItemSelected={item => setBodyPart(item)}
                            />
                        </Col>
                    </Form.Group>
                </Container>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
                <Button variant="danger" onClick={reset}>Reset</Button>
                <Button type="submit" form="ObservationModalForm">{props.observation ? 'Update' : 'Create'}</Button>
            </Modal.Footer>
        </Modal>
    );
}