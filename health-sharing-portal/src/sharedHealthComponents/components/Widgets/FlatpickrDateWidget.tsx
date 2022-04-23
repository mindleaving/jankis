import { WidgetProps } from '@rjsf/core';
import { FormGroup, FormLabel } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';

export const FlatpickrDateWidget = (props: WidgetProps) => {

    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <Flatpickr
                className='form-control'
                options={{
                    allowInput: true,
                    enableTime: false,
                    time_24hr: true
                }}
                value={props.value}
                onChange={(_: Date[], dateStr: string) => props.onChange(`${dateStr}T00:00:00Z`)}
            />
        </FormGroup>
    );

}