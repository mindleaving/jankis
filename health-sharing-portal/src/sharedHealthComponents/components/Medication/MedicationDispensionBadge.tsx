import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { formatDate, formatTime } from '../../helpers/Formatters';
import { DispensionStateChangeCallback } from '../../types/frontendTypes';

interface MedicationDispensionBadgeProps {
    dispension: Models.Medication.MedicationDispension;
    hideDate?: boolean;
    onDispensionStateChanged: DispensionStateChangeCallback;
}

export const MedicationDispensionBadge = (props: MedicationDispensionBadgeProps) => {

    const [ isExpanded, setIsExpanded ] = useState<boolean>(true);

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
        props.onDispensionStateChanged(props.dispension.id, props.dispension.state, state);
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