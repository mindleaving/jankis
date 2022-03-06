import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { SymptomType } from '../types/enums.d';
import { Models } from '../types/models';
import Container from 'react-bootstrap/Container';
import { Autocomplete } from '../components/Autocomplete';
import { AutocompleteRunner } from '../helpers/AutocompleteRunner';
import { ListFormControl } from '../components/ListFormControl';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import { apiClient } from '../communication/ApiClient';
import { NotificationManager } from 'react-notifications';

interface SymptomModalProps {
    symptom?: Models.Symptoms.Symptom;
    show: boolean;
    onSymptomCreated: (symptom: Models.Symptoms.Symptom) => void;
    onCancel: () => void;
}

export const SymptomModal = (props: SymptomModalProps) => {

    const bodyStructureAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Symptoms.BodyStructure>('api/bodystructures/search', 'searchText', 10), []);

    const [ name, setName ] = useState<string>(props.symptom?.name ?? '');
    const [ type, setType ] = useState<SymptomType>(props.symptom?.type ?? SymptomType.Systemic);
    const [ bodyParts, setBodyParts ] = useState<Models.Symptoms.BodyStructure[]>((props.symptom as Models.Symptoms.LocalizedSymptom)?.bodyStructures ?? []);
    useEffect(() => {
        if(props.symptom) {
            setName(props.symptom.name);
            setType(props.symptom.type);
            const localizedSymptom = props.symptom as Models.Symptoms.LocalizedSymptom;
            if(localizedSymptom.bodyStructures) {
                setBodyParts(localizedSymptom.bodyStructures);
            }
        } else {
            reset();
        }
    }, [ props.symptom ]);

    const createSymptom = async (event: React.FormEvent) => {
        event.preventDefault();
        let symptom: Models.Symptoms.Symptom = {
            id: props.symptom?.id ?? uuid(),
            name: name,
            type: type
        };
        if(type === SymptomType.Localized) {
            const localizedSymptom: Models.Symptoms.LocalizedSymptom = Object.assign(symptom, {
                bodyStructures: bodyParts
            });
            symptom = localizedSymptom;
        }
        try {
            await apiClient.put(`api/symptoms/${symptom.id}`, {}, symptom);
            NotificationManager.success('Symptom updated!');
            props.onSymptomCreated(symptom);
            reset();
        } catch(error){
            NotificationManager.error('Could not store symptom: ', error.message);
        }
    }

    const reset = () => {
        setName('');
        setType(SymptomType.Systemic);
        setBodyParts([]);
    }

    return (
        <Modal show={props.show} onHide={props.onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>{props.symptom ? 'Edit' : 'Add'} symptom</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                    className="needs-validation was-validated" 
                    id="SymptomModalForm" 
                    onSubmit={createSymptom}>
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
                        <Form.Label column>Type</Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                value={type}
                                onChange={(e:any) => setType(e.target.value)}
                            >
                                <option value={SymptomType.Systemic}>Systemic</option>
                                <option value={SymptomType.Localized}>Localized</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    {type === SymptomType.Localized ?
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column>Affected body parts:</Form.Label>
                            <Col>
                                <Autocomplete 
                                    search={bodyStructureAutocompleteRunner.search}
                                    displayNameSelector={bodyPart => `${bodyPart.name}`}
                                    onItemSelected={item => setBodyParts(bodyParts.concat([item]))}
                                />
                            </Col>
                        </Form.Group>
                        <Row>
                            <Col></Col>
                            <Col>
                                <ListFormControl<Models.Symptoms.BodyStructure>
                                    items={bodyParts}
                                    displayFunc={bodyPart => `${bodyPart.name}`}
                                    idFunc={bodyPart => bodyPart.icdCode}
                                    removeItem={item => setBodyParts(bodyParts.filter(x => x.icdCode !== item.icdCode))}
                                />
                            </Col>
                        </Row>
                    </> : null}
                </Container>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
                <Button variant="danger" onClick={reset}>Reset</Button>
                <Button type="submit" form="SymptomModalForm">{props.symptom ? 'Update' : 'Create'}</Button>
            </Modal.Footer>
        </Modal>
    );
}