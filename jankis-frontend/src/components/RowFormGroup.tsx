import React, { ElementType } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';

interface RowFormGroupProps {
    label: string;
    as?: ElementType<any>;
    type?: string;
    value: any;
    onChange: (changedValue: any) => void;
    disabled?: boolean;
    required?: boolean;
}

export const RowFormGroup = (props: RowFormGroupProps) => {

    return (
        <FormGroup as={Row}>
            <FormLabel column>{props.label}</FormLabel>
            <Col>
                <FormControl
                    required={props.required}
                    as={props.as}
                    type={props.type}
                    value={props.value}
                    onChange={(e:any) => props.onChange(e.target.value)}
                    disabled={props.disabled}
                />
            </Col>
        </FormGroup>
    );

}