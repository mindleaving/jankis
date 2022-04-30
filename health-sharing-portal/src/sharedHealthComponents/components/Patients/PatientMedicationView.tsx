import { addDays } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, FormControl, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationDispensionChart } from '../Medication/MedicationDispensionChart';
import { MedicationScheduleView } from '../Medication/MedicationScheduleView';
import { PastMedicationTable } from '../Medication/PastMedicationTable';
import { NotificationManager } from 'react-notifications';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { ViewModels } from '../../../localComponents/types/viewModels';
import UserContext from '../../../localComponents/contexts/UserContext';

interface PatientMedicationViewProps {
    medicationSchedules: Models.Medication.MedicationSchedule[];
    medicationDispensions: Models.Medication.MedicationDispension[];
    onCreateNewMedicationSchedule: () => void;
    onMedicationScheduleChanged: (scheduleId: string, update: Update<Models.Medication.MedicationSchedule>) => void;
    onMedicationDispensionRemoved: (dispensionId: string) => void;
    onDispensionAdded: (dispension: Models.Medication.MedicationDispension) => void;
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.Medication.MedicationSchedule>();
    const user = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(props.medicationSchedules.length === 0) {
            setSelectedMedicationSchedule(undefined);
            return;
        }
        if(selectedMedicationSchedule) {
            setSelectedMedicationSchedule(props.medicationSchedules.find(x => x.id === selectedMedicationSchedule.id) ?? props.medicationSchedules[0]);
            return;
        }
        setSelectedMedicationSchedule(props.medicationSchedules[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.medicationSchedules ]);
    
    const switchToActiveMedicationSchedule = () => {
        const activeSchedule = props.medicationSchedules.find(x => x.isActive);
        if(!activeSchedule) {
            NotificationManager.error(resolveText("MedicationSchedules_NoActiveFound"));
            return;
        }
        setSelectedMedicationSchedule(activeSchedule);
    }

    const markAsActive = (scheduleId: string) => {
        const activeSchedules = props.medicationSchedules.filter(x => x.isActive);
        for (const activeSchedule of activeSchedules) {
            if(activeSchedule.id === scheduleId) {
                continue;
            }
            props.onMedicationScheduleChanged(activeSchedule.id, x => ({
                ...x,
                isActive: false
            }));
        }
        if(!activeSchedules.some(x => x.id === scheduleId))
        {
            props.onMedicationScheduleChanged(scheduleId, x => ({
                ...x,
                isActive: true
            }));
        }
    }
    const moveDispensionToSchedule = async (dispensionId: string) => {
        const matchingDispension = props.medicationDispensions.find(x => x.id === dispensionId)!;
        await sendPostRequest(
            `api/medicationdispensions/${dispensionId}/back-to-schedule`,
            resolveText("MedicationDispension_CouldNotMoveToSchedule"),
            null,
            async response => {
                const scheduleId = await response.text();
                props.onMedicationScheduleChanged(scheduleId, x => ({
                    ...x,
                    items: x.items.map(item => item.drug.id === matchingDispension.drug.id 
                        ? {
                            ...item,
                            plannedDispensions: item.plannedDispensions.concat(matchingDispension)
                        }
                        : item)
                }));
                props.onMedicationDispensionRemoved(dispensionId);
            }
        );
    }

    const onDispensionStateChanged = async (dispensionId: string, oldState: MedicationDispensionState, newState: MedicationDispensionState) => {
        if(!selectedMedicationSchedule) {
            return;
        }
        const matchingItem = selectedMedicationSchedule.items.find(x => x.plannedDispensions.some(dispension => dispension.id === dispensionId));
        if(!matchingItem) {
            return;
        }
        const matchingDispension = matchingItem.plannedDispensions.find(dispension => dispension.id === dispensionId);
        if(!matchingDispension) {
            return;
        }
        const request: ViewModels.DispenseMedicationViewModel = {
            scheduleId: selectedMedicationSchedule.id,
            itemId: matchingItem.id,
            dispensionId: dispensionId,
            dispensionState: newState,
            note: '',
            administrationTime: new Date(),
            administeredAmount: {
                value: matchingDispension.drug.amountValue,
                unit: matchingDispension.drug.amountUnit
            },
            administeredBy: user!.accountId
        };
        await sendPostRequest(
            `api/medicationschedules/dispense`,
            resolveText("MedicationSchedule_CouldNotDispense"),
            request,
            () => {
                props.onMedicationScheduleChanged(selectedMedicationSchedule.id, x => ({
                    ...x,
                    items: x.items.map(item => ({
                        ...item,
                        plannedDispensions: item.plannedDispensions.filter(dispension => dispension.id !== dispensionId)
                    }))
                }));
                matchingDispension.state = newState;
                props.onDispensionAdded(matchingDispension);
            }
        );
    }
    
    const now = new Date();
    return (
        <>
            <Row className="mt-2">
                <Col>
                </Col>
                <FormLabel column xs="auto">{resolveText('MedicationSchedule')}</FormLabel>
                <Col xs="auto">
                    <InputGroup>
                        <FormControl
                            as="select"
                            value={selectedMedicationSchedule?.id ?? ''}
                            onChange={(e:any) => setSelectedMedicationSchedule(props.medicationSchedules.find(x => x.id === e.target.value))}
                            style={{ minWidth: '100px'}}
                        >
                            {props.medicationSchedules.map((medicationSchedule,index) => (
                                <option key={medicationSchedule.id} value={medicationSchedule.id}>
                                    {medicationSchedule.name ?? `${resolveText('MedicationSchedule')} #${index}`}
                                </option>
                            ))}
                        </FormControl>
                        {selectedMedicationSchedule
                        ? <i className="fa fa-edit clickable m-2" style={{ fontSize: '20px'}} onClick={() => navigate(`/medicationschedules/${selectedMedicationSchedule.id}/edit`)} />
                        : null}
                    </InputGroup>
                </Col>
            </Row>
            {selectedMedicationSchedule
            ? <>
                <h3>{resolveText("Medication_UpcomingDispensions")}</h3>
                <MedicationScheduleView
                    medicationSchedule={selectedMedicationSchedule}
                    onDispensionStateChanged={onDispensionStateChanged}
                    onSwitchToActive={switchToActiveMedicationSchedule}
                    onMarkedAsActive={markAsActive}
                />
            </>
            : <Row>
                <Col className="text-center">
                    {resolveText('MedicationSchedule_NoneSelected')}
                    <div>
                        <Button onClick={props.onCreateNewMedicationSchedule} size="lg">{resolveText('CreateNew')}</Button>
                    </div>
                </Col>
            </Row>}
            <div className='mt-3'>
                <h3>{resolveText("Medication_PastDispensions")}</h3>
                <MedicationDispensionChart
                    medicationDispensions={props.medicationDispensions.filter(x => x.state === MedicationDispensionState.Dispensed)}
                    groupBy={x => x.drug.id}
                    defaultTimeRangeStart={addDays(now, -180)}
                    defaultTimeRangeEnd={addDays(now, 3)}
                />
                <PastMedicationTable
                    medicationDispensions={props.medicationDispensions}
                    moveDispensionToSchedule={moveDispensionToSchedule}
                />
            </div>
            <div style={{ height: '200px'}}></div>
        </>
    );

}