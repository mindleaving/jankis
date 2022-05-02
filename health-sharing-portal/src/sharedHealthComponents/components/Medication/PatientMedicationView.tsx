import { addDays } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, FormControl, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationDispensionChart } from './MedicationDispensionChart';
import { MedicationScheduleView } from './MedicationScheduleView';
import { PastMedicationTable } from './PastMedicationTable';
import { NotificationManager } from 'react-notifications';
import { buildAndStoreObject, sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { ViewModels } from '../../../localComponents/types/viewModels';
import UserContext from '../../../localComponents/contexts/UserContext';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';
import { addMedicationDispension, removeMedicationDispension } from '../../redux/slices/medicationDispensionsSlice';
import { uuid } from '../../../sharedCommonComponents/helpers/uuid';
import { addDispensionToMedicationSchedule, addMedicationSchedule, removeDispensionFromMedicationSchedule, setMedicationScheduleIsActive } from '../../redux/slices/medicationSchedulesSlice';

interface PatientMedicationViewProps {
    personId: string;
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.Medication.MedicationSchedule>();
    const user = useContext(UserContext);
    const medicationSchedules = useAppSelector(state => state.medicationSchedules.items.filter(x => x.personId === props.personId));
    const medicationDispensions = useAppSelector(state => state.medicationDispensions.items.filter(x => x.personId === props.personId));
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if(medicationSchedules.length === 0) {
            setSelectedMedicationSchedule(undefined);
            return;
        }
        if(selectedMedicationSchedule) {
            setSelectedMedicationSchedule(medicationSchedules.find(x => x.id === selectedMedicationSchedule.id) ?? medicationSchedules[0]);
            return;
        }
        setSelectedMedicationSchedule(medicationSchedules[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ medicationSchedules ]);
    
    const switchToActiveMedicationSchedule = () => {
        const activeSchedule = medicationSchedules.find(x => x.isActive);
        if(!activeSchedule) {
            NotificationManager.error(resolveText("MedicationSchedules_NoActiveFound"));
            return;
        }
        setSelectedMedicationSchedule(activeSchedule);
    }

    const markAsActive = (scheduleId: string) => {
        const activeSchedules = medicationSchedules.filter(x => x.isActive);
        for (const activeSchedule of activeSchedules) {
            if(activeSchedule.id === scheduleId) {
                continue;
            }
            dispatch(setMedicationScheduleIsActive({
                scheduleId: activeSchedule.id,
                isActive: false
            }));
        }
        if(!activeSchedules.some(x => x.id === scheduleId))
        {
            dispatch(setMedicationScheduleIsActive({
                scheduleId: scheduleId,
                isActive: true
            }));
        }
    }
    const moveDispensionToSchedule = async (dispensionId: string) => {
        const matchingDispension = medicationDispensions.find(x => x.id === dispensionId)!;
        await sendPostRequest(
            `api/medicationdispensions/${dispensionId}/back-to-schedule`,
            resolveText("MedicationDispension_CouldNotMoveToSchedule"),
            null,
            async response => {
                const scheduleId = await response.text();
                dispatch(addDispensionToMedicationSchedule({
                    scheduleId: scheduleId,
                    dispension: matchingDispension
                }));
                dispatch(removeMedicationDispension(dispensionId));
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
                dispatch(removeDispensionFromMedicationSchedule({
                    scheduleId: selectedMedicationSchedule.id,
                    dispensionId: dispensionId
                }));
                matchingDispension.state = newState;
                dispatch(addMedicationDispension(matchingDispension));
            }
        );
    }

    const onCreateNewMedicationSchedule = async () => {
        NotificationManager.info(resolveText('MedicationSchedule_Creating...'));
        const medicationSchedule: Models.Medication.MedicationSchedule = {
            id: uuid(),
            personId: props.personId,
            note: '',
            isPaused: false,
            isDispendedByPatient: false,
            isActive: true,
            items: []
        };
        await buildAndStoreObject<Models.Medication.MedicationSchedule>(
            `api/medicationschedules/${medicationSchedule.id}`,
            resolveText('MedicationSchedule_SuccessfullyStored'),
            resolveText('MedicationSchedule_CouldNotStore'),
            () => medicationSchedule,
            () => dispatch(addMedicationSchedule(medicationSchedule))
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
                            onChange={(e:any) => setSelectedMedicationSchedule(medicationSchedules.find(x => x.id === e.target.value))}
                            style={{ minWidth: '100px'}}
                        >
                            {medicationSchedules.map((medicationSchedule,index) => (
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
                        <Button onClick={onCreateNewMedicationSchedule} size="lg">{resolveText('CreateNew')}</Button>
                    </div>
                </Col>
            </Row>}
            <div className='mt-3'>
                <h3>{resolveText("Medication_PastDispensions")}</h3>
                <MedicationDispensionChart
                    medicationDispensions={medicationDispensions.filter(x => x.state === MedicationDispensionState.Dispensed)}
                    groupBy={x => x.drug.id}
                    defaultTimeRangeStart={addDays(now, -180)}
                    defaultTimeRangeEnd={addDays(now, 3)}
                />
                <PastMedicationTable
                    medicationDispensions={medicationDispensions}
                    moveDispensionToSchedule={moveDispensionToSchedule}
                />
            </div>
            <div style={{ height: '200px'}}></div>
        </>
    );

}