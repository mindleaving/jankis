import React, { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { AsyncButton } from '../../components/AsyncButton';
import { DepartmentAutocomplete } from '../../components/Autocompletes/DepartmentAutocomplete';
import { LocationFormControl } from '../../components/LocationFormControl';
import { ViewModels } from '../../types/viewModels';

interface StockParams {
    stockId?: string;
}
interface StockEditPageProps extends RouteComponentProps<StockParams> {}

export const StockEditPage = (props: StockEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.stockId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.stockId ?? uuid();

    const [ name, setName ] = useState<string>('');
    const [ selectedDepartment, setSelectedDepartment ] = useState<ViewModels.DepartmentViewModel>();
    const [ location, setLocation ] = useState<ViewModels.LocationViewModel>();
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring] = useState<boolean>(false);

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadStock = buildLoadObjectFunc<ViewModels.StockViewModel>(
            `api/stocks/${id}`,
            {},
            resolveText('Stock_CouldNotLoad'),
            stock => {
                setName(stock.name);
                setSelectedDepartment(stock.department);
                setLocation(stock.locationViewModel);
            },
            () => setIsLoading(false)
        );
        loadStock();
    }, [ isNew, id ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsStoring(true);
            const stock = buildStock();
            await apiClient.put(`api/stocks/${stock.id}`, {}, stock);
            NotificationManager.success(resolveText('Stock_SuccessfullyStored'));
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Stock_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const buildStock = (): Models.Stock => {
        return {
            id: id,
            name: name,
            location: {
                type: location!.type,
                id: location!.id
            },
            departmentId: selectedDepartment!.id
        };
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Stock')} '{name}'</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Stock_Name')}
                    value={name}
                    onChange={setName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Stock_Department')}</FormLabel>
                    <Col>
                        <DepartmentAutocomplete required
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Stock_Location')}</FormLabel>
                    <Col>
                        <LocationFormControl required
                            value={location}
                            onChange={setLocation}
                        />
                    </Col>
                </FormGroup>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Store')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
        </>
    );

}