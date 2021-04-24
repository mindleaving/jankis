import React, { useState } from 'react';
import { Badge, FormCheck, FormControl } from 'react-bootstrap';
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
    const [ note, setNote] = useState<string>(medication.note);
    const [dispensionsToday, setDispensionsToday] = useState<Models.MedicationDispension[]>(
        medication.dispensions.filter(dispension => isToday(new Date(dispension.timestamp)))
    );
    const [dispensionsTomorrow, setDispensionsTomorrow] = useState<Models.MedicationDispension[]>(
        medication.dispensions.filter(dispension => isTomorrow(new Date(dispension.timestamp)))
    );
    const [ isEditEnabled, setIsEditEnabled ] = useState<boolean>(false);
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
            {resolveText('Note')}: <FormControl
                value={note}
                onChange={(e:any) => setNote(e.target.value)}
            />
        </td>
        <td>
            {dispensionsToday.map(dispension => (
                <div>
                    <Badge variant="primary">{new Date(dispension.timestamp).toLocaleTimeString()}</Badge>
                </div>
            ))}
        </td>
        <td>
            {dispensionsTomorrow.map(dispension => (
                <div>
                    <Badge variant="primary">{new Date(dispension.timestamp).toLocaleTimeString()}</Badge>
                </div>
            ))}
        </td>
        <td>
            {isEditEnabled
            ? <i className="fa fa-close clickable" onClick={() => setIsEditEnabled(false)} />
            : <i className="fa fa-edit clickable" onClick={() => setIsEditEnabled(true)} />}
        </td>
    </tr>);

}