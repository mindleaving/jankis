import React, { useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { Models } from '../../types/models';

interface PathogensSectionProps {
    pathogens: Models.Icd.Annotation.Epidemiology.Microb[];
    setPathogens: (pathogens: Models.Icd.Annotation.Epidemiology.Microb[]) => void;
    disabled?: boolean;
}

export const PathogensSection = (props: PathogensSectionProps) => {

    const microbAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.Annotation.Epidemiology.Microb>('api/microbs/search', 'searchText', 10), []);
    const pathogens = props.pathogens;
    const setPathogens = props.setPathogens;

    const removePathogen = (pathogen: Models.Icd.Annotation.Epidemiology.Microb) => {
        if(props.disabled) {
            return;
        }
        setPathogens(pathogens.filter(x => x.name !== pathogen.name));
    }

    return (
        <>
            <Form.Group as={Row}>
                <Form.Label as={Col}>Pathogens</Form.Label>
                <Col>
                    <Autocomplete
                        displayNameSelector={microb => `${microb.type}: ${microb.name}`}
                        search={microbAutocompleteRunner.search}
                        onItemSelected={(pathogen) => {
                            if(!pathogens.find(x => x.icdCode === pathogen.icdCode)) {
                                setPathogens(pathogens.concat([pathogen]));
                            }
                        }}
                        minSearchTextLength={3}
                        resetOnSelect
                        disabled={props.disabled}
                    />
                </Col>
            </Form.Group>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl<Models.Icd.Annotation.Epidemiology.Microb>
                        items={pathogens}
                        idFunc={item => item.icdCode}
                        displayFunc={item => `${item.type}: ${item.name}`}
                        removeItem={removePathogen}
                    />
                </Col>
            </Row>
        </>
    );
}