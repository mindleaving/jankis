import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatMedicalProcedureCodeAndName, formatDate } from '../../helpers/Formatters';
import { deleteMedicalProcedure } from '../../redux/slices/medicalProceduresSlice';

interface MedicalProcedureTableRowProps {
    medicalProcedure: Models.Procedures.MedicalProcedure
}

export const MedicalProcedureTableRow = (props: MedicalProcedureTableRowProps) => {

    const medicalProcedure = props.medicalProcedure;
    const dispatch = useAppDispatch();
    const dispatchDeleteMedicalProcedure = () => {
        openConfirmDeleteAlert(
            `${medicalProcedure.snomedCtName} (${formatDate(new Date(medicalProcedure.timestamp))})`,
            resolveText("MedicalProcedure_Delete_Title"),
            resolveText("MedicalProcedure_Delete_Message"),
            () => dispatch(deleteMedicalProcedure({ args: medicalProcedure.id }))
        );
    }
    return (
        <tr>
            <td>
                <i
                    className='fa fa-trash red clickable'
                    onClick={dispatchDeleteMedicalProcedure}
                />
            </td>
            <td>
                <strong>{formatMedicalProcedureCodeAndName(medicalProcedure)}</strong>
                <div><small>{formatDate(new Date(medicalProcedure.timestamp))}</small></div>
            </td>
            <td>
                <small>{medicalProcedure.note}</small>
            </td>
        </tr>
    );

}