import React, { useEffect, useState } from 'react';
import { FormGroup, FormLabel, FormControl, Col, Row } from 'react-bootstrap';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { areEqual } from '../../../sharedCommonComponents/helpers/CollectionHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccessPermissions } from '../../types/enums.d';

interface AccessPermissionsFormGroupProps {
    title: string;
    value: AccessPermissions[];
    onChange: (permissions: AccessPermissions[]) => void;
}

export const AccessPermissionsFormGroup = (props: AccessPermissionsFormGroupProps) => {

    const [ permissions, setPermissions ] = useState<AccessPermissions[]>(props.value);

    useEffect(() => {
        if(areEqual(props.value, permissions)) {
            return;
        }
        setPermissions(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ props.value ]);
    
    useEffect(() => {
        props.onChange(permissions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ permissions ]);

    const addPermission = (permission: AccessPermissions) => {
        setPermissions(state => state.includes(permission) ? state : state.concat(permission));
    }
    const removePermission = (permission: AccessPermissions) => {
        setPermissions(state => state.filter(x => x !== permission));
    }

    return (
    <>
        <FormGroup>
            <FormLabel>{props.title}</FormLabel>
            <FormControl
                as="select"
                value={''}
                onChange={(e:any) => addPermission(e.target.value as AccessPermissions)}
            >
                <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                <option value={AccessPermissions.Read}>{resolveText(`AccessPermissions_${AccessPermissions.Read}`)}</option>
                <option value={AccessPermissions.Create}>{resolveText(`AccessPermissions_${AccessPermissions.Create}`)}</option>
                <option value={AccessPermissions.Modify}>{resolveText(`AccessPermissions_${AccessPermissions.Modify}`)}</option>
            </FormControl>
        </FormGroup>
        <Row>
            <Col>
                <ListFormControl
                    items={permissions}
                    idFunc={x => x}
                    displayFunc={x => resolveText(`AccessPermissions_${x}`)}
                    removeItem={removePermission}
                />
            </Col>
        </Row>
    </>
    );

}