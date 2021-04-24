import React, { useState } from 'react';
import { Button, FormCheck, FormControl } from 'react-bootstrap';
import { formatDrug } from '../../helpers/Formatters';
import { Models } from '../../types/models';
import { isToday, isTomorrow } from 'date-fns';
import { resolveText } from '../../helpers/Globalizer';
import { MedicationDispensionEditor } from './MedicationDispensionEditor';

interface MedicationScheduleItemEditTableRowProps {
    medication: Models.MedicationScheduleItem;
    isSelected: boolean;
    onSelectionChanged: (isSelected: boolean) => void;
    onStore: (item: Models.MedicationScheduleItem) => void;
    onDelete: (id: string) => void;
}

export const MedicationScheduleItemEditTableRow = (props: MedicationScheduleItemEditTableRowProps) => {

    const medication = props.medication;
    const [ note, setNote] = useState<string>(medication.note);
    const [ isPaused, setIsPaused ] = useState<boolean>(false);
    const [ isDispendedByPatient, setIsDispendedByPatient ] = useState<boolean>(false);
    const [ dispensions, setDispensions ] = useState<Models.MedicationDispension[]>([]);

    const updateDispension = (updatedDispension: Models.MedicationDispension) => {
        setDispensions(dispensions.map(dispension => {
            return dispension.id === updatedDispension.id ? updatedDispension : dispension;
        }));
    }
    const deleteDispension = (dispensionId: string) => {
        setDispensions(dispensions.filter(x => x.id !== dispensionId));
    }
    const store = () => {
        const updatedMedication: Models.MedicationScheduleItem = {
            id: medication.id,
            drug: medication.drug,
            dispensions: dispensions,
            isPaused: isPaused,
            isDispendedByPatient: isDispendedByPatient,
            note: note
        };
        props.onStore(updatedMedication);
    }

    return (
    <tr>
        <td>
            <FormCheck
                checked={props.isSelected}
                onChange={(e:any) => props.onSelectionChanged(e.target.checked)}
            />
            <i className="fa fa-trash red clickable" onClick={() => props.onDelete(medication.id)} />
        </td>
        <td>
            {formatDrug(medication.drug)}
            {resolveText('Note')}: <FormControl
                value={note}
                onChange={(e:any) => setNote(e.target.value)}
            />
        </td>
        <td>
            <FormCheck
                checked={isPaused}
                onChange={(e:any) => setIsPaused(e.target.checked)}
            />
        </td>
        <td>
            <FormCheck
                checked={isDispendedByPatient}
                onChange={(e:any) => setIsDispendedByPatient(e.target.checked)}
            />
        </td>
        <td>
            {dispensions
                .filter(dispension => isToday(new Date(dispension.timestamp)))
                .map(dispension => (
                    <MedicationDispensionEditor
                        dispension={dispension}
                        onChange={updateDispension}
                        onDelete={deleteDispension}
                    />
                ))
            }
        </td>
        <td>
            {dispensions
                .filter(dispension => isTomorrow(new Date(dispension.timestamp)))
                .map(dispension => (
                    <MedicationDispensionEditor
                        dispension={dispension}
                        onChange={updateDispension}
                        onDelete={deleteDispension}
                    />
                ))
            }
        </td>
        <td>
            <Button onClick={store}>{resolveText('Store')}</Button>
        </td>
    </tr>);

}