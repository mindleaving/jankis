import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { Models } from '../../types/models';
import { Autocomplete } from './Autocomplete';

interface RoomAutocompleteProps {
    isLoading?: boolean;
    value?: Models.Room;
    onChange: (room: Models.Room | undefined) => void;
}

export const RoomAutocomplete = (props: RoomAutocompleteProps) => {

    const roomAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Room>('api/rooms/search', 'searchText', 10), []);

    if(props.value || props.isLoading) {
        return (<Alert 
            variant="info"
            dismissible
            onClose={() => props.onChange(undefined)}
        >
            {props.isLoading 
            ? resolveText('Loading...') 
            : props.value!.name}
        </Alert>);
    }
    return (<Autocomplete
        search={roomAutocompleteRunner.search}
        displayNameSelector={x => x?.name}
        onItemSelected={props.onChange}
    />);

}