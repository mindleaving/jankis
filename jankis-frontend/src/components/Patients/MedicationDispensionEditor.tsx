import React, { useState } from 'react';
import { Models } from '../../types/models';
import Flatpickr from 'react-flatpickr';
import { FormControl } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

interface MedicationDispensionEditorProps {
    dispension: Models.MedicationDispension;
    onChange: (item: Models.MedicationDispension) => void;
    onDelete: (dispensionId: string) => void;
}

export const MedicationDispensionEditor = (props: MedicationDispensionEditorProps) => {

    const [ timestamp, setTimestamp  ] = useState<Date>(props.dispension.timestamp);
    const [ note, setNote ] = useState<string>(props.dispension.note);
    return (
        <>
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
            />
            <i className="fa fa-trash red clickable" onClick={() => props.onDelete(props.dispension.id)} />
        </>
    );

}