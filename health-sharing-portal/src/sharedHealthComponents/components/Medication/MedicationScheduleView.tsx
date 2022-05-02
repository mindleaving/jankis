import { useEffect, useState } from 'react';
import { Alert, Button, FormCheck, Table } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationScheduleItemTableRow } from './MedicationScheduleItemTableRow';
import { DispensionStateChangeCallback } from '../../types/frontendTypes';
import { MedicationDispensionChart } from './MedicationDispensionChart';
import { addDays } from 'date-fns';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface MedicationScheduleViewProps {
    medicationSchedule: Models.Medication.MedicationSchedule;
    onDispensionStateChanged: DispensionStateChangeCallback;
    onSwitchToActive: () => void;
    onMarkedAsActive: (scheduleId: string) => void;
}

export const MedicationScheduleView = (props: MedicationScheduleViewProps) => {

    const [ selectedMedications, setSelectedMedications ] = useState<Models.Medication.MedicationScheduleItem[]>([]);

    useEffect(() => {
        if(!props.medicationSchedule) {
            setSelectedMedications([]);
            return;
        }
        setSelectedMedications(props.medicationSchedule.items);
    }, [ props.medicationSchedule ]);

    const addMedicationToSelection = (medication: Models.Medication.MedicationScheduleItem) => {
        if(selectedMedications.includes(medication)) return;
        setSelectedMedications(selectedMedications.concat(medication));
    }
    const removeMedicationFromSelection = (medication: Models.Medication.MedicationScheduleItem) => {
        setSelectedMedications(selectedMedications.filter(x => x !== medication));
    }
    const toggleSelectAll = () => {
        if(selectedMedications.length === props.medicationSchedule.items.length) {
            setSelectedMedications([]);
        } else {
            setSelectedMedications(props.medicationSchedule.items);
        }
    }
    const switchToActive = () => props.onSwitchToActive();
    const makeActive = async () => {
        await sendPostRequest(
            `api/medicationschedules/${props.medicationSchedule.id}/active`,
            resolveText("MedicationSchedule_CouldNotSetActive"),
            null,
            () => props.onMarkedAsActive(props.medicationSchedule.id)
        );
    }
    
    const now = new Date();
    return (
        <>
            {!props.medicationSchedule.isActive 
            ? <Alert 
                variant='danger'
            >
                <div className='d-flex'>
                    <div className='me-auto'>{resolveText("MedicationSchedule_NotActive")}</div>
                    <Button 
                        size="sm" 
                        className='mx-2'
                        onClick={switchToActive}
                    >
                        {resolveText("MedicationSchedule_SwitchToActive")}
                    </Button>
                    <Button 
                        size="sm"
                        variant='success'
                        className='mx-2'
                        onClick={makeActive}
                    >
                        {resolveText("MedicationSchedule_MakeActive")}
                    </Button>
                </div>
            </Alert> 
            : null}
            {props.medicationSchedule.items.flatMap(item => item.plannedDispensions).length > 0
            ? <MedicationDispensionChart
                medicationDispensions={selectedMedications.flatMap(x => x.plannedDispensions)}
                groupBy={x => x.drug.id}
                defaultTimeRangeStart={addDays(now, -2)}
                defaultTimeRangeEnd={addDays(now, 3)}
            /> : null}
            {props.medicationSchedule.note
            ? <Alert variant="danger">
                {props.medicationSchedule.note}
            </Alert> : null}
            <Table>
                <thead>
                    <tr>
                        <th>
                            <FormCheck
                                checked={selectedMedications.length === props.medicationSchedule.items.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th>{resolveText('MedicationScheduleItem_DrugName')}</th>
                        <th>{resolveText('MedicationScheduleItem_PotentiallyMissedDispensions')}</th>
                        <th>{resolveText('MedicationScheduleItem_DispensionsToday')}</th>
                        <th>{resolveText('MedicationScheduleItem_DispensionsTomorrow')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.medicationSchedule.items.map(medication => {
                        const isSelected = selectedMedications.includes(medication);
                        return (
                            <MedicationScheduleItemTableRow
                                key={medication.drug.id}
                                medication={medication}
                                isSelected={isSelected}
                                onSelectionChanged={isSelected => isSelected ? addMedicationToSelection(medication) : removeMedicationFromSelection(medication)}
                                onDispensionStateChanged={props.onDispensionStateChanged}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </>
    );

}