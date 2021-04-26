import React, { useEffect, useState } from 'react';
import { Models } from '../../types/models';
import Flatpickr from 'react-flatpickr';
import { FormControl, InputGroup } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

interface MedicationDispensionEditorProps {
    dispension: Models.MedicationDispension;
    onChange: (item: Models.MedicationDispension) => void;
    onDelete: (dispensionId: string) => void;
}

export const MedicationDispensionEditor = (props: MedicationDispensionEditorProps) => {

    const [ timestamp, setTimestamp  ] = useState<Date>(props.dispension.timestamp);
    const [ note, setNote ] = useState<string>(props.dispension.note ?? '');

    useEffect(() => {
        props.onChange({
            ...props.dispension,
            timestamp: timestamp,
            note: note
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ timestamp, note ]);

    return (
        <InputGroup className="my-2">
            <Flatpickr
                options={{
                    allowInput: true,
                    enableTime: true,
                    noCalendar: true,
                    time_24hr: true
                }}
                value={timestamp}
                onChange={(selectedDates) => setTimestamp(selectedDates[0])}
            />
            <FormControl
                value={note}
                onChange={(e:any) => setNote(e.target.value)}
                placeholder={resolveText('Note')}
                className="mx-2"
            />
            <i className="fa fa-trash red clickable m-2" onClick={() => props.onDelete(props.dispension.id)} />
        </InputGroup>
    );

}