import React, { useState } from 'react';
import { StocksFilterView } from '../../components/Stocks/StocksFilterView';
import { StocksList } from '../../components/Stocks/StocksList';
import { resolveText } from '../../helpers/Globalizer';
import { StocksFilter } from '../../types/frontendTypes';

interface StocksListPageProps {}

export const StocksListPage = (props: StocksListPageProps) => {

    const [ filter, setFilter ] = useState<StocksFilter>({});
    return (
        <>
            <h1>{resolveText('Stocks')}</h1>
            <StocksFilterView setFilter={setFilter} />
            <StocksList filter={filter} />
        </>
    );

}