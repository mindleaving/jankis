import React, { useState } from 'react';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { ConsumablesFilterView } from '../../components/Consumables/ConsumablesFilterView';
import { ConsumablesList } from '../../components/Consumables/ConsumablesList';
import { ConsumablesFilter } from '../../types/frontendTypes';

interface ConsumablesListPageProps {}

export const ConsumablesListPage = (props: ConsumablesListPageProps) => {

    const [ filter, setFilter ] = useState<ConsumablesFilter>({});
    return (
        <>
            <h1>{resolveText('Consumables')}</h1>
            <ConsumablesFilterView setFilter={setFilter} />
            <ConsumablesList filter={filter} />
        </>
    );

}