import { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { formatPrevalenceDataPoint } from '../../helpers/Formatters';
import { Sex } from '../../types/enums.d';
import { Models, Commons } from '../../types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';

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
    const [prevalenceSex, setPrevalenceSex] = useState<Sex>(Sex.Both);
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
        const sex = prevalenceSex !== Sex.Both ? prevalenceSex : undefined;
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
                    <AccordionCard 
                        className="mb-2"
                        eventKey="Prevalence"
                        title={"Enter data..."}
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
                                            defaultValue={prevalenceValue}
                                            onBlur={(e: any) => setPrevalenceValue(e.target.value)}
                                        />
                                        <InputGroup.Text>/100.000</InputGroup.Text>
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
                    </AccordionCard> : null}
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