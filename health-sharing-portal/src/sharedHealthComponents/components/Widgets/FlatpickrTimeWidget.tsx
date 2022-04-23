import { WidgetProps } from '@rjsf/core';
import { FormGroup, FormLabel } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';

export const FlatpickrTimeWidget = (props: WidgetProps) => {

    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <Flatpickr
                className='form-control'
                options={{
                    allowInput: true,
                    enableTime: true,
                    time_24hr: true
                }}
                value={props.value}
                onChange={(dates: Date[], dateStr: string) => props.onChange(dates[0].toISOString())}
            />
        </FormGroup>
    );

}