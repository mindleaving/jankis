import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { ListFormControl } from '../../components/ListFormControl';
import { RowFormGroup } from '../../components/RowFormGroup';
import { resolveText } from '../../helpers/Globalizer';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Permission } from '../../types/enums.d';
import { v4 as uuid } from 'uuid';
import { Models } from '../../types/models';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { AsyncButton } from '../../components/AsyncButton';

interface RoleParams {
    roleId?: string;
}
interface RoleEditPageProps extends RouteComponentProps<RoleParams> {}

export const RoleEditPage = (props: RoleEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.roleId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.roleId ?? uuid();

    const [ name, setName ] = useState<string>('');
    const [ isSystemRole, setIsSystemRole ] = useState<boolean>(false);
    const [ selectedPermission, setSelectedPermission ] = useState<Permission>();
    const [ permissions, setPermissions ] = useState<Permission[]>([]);
    const history = useHistory();
    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadRole = buildLoadObjectFunc<Models.Role>(
            `api/roles/${id}`,
            {},
            resolveText('Role_CouldNotLoad'),
            role => {
                setName(role.name);
                setIsSystemRole(role.isSystemRole);
                setPermissions(role.permissions);
            },
            () => setIsLoading(false)
        );
        loadRole();
    }, [ isNew, id ]);
    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        await buidlAndStoreObject(
            `api/roles/${id}`,
            resolveText('Role_SuccessfullyStored'),
            resolveText('Role_CouldNotStore'),
            buildRole,
            () => {
                history.push('/roles');
            },
            () => setIsStoring(false)
        );
    }

    const buildRole = (): Models.Role => {
        return {
            id: id,
            name: name,
            isSystemRole: isSystemRole,
            permissions: permissions
        };
    }

    const addPermission = (permission: Permission) => {
        if(permissions.some(x => x === permission)) {
            return;
        }
        setPermissions(permissions.concat(permission));
    }
    const removePermission = (permission: Permission) => {
        setPermissions(permissions.filter(x => x !== permission));
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('Role')} - '{name}'</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Role_Name')}
                    value={name}
                    onChange={setName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Role_Permissions')}</FormLabel>
                    <Col>
                        <InputGroup>
                            <FormControl
                                as="select"
                                value={selectedPermission ?? ''}
                                onChange={(e:any) => setSelectedPermission(e.target.value)}
                            >
                                <option value="" disabled></option>
                                {Object.keys(Permission).map((permission) => (
                                    <option key={permission} value={permission}>{resolveText(`Permission_${permission}`)}</option>
                                ))}
                            </FormControl>
                            <Button
                                onClick={() => addPermission(selectedPermission!)}
                                disabled={!selectedPermission}
                            >
                                {resolveText('Add')}
                            </Button>
                        </InputGroup>
                    </Col>
                </FormGroup>
                <Row>
                    <Col></Col>
                    <Col>
                        <ListFormControl<Permission>
                            items={permissions}
                            idFunc={x => x}
                            displayFunc={x => x}
                            removeItem={removePermission}
                        />
                    </Col>
                </Row>
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