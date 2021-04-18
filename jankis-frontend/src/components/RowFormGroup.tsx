import React, { ElementType, PropsWithChildren } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';

interface RowFormGroupProps {
    label: string;
    as?: ElementType<any>;
    type?: string;
    value: any;
    min?: number,
    max?: number,
    onChange: (changedValue: any) => void;
    disabled?: boolean;
    required?: boolean;
}

export const RowFormGroup = (props: PropsWithChildren<RowFormGroupProps>) => {

    return (
        <FormGroup as={Row}>
            <FormLabel column>{props.label}</FormLabel>
            <Col>
                {props.type?.toLowerCase() === "date" || props.type?.toLowerCase() === "datetime"
                ? <Flatpickr 
                    required={props.required}
                    disabled={props.disabled}
                    options={{
                        allowInput: true,
                        enableTime: props.type.toLowerCase() === "datetime",
                        time_24hr: true
                    }}
                    value={props.value}
                    onChange={selectedDates => props.onChange(selectedDates[0])}
                />
                : <FormControl
                        required={props.required}
                        as={props.as}
                        type={props.type}
                        value={props.value}
                        min={props.min}
                        max={props.max}
                        onChange={(e:any) => props.onChange(e.target.value)}
                        disabled={props.disabled}
                    >
                        {props.children}
                    </FormControl>
                }
            </Col>
        </FormGroup>
    );

}