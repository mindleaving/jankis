import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDrug, formatDate, formatDispension } from '../../helpers/Formatters';
import { deleteImmunization } from '../../redux/slices/immunizationsSlice';

interface ImmunizationTableRowProps {
    immunizations: Models.Medication.Immunization[];
}

export const ImmunizationTableRow = (props: ImmunizationTableRowProps) => {

    const lastDispension = props.immunizations[0];
    const takenDispensions = props.immunizations.filter(x => x.state === MedicationDispensionState.Dispensed);
    const lastTakenDispension = takenDispensions[0];
    const drugId = lastDispension.drug.id;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const dispatchDeleteImmunization = (immunizationId: string, immunizationName: string) => {
        openConfirmDeleteAlert(
            immunizationName,
            resolveText("Immunization_ConfirmDelete_Title"),
            resolveText("Immunization_ConfirmDelete_Description"),
            () => dispatch(deleteImmunization({ args: immunizationId }))
        );
    }
    return (
        <tr>
            <td>
                <strong>{formatDrug(lastDispension.drug)}</strong>
                {takenDispensions.length > 0 ?
                <div>
                    <small>
                        {takenDispensions.length} {resolveText("Medication_Doses")} - {resolveText("Medication_LastDose")}: {formatDate(new Date(lastTakenDispension.timestamp))}
                    </small>
                </div>
                : null}
                {lastDispension.drug.protectsAgainst?.length > 0
                ? <div className='small fw-bold'>
                    {resolveText("Immunization_ProtectsAgainst")}:
                    <ul>
                        {lastDispension.drug.protectsAgainst.map((pathogen,idx) => (
                            <li key={idx}>{pathogen}</li>
                        ))}
                    </ul>
                </div>
                : null}
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
                                            <i 
                                                className='fa fa-trash red clickable' 
                                                onClick={() => dispatchDeleteImmunization(immunization.id, immunizationName)}
                                            />
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