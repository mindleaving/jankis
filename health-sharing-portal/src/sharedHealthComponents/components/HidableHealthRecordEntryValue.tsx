import React, { PropsWithChildren } from 'react';

interface HidableHealthRecordEntryValueProps {
    hideValue: boolean;
    onMarkAsSeen: () => void;
}

export const HidableHealthRecordEntryValue = (props: PropsWithChildren<HidableHealthRecordEntryValueProps>) => {

    return (<>
        {props.hideValue 
            ? <i className='fa fa-eye-slash clickable' onClick={props.onMarkAsSeen} /> 
            : props.children}
    </>);

}