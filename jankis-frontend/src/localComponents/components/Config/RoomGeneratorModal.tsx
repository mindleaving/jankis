import React, { FormEvent, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row } from 'react-bootstrap';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface RoomGeneratorModalProps {
    show: boolean;
    onGenerate: (rooms: Models.Room[]) => void;
    onClose: () => void;
}

export const RoomGeneratorModal = (props: RoomGeneratorModalProps) => {

    const [ prefix, setPrefix ] = useState<string>('');
    const [ suffix, setSuffix ] = useState<string>('');
    const [ from, setFrom ] = useState<number>(0);
    const [ to, setTo ] = useState<number>(0);
    const [ bedPosition, setBedPosition ] = useState<string>('');
    const [ bedPositions, setBedPositions ] = useState<string[]>([]);

    const generate = (e: FormEvent) => {
        e.preventDefault();
        const rooms: Models.Room[] = [];
        for (let index = from; index <= to; index++) {
            const id = uuid();
            const name = `${prefix}${index}${suffix}`;
            rooms.push({ id, name, bedPositions: bedPositions });
        }
        props.onGenerate(rooms);
        //props.onClose();
    }

    const addBedPosition = () => {
        if(!bedPosition) {
            return;
        }
        setBedPositions(bedPositions.concat(bedPosition));
        setBedPosition('');
    }
    const removeBedPosition = (position: string) => {
        setBedPositions(bedPositions.filter(x => x !== position));
    }
    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{resolveText('GenerateRooms')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="RoomGeneratorModal" onSubmit={generate}>
                    <RowFormGroup
                        label={resolveText('Prefix')}
                        value={prefix}
                        onChange={setPrefix}
                    />
                    <RowFormGroup
                        label={resolveText('From')}
                        type="number"
                        value={from}
                        onChange={setFrom}
                    />
                    <RowFormGroup
                        label={resolveText('To')}
                        type="number"
                        value={to}
                        onChange={setTo}
                    />
                    <RowFormGroup
                        label={resolveText('Suffix')}
                        value={suffix}
                        onChange={setSuffix}
                    />
                    <FormGroup as={Row}>
                        <FormLabel column>{resolveText('Room_BedPositions')}</FormLabel>
                        <Col>
                            <InputGroup>
                                <FormControl
                                    value={bedPosition}
                                    onChange={(e:any) => setBedPosition(e.target.value)}
                                    isInvalid={bedPositions.some(x => x === bedPosition)}
                                />
                                <Button className="m-1" onClick={addBedPosition}>{resolveText('Add')}</Button>
                            </InputGroup>
                            <FormControl.Feedback type="invalid">{resolveText('AlreadyExists')}</FormControl.Feedback>
                        </Col>
                    </FormGroup>
                    <Row>
                        <Col></Col>
                        <Col>
                            <ListFormControl
                                items={bedPositions}
                                idFunc={x => x}
                                displayFunc={x => x}
                                removeItem={removeBedPosition}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose}>{resolveText('Close')}</Button>
                <Button type="submit" form="RoomGeneratorModal">{resolveText('Generate')}</Button>
            </Modal.Footer>
        </Modal>
    );

}