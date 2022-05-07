import { differenceInHours } from 'date-fns';
import { Table, Button } from 'react-bootstrap';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDrug, formatDate, formatDispension } from '../../helpers/Formatters';
import { moveDispensionBackToSchedule } from '../../redux/slices/medicationSchedulesSlice';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';

interface PastMedicationTableRowProps {
    dispensions: Models.Medication.MedicationDispension[];
}

export const PastMedicationTableRow = (props: PastMedicationTableRowProps) => {

    const lastDispension = props.dispensions[0];
    const drugId = lastDispension.drug.id;
    const now = new Date();
    const dispatch = useAppDispatch();

    const moveDispensionToSchedule = (dispensionId: string) => {
        const matchingDispension = props.dispensions.find(x => x.id === dispensionId);
        dispatch(moveDispensionBackToSchedule({
            args: {
                dispension: matchingDispension!
            }
        }));
    }
    
    return (
        <tr>
            <td>
                <strong>{formatDrug(props.dispensions[0].drug)}</strong>
                <div>
                    <small>{formatDate(new Date(lastDispension.timestamp))}</small>
                </div>
            </td>
            <td>
                <AccordionCard standalone
                    eventKey={drugId}
                    title={formatDispension(lastDispension)}
                >
                    <Table>
                        <tbody>
                            {props.dispensions.map(dispension => {
                                const canMoveToSchedule = differenceInHours(now, new Date(dispension.timestamp)) < 24;
                                return (
                                    <tr key={dispension.id}>
                                        <td>{formatDate(new Date(dispension.timestamp))}</td>
                                        <td>{resolveText(`MedicationDispensionState_${dispension.state}`)}</td>
                                        <td>{dispension.state === MedicationDispensionState.Dispensed ? `${dispension.value} ${dispension.unit}` : ''}</td>
                                        <td>
                                            {canMoveToSchedule 
                                            ? <Button 
                                                size="sm"
                                                onClick={() => moveDispensionToSchedule(dispension.id)}
                                            >
                                                {resolveText("MedicationDispension_MoveToSchedule")}
                                            </Button>
                                            : null}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </AccordionCard>
            </td>
        </tr>
    );

}