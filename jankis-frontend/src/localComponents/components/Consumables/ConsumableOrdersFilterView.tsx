import { useEffect, useState } from 'react';
import { Form, FormGroup, Row, FormLabel, Col } from 'react-bootstrap';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { ConsumableOrdersFilter } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';
import { ConsumableAutocomplete } from '../Autocompletes/ConsumableAutocomplete';

interface ConsumableOrdersFilterViewProps {
    filter?: ConsumableOrdersFilter;
    setFilter: (filter: ConsumableOrdersFilter) => void;
}

export const ConsumableOrdersFilterView = (props: ConsumableOrdersFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>(props.filter?.searchText ?? '');
    const [ consumable, setConsumable ] = useState<ViewModels.ConsumableViewModel>();

    useEffect(() => {
        if(!props.filter?.consumableId) return;
        const loadConsumable = buildLoadObjectFunc<ViewModels.ConsumableViewModel>(
            `api/services/${props.filter.consumableId}`,
            {},
            resolveText('Consumable_CouldNotLoad'),
            setConsumable
        );
        loadConsumable();
    }, [ props.filter?.consumableId ]);
    
    const setFilter = props.setFilter;
    useEffect(() => {
        const filter: ConsumableOrdersFilter = {
            searchText: searchText,
            consumableId: consumable?.id
        };
        setFilter(filter);
    }, [ searchText, consumable, setFilter ]);
    
    return (
        <Form>
            <RowFormGroup
                label={resolveText('Search')}
                value={searchText}
                onChange={setSearchText}
            />
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Consumable')}</FormLabel>
                <Col>
                    <ConsumableAutocomplete
                        value={consumable}
                        onChange={setConsumable}
                    />
                </Col>
            </FormGroup>
        </Form>
    );

}