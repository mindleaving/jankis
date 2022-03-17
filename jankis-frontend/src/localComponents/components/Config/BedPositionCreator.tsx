import React, { useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface BedPositionCreatorProps {
    onAdd: (bedPosition: string) => void;
}

export const BedPositionCreator = (props: BedPositionCreatorProps) => {

    const [ bedPosition, setBedPosition ] = useState<string>('');
    const addBedPosition = () => {
        props.onAdd(bedPosition);
        setBedPosition('');
    }
    return (
        <InputGroup>
            <FormControl
                value={bedPosition}
                onChange={(e:any) => setBedPosition(e.target.value)}
            />
            <Button className="m-1" onClick={addBedPosition} disabled={!bedPosition}>{resolveText('Add')}</Button>
        </InputGroup>
    );

}