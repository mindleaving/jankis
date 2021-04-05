import React, { FormEvent, useMemo, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { AsyncButton } from '../../components/AsyncButton';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../communication/ApiClient';
import { Models } from '../../types/models';
import { RouteComponentProps } from 'react-router';
import { v4 as uuid } from 'uuid';
import { Autocomplete } from '../../components/Autocomplete';
import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';

interface DepartmentParams {
    departmentId?: string;
}
interface DepartmentEditPageProps extends RouteComponentProps<DepartmentParams> {}

export const DepartmentEditPage = (props: DepartmentEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    const id = props.match.params.departmentId ?? uuid();

    const departmentAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Department>('api/departments/search', 'searchText', 10), []);
    const [ name, setName ] = useState<string>('');
    const [ parentDepartmentId, setParentDepartmentId ] = useState<string>();
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        try {
            setIsStoring(true);
            const department = buildDepartment();
            await apiClient.put(`api/departments/${id}`, {}, department);
            NotificationManager.success(resolveText('Department_SuccessfullyStored'));
        } catch(error) {
            NotificationManager.error(error.message, resolveText('Department_CouldNotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const buildDepartment = (): Models.Department => {
        return {
            id: id,
            name: name,
            parentDepartment: parentDepartmentId
        }
    }

    if(isNew) {
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