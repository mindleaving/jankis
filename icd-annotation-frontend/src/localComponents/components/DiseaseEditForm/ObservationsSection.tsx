import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { ObservationModal } from '../../modals/ObservationModal';
import { Models } from '../../types/models';

interface ObservationsSectionProps {
    observations: Models.Icd.Annotation.Diagnostics.Observation[];
    setObservations: (observations: Models.Icd.Annotation.Diagnostics.Observation[]) => void;
    disabled?: boolean;
}

export const ObservationsSection = (props: ObservationsSectionProps) => {

    const observations = props.observations;
    const setObservations = props.setObservations;
    const observationAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.Annotation.Diagnostics.Observation>('api/observations/search', 'searchText', 10), []);
    const [showObservationModal, setShowObservationModal] = useState<boolean>(false);

    const removeObservation = (observation: Models.Icd.Annotation.Diagnostics.Observation) => {
        if(props.disabled) {
            return;
        }
        setObservations(observations.filter(x => x.id !== observation.id));
    }

    return (
        <>
            <Form.Group as={Row}>
                <Form.Label as={Col}>Observations</Form.Label>
                <Col>
                    {!props.disabled ?
                    <Row>
                        <Col>
                            <Autocomplete
                                displayNameSelector={observation => `${observation.name}`}
                                search={observationAutocompleteRunner.search}
                                onItemSelected={observation => {
                                    if (!observations.find(x => x.id === observation.id)) {
                                        setObservations(observations.concat([observation]));
                                    }
                                }}
                                minSearchTextLength={3}
                                resetOnSelect
                            />
                        </Col>
                        <Col xs="auto">
                            <Button onClick={() => setShowObservationModal(true)}>Add new...</Button>
                            <ObservationModal
                                show={showObservationModal}
                                onCancel={() => setShowObservationModal(false)}
                                onObservationCreated={observation => {
                                    if (!observations.find(x => x.id === observation.id))
                                        setObservations(observations.concat([observation]));
                                    setShowObservationModal(false);
                                }}
                            />
                        </Col>
                    </Row> : null}
                </Col>
            </Form.Group>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl<Models.Icd.Annotation.Diagnostics.Observation>
                        items={observations}
                        idFunc={item => item.id}
                        displayFunc={item => item.name}
                        removeItem={removeObservation}
                    />
                </Col>
            </Row>
        </>
    );
}