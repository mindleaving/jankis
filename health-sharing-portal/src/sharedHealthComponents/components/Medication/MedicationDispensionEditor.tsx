import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { FormControl, InputGroup } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface MedicationDispensionEditorProps {
    dispension: Models.Medication.MedicationDispension;
    onChange: (item: Models.Medication.MedicationDispension) => void;
    onDelete: (dispensionId: string) => void;
    disabled?: boolean;
}

export const MedicationDispensionEditor = (props: MedicationDispensionEditorProps) => {

    const [ date ] = useState<Date>(props.dispension.timestamp);
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
                    time_24hr: true,
                    minDate: date
                }}
                value={timestamp}
                onChange={(selectedDates) => {
                    if(selectedDates.length === 0) {
                        return;
                    }
                    setTimestamp(selectedDates[0]);
                }}
                disabled={props.disabled}
            />
            <FormControl
                value={note}
                onChange={(e:any) => setNote(e.target.value)}
                placeholder={resolveText('Note')}
                className="mx-2"
                disabled={props.disabled}
            />
            <i className="fa fa-trash red clickable m-2" onClick={() => props.onDelete(props.dispension.id)} />
        </InputGroup>
    );

}