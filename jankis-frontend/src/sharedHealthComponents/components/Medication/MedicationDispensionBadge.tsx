import { useContext, useState } from 'react';
import { Badge } from 'react-bootstrap';
import UserContext from '../../../localComponents/contexts/UserContext';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate, formatTime } from '../../helpers/Formatters';
import { dispenseMedication } from '../../redux/slices/medicationSchedulesSlice';
import { useAppDispatch } from '../../../localComponents/redux/store/healthRecordStore';

interface MedicationDispensionBadgeProps {
    scheduleId: string;
    scheduleItemId: string;
    dispension: Models.Medication.MedicationDispension;
    hideDate?: boolean;
}

export const MedicationDispensionBadge = (props: MedicationDispensionBadgeProps) => {

    const [ isExpanded, setIsExpanded ] = useState<boolean>(true);
    const user = useContext(UserContext);
    const dispatch = useAppDispatch();

    const markAsDispensed = () => {
        markAs(MedicationDispensionState.Dispensed);
    }
    const markAsMissed = () => {
        markAs(MedicationDispensionState.Missed);
    }
    const markAsSkipped = () => {
        markAs(MedicationDispensionState.Skipped);
    }
    const markAs = (state: MedicationDispensionState) => {
        const request: ViewModels.DispenseMedicationViewModel = {
            scheduleId: props.scheduleId,
            itemId: props.scheduleItemId,
            dispensionId: props.dispension.id,
            dispensionState: state,
            note: '',
            administrationTime: new Date(),
            administeredAmount: {
                value: props.dispension.drug.amountValue,
                unit: props.dispension.drug.amountUnit
            },
            administeredBy: user!.accountId
        };
        dispatch(dispenseMedication({
            args: {
                scheduleId: props.scheduleId,
                dispensionId: props.dispension.id,
                dispensionState: state
            },
            body: request
        }));
    }

    const icons = isExpanded
        ? <>
            <i 
                className='fa fa-check green clickable ms-2' 
                title={resolveText(`MedicationDispensionState_Dispensed`)} 
                onClick={markAsDispensed} 
            />
            <i 
                className='fa fa-times red clickable ms-2'
                title={resolveText(`MedicationDispensionState_Missed`)} 
                onClick={markAsMissed} 
            />
            <i 
                className='fa fa-forward clickable ms-2'
                title={resolveText(`MedicationDispensionState_Skipped`)} 
                onClick={markAsSkipped} 
            />
            <i 
                className='fa fa-ellipsis-h clickable ms-2'
                title={resolveText("MoreOptions")}
                onClick={() => setIsExpanded(false)}
            />
        </>
        : <>
            <i 
                className='fa fa-ellipsis-h clickable ms-2' 
                title={resolveText("MoreOptions")}
                onClick={() => setIsExpanded(true)}
            />
        </>
    return (
        <Badge
            bg="info"
        >
            {props.hideDate ? formatTime(new Date(props.dispension.timestamp)) : formatDate(new Date(props.dispension.timestamp))}
            {props.dispension.note ? ` (${props.dispension.note})` : ''}
            {icons}
        </Badge>
    );

}