import React, { FormEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { RowFormGroup } from '../RowFormGroup';
import { v4 as uuid } from 'uuid';

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

    const generate = (e: FormEvent) => {
        e.preventDefault();
        const rooms: Models.Room[] = [];
        for (let index = from; index <= to; index++) {
            const id = uuid();
            const name = `${prefix}${index}${suffix}`;
            rooms.push({ id, name });
        }
        props.onGenerate(rooms);
        //props.onClose();
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose}>{resolveText('Close')}</Button>
                <Button type="submit" form="RoomGeneratorModal">{resolveText('Generate')}</Button>
            </Modal.Footer>
        </Modal>
    );

}