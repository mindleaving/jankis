import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { AutoCompleteContext } from '../../localComponents/types/enums.d';
import { MemoryFormControl } from '../../sharedCommonComponents/components/MemoryFormControl';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface UnitValueFormControlProps {
    value: number;
    unit: string;
    onValueChanged: (value: number) => void;
    onUnitChanged: (unit: string) => void;
}

export const UnitValueFormControl = (props: UnitValueFormControlProps) => {

    return (
        <InputGroup>
            <FormControl required
                type='number'
                value={props.value}
                onChange={(e:any) => props.onValueChanged(e.target.value)}
                placeholder={resolveText('Observation_Value')}
            />
            <MemoryFormControl
                context={AutoCompleteContext.Unit}
                defaultValue={props.unit}
                onChange={props.onUnitChanged}
                placeholder={resolveText('Unit')}
                minSearchTextLength={1}
            />
        </InputGroup>
    );

}