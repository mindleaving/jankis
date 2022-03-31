import { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import math from 'mathjs';
import { InputGroup } from 'react-bootstrap';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { UnitValueFormControl } from '../../../sharedCommonComponents/components/UnitValueFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { formatDiagnosticCriteria } from '../../helpers/Formatters';
import { DiagnosticTestScaleType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';

interface DiagnosticCriteriasSectionProps {
    diagnosticCriterias: Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria[];
    setDiagnosticCriterias: (diagnosticCriterias: Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria[]) => void;
    disabled?: boolean;
}

export const DiagnosticCriteriasSection = (props: DiagnosticCriteriasSectionProps) => {

    const diagnosticTestAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.Annotation.Diagnostics.DiagnosticTest>('api/diagnostictests/search', 'searchText', 10), []);
    const diagnosticCriterias = props.diagnosticCriterias;
    const setDiagnosticCriterias = props.setDiagnosticCriterias;

    const [selectedDiagnosticTest, setSelectedDiagnosticTest] = useState<Models.Icd.Annotation.Diagnostics.DiagnosticTest>();
    const [expectedResponse, setExpectedResponse] = useState<string>('');
    const [expectedResponses, setExpectedResponses] = useState<string[]>([]);
    const [expectedRangeStart, setExpectedRangeStart] = useState<math.Unit | undefined>();
    const [expectedRangeEnd, setExpectedRangeEnd] = useState<math.Unit | undefined>();

    const addDiagnosticCriteria = () => {
        if(!selectedDiagnosticTest) {
            return;
        }
        let diagnosticCriteria: Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria = {
            diagnosticTestLoincCode: selectedDiagnosticTest.loincCode,
            diagnosticTestName: selectedDiagnosticTest.name,
            scaleType: selectedDiagnosticTest.scaleType,
        };
        switch(selectedDiagnosticTest.scaleType) {
            case DiagnosticTestScaleType.Document:
            case DiagnosticTestScaleType.Freetext:
                // No more to do
                break;
            case DiagnosticTestScaleType.Nominal:
                const nominalCriteria: Models.Icd.Annotation.Diagnostics.NominalDiagnosticCriteria = Object.assign(diagnosticCriteria, {
                    expectedResponses: expectedResponses
                });
                diagnosticCriteria = nominalCriteria;
                break;
            case DiagnosticTestScaleType.Ordinal:
                const ordinalCriteria: Models.Icd.Annotation.Diagnostics.OrdinalDiagnosticCriteria = Object.assign(diagnosticCriteria, {
                    expectedResponses: expectedResponses
                });
                diagnosticCriteria = ordinalCriteria;
                break;
            case DiagnosticTestScaleType.OrdinalOrQuantitative:
                const quantativeOrdinalCriteria: Models.Icd.Annotation.Diagnostics.OrdinalQuantativeDiagnosticCriteria = Object.assign(diagnosticCriteria, {
                    expectedResponses: expectedResponses,
                    rangeStart: expectedRangeStart,
                    rangeEnd: expectedRangeEnd
                });
                diagnosticCriteria = quantativeOrdinalCriteria;
                break;
            case DiagnosticTestScaleType.Quantitative:
                const quantativeCriteria: Models.Icd.Annotation.Diagnostics.QuantativeDiagnosticCriteria = Object.assign(diagnosticCriteria, {
                    rangeStart: expectedRangeStart,
                    rangeEnd: expectedRangeEnd
                });
                diagnosticCriteria = quantativeCriteria;
                break;
            case DiagnosticTestScaleType.Set:
                const setCriteria: Models.Icd.Annotation.Diagnostics.SetDiagnosticCriteria = Object.assign(diagnosticCriteria, {
                    expectedResponses: expectedResponses
                });
                diagnosticCriteria = setCriteria;
                break;
            default:
                throw new Error(`Scale type '${selectedDiagnosticTest.scaleType}' is not supported`);
        }
        setDiagnosticCriterias(diagnosticCriterias.concat([ diagnosticCriteria ]));
    }

    const canAddDiagnosticCriteria = () => {
        if(!selectedDiagnosticTest) {
            return false;
        }
        if([ DiagnosticTestScaleType.Nominal, DiagnosticTestScaleType.Ordinal, DiagnosticTestScaleType.OrdinalOrQuantitative, DiagnosticTestScaleType.Set]
            .includes(selectedDiagnosticTest.scaleType)
            && expectedResponses.length === 0) {
            return false;
        }
        if([ DiagnosticTestScaleType.Quantitative, DiagnosticTestScaleType.OrdinalOrQuantitative ]
            .includes(selectedDiagnosticTest.scaleType)
            && !expectedRangeStart && !expectedRangeEnd) {
            return false;
        }
        return true;
    }
    const addExpectedResponse = () => {
        setExpectedResponses(expectedResponses.concat([ expectedResponse ]));
        setExpectedResponse('');
    }
    const canAddExpectedResponse = () => {
        return expectedResponse.trim().length > 0
            && !expectedResponses.includes(expectedResponse);
    }
    const removeExpectedResponse = (response: string) => {
        setExpectedResponses(expectedResponses.filter(x => x !== response));
    }
    const removeDiagnosticCriteria = (diagnosticCriteria: Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria) => {
        setDiagnosticCriterias(diagnosticCriterias.filter(x => x.diagnosticTestLoincCode !== diagnosticCriteria.diagnosticTestLoincCode));
    }

    return (
        <>
        <Row>
            <Col>
                <Form.Label>Diagnostic tests</Form.Label>
            </Col>
            <Col>
                {!props.disabled ? 
                <AccordionCard 
                    className="mb-2"
                    eventKey='DiagnosticCriteria'
                    title={"Enter data..."}
                >
                    <Form.Group as={Row}>
                        <Form.Label column>Relevant diagnostic tests</Form.Label>
                        <Col>
                            <Autocomplete
                                displayNameSelector={analysis => `${analysis.name}: ${analysis.loincCode}`}
                                search={diagnosticTestAutocompleteRunner.search}
                                onItemSelected={(analysis) => setSelectedDiagnosticTest(analysis)}
                                minSearchTextLength={3}
                            />
                        </Col>
                    </Form.Group>
                    {selectedDiagnosticTest 
                    && [DiagnosticTestScaleType.Quantitative, DiagnosticTestScaleType.OrdinalOrQuantitative].includes(selectedDiagnosticTest.scaleType)
                    ? <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Expected range</Form.Label>
                                <InputGroup>
                                    <UnitValueFormControl
                                        required={expectedRangeEnd === undefined}
                                        className="mx-2"
                                        onChange={unitValue => setExpectedRangeStart(unitValue)}
                                        placeholder={expectedRangeEnd ? 'Lower limit (optional)' : 'Lower limit'}
                                    />
                                    -
                                    <UnitValueFormControl
                                        required={expectedRangeStart === undefined}
                                        className="mx-2"
                                        onChange={unitValue => setExpectedRangeEnd(unitValue)}
                                        placeholder={expectedRangeStart ? 'Upper limit (optional)' : 'Upper limit'}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        </Row> 
                    : null}
                    {selectedDiagnosticTest
                    && [ DiagnosticTestScaleType.Nominal, DiagnosticTestScaleType.Ordinal, DiagnosticTestScaleType.OrdinalOrQuantitative, DiagnosticTestScaleType.Set ].includes(selectedDiagnosticTest.scaleType)
                    ? <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Expected responses</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            value={expectedResponse}
                                            onChange={(e:any) => setExpectedResponse(e.target.value)}
                                        />
                                        <Button
                                            className="ml-2"
                                            onClick={addExpectedResponse}
                                            disabled={!canAddExpectedResponse()}
                                        >
                                            Add
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ListFormControl<string>
                                    items={expectedResponses}
                                    idFunc={x => x}
                                    displayFunc={x => x}
                                    removeItem={removeExpectedResponse}
                                />
                            </Col>
                        </Row>
                    </>
                    : null}
                    <Row>
                        <Col>
                            <Button className="m-2" onClick={addDiagnosticCriteria} disabled={!canAddDiagnosticCriteria()}>Add</Button>
                        </Col>
                    </Row>
                </AccordionCard> : null}
            </Col>
        </Row>
        {diagnosticCriterias.length > 0
        ? <Row>
            <Col></Col>
            <Col>
                <ListFormControl<Models.Icd.Annotation.Diagnostics.IDiagnosticCriteria>
                    items={diagnosticCriterias}
                    idFunc={item => item.diagnosticTestLoincCode}
                    displayFunc={formatDiagnosticCriteria}
                    removeItem={removeDiagnosticCriteria}
                />
            </Col>
        </Row> : null}
        </>
    );
}