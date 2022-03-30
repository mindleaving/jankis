import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import { Models } from '../../types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';

interface DiseaseFilterProps {
    setFilter: React.Dispatch<React.SetStateAction<Models.Filters.DiseaseFilter>>;
}
enum ExistsFilterStates {
    Disabled = '',
    Yes = 'yes',
    No = 'no'
}

export const DiseaseFilter = (props: DiseaseFilterProps) => {

    const setFilter = props.setFilter;
    const [ searchText, setSearchText ] = useState<string>('');
    const [ hasIncidence, setHasIncidence ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasPrevalence, setHasPrevalence ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasMortality, setHasMortality ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasSymptoms, setHasSymptoms ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasObservations, setHasObservations ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasDiagnosticCriteria, setHasDiagnosticCriteria ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasAffectedBodyStructures, setHasAffectedBodyStructures ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ isInfectiousDisease, setIsInfectiousDisease ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasDiseaseHosts, setHasDiseaseHosts ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    const [ hasPathogens, setHasPathogens ] = useState<ExistsFilterStates>(ExistsFilterStates.Disabled);
    
    useEffect(() => {
        const existsFilterStatesToBoolean = (state: ExistsFilterStates) => {
            if(state === ExistsFilterStates.Disabled) {
                return undefined;
            }
            return state === ExistsFilterStates.Yes;
        }
        setFilter({
            searchText: searchText && searchText.trim().length > 0 ? searchText.trim() : undefined,
            hasIncidenceData: existsFilterStatesToBoolean(hasIncidence),
            hasPrevalenceData: existsFilterStatesToBoolean(hasPrevalence),
            hasMortalityData: existsFilterStatesToBoolean(hasMortality),
            hasSymptoms: existsFilterStatesToBoolean(hasSymptoms),
            hasObservations: existsFilterStatesToBoolean(hasObservations),
            hasDiagnosticCriteria: existsFilterStatesToBoolean(hasDiagnosticCriteria),
            hasAffectedBodyStructures: existsFilterStatesToBoolean(hasAffectedBodyStructures),
            isInfectiousDisease: existsFilterStatesToBoolean(isInfectiousDisease),
            hasDiseaseHosts: existsFilterStatesToBoolean(hasDiseaseHosts),
            hasPathogens: existsFilterStatesToBoolean(hasPathogens)
        });
    }, [ setFilter, searchText, hasIncidence, hasPrevalence, hasMortality, hasSymptoms, hasObservations, hasDiagnosticCriteria, hasAffectedBodyStructures, isInfectiousDisease, hasDiseaseHosts, hasPathogens]);

    const resetAll = () => {
        setSearchText('');
        setHasIncidence(ExistsFilterStates.Disabled);
        setHasPrevalence(ExistsFilterStates.Disabled);
        setHasMortality(ExistsFilterStates.Disabled);
        setHasSymptoms(ExistsFilterStates.Disabled);
        setHasObservations(ExistsFilterStates.Disabled);
        setHasDiagnosticCriteria(ExistsFilterStates.Disabled);
        setHasAffectedBodyStructures(ExistsFilterStates.Disabled);
        setIsInfectiousDisease(ExistsFilterStates.Disabled);
        setHasDiseaseHosts(ExistsFilterStates.Disabled);
        setHasPathogens(ExistsFilterStates.Disabled);
    }

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group className="mb-1">
                        <Form.Control
                            type="text"
                            value={searchText}
                            onChange={(e:any) => setSearchText(e.target.value)}
                            placeholder="Search..."
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AccordionCard standalone
                        className='mb-3 filter-card-header'
                        eventKey='0'
                        title={"+ Filters"}
                    >
                        <Row>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Incidence"
                                    value={hasIncidence}
                                    onChange={setHasIncidence}
                                />
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Prevalence"
                                    value={hasPrevalence}
                                    onChange={setHasPrevalence}
                                />
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Mortality"
                                    value={hasMortality}
                                    onChange={setHasMortality}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Symptoms"
                                    value={hasSymptoms}
                                    onChange={setHasSymptoms}
                                />
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Observations"
                                    value={hasObservations}
                                    onChange={setHasObservations}
                                />
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Diagnostic tests"
                                    value={hasDiagnosticCriteria}
                                    onChange={setHasDiagnosticCriteria}
                                />
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Body structures"
                                    value={hasAffectedBodyStructures}
                                    onChange={setHasAffectedBodyStructures}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Is infectious disease</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={isInfectiousDisease}
                                        onChange={(e:any) => setIsInfectiousDisease(e.target.value)}
                                    >
                                        <option value={ExistsFilterStates.Disabled}></option>
                                        <option value={ExistsFilterStates.No}>No</option>
                                        <option value={ExistsFilterStates.Yes}>Yes</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Disease host"
                                    value={hasDiseaseHosts}
                                    onChange={setHasDiseaseHosts}
                                />
                            </Col>
                            <Col md={2}>
                                <ExistsFilterFormGroup
                                    title="Pathogens"
                                    value={hasPathogens}
                                    onChange={setHasPathogens}
                                />
                            </Col>
                            <Col></Col>
                            <Col md={2} className="align-self-end">
                                <Button size="sm" onClick={resetAll}>Reset all</Button>
                            </Col>
                        </Row>
                    </AccordionCard>
                </Col>
            </Row>
        </Form>
    );
}

interface ExistsFilterFormGroupProps {
    title: string;
    value: ExistsFilterStates;
    onChange: (state: ExistsFilterStates) => void;
}
const ExistsFilterFormGroup = (props: ExistsFilterFormGroupProps) => {
    return (
        <Form.Group>
            <Form.Label>{props.title}</Form.Label>
            <Form.Control
                as="select"
                value={props.value}
                onChange={(e:any) => props.onChange(e.target.value as ExistsFilterStates)}
            >
                <option value={ExistsFilterStates.Disabled}></option>
                <option value={ExistsFilterStates.No}>Missing data</option>
                <option value={ExistsFilterStates.Yes}>Has data</option>
            </Form.Control>
        </Form.Group>
    );
}