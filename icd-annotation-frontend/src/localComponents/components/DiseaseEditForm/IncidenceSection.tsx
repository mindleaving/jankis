import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { formatIncidenceDataPoint } from '../../helpers/Formatters';
import { Models, Commons } from '../../types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { Sex, TimeOfYear } from '../../types/enums.d';

interface IncidenceSectionProps {
    incidenceDataPoints: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint[];
    setIncidenceDataPoints: (incidenceDataPoints: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint[]) => void;
    disabled?: boolean;
}

export const IncidenceSection = (props: IncidenceSectionProps) => {

    const locationAutoCompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.Annotation.Epidemiology.Location>('api/locations/search', 'searchText', 10), []);
    const incidenceDataPoints = props.incidenceDataPoints;
    const setIncidenceDataPoints = props.setIncidenceDataPoints;

    const [incidenceValue, setIncidenceValue] = useState<number>(0);
    const [incidenceLocation, setIncidenceLocation] = useState<Models.Icd.Annotation.Epidemiology.Location>();
    const [incidenceSex, setIncidenceSex] = useState<Sex>(Sex.Both);
    const [incidenceHasAgeRange, setIncidenceHasAgeRange] = useState<boolean>(false);
    const [incidenceAgeRangeStart, setIncidenceAgeRangeStart] = useState<number>(0);
    const [incidenceAgeRangeEnd, setIncidenceAgeRangeEnd] = useState<number>(0);
    const [incidenceIsSeasonal, setIncidenceIsSeasonal] = useState<boolean>(false);
    const [incidenceSeasons, setIncidenceSeasons] = useState<TimeOfYear[]>([]);

    const addIncidenceSeason = (season: TimeOfYear) => {
        if (!season) {
            return;
        }
        if (incidenceSeasons.some(x => x === season)) {
            return;
        }
        setIncidenceSeasons(incidenceSeasons.concat(season));
    }

    const addIncidence = () => {
        const ageRange: Commons.Mathematics.Range<number> | undefined = incidenceHasAgeRange
            ? {
                from: incidenceAgeRangeStart!,
                to: incidenceAgeRangeEnd!
            }
            : undefined;
        const sex = incidenceSex !== Sex.Both ? incidenceSex : undefined;
        const timeOfYear = incidenceIsSeasonal
            ? incidenceSeasons
            : undefined;
        const incidenceDataPoint: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint = {
            id: uuid(),
            incidence: incidenceValue!,
            location: incidenceLocation!,
            sex: sex,
            ageRange: ageRange,
            timeOfYear: timeOfYear
        };
        setIncidenceDataPoints(incidenceDataPoints.concat([incidenceDataPoint]));
    }

    const canAddIncidence = () => {
        if (!incidenceValue || incidenceValue <= 0) {
            return false;
        }
        if (!incidenceLocation) {
            return false;
        }
        if (incidenceHasAgeRange) {
            if (!incidenceAgeRangeStart || !incidenceAgeRangeEnd) {
                return false;
            }
        }
        if (incidenceIsSeasonal) {
            if (incidenceSeasons.length === 0) {
                return false;
            }
        }
        return true;
    }
    const removeIncidenceDataPoint = (item: Models.Icd.Annotation.Epidemiology.IncidenceDataPoint) => {
        if(props.disabled) {
            return;
        }
        setIncidenceDataPoints(incidenceDataPoints.filter(x => x.id !== item.id));
    }

    return (
        <>
            <Row>
                <Col>
                    <Form.Label>Incidence</Form.Label>
                </Col>
                <Col>
                    {!props.disabled ?
                    <AccordionCard className='mb-2'
                        title={"Enter data..."}
                        eventKey="Incidence"
                    >
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Value</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            max={100000}
                                            defaultValue={incidenceValue}
                                            onBlur={(e: any) => setIncidenceValue(e.target.value)}
                                        />
                                        <InputGroup.Text>/100.000/year</InputGroup.Text>
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
                                        onItemSelected={item => setIncidenceLocation(item)}
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
                                        value={incidenceSex}
                                        onChange={(e: any) => setIncidenceSex(e.target.value)}
                                    >
                                        <option value={Sex.Both}>Both</option>
                                        <option value={Sex.Female}>Female</option>
                                        <option value={Sex.Male}>Male</option>
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
                                            checked={incidenceHasAgeRange}
                                            onChange={(e: any) => setIncidenceHasAgeRange(e.target.checked)}
                                        />
                                        {incidenceHasAgeRange ?
                                            <>
                                                <Form.Control
                                                    className="mx-2"
                                                    type="number"
                                                    placeholder="From"
                                                    value={incidenceAgeRangeStart}
                                                    onChange={(e: any) => setIncidenceAgeRangeStart(e.target.value)}
                                                />
                                -
                                <Form.Control
                                                    className="mx-2"
                                                    type="number"
                                                    placeholder="To"
                                                    value={incidenceAgeRangeEnd}
                                                    onChange={(e: any) => setIncidenceAgeRangeEnd(e.target.value)}
                                                />
                                            </> : null}
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Is Sesonal?</Form.Label>
                                    <InputGroup>
                                        <Form.Check
                                            checked={incidenceIsSeasonal}
                                            onChange={(e: any) => setIncidenceIsSeasonal(e.target.checked)}
                                        />
                                        {incidenceIsSeasonal ?
                                            <Form.Control
                                                as="select"
                                                value=""
                                                onChange={(e: any) => addIncidenceSeason(e.target.value as TimeOfYear)}
                                            >
                                                <option value="" disabled>Please select...</option>
                                                <option value={TimeOfYear.Spring}>Spring</option>
                                                <option value={TimeOfYear.Summer}>Summer</option>
                                                <option value={TimeOfYear.Autumn}>Autumn</option>
                                                <option value={TimeOfYear.Winter}>Winter</option>
                                            </Form.Control> : null}
                                    </InputGroup>
                                </Form.Group>
                                {incidenceIsSeasonal ?
                                    <ListFormControl
                                        items={incidenceSeasons}
                                        displayFunc={item => item}
                                        idFunc={item => item}
                                        removeItem={item => setIncidenceSeasons(incidenceSeasons.filter(x => x !== item))}
                                    /> : null}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className="m-2" onClick={addIncidence} disabled={!canAddIncidence()}>Add</Button>
                            </Col>
                        </Row>
                    </AccordionCard> : null}
                    {incidenceDataPoints.length > 0
                        ? <Row>
                            <Col>
                                <div className="border border-dark pt-3 mb-3">
                                    <ListFormControl
                                        items={incidenceDataPoints}
                                        displayFunc={item => formatIncidenceDataPoint(item)}
                                        idFunc={item => item.id}
                                        removeItem={removeIncidenceDataPoint}
                                    />
                                </div>
                            </Col>
                        </Row> : null}
                </Col>
            </Row>
        </>
    );
}