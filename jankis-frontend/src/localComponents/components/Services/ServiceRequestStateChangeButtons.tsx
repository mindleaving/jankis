import React from 'react';
import { Alert } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ServiceRequestState } from '../../types/enums.d';

interface ServiceRequestStateChangeButtonsProps {
    state: ServiceRequestState;
    onStateChange: (newState: ServiceRequestState) => void;
    isChanging: boolean;
}

export const ServiceRequestStateChangeButtons = (props: ServiceRequestStateChangeButtonsProps) => {

    const nextStates: ServiceRequestState[] = [];
    switch(props.state) {
        case ServiceRequestState.Requested:
            nextStates.push(ServiceRequestState.Accepted, ServiceRequestState.Declined);
            break;
        case ServiceRequestState.Accepted:
            nextStates.push(ServiceRequestState.ReadyWhenYouAre, ServiceRequestState.InProgress, ServiceRequestState.Fulfilled, ServiceRequestState.Declined);
            break;
        case ServiceRequestState.ReadyWhenYouAre:
            nextStates.push(ServiceRequestState.Accepted, ServiceRequestState.InProgress, ServiceRequestState.Fulfilled, ServiceRequestState.Declined);
            break;
        case ServiceRequestState.InProgress:
            nextStates.push(ServiceRequestState.Accepted, ServiceRequestState.Fulfilled, ServiceRequestState.Declined);
            break;
    }

    const finalStateColorVariantFromState = (state: ServiceRequestState) => {
        switch(state) {
            case ServiceRequestState.Fulfilled:
                return "success";
            case ServiceRequestState.Declined:
            case ServiceRequestState.CancelledByRequester:
                return "danger";
            default:
                return "light";
        }
    }
    if(nextStates.length === 0) {
        const variant = finalStateColorVariantFromState(props.state);
        return (<Alert
            variant={variant}
            className="m-3"
        >
            {resolveText('ServiceRequest_State_Final')}: <b>{resolveText(`ServiceRequestState_${props.state}`)}</b>
        </Alert>);
    }

    const buttonColorFromState = (currentState: ServiceRequestState, state: ServiceRequestState) => {
        switch(state) {
            case ServiceRequestState.Accepted:
                return currentState === ServiceRequestState.Requested ? "success" : "secondary";
            case ServiceRequestState.ReadyWhenYouAre:
                return "warning";
            case ServiceRequestState.InProgress:
                return "warning";
            case ServiceRequestState.Fulfilled:
                return "success";
            case ServiceRequestState.Declined:
                return "danger";
            default:
                return "primary";
        }
    }
    const needsConfirmation = (currentState: ServiceRequestState, newState: ServiceRequestState) => {
        switch(newState) {
            case ServiceRequestState.Accepted:
                return currentState === ServiceRequestState.Requested;
            case ServiceRequestState.ReadyWhenYouAre:
                return true;
            case ServiceRequestState.InProgress:
                return false;
            case ServiceRequestState.Fulfilled:
                return true;
            case ServiceRequestState.Declined:
                return true;
            default:
                return false;
        }
    }

    const confirmStateChange = (newState: ServiceRequestState) => {
        const title = resolveText('ServiceRequest_StateChange_Confirm_Title')
            .replace('{newState}', resolveText(`ServiceRequestState_${newState}`));

        const message = (newState === ServiceRequestState.Declined
                ? resolveText('ServiceRequest_StateChange_Decline_Confirm_Message')
                : resolveText('ServiceRequest_StateChange_Confirm_Message'))
            .replace('{newState}', resolveText(`ServiceRequestState_${newState}`));

        confirmAlert({
            title: title,
            message: message,
            closeOnClickOutside: true,
            buttons: [
                {
                    label: resolveText('StateChange_No'),
                    onClick: () => {}
                }, 
                {
                    label: resolveText('StateChange_Yes'),
                    onClick: () => setState(newState, true)
                }
            ]
        });
    }
    const setState = (newState: ServiceRequestState, isConfirmed: boolean = false) => {
        if(!isConfirmed && needsConfirmation(props.state, newState)) {
            confirmStateChange(newState);
            return;
        }
        props.onStateChange(newState);
    }

    return (<>
        {nextStates.map(newState => (
            <AsyncButton
                className="m-2 p-3"
                variant={buttonColorFromState(props.state, newState)}
                activeText={resolveText(`ServiceRequestState_${newState}`)}
                executingText={resolveText(`ServiceRequestState_${newState}`)}
                isExecuting={props.isChanging}
                onClick={() => setState(newState)}
            />
        ))}
    </>)

}