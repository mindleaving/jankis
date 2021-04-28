import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { formatLocation } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { StocksFilter } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';
import { PagedTable } from '../PagedTable';

interface StocksListProps {
    filter: StocksFilter;
}

export const StocksList = (props: StocksListProps) => {

    const [ stocks, setStocks ] = useState<ViewModels.StockViewModel[]>([]);
    const stocksLoader = useMemo(() => new PagedTableLoader<ViewModels.StockViewModel>(
        'api/stocks', 
        resolveText('Stocks_CouldNotLoad'),
        setStocks,
        props.filter
    ), [ props.filter ]);
    const history = useHistory();
    
    const deleteStock = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmAlert(
                id,
                name,
                resolveText('Stock_ConfirmDelete_Title'),
                resolveText('Stock_ConfirmDelete_Message').replace('{0}', name),
                () => deleteStock(id, name, true)
            );
            return;
        }
        await deleteObject(
            `api/stocks/${id}`,
            {},
            resolveText('Stock_SuccessfullyDeleted'),
            resolveText('Stock_CouldNotDelete'),
            () => setStocks(stocks.filter(x => x.id !== id))
        );
    }
    return (
        <PagedTable
            onPageChanged={stocksLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/stock')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Stock_Name')}</th>
                    <th>{resolveText('Stock_Department')}</th>
                    <th>{resolveText('Stock_Location')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {stocks.length > 0
                ? stocks.map(stock => (
                    <tr key={stock.id}>
                        <td>
                            <i className="fa fa-trash red clickable" onClick={() => deleteStock(stock.id, stock.name)} />
                        </td>
                        <td>{stock.name}</td>
                        <td>{stock.department?.name ?? stock.departmentId}</td>
                        <td>{formatLocation(stock.locationViewModel ?? stock.location)}</td>
                        <td>
                            <Button variant="link" onClick={() => history.push(`/stocks/${stock.id}/edit`)}>{resolveText('Edit...')}</Button>
                        </td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={5}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}