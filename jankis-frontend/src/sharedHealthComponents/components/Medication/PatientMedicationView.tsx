import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { MedicationDispensionChart } from './MedicationDispensionChart';
import { MedicationScheduleView } from './MedicationScheduleView';
import { PastMedicationTable } from './PastMedicationTable';
import { NotificationManager } from 'react-notifications';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { createNewMedicationSchedule } from '../../redux/slices/medicationSchedulesSlice';
import { MedicationScheduleSelectorRow } from './MedicationScheduleSelectorRow';
import { ImmunizationTable } from './ImmunizationTable';
import { useNavigate } from 'react-router-dom';

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
    
    const now = new Date();
    return (
        <>
            <Tabs 
                defaultActiveKey='upcoming'
                className='mt-3'
            >
                <Tab 
                    eventKey='upcoming'
                    title={resolveText("Medication_UpcomingDispensions")}
                >
                    <MedicationScheduleSelectorRow
                        medicationSchedules={medicationSchedules}
                        selectedMedicationSchedule={selectedMedicationSchedule}
                        onSelectionChanged={setSelectedMedicationSchedule}
                    />
                    {selectedMedicationSchedule
                    ? <>
                        <h3>{}</h3>
                        <MedicationScheduleView
                            medicationSchedule={selectedMedicationSchedule}
                            onSwitchToActive={switchToActiveMedicationSchedule}
                        />
                    </>
                    : <Row>
                        <Col className="text-center">
                            {resolveText('MedicationSchedule_NoneSelected')}
                            <div>
                                <Button 
                                    onClick={() => dispatch(createNewMedicationSchedule(props.personId))} 
                                    size="lg"
                                >
                                    {resolveText('CreateNew')}
                                </Button>
                            </div>
                        </Col>
                    </Row>}
                </Tab>
                <Tab 
                    eventKey='past'
                    title={resolveText("Medication_PastDispensions")}
                >
                    <MedicationDispensionChart
                        medicationDispensions={medicationDispensions.filter(x => x.state === MedicationDispensionState.Dispensed)}
                        groupBy={x => x.drug.id}
                        defaultTimeRangeStart={addDays(now, -180)}
                        defaultTimeRangeEnd={addDays(now, 3)}
                    />
                    <PastMedicationTable
                        personId={props.personId}
                    />
                </Tab>
                <Tab 
                    eventKey='immunizations'
                    title={resolveText("Immunizations")}
                >
                    <Row>
                        <Col></Col>
                        <Col xs="auto">
                            <Button 
                                onClick={() => navigate(`/healthrecord/${props.personId}/add/immunization`)}
                                className="m-3"
                            >
                                {resolveText("CreateNew")}
                            </Button>
                        </Col>
                    </Row>
                    <ImmunizationTable
                        personId={props.personId}
                    />
                </Tab>
            </Tabs>
        </>
    );

}