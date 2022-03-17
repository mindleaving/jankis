import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { Models } from '../../types/models';
import { useNavigate, useLocation, useParams } from 'react-router';
import { v4 as uuid } from 'uuid';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';


interface DepartmentEditPageProps {}

export const DepartmentEditPage = (props: DepartmentEditPageProps) => {

    const location = useLocation();
    const { departmentId } = useParams();
    const isNew = location.pathname.toLowerCase().startsWith('/create');
    if(!isNew && !departmentId) {
        throw new Error('Invalid link');
    }
    const id = departmentId ?? uuid();

    const institutionAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Institution>('api/institutions/search', 'searchText', 10), []);
    const departmentAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Department>('api/departments/search', 'searchText', 10), []);
    const [ name, setName ] = useState<string>('');
    const [ institutionId, setInstitutionId] = useState<string>();
    const [ parentDepartmentId, setParentDepartmentId ] = useState<string>();
    const [ rooms, setRooms ] = useState<Models.Room[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadDepartment = buildLoadObjectFunc<Models.Department>(
            `api/departments/${id}`,
            {},
            resolveText('Department_CouldNotLoad'),
            (department) => {
                setName(department.name);
                setInstitutionId(department.institutionId);
                setParentDepartmentId(department.parentDepartmentId);
            },
            () => setIsLoading(false)
        );
        loadDepartment();
    }, [ isNew, id ])

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsStoring(true);
            const department = buildDepartment();
            await apiClient.instance!.put(`api/departments/${department.id}`, {}, department);
            NotificationManager.success(resolveText('Department_SuccessfullyStored'));
            navigate('/departments');
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Department_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const buildDepartment = (): Models.Department => {
        return {
            id: id,
            name: name,
            institutionId: institutionId!,
            parentDepartmentId: parentDepartmentId,
            roomIds: rooms.map(x => x.id)
        }
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    
    return (
        <>
            <h1>{resolveText('Department')} - '{name}'</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Department_Name')}
                    value={name}
                    onChange={setName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Department_Institution')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={institutionAutocompleteRunner.search}
                            displayNameSelector={x => x.name}
                            onItemSelected={x => setInstitutionId(x.id)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Department_ParentDepartment')}</FormLabel>
                    <Col>
                        <Autocomplete
                            search={departmentAutocompleteRunner.search}
                            displayNameSelector={x => x.name}
                            onItemSelected={x => setParentDepartmentId(x.id)}
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