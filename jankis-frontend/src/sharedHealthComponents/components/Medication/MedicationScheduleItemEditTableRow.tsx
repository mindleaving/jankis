import React, { useContext, useEffect, useState } from 'react';
import { Button, FormCheck, FormControl } from 'react-bootstrap';
import { formatDrug } from '../../helpers/Formatters';
import { isToday, isTomorrow, startOfToday, startOfTomorrow } from 'date-fns';
import { MedicationDispensionEditor } from './MedicationDispensionEditor';
import { v4 as uuid } from 'uuid';
import UserContext from '../../../localComponents/contexts/UserContext';
import { MedicationDispensionState, HealthRecordEntryType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface MedicationScheduleItemEditTableRowProps {
    medication: Models.Medication.MedicationScheduleItem;
    personId: string;
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
    const [ dispensions, setDispensions ] = useState<Models.Medication.MedicationDispension[]>(medication.plannedDispensions ?? []);

    useEffect(() => {
        const updatedMedication: Models.Medication.MedicationScheduleItem = {
            id: medication.id,
            drug: medication.drug,
            plannedDispensions: dispensions,
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
            personId: props.personId,
            drug: medication.drug,
            state: MedicationDispensionState.Scheduled,
            type: HealthRecordEntryType.MedicationDispension,
            value: 0,
            unit: medication.drug.amountUnit,
            timestamp: timestamp,
            createdBy: user!.accountId,
            isVerified: false,
            hasBeenSeenBySharer: user!.profileData.id === props.personId
        };
        setDispensions(dispensions.concat([dispension]));
    }
    const updateDispension = (dispensionId: string, update: Update<Models.Medication.MedicationDispension>) => {
        setDispensions(dispensions.map(dispension => {
            return dispension.id === dispensionId ? update(dispension) : dispension;
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
                        key={dispension.id}
                        dispension={dispension}
                        onChange={updateDispension}
                        onDelete={deleteDispension}
                        disabled={isPaused}
                        daysOffset={0}
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
                        key={dispension.id}
                        dispension={dispension}
                        onChange={updateDispension}
                        onDelete={deleteDispension}
                        disabled={isPaused}
                        daysOffset={1}
                    />
                ))}
                <Button size="sm" onClick={() => addDispension(startOfTomorrow())}>+ {resolveText('Add')}</Button>
            </>
            : <><i className="fa fa-pause" /> {resolveText("Paused")}</>}
        </td>
    </tr>);

}