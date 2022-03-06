import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Models } from '../../types/models';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import { apiClient } from '../../communication/ApiClient';
import { NotificationManager } from 'react-notifications';

interface DiseaseHostModalProps {
    diseaseHost?: Models.Icd.Annotation.Epidemiology.DiseaseHost;
    show: boolean;
    onDiseaseHostCreated: (diseaseHost: Models.Icd.Annotation.Epidemiology.DiseaseHost) => void;
    onCancel: () => void;
}

export const DiseaseHostModal = (props: DiseaseHostModalProps) => {

    const [ name, setName ] = useState<string>(props.diseaseHost?.name ?? '');
    useEffect(() => {
        if(props.diseaseHost) {
            setName(props.diseaseHost.name);
        } else {
            reset();
        }
    }, [ props.diseaseHost ]);

    const createDiseaseHost = async (event: React.FormEvent) => {
        event.preventDefault();
        let diseaseHost: Models.Icd.Annotation.Epidemiology.DiseaseHost = {
            id: props.diseaseHost?.id ?? uuid(),
            name: name
        };
        try {
            await apiClient.put(`api/diseasehosts/${diseaseHost.id}`, {}, diseaseHost);
            NotificationManager.success('Disease host created/updated!');
            props.onDiseaseHostCreated(diseaseHost);
            reset();
        } catch(error){
            NotificationManager.error('Could not store disease host: ', error.message);
        }
    }

    const reset = () => {
        setName('');
    }

    return (
        <Modal show={props.show} onHide={props.onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>{props.diseaseHost ? 'Edit' : 'Add'} disease host</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                    className="needs-validation was-validated" 
                    id="DiseaseHostModalForm" 
                    onSubmit={createDiseaseHost}>
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
                </Container>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
                <Button variant="danger" onClick={reset}>Reset</Button>
                <Button type="submit" form="DiseaseHostModalForm">{props.diseaseHost ? 'Update' : 'Create'}</Button>
            </Modal.Footer>
        </Modal>
    );
}