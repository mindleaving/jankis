import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDrug, formatDate, formatDispension } from '../../helpers/Formatters';
import { deleteImmunization as deleteImmunizationFromStore } from '../../redux/slices/immunizationsSlice';

interface ImmunizationTableRowProps {
    immunizations: Models.Medication.Immunization[];
}

export const ImmunizationTableRow = (props: ImmunizationTableRowProps) => {

    const lastDispension = props.immunizations[0];
    const drugId = lastDispension.drug.id;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const deleteImmunization = (immunizationId: string, immunizationName: string) => {
        openConfirmDeleteAlert(
            immunizationName,
            resolveText("Immunization_ConfirmDelete_Title"),
            resolveText("Immunization_ConfirmDelete_Description"),
            () => dispatch(deleteImmunizationFromStore({ 
                args: immunizationId
            }))
        );
    }
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
                                <th></th>
                                <th>{resolveText("Immunization_Timestamp")}</th>
                                <th>{resolveText("Immunization_DispensionState")}</th>
                                <th>{resolveText("Immunization_BatchNumber")}</th>
                                <th>{resolveText("Immunization_Amount")}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.immunizations.map(immunization => {
                                const formattedTime = formatDate(new Date(immunization.timestamp));
                                const immunizationName = `${immunization.drug.productName} (${formattedTime})`;
                                return (
                                    <tr key={immunization.id}>
                                        <td>
                                            <i className='fa fa-trash red clickable' onClick={() => deleteImmunization(immunization.id, immunizationName)} />
                                        </td>
                                        <td>{formattedTime}</td>
                                        <td>{resolveText(`MedicationDispensionState_${immunization.state}`)}</td>
                                        <td>{immunization.batchNumber}</td>
                                        <td>{immunization.state === MedicationDispensionState.Dispensed ? `${immunization.value} ${immunization.unit}` : ''}</td>
                                        <td>
                                            <Button 
                                                variant="link"
                                                onClick={() => navigate(`/healthrecord/${immunization.personId}/edit/immunization/${immunization.id}`)}
                                            >
                                                {resolveText("Edit...")}
                                            </Button>
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