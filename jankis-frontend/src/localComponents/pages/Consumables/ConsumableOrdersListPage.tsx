import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ConsumableOrdersFilterView } from '../../components/Consumables/ConsumableOrdersFilterView';
import { ConsumableOrdersList } from '../../components/Consumables/ConsumableOrdersList';
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