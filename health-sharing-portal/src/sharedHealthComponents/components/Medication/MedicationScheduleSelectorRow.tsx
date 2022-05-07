import { Row, Col, FormLabel, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface MedicationScheduleSelectorRowProps {
    medicationSchedules: Models.Medication.MedicationSchedule[];
    selectedMedicationSchedule?: Models.Medication.MedicationSchedule;
    onSelectionChanged: (selectedSchedule?: Models.Medication.MedicationSchedule) => void;
}

export const MedicationScheduleSelectorRow = (props: MedicationScheduleSelectorRowProps) => {

    const selectedMedicationSchedule = props.selectedMedicationSchedule;
    const navigate = useNavigate();
    
    return (
        <Row className="mt-2">
            <Col>
            </Col>
            <FormLabel column xs="auto">{resolveText('MedicationSchedule')}</FormLabel>
            <Col xs="auto">
                <InputGroup>
                    <FormControl
                        as="select"
                        value={selectedMedicationSchedule?.id ?? ''}
                        onChange={(e:any) => props.onSelectionChanged(props.medicationSchedules.find(x => x.id === e.target.value))}
                        style={{ minWidth: '100px'}}
                    >
                        {props.medicationSchedules.map((medicationSchedule,index) => (
                            <option key={medicationSchedule.id} value={medicationSchedule.id}>
                                {medicationSchedule.name ?? `${resolveText('MedicationSchedule')} #${index}`}
                            </option>
                        ))}
                    </FormControl>
                    {selectedMedicationSchedule
                    ? <i 
                        className="fa fa-edit clickable m-2" 
                        style={{ fontSize: '20px'}} 
                        onClick={() => navigate(`/medicationschedules/${selectedMedicationSchedule.id}/edit`)} 
                    />
                    : null}
                </InputGroup>
            </Col>
        </Row>
    );

}