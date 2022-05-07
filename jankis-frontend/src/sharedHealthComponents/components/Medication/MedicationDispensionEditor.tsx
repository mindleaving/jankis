import Flatpickr from 'react-flatpickr';
import { FormControl, InputGroup } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { addDays } from 'date-fns';

interface MedicationDispensionEditorProps {
    dispension: Models.Medication.MedicationDispension;
    onChange: (dispensionId: string, update: Update<Models.Medication.MedicationDispension>) => void;
    onDelete: (dispensionId: string) => void;
    disabled?: boolean;
    daysOffset?: number
}

export const MedicationDispensionEditor = (props: MedicationDispensionEditorProps) => {

    return (
        <InputGroup className="my-2">
            <Flatpickr
                options={{
                    allowInput: true,
                    enableTime: true,
                    noCalendar: true,
                    time_24hr: true
                }}
                value={new Date(props.dispension.timestamp)}
                onChange={(selectedDates) => {
                    props.onChange(props.dispension.id, x => ({
                        ...x,
                        timestamp: selectedDates.length > 0 
                            ? addDays(selectedDates[0] , props.daysOffset ?? 0).toISOString() as any
                            : x.timestamp
                    }));
                }}
                disabled={props.disabled}
            />
            <FormControl
                value={props.dispension.note ?? ''}
                onChange={(e:any) => props.onChange(props.dispension.id, x => ({
                    ...x,
                    note: e.target.value
                }))}
                placeholder={resolveText('Note')}
                className="mx-2"
                disabled={props.disabled}
            />
            <i className="fa fa-trash red clickable m-2" onClick={() => props.onDelete(props.dispension.id)} />
        </InputGroup>
    );

}