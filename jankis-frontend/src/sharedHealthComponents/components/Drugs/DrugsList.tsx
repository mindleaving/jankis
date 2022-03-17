import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Models } from '../../../localComponents/types/models';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { deleteObject } from '../../../sharedCommonComponents/helpers/DeleteHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { formatDrug } from '../../helpers/Formatters';
import { DrugsFilter } from '../../types/frontendTypes';

interface DrugsListProps {
    filter: DrugsFilter;
}

export const DrugsList = (props: DrugsListProps) => {


    const [ drugs, setDrugs ] = useState<Models.Medication.Drug[]>([]);
    const filter = props.filter;
    const drugsLoader = useMemo(() => new PagedTableLoader<Models.Medication.Drug>(
        'api/drugs', 
        resolveText('Drugs_CouldNotLoad'),
        setDrugs,
        filter
    ), [ filter ]);
    const navigate = useNavigate();


    const deleteDrug = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmDeleteAlert(
                id,
                name,
                resolveText('Drug_ConfirmDelete_Title'),
                resolveText('Drug_ConfirmDelete_Message').replace('{0}', name),
                () => deleteDrug(id, name, true)
            );
            return;
        }
        await deleteObject(
            `api/drugs/${id}`,
            {},
            resolveText('Drug_SuccessfullyDeleted'),
            resolveText('Drug_CouldNotDelete'),
            () => setDrugs(drugs.filter(x => x.id !== id))
        );
    }

    return (
        <PagedTable
            onPageChanged={drugsLoader.load}
            hasCreateNewButton
            onCreateNew={() => navigate('/create/drug')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Drug_ProductName')}</th>
                    <th>{resolveText('Drug_Brand')}</th>
                    <th>{resolveText('Drug_ActiveIngredients')}</th>
                    <th>{resolveText('Drug_Amount')}</th>
                    <th>{resolveText('Drug_DispensionForm')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {drugs.map(drug => (
                    <tr>
                        <td>
                            <i className="fa fa-trash red clickable" onClick={() => deleteDrug(drug.id, formatDrug(drug))} />
                        </td>
                        <td>{drug.productName}</td>
                        <td>{drug.brand}</td>
                        <td>
                            <ul className="bulletFreeList">
                                {drug.activeIngredients.map(activeIngredient => (
                                    <li>{activeIngredient}</li>
                                ))}
                            </ul>
                        </td>
                        <td>{drug.amountValue} {drug.amountUnit}</td>
                        <td>{drug.dispensionForm} @ {drug.applicationSite}</td>
                        <td>
                            <Button variant="link" onClick={() => navigate(`/drugs/${drug.id}/edit`)}>{resolveText('Edit...')}</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </PagedTable>
    );

}