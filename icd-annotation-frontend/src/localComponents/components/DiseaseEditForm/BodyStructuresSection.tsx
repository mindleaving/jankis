import React, { useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { Models } from '../../types/models';

interface BodyStructuresSectionProps {
    affectedBodyStructures: Models.Symptoms.BodyStructure[];
    setAffectedBodyStructures: (affectedBodyStructures: Models.Symptoms.BodyStructure[]) => void;
    disabled?: boolean;
}

export const BodyStructuresSection = (props: BodyStructuresSectionProps) => {

    const bodyStructureAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Symptoms.BodyStructure>('api/bodystructures/search', 'searchText', 10), []);
    const affectedBodyStructures = props.affectedBodyStructures;
    const setAffectedBodyStructures = props.setAffectedBodyStructures;

    const removeAffectedBodyStructure = (bodyStructure: Models.Symptoms.BodyStructure) => {
        if(props.disabled) {
            return;
        }
        setAffectedBodyStructures(affectedBodyStructures.filter(x => x.icdCode !== bodyStructure.icdCode));
    }

    return (
        <>
            <Form.Group as={Row}>
                <Form.Label as={Col}>Affected body parts</Form.Label>
                <Col>
                    <Autocomplete
                        displayNameSelector={bodyStructure => `${bodyStructure.name}`}
                        search={bodyStructureAutocompleteRunner.search}
                        onItemSelected={(bodyStructure) => setAffectedBodyStructures(affectedBodyStructures.concat([bodyStructure]))}
                        minSearchTextLength={3}
                        resetOnSelect
                        disabled={props.disabled}
                    />
                </Col>
            </Form.Group>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl<Models.Symptoms.BodyStructure>
                        items={affectedBodyStructures}
                        idFunc={item => item.icdCode}
                        displayFunc={item => item.name}
                        removeItem={removeAffectedBodyStructure}
                    />
                </Col>
            </Row>
        </>
    );
}