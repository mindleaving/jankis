import React, { useMemo, useState } from 'react';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { ConsumableOrdersFilter } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';

interface ConsumableOrdersListProps {
    filter: ConsumableOrdersFilter;
}

export const ConsumableOrdersList = (props: ConsumableOrdersListProps) => {

    const [ orders, setOrders ] = useState<ViewModels.ConsumableOrderViewModel[]>([]);
    const orderLoader = useMemo(() => new PagedTableLoader<ViewModels.ConsumableOrderViewModel>(
        'api/consumableorders',
        resolveText('ConsumableOrders_CouldNotLoad'),
        setOrders,
        props.filter
    ), [ props.filter ]);

    return (
        <PagedTable
            onPageChanged={orderLoader.load}
        >
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </PagedTable>
    );

}