import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Autocomplete } from '../Autocomplete';
import { Models } from '../../types/models';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { SymptomModal } from '../../modals/SymptomModal';
import { ListFormControl } from '../ListFormControl';

interface SymptomsSectionProps {
    symptoms: Models.Symptoms.Symptom[];
    setSymptoms: (symptoms: Models.Symptoms.Symptom[]) => void;
    disabled?: boolean;
}

export const SymptomsSection = (props: SymptomsSectionProps) => {

    const symptoms = props.symptoms;
    const setSymptoms = props.setSymptoms;
    const symptomAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Symptoms.Symptom>('api/symptoms/search', 'searchText', 10), []);
    const [showSymptomModal, setShowSymptomModal] = useState<boolean>(false);

    const removeSymptom = (symptom: Models.Symptoms.Symptom) => {
        if(props.disabled) {
            return;
        }
        setSymptoms(symptoms.filter(x => x.id !== symptom.id));
    }

    return (
        <>
            <Form.Group as={Row}>
                <Form.Label as={Col}>Symptoms</Form.Label>
                <Col>
                    {!props.disabled ?
                    <Row>
                        <Col>
                            <Autocomplete
                                displayNameSelector={symptom => `${symptom.name}`}
                                search={symptomAutocompleteRunner.search}
                                onItemSelected={symptom => {
                                    if (!symptoms.find(x => x.id === symptom.id)) {
                                        setSymptoms(symptoms.concat([symptom]));
                                    }
                                }}
                                minSearchTextLength={3}
                                resetOnSelect
                            />
                        </Col>
                        <Col xs="auto">
                            <Button onClick={() => setShowSymptomModal(true)}>Add new...</Button>
                            <SymptomModal
                                show={showSymptomModal}
                                onCancel={() => setShowSymptomModal(false)}
                                onSymptomCreated={symptom => {
                                    if (!symptoms.find(x => x.id === symptom.id))
                                        setSymptoms(symptoms.concat([symptom]));
                                    setShowSymptomModal(false);
                                }}
                            />
                        </Col>
                    </Row> : null}
                </Col>
            </Form.Group>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl<Models.Symptoms.Symptom>
                        items={symptoms}
                        idFunc={item => item.id}
                        displayFunc={item => item.name}
                        removeItem={removeSymptom}
                    />
                </Col>
            </Row>
        </>
    );
}