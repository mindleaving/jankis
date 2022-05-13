import { WidgetProps } from '@rjsf/core';
import { useEffect } from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { addPerson, loadPerson } from '../../redux/slices/personsSlice';
import { PersonAutocomplete } from '../Autocompletes/PersonAutocomplete';

export const PersonAutocompleteWidget = (props: WidgetProps) => {

    const isLoading = useAppSelector(state => state.persons.isLoading);
    const person = useAppSelector(state => state.persons.items.find(x => x.id === props.value));
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!props.value || props.value === person?.id) {
            return;
        }
        dispatch(loadPerson({ personId: props.value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.value ]);

    const onPersonSelected = (person?: Models.Person) => {
        if(!person) {
            props.onChange(undefined);
            return;
        }
        dispatch(addPerson({
            args: person,
            body: person
        }));
        props.onChange(person.id);
    }
    
    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            <PersonAutocomplete
                isLoading={isLoading}
                value={person}
                onChange={onPersonSelected}
            />
        </FormGroup>
    );

}