import React, { useContext, useEffect, useState } from 'react';
import { Button, FormCheck, FormControl } from 'react-bootstrap';
import { formatDrug } from '../../helpers/Formatters';
import { Models } from '../../types/models';
import { isToday, isTomorrow, startOfToday, startOfTomorrow } from 'date-fns';
import { resolveText } from '../../helpers/Globalizer';
import { MedicationDispensionEditor } from './MedicationDispensionEditor';
import { v4 as uuid } from 'uuid';
import { MedicationDispensionState, PatientEventType } from '../../types/enums.d';
import UserContext from '../../contexts/UserContext';

interface MedicationScheduleItemEditTableRowProps {
    medication: Models.Medication.MedicationScheduleItem;
    patientId: string;
    admissionId?: string;
    isSelected: boolean;
    onSelectionChanged: (isSelected: boolean) => void;
    onChange: (item: Models.Medication.MedicationScheduleItem) => void;
    onDelete: (id: string) => void;
}

export const MedicationScheduleItemEditTableRow = (props: MedicationScheduleItemEditTableRowProps) => {

    const medication = props.medication;
    const user = useContext(UserContext);
    const [ note, setNote] = useState<string>(medication.note ?? '');
    const [ isPaused, setIsPaused ] = useState<boolean>(medication.isPaused ?? false);
    const [ isDispendedByPatient, setIsDispendedByPatient ] = useState<boolean>(medication.isDispendedByPatient ?? false);
    const [ dispensions, setDispensions ] = useState<Models.Medication.MedicationDispension[]>(medication.dispensions ?? []);

    useEffect(() => {
        const updatedMedication: Models.Medication.MedicationScheduleItem = {
            id: medication.id,
            drug: medication.drug,
            dispensions: dispensions,
            isPaused: isPaused,
            isDispendedByPatient: isDispendedByPatient,
            note: note
        };
        props.onChange(updatedMedication);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ note, isPaused, isDispendedByPatient, dispensions ]);

    const addDispension = (timestamp: Date) => {
        const dispension: Models.Medication.MedicationDispension = {
            id: uuid(),
            patientId: props.patientId,
            admissionId: props.admissionId,
            drug: medication.drug,
            state: MedicationDispensionState.Scheduled,
            type: PatientEventType.MedicationDispension,
            value: 0,
            unit: medication.drug.amountUnit,
            timestamp: timestamp,
            createdBy: user!.username
        };
        setDispensions(dispensions.concat([dispension]));
    }
    const updateDispension = (updatedDispension: Models.Medication.MedicationDispension) => {
        setDispensions(dispensions.map(dispension => {
            return dispension.id === updatedDispension.id ? updatedDispension : dispension;
        }));
    }
    const deleteDispension = (dispensionId: string) => {
        setDispensions(dispensions.filter(x => x.id !== dispensionId));
    }

    return (
    <tr>
        <td>
            <FormCheck
                checked={props.isSelected}
                onChange={(e:any) => props.onSelectionChanged(e.target.checked)}
            />
        </td>
        <td>
            <i className="fa fa-trash red clickable" onClick={() => props.onDelete(medication.id)} />
        </td>
        <td>
            {formatDrug(medication.drug)}
            <FormControl
                value={note}
                onChange={(e:any) => setNote(e.target.value)}
                placeholder={resolveText('Note')}
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
            {!isPaused
            ? <>
                {dispensions
                .filter(dispension => isToday(new Date(dispension.timestamp)))
                .map(dispension => (
                    <MedicationDispensionEditor
                        dispension={dispension}
                        onChange={updateDispension}
                        onDelete={deleteDispension}
                        disabled={isPaused}
                    />
                ))}
                <Button size="sm" onClick={() => addDispension(startOfToday())}>+ {resolveText('Add')}</Button>
            </>
            : <><i className="fa fa-pause" /> {resolveText("Paused")}</>}
        </td>
        <td>
            {!isPaused
            ? <>
                {dispensions
                .filter(dispension => isTomorrow(new Date(dispension.timestamp)))
                .map(dispension => (
                    <MedicationDispensionEditor
                        dispension={dispension}
                        onChange={updateDispension}
                        onDelete={deleteDispension}
                        disabled={isPaused}
                    />
                ))}
                <Button size="sm" onClick={() => addDispension(startOfTomorrow())}>+ {resolveText('Add')}</Button>
            </>
            : <><i className="fa fa-pause" /> {resolveText("Paused")}</>}
        </td>
    </tr>);

}