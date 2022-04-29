import { useEffect, useState } from 'react';
import { Button, Col, FormControl, FormLabel, InputGroup, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate, formatDrug } from '../../helpers/Formatters';
import { MedicationScheduleView } from '../Medication/MedicationScheduleView';

interface PatientMedicationViewProps {
    medicationSchedules: Models.Medication.MedicationSchedule[];
    medicationDispensions: Models.Medication.MedicationDispension[];
    onCreateNewMedicationSchedule: () => void;
}

export const PatientMedicationView = (props: PatientMedicationViewProps) => {

    const [ selectedMedicationSchedule, setSelectedMedicationSchedule ] = useState<Models.Medication.MedicationSchedule>();
    const navigate = useNavigate();

    useEffect(() => {
        if(selectedMedicationSchedule) return;
        if(props.medicationSchedules.length === 0) return;
        setSelectedMedicationSchedule(props.medicationSchedules[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.medicationSchedules ]);
    

    
    
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
            ? <MedicationScheduleView
                medicationSchedule={selectedMedicationSchedule}
            />
            : <Row>
                <Col className="text-center">
                    {resolveText('MedicationSchedule_NoneSelected')}
                    <div>
                        <Button onClick={props.onCreateNewMedicationSchedule} size="lg">{resolveText('CreateNew')}</Button>
                    </div>
                </Col>
            </Row>}
            <Table>
                <tbody>
                    {props.medicationDispensions.map(dispension => (
                        <tr key={dispension.id}>
                            <td>{formatDrug(dispension.drug)}</td>
                            <td>{formatDate(new Date(dispension.timestamp))}</td>
                            <td>{dispension.state}</td>
                            <td>{dispension.value} {dispension.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );

}