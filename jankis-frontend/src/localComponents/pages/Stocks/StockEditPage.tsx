import { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useNavigate, useLocation, useParams } from 'react-router';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { DepartmentAutocomplete } from '../../components/Autocompletes/DepartmentAutocomplete';
import { LocationFormControl } from '../../components/LocationFormControl';
import { ViewModels } from '../../types/viewModels';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';


interface StockEditPageProps {}

export const StockEditPage = (props: StockEditPageProps) => {

    const routerLocation = useLocation();
    const { stockId } = useParams();
    const isNew = routerLocation.pathname.toLowerCase().startsWith('/create');
    if(!isNew && !stockId) {
        throw new Error('Invalid link');
    }
    const id = stockId ?? uuid();

    const [ name, setName ] = useState<string>('');
    const [ selectedDepartment, setSelectedDepartment ] = useState<ViewModels.DepartmentViewModel>();
    const [ location, setLocation ] = useState<ViewModels.LocationViewModel>();
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring] = useState<boolean>(false);
    const navigate = useNavigate();

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
        setIsStoring(true);
        await buildAndStoreObject(
            `api/stocks/${id}`,
            resolveText('Stock_SuccessfullyStored'),
            resolveText('Stock_CouldNotStore'),
            buildStock,
            () => navigate(-1),
            () => setIsStoring(false)
        )
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