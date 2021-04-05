import React, { FormEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { apiClient } from '../../communication/ApiClient';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { NotificationManager } from 'react-notifications';
import { v4 as uuid } from 'uuid';
import { AsyncButton } from '../../components/AsyncButton';
import { useSelector } from 'react-redux';
import { getDepartments } from '../../stores/selectors/departmentSelectors';

interface StockParams {
    stockId?: string;
}
interface StockEditPageProps extends RouteComponentProps<StockParams> {}

export const StockEditPage = (props: StockEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    const matchedId = props.match.params.stockId;
    const departments = useSelector(getDepartments);

    const [ name, setName ] = useState<string>('');
    const [ selectedDepartment, setSelectedDepartment ] = useState<Models.Department>();
    const [ selectedLocation, setSelectedLocation ] = useState<Models.LocationReference>();
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring] = useState<boolean>(false);

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadStock = buildLoadObjectFunc<Models.Stock>(
            `api/stocks/${matchedId}`,
            {},
            resolveText('Stock_CouldNotLoad'),
            stock => {
                setName(stock.name);
                setSelectedDepartment(departments.find(x => x.id === stock.departmentId));
                setSelectedLocation(stock.location);
            },
            () => setIsLoading(false)
        );
        loadStock();
    }, [ isNew, matchedId, departments ]);

    const store = async (e?: FormEvent) => {
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
            id: matchedId ?? uuid(),
            name: name,
            location: selectedLocation!,
            departmentId: selectedDepartment!.id
        };
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Stock')} '{name}'</h1>
            <Form className="needs-validation was-validated" onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Stock_Name')}
                    value={name}
                    onChange={setName}
                />
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