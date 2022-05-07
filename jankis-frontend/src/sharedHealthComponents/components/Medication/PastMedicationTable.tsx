import { differenceInSeconds } from 'date-fns';
import { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { groupBy } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { PastMedicationTableRow } from './PastMedicationTableRow';

interface PastMedicationTableProps {
    medicationDispensions: Models.Medication.MedicationDispension[];
}

export const PastMedicationTable = (props: PastMedicationTableProps) => {

    const groupedDispensions = useMemo(() => {
        const inverseTimeOrderedDispensions = [...props.medicationDispensions].sort((a,b) => -differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
        return groupBy(inverseTimeOrderedDispensions, x => x.drug.id);
    }, [ props.medicationDispensions ]);

    return (
        <Table>
            <tbody>
                {groupedDispensions.map(g => {
                    const drugId = g.key;
                    return (
                        <PastMedicationTableRow
                            key={drugId}
                            dispensions={g.items}
                        />
                    );
                })}
            </tbody>
        </Table>
    );

}