import { differenceInSeconds } from 'date-fns';
import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { groupBy } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ImmunizationTableRow } from './ImmunizationTableRow';

interface ImmunizationTableProps {
    personId: string;
}

export const ImmunizationTable = (props: ImmunizationTableProps) => {

    const immunizations = useAppSelector(x => x.immunizations.items.filter(x => x.personId === props.personId))

    const groupedImmunizations = useMemo(() => {
        const inverseTimeOrderedDispensions = [...immunizations].sort((a,b) => -differenceInSeconds(new Date(a.timestamp), new Date(b.timestamp)));
        return groupBy(inverseTimeOrderedDispensions, x => x.drug.id);
    }, [ immunizations ]);

    return (
        <Table>
            <tbody>
                {groupedImmunizations.length > 0
                ? groupedImmunizations.map(g => {
                    const drugId = g.key;
                    return (
                        <ImmunizationTableRow
                            key={drugId}
                            immunizations={g.items}
                        />
                    );
                })
                : <tr>
                    <td colSpan={5} className="text-center">{resolveText("NoEntries")}</td>
                </tr>}
            </tbody>
        </Table>
    );

}