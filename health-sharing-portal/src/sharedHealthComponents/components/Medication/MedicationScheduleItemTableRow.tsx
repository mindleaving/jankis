import { FormCheck } from 'react-bootstrap';
import { formatDrug } from '../../helpers/Formatters';
import { isBefore, isToday, isTomorrow, startOfToday } from 'date-fns';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationDispensionBadge } from './MedicationDispensionBadge';
import { DispensionStateChangeCallback } from '../../types/frontendTypes';

interface MedicationScheduleItemTableRowProps {
    medication: Models.Medication.MedicationScheduleItem;
    isSelected: boolean;
    onSelectionChanged: (isSelected: boolean) => void;
    onDispensionStateChanged: DispensionStateChangeCallback;
}

export const MedicationScheduleItemTableRow = (props: MedicationScheduleItemTableRowProps) => {

    const medication = props.medication;
    const selectionCheckbox = (
        <FormCheck
            checked={props.isSelected}
            onChange={(e:any) => props.onSelectionChanged(e.target.checked)}
        />
    );
    const medicationInfos = (
        <>
            {formatDrug(medication.drug)}
            {medication.note ?
            <div>
                <span>{resolveText('Note')}:</span> {medication.note}
            </div> : null}
        </>
    )
    if(medication.isPaused) {
        return (
            <tr>
                <td>{selectionCheckbox}</td>
                <td>{medicationInfos}</td>
                <td><i className="fa fa-pause" /> {resolveText("Paused")}</td>
                <td><i className="fa fa-pause" /> {resolveText("Paused")}</td>
            </tr>
        )
    }
    const timeSortedDispensions = medication.plannedDispensions.sort((a:any,b:any) => a.timestamp.localeCompare(b.timestamp));
    const dispensionsToday = timeSortedDispensions.filter(dispension => isToday(new Date(dispension.timestamp)));
    const dispensionsTomorrow = timeSortedDispensions.filter(dispension => isTomorrow(new Date(dispension.timestamp)));
    const potentiallyMissedDispensions = timeSortedDispensions.filter(dispension => isBefore(new Date(dispension.timestamp), startOfToday()));

    return (
    <tr>
        <td>{selectionCheckbox}</td>
        <td>{medicationInfos}</td>
        <td>
            {potentiallyMissedDispensions.map(dispension => (
                <div key={dispension.id}>
                    <MedicationDispensionBadge
                        dispension={dispension}
                        onDispensionStateChanged={props.onDispensionStateChanged}
                    />
                </div>
            ))}
        </td>
        <td>
            {dispensionsToday.length > 0
            ? dispensionsToday.map(dispension => (
                <div key={dispension.id}>
                    <MedicationDispensionBadge
                        dispension={dispension}
                        onDispensionStateChanged={props.onDispensionStateChanged}
                        hideDate
                    />
                </div>
            ))
            : resolveText('None')}
        </td>
        <td>
            {dispensionsTomorrow.length > 0
            ? dispensionsTomorrow.map(dispension => (
                <div key={dispension.id}>
                    <MedicationDispensionBadge
                        dispension={dispension}
                        onDispensionStateChanged={props.onDispensionStateChanged}
                        hideDate
                    />
                </div>
            ))
            : resolveText('None')}
        </td>
    </tr>);

}