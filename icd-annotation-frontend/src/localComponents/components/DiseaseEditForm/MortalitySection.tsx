import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { formatMortalityDataPoint } from '../../helpers/Formatters';
import { Models, Commons } from '../../types/models';
import { Sex } from '../../types/enums.d';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';

interface MortalitySectionProps {
    mortalityDataPoints: Models.Icd.Annotation.Epidemiology.MortalityDataPoint[];
    setMortalityDataPoints: (mortalityDataPoints: Models.Icd.Annotation.Epidemiology.MortalityDataPoint[]) => void;
    disabled?: boolean;
}

export const MortalitySection = (props: MortalitySectionProps) => {

    const mortalityDataPoints = props.mortalityDataPoints;
    const setMortalityDataPoints = props.setMortalityDataPoints;

    const [mortalityValue, setMortalityValue] = useState<number>(0);
    const [mortalityYearsAfterDiagnosis, setMortalityYearsAfterDiagnosis] = useState<number>(0);
    const [mortalitySex, setMortalitySex] = useState<Sex>(Sex.Both);
    const [mortalityHasAgeRange, setMortalityHasAgeRange] = useState<boolean>(false);
    const [mortalityAgeRangeStart, setMortalityAgeRangeStart] = useState<number>(0);
    const [mortalityAgeRangeEnd, setMortalityAgeRangeEnd] = useState<number>(0);

    const addMortality = () => {
        const ageRange: Commons.Mathematics.Range<number> | undefined = mortalityHasAgeRange
            ? {
                from: mortalityAgeRangeStart!,
                to: mortalityAgeRangeEnd!
            }
            : undefined;
        const sex = mortalitySex !== Sex.Both ? mortalitySex : undefined;
        const mortalityDataPoint: Models.Icd.Annotation.Epidemiology.MortalityDataPoint = {
            id: uuid(),
            mortality: mortalityValue!,
            yearsAfterDiagnosis: mortalityYearsAfterDiagnosis!,
            sex: sex,
            ageRange: ageRange
        };
        setMortalityDataPoints(mortalityDataPoints.concat([mortalityDataPoint]));
    }
    const canAddMortality = () => {
        if (!mortalityValue || mortalityValue <= 0) {
            return false;
        }
        if (mortalityHasAgeRange) {
            if (!mortalityAgeRangeStart || !mortalityAgeRangeEnd) {
                return false;
            }
        }
        return true;
    }
    const removeMortalityDataPoint = (item: Models.Icd.Annotation.Epidemiology.MortalityDataPoint) => {
        if(props.disabled) {
            return;
        }
        setMortalityDataPoints(mortalityDataPoints.filter(x => x.id !== item.id));
    };

    return (
        <>
            <Row>
                <Col>
                    <Form.Label>Mortality</Form.Label>
                </Col>
                <Col>
                    {!props.disabled ?
                    <AccordionCard
                        className="mb-2"
                        eventKey="Mortality"
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
                                            defaultValue={mortalityValue}
                                            onBlur={(e: any) => setMortalityValue(e.target.value)}
                                        />
                                        <InputGroup.Text>/100.000 cases</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Years after diagnosis</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        max={150}
                                        defaultValue={mortalityYearsAfterDiagnosis}
                                        onBlur={(e: any) => setMortalityYearsAfterDiagnosis(e.target.value)}
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
                                        value={mortalitySex}
                                        onChange={(e: any) => setMortalitySex(e.target.value)}
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
                                            checked={mortalityHasAgeRange}
                                            onChange={(e: any) => setMortalityHasAgeRange(e.target.checked)}
                                        />
                                        {mortalityHasAgeRange ?
                                            <>
                                                <Form.Control
                                                    className="mx-2"
                                                    type="number"
                                                    placeholder="From"
                                                    value={mortalityAgeRangeStart}
                                                    onChange={(e: any) => setMortalityAgeRangeStart(e.target.value)}
                                                />
                                            -
                                            <Form.Control
                                                    className="mx-2"
                                                    type="number"
                                                    placeholder="To"
                                                    value={mortalityAgeRangeEnd}
                                                    onChange={(e: any) => setMortalityAgeRangeEnd(e.target.value)}
                                                />
                                            </> : null}
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className="m-2" onClick={addMortality} disabled={!canAddMortality()}>Add</Button>
                            </Col>
                        </Row>
                    </AccordionCard> : null}
                    {mortalityDataPoints.length > 0
                        ? <Row>
                            <Col>
                                <div className="border border-dark pt-3 mb-3">
                                    <ListFormControl
                                        items={mortalityDataPoints}
                                        displayFunc={item => formatMortalityDataPoint(item)}
                                        idFunc={item => item.id}
                                        removeItem={removeMortalityDataPoint}
                                    />
                                </div>
                            </Col>
                        </Row> : null}
                </Col>
            </Row>
        </>
    );
}