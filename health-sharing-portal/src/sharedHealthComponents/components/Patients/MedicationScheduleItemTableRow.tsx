import { Badge, FormCheck } from 'react-bootstrap';
import { formatDrug } from '../../helpers/Formatters';
import { isToday, isTomorrow } from 'date-fns';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface MedicationScheduleItemTableRowProps {
    medication: Models.Medication.MedicationScheduleItem;
    isSelected: boolean;
    onSelectionChanged: (isSelected: boolean) => void;
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
    const timeSortedDispensions = medication.dispensions.sort((a:any,b:any) => a.timestamp.localeCompare(b.timestamp));
    const dispensionsToday = timeSortedDispensions.filter(dispension => isToday(new Date(dispension.timestamp)));
    const dispensionsTomorrow = timeSortedDispensions.filter(dispension => isTomorrow(new Date(dispension.timestamp)));
    return (
    <tr>
        <td>{selectionCheckbox}</td>
        <td>{medicationInfos}</td>
        <td>
            {dispensionsToday.length > 0
            ? dispensionsToday.map(dispension => (
                <div>
                    <Badge bg="primary">{new Date(dispension.timestamp).toLocaleTimeString()}{dispension.note ? ` (${dispension.note})` : ''}</Badge>
                </div>
            ))
            : resolveText('None')}
        </td>
        <td>
            {dispensionsTomorrow.length > 0
            ? dispensionsTomorrow.map(dispension => (
                <div>
                    <Badge bg="primary">{new Date(dispension.timestamp).toLocaleTimeString()}{dispension.note ? ` (${dispension.note})` : ''}</Badge>
                </div>
            ))
            : resolveText('None')}
        </td>
    </tr>);

}