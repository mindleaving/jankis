import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { ListFormControl } from '../ListFormControl';


interface ReferencesSectionProps {
    references: string[];
    setReferences: (references: string[]) => void;
    disabled?: boolean;
}

export const ReferencesSection = (props: ReferencesSectionProps) => {

    const references = props.references;
    const setReferences = props.setReferences;
    const [newReference, setNewReference] = useState<string>('');

    const addReference = () => {
        setReferences(references.concat([ newReference ]));
        setNewReference('');
    }
    const canAddReference = () => {
        if(newReference.trim().length === 0) {
            return false;
        }
        if(references.includes(newReference)) {
            return false;
        }
        return true;
    }
    const removeReference = (reference: string) => {
        if(props.disabled) {
            return;
        }
        setReferences(references.filter(x => x !== reference));
    }

    return (
        <>
            {!props.disabled ?
            <>
            <Form.Group as={Row}>
                <Form.Label as={Col}>References</Form.Label>
                <Col>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={newReference}
                            onChange={(e:any) => setNewReference(e.target.value)}
                        />
                        <Button
                            onClick={addReference}
                            disabled={!canAddReference()}
                        >
                            Add
                        </Button>
                    </InputGroup>
                </Col>
            </Form.Group>
            </> : null}
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl<string>
                        items={references}
                        idFunc={item => item}
                        displayFunc={item => item.startsWith('http') ? <a href={item} target="_blank" rel="noreferrer">{item}</a> : item}
                        removeItem={removeReference}
                    />
                </Col>
            </Row>
        </>
    );
}