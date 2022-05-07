import { differenceInSeconds } from 'date-fns';
import { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { groupBy } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { PastMedicationTableRow } from './PastMedicationTableRow';

interface PastMedicationTableProps {
    personId: string;
}

export const PastMedicationTable = (props: PastMedicationTableProps) => {

    const medicationDispensions = useAppSelector(x => x.medicationDispensions.items.filter(x => x.personId === props.personId));

    const groupedDispensions = useMemo(() => {
        const inverseTimeOrderedDispensions = [...medicationDispensions].sort((a,b) => -differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
        return groupBy(inverseTimeOrderedDispensions, x => x.drug.id);
    }, [ medicationDispensions ]);

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