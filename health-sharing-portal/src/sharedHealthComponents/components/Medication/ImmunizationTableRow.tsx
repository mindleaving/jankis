import { Table } from 'react-bootstrap';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDrug, formatDate, formatDispension } from '../../helpers/Formatters';

interface ImmunizationTableRowProps {
    immunizations: Models.Medication.Immunization[];
}

export const ImmunizationTableRow = (props: ImmunizationTableRowProps) => {

    const lastDispension = props.immunizations[0];
    const drugId = lastDispension.drug.id;

    return (
        <tr>
            <td>
                <strong>{formatDrug(lastDispension.drug)}</strong>
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
                        <thead>
                            <tr>
                                <th>{resolveText("Immunization_Timestamp")}</th>
                                <th>{resolveText("Immunization_DispensionState")}</th>
                                <th>{resolveText("Immunization_BatchNumber")}</th>
                                <th>{resolveText("Immunization_Amount")}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.immunizations.map(immunization => {
                                return (
                                    <tr key={immunization.id}>
                                        <td>{formatDate(new Date(immunization.timestamp))}</td>
                                        <td>{resolveText(`MedicationDispensionState_${immunization.state}`)}</td>
                                        <td>{immunization.batchNumber}</td>
                                        <td>{immunization.state === MedicationDispensionState.Dispensed ? `${immunization.value} ${immunization.unit}` : ''}</td>
                                        <td>
                                            {/* TODO: Edit button? */}
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