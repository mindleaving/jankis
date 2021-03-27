import React, { useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { ListFormControl } from '../../components/ListFormControl';
import { RowFormGroup } from '../../components/RowFormGroup';
//import { Autocomplete } from '../../components/Autocomplete';
//import { AutocompleteRunner } from '../../helpers/AutocompleteRunner';
import { resolveText } from '../../helpers/Globalizer';
import { Permission } from '../../types/enums.d';

interface RoleEditPageProps {}

export const RoleEditPage = (props: RoleEditPageProps) => {

    //const permissionAutocompleteRunner = useMemo(() => new AutocompleteRunner<string>('api/autocomplete/permissions', 'searchText', 10), []);
    const [ name, setName ] = useState<string>('');
    const [ selectedPermission, setSelectedPermission ] = useState<string>('');
    const [ permissions, setPermissions ] = useState<string[]>([]);

    const addPermission = (permission: string) => {
        if(permissions.some(x => x === permission)) {
            return;
        }
        setPermissions(permissions.concat(permission));
    }
    const removePermission = (permission: string) => {
        setPermissions(permissions.filter(x => x !== permission));
    }
    return (
        <>
            <h1>Role {name}</h1>
            <Form>
                <RowFormGroup required
                    label={resolveText('Role_Name')}
                    value={name}
                    onChange={setName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Role_Permissions')}</FormLabel>
                    <Col>
                        {/* <Autocomplete
                            search={permissionAutocompleteRunner.search}
                            displayNameSelector={x => x}
                            onItemSelected={addPermission}
                            resetOnSelect
                        /> */}
                        <InputGroup>
                            <FormControl
                                as="select"
                                value={selectedPermission}
                                onChange={(e:any) => setSelectedPermission(e.target.value)}
                            >
                                <option value="" disabled></option>
                                {Object.keys(Permission).map((permission) => (
                                    <option key={permission} value={permission}>{resolveText(`Permission_${permission}`)}</option>
                                ))}
                            </FormControl>
                            <Button
                                onClick={() => addPermission(selectedPermission)}
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
                        <ListFormControl<string>
                            items={permissions}
                            idFunc={x => x}
                            displayFunc={x => x}
                            removeItem={removePermission}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );

}