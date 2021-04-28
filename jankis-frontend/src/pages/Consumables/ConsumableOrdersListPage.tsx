import React, { useState } from 'react';
import { ConsumableOrdersFilterView } from '../../components/Consumables/ConsumableOrdersFilterView';
import { ConsumableOrdersList } from '../../components/Consumables/ConsumableOrdersList';
import { resolveText } from '../../helpers/Globalizer';
import { ConsumableOrdersFilter } from '../../types/frontendTypes';

interface ConsumableOrdersListPageProps {}

export const ConsumableOrdersListPage = (props: ConsumableOrdersListPageProps) => {

    const [ filter, setFilter ] = useState<ConsumableOrdersFilter>({});
    return (
        <>
            <h1>{resolveText('ConsumableOrders')}</h1>
            <ConsumableOrdersFilterView setFilter={setFilter} />
            <ConsumableOrdersList filter={filter} />
        </>
    );

}