import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { resolveText } from '../helpers/Globalizer';
import { AutoCompleteContext, LocationType } from '../types/enums.d';
import { Models } from '../types/models';
import { ViewModels } from '../types/viewModels';
import { DepartmentAutocomplete } from './Autocompletes/DepartmentAutocomplete';
import { RoomAutocomplete } from './Autocompletes/RoomAutocomplete';
import { MemoryFormControl } from './MemoryFormControl';

interface LocationFormControlProps {
    value?: ViewModels.LocationViewModel;
    onChange: (location: Models.LocationReference) => void;
    required?: boolean;
}

export const LocationFormControl = (props: LocationFormControlProps) => {

    const [ type, setType ] = useState<LocationType | undefined>(props.value?.type);
    const [ selectedDepartment, setSelectedDepartment ] = useState<ViewModels.DepartmentViewModel | undefined>(props.value?.department);
    const [ selectedRoom, setSelectedRoom ] = useState<Models.Room | undefined>(props.value?.room);
    const [ externalLocation, setExternalLocation ] = useState<string | undefined>(props.value?.id);

    useEffect(() => {
        if(!type) return;
        let locationReference;
        if(type === LocationType.Department) {
            if(!selectedDepartment) return;
            locationReference = {
                type: type,
                id: selectedDepartment.id
            };
        } else if(type === LocationType.Room) {
            if(!selectedRoom) return;
            locationReference = {
                type: type,
                id: selectedRoom.id
            };
        } else if(type === LocationType.External) {
            if(!externalLocation) return;
            locationReference = {
                type: type,
                id: externalLocation
            }
        } else {
            throw new Error(`Unsupported location type '${type}'`);
        }
        props.onChange(locationReference);
    }, [ type, selectedDepartment, selectedRoom, externalLocation ]);

    let typeSpecificControls = null;
    if(type === LocationType.Department) {
        typeSpecificControls = (
            <FormGroup>
                <FormLabel>{resolveText('Department')}</FormLabel>
                <DepartmentAutocomplete
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                />
            </FormGroup>
        );
    } else if(type === LocationType.Room) {
        typeSpecificControls = (
            <FormGroup>
                <FormLabel>{resolveText('Room')}</FormLabel>
                <RoomAutocomplete
                    value={selectedRoom}
                    onChange={setSelectedRoom}
                />
            </FormGroup>
        );
    } else if(type === LocationType.External) {
        typeSpecificControls = (
            <FormGroup>
                <FormLabel>{resolveText('Location_External')}</FormLabel>
                <MemoryFormControl
                    context={AutoCompleteContext.ExternalLocation}
                    defaultValue={externalLocation}
                    onChange={setExternalLocation}
                />
            </FormGroup>
        );
    }

    return (
        <>
            <FormGroup>
                <FormLabel>{resolveText('Location_Type')}</FormLabel>
                <FormControl required={props.required}
                    as="select"
                    value={type ?? ''}
                    onChange={(e:any) => setType(e.target.value)}
                >
                    <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                    {Object.keys(LocationType).map(x => (
                        <option key={x} value={x}>{resolveText(`LocationType_${x}`)}</option>
                    ))}
                </FormControl>
            </FormGroup>
            {typeSpecificControls}
        </>
    );

}