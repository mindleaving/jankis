import React, { useState } from 'react';
import { FormControl, Button, InputGroup } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';

interface RoomSelectorProps {
    rooms: Models.Room[];
    onAdd: (roomId: string) => void;
}

export const RoomSelector = (props: RoomSelectorProps) => {

    const [ selectedRoomId, setSelectedRoomId] = useState<string>('');
    return (
        <InputGroup>
            <FormControl
                as="select"
                value={selectedRoomId}
                onChange={(e:any) => setSelectedRoomId(e.target.value)}
            >
                <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                {props.rooms.map(room => (
                    <option value={room.id} key={room.id}>{room.name}</option>
                ))}
            </FormControl>
            <Button className="mx-1" onClick={() => props.onAdd(selectedRoomId!)} disabled={!selectedRoomId}>{resolveText('Add')}</Button>
        </InputGroup>
    );

}