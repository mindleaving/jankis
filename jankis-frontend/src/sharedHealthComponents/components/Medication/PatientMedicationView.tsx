import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { Button, Col, FormControl, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationDispensionChart } from './MedicationDispensionChart';
import { MedicationScheduleView } from './MedicationScheduleView';
import { PastMedicationTable } from './PastMedicationTable';
import { NotificationManager } from 'react-notifications';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { uuid } from '../../../sharedCommonComponents/helpers/uuid';
import { addMedicationSchedule } from '../../redux/slices/medicationSchedulesSlice';

interface PatientMedicationViewProps {
    personId: string;
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.Medication.MedicationSchedule>();
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
        dispatch(addMedicationSchedule({
            args: medicationSchedule,
            body: medicationSchedule,
            onSuccess: () => {
                NotificationManager.success(resolveText('MedicationSchedule_SuccessfullyStored'));
            }
        }));
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
                    onSwitchToActive={switchToActiveMedicationSchedule}
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
                />
            </div>
            <div style={{ height: '200px'}}></div>
        </>
    );

}