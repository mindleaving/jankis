import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Commons, Models } from '../../types/models';
import * as Enums from '../../types/enums.d';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { v4 as uuid } from 'uuid';
import { Autocomplete } from '../Autocomplete';
import { ListFormControl } from '../ListFormControl';
import { formatPrevalenceDataPoint } from '../../helpers/Formatters';

interface PrevalenceSectionProps {
    prevalenceDataPoints: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint[];
    setPrevalenceDataPoints: (prevalenceDataPoints: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint[]) => void;
    disabled?: boolean;
}

export const PrevalenceSection = (props: PrevalenceSectionProps) => {

    const locationAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.Annotation.Epidemiology.Location>('api/locations/search', 'searchText', 10), []);
    const prevalenceDataPoints = props.prevalenceDataPoints;
    const setPrevalenceDataPoints = props.setPrevalenceDataPoints;

    const [prevalenceValue, setPrevalenceValue] = useState<number>(0);
    const [prevalenceLocation, setPrevalenceLocation] = useState<Models.Icd.Annotation.Epidemiology.Location>();
    const [prevalenceSex, setPrevalenceSex] = useState<Enums.Sex>(Enums.Sex.Both);
    const [prevalenceHasAgeRange, setPrevalenceHasAgeRange] = useState<boolean>(false);
    const [prevalenceAgeRangeStart, setPrevalenceAgeRangeStart] = useState<number>(0);
    const [prevalenceAgeRangeEnd, setPrevalenceAgeRangeEnd] = useState<number>(0);

    const addPrevalence = () => {
        const ageRange: Commons.Mathematics.Range<number> | undefined = prevalenceHasAgeRange
            ? {
                from: prevalenceAgeRangeStart!,
                to: prevalenceAgeRangeEnd!
            }
            : undefined;
        const sex = prevalenceSex !== Enums.Sex.Both ? prevalenceSex : undefined;
        const prevalenceDataPoint: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint = {
            id: uuid(),
            prevalence: prevalenceValue!,
            location: prevalenceLocation!,
            sex: sex,
            ageRange: ageRange
        };
        setPrevalenceDataPoints(prevalenceDataPoints.concat([prevalenceDataPoint]));
    }
    const canAddPrevalence = () => {
        if (!prevalenceValue || prevalenceValue <= 0) {
            return false;
        }
        if (!prevalenceLocation) {
            return false;
        }
        if (prevalenceHasAgeRange) {
            if (!prevalenceAgeRangeStart || !prevalenceAgeRangeEnd) {
                return false;
            }
        }
        return true;
    }
    const removePrevalenceDataPoint = (item: Models.Icd.Annotation.Epidemiology.PrevalenceDataPoint) => {
        if(props.disabled) {
            return;
        }
        setPrevalenceDataPoints(prevalenceDataPoints.filter(x => x.id !== item.id));
    }

    return (
        <>
            <Row>
                <Col>
                    <Form.Label>Prevalence</Form.Label>
                </Col>
                <Col>
                    {!props.disabled ?
                    <Card className="mb-2">
                        <Accordion.Toggle as={Card.Header} eventKey="Prevalence">Enter data...</Accordion.Toggle>
                        <Accordion.Collapse eventKey="Prevalence">
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Value</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={100000}
                                                    defaultValue={prevalenceValue}
                                                    onBlur={(e: any) => setPrevalenceValue(e.target.value)}
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>/100.000</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Location</Form.Label>
                                            <Autocomplete
                                                search={locationAutoCompleteRunner.search}
                                                displayNameSelector={item => `${item.name}`}
                                                onItemSelected={item => setPrevalenceLocation(item)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Sex</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={prevalenceSex}
                                                onChange={(e: any) => setPrevalenceSex(e.target.value)}
                                            >
                                                <option value={Enums.Sex.Both}>Both</option>
                                                <option value={Enums.Sex.Female}>Female</option>
                                                <option value={Enums.Sex.Male}>Male</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Age range</Form.Label>
                                            <InputGroup>
                                                <Form.Check
                                                    checked={prevalenceHasAgeRange}
                                                    onChange={(e: any) => setPrevalenceHasAgeRange(e.target.checked)}
                                                />
                                                {prevalenceHasAgeRange ?
                                                    <>
                                                        <Form.Control
                                                            className="mx-2"
                                                            type="number"
                                                            placeholder="From"
                                                            value={prevalenceAgeRangeStart}
                                                            onChange={(e: any) => setPrevalenceAgeRangeStart(e.target.value)}
                                                        />
                                        -
                                        <Form.Control
                                                            className="mx-2"
                                                            type="number"
                                                            placeholder="To"
                                                            value={prevalenceAgeRangeEnd}
                                                            onChange={(e: any) => setPrevalenceAgeRangeEnd(e.target.value)}
                                                        />
                                                    </> : null}
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button className="m-2" onClick={addPrevalence} disabled={!canAddPrevalence()}>Add</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card> : null}
                    {prevalenceDataPoints.length > 0
                        ? <Row>
                            <Col>
                                <div className="border border-dark pt-3 mb-3">
                                    <ListFormControl
                                        items={prevalenceDataPoints}
                                        displayFunc={item => formatPrevalenceDataPoint(item)}
                                        idFunc={item => item.id}
                                        removeItem={removePrevalenceDataPoint}
                                    />
                                </div>
                            </Col>
                        </Row> : null}
                </Col>
            </Row>
        </>
    );
}