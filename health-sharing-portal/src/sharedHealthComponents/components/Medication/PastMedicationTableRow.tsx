import { differenceInHours } from 'date-fns';
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDrug, formatDate } from '../../helpers/Formatters';

interface PastMedicationTableRowProps {
    dispensions: Models.Medication.MedicationDispension[];
    moveDispensionToSchedule: (dispensionId: string) => void;
}

export const PastMedicationTableRow = (props: PastMedicationTableRowProps) => {

    const lastDispension = props.dispensions[0];
    const drugId = lastDispension.drug.id;
    const now = new Date();
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
                    title={`${resolveText(`MedicationDispensionState_${lastDispension.state}`)} - ${lastDispension.value} ${lastDispension.unit}`}
                >
                    <Table>
                        <tbody>
                            {props.dispensions.map(dispension => {
                                const canMoveToSchedule = differenceInHours(now, new Date(dispension.timestamp)) < 24;
                                return (
                                    <tr key={dispension.id}>
                                        <td>{formatDate(new Date(dispension.timestamp))}</td>
                                        <td>{resolveText(`MedicationDispensionState_${dispension.state}`)}</td>
                                        <td>{dispension.value} {dispension.unit}</td>
                                        <td>
                                            {canMoveToSchedule 
                                            ? <Button 
                                                size="sm"
                                                onClick={() => props.moveDispensionToSchedule(dispension.id)}
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