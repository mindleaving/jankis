import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { MemoryFormControl } from '../../sharedCommonComponents/components/MemoryFormControl';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { AutoCompleteContext, InstitutionLocationType } from '../types/enums.d';
import { Models } from '../types/models';
import { ViewModels } from '../types/viewModels';
import { DepartmentAutocomplete } from './Autocompletes/DepartmentAutocomplete';
import { RoomAutocomplete } from './Autocompletes/RoomAutocomplete';

interface LocationFormControlProps {
    value?: ViewModels.LocationViewModel;
    onChange: (location: Models.LocationReference) => void;
    required?: boolean;
}

export const LocationFormControl = (props: LocationFormControlProps) => {

    const [ type, setType ] = useState<InstitutionLocationType | undefined>(props.value?.type);
    const [ selectedDepartment, setSelectedDepartment ] = useState<ViewModels.DepartmentViewModel | undefined>(props.value?.department);
    const [ selectedRoom, setSelectedRoom ] = useState<Models.Room | undefined>(props.value?.room);
    const [ externalLocation, setExternalLocation ] = useState<string | undefined>(props.value?.id);

    useEffect(() => {
        if(!type) return;
        let locationReference;
        if(type === InstitutionLocationType.Department) {
            if(!selectedDepartment) return;
            locationReference = {
                type: type,
                id: selectedDepartment.id
            };
        } else if(type === InstitutionLocationType.Room) {
            if(!selectedRoom) return;
            locationReference = {
                type: type,
                id: selectedRoom.id
            };
        } else if(type === InstitutionLocationType.External) {
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
    if(type === InstitutionLocationType.Department) {
        typeSpecificControls = (
            <FormGroup>
                <FormLabel>{resolveText('Department')}</FormLabel>
                <DepartmentAutocomplete
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                />
            </FormGroup>
        );
    } else if(type === InstitutionLocationType.Room) {
        typeSpecificControls = (
            <FormGroup>
                <FormLabel>{resolveText('Room')}</FormLabel>
                <RoomAutocomplete
                    value={selectedRoom}
                    onChange={setSelectedRoom}
                />
            </FormGroup>
        );
    } else if(type === InstitutionLocationType.External) {
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
                    {Object.keys(InstitutionLocationType).map(x => (
                        <option key={x} value={x}>{resolveText(`InstitutionLocationType_${x}`)}</option>
                    ))}
                </FormControl>
            </FormGroup>
            {typeSpecificControls}
        </>
    );

}