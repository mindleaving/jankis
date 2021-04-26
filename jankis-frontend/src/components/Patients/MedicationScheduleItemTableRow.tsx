import React, { useState } from 'react';
import { Badge, FormCheck, FormControl, FormLabel, InputGroup } from 'react-bootstrap';
import { formatDrug } from '../../helpers/Formatters';
import { Models } from '../../types/models';
import { ListFormControl } from '../ListFormControl';
import { isToday, isTomorrow } from 'date-fns';
import { resolveText } from '../../helpers/Globalizer';

interface MedicationScheduleItemTableRowProps {
    medication: Models.MedicationScheduleItem;
    isSelected: boolean;
    onSelectionChanged: (isSelected: boolean) => void;
}

export const MedicationScheduleItemTableRow = (props: MedicationScheduleItemTableRowProps) => {

    const medication = props.medication;
    const dispensionsToday = medication.dispensions.filter(dispension => isToday(new Date(dispension.timestamp)));
    const dispensionsTomorrow = medication.dispensions.filter(dispension => isTomorrow(new Date(dispension.timestamp)));
    return (
    <tr>
        <td>
            <FormCheck
                checked={props.isSelected}
                onChange={(e:any) => props.onSelectionChanged(e.target.checked)}
            />
        </td>
        <td>
            {formatDrug(medication.drug)}
            {medication.note ?
            <div>
                <span>{resolveText('Note')}:</span> {medication.note}
            </div> : null}
        </td>
        <td>
            {dispensionsToday.map(dispension => (
                <div>
                    <Badge variant="primary">{new Date(dispension.timestamp).toLocaleTimeString()}{dispension.note ? ` (${dispension.note})` : ''}</Badge>
                </div>
            ))}
        </td>
        <td>
            {dispensionsTomorrow.map(dispension => (
                <div>
                    <Badge variant="primary">{new Date(dispension.timestamp).toLocaleTimeString()}{dispension.note ? ` (${dispension.note})` : ''}</Badge>
                </div>
            ))}
        </td>
    </tr>);

}