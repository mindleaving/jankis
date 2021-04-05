import React from 'react';
import { Table } from 'react-bootstrap';
import { resolveText } from '../../helpers/Globalizer';

interface MedicationListProps {}

export const MedicationList = (props: MedicationListProps) => {

    return (
        <Table>
            <thead>
                <tr>
                    <th>{resolveText('Medication_BrandName')}</th>
                    <th>{resolveText('Medication_ActiveIngredient')}</th>
                    <th>{resolveText('Medication_Dosing')}</th>
                    <th>{resolveText('Medication_Note')}</th>
                </tr>
            </thead>
        </Table>
    );

}