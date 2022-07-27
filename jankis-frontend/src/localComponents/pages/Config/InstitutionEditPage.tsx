import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, FormControl, Row, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import { v4 as uuid } from 'uuid';
import { Models } from '../../types/models';
import { RoomSelector } from '../../components/Config/RoomSelector';
import { RoomGeneratorModal } from '../../components/Config/RoomGeneratorModal';
import { BedPositionCreator } from '../../components/Config/BedPositionCreator';
import { ViewModels } from '../../types/viewModels';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { openConfirmDeleteAlert } from '../../../sharedCommonComponents/helpers/AlertHelpers';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface InstitutionEditPageProps { }

export const InstitutionEditPage = (props: InstitutionEditPageProps) => {
    const location = useLocation();
    const { institutionId } = useParams();
    const isNew = location.pathname.toLowerCase().startsWith('/create');
    if (!isNew && !institutionId) {
        throw new Error('Invalid link');
    }
    const id = useMemo(() => institutionId ?? uuid(), [ institutionId ]);

    const [name, setName] = useState<string>('');
    const [rooms, setRooms] = useState<Models.Room[]>([]);
    const [departments, setDepartments] = useState<Models.Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(!isNew);
    const [isStoring, setIsStoring] = useState<boolean>(false);
    const [ showRoomGeneratorModal, setShowRoomGeneratorModal] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNew) return;
        setIsLoading(true);
        const loadInstitution = buildLoadObjectFunc<ViewModels.InstitutionViewModel>(
            `api/institutions/${id}`,
            {},
            resolveText('Institution_CouldNotLoad'),
            item => {
                setName(item.name);
                setRooms(item.rooms);
                setDepartments(item.departments);
            },
            () => setIsLoading(false)
        );
        loadInstitution();
    }, [isNew, id]);

    const addRoom = () => {
        setRooms(rooms.concat({
            id: uuid(),
            institutionId: id,
            name: '',
            bedPositions: [],
        }));
    }
    const addDepartment = () => {
        setDepartments(departments.concat({
            id: uuid(),
            institutionId: id,
            name: '',
            roomIds: []
        }));
    }
    const setRoomProperty = (roomId: string, propertyName: string, propertyValue: string) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                return {
                    ...room,
                    [propertyName]: propertyValue
                };
            }
            return room;
        }));
    }
    const addBedPositionToRoom = (roomId: string, bedPosition: string) => {
        setRooms(rooms.map(room => {
            if(room.id === roomId) {
                return {
                    ...room,
                    bedPositions: room.bedPositions.concat(bedPosition)
                }
            }
            return room;
        }));
    }
    const removeBedPositionFromRoom = (roomId: string, bedPosition: string) => {
        setRooms(rooms.map(room => {
            if(room.id === roomId) {
                return {
                    ...room,
                    bedPositions: room.bedPositions.filter(x => x !== bedPosition)
                }
            }
            return room;
        }));
    }
    const setDepartmentProperty = (departmentId: string, propertyName: string, propertyValue: string) => {
        setDepartments(departments.map(department => {
            if (department.id === departmentId) {
                return {
                    ...department,
                    [propertyName]: propertyValue
                };
            }
            return department;
        }));
    }
    const addRoomToDepartment = (departmentId: string, roomId: string) => {
        if(departments.find(x => x.id === departmentId)?.roomIds.includes(roomId)) {
            return;
        }
        const room = rooms.find(x => x.id === roomId);
        if(!room) {
            return;
        }
        setDepartments(departments.map(department => {
            if(department.id === departmentId) {
                return {
                    ...department,
                    roomIds: department.roomIds.concat(roomId)
                }
            }
            return department;
        }));
    }
    const removeRoomFromDepartment = (departmentId: string, roomId: string) => {
        setDepartments(departments.map(department => {
            if(department.id === departmentId) {
                return {
                    ...department,
                    roomIds: department.roomIds.filter(x => x !== roomId)
                }
            }
            return department;
        }));
    }
    const deleteRoom = (id: string, name: string, force: boolean = false) => {
        if (!force) {
            openConfirmDeleteAlert(
                name, 
                resolveText('Room_ConfirmDelete_Title'), 
                resolveText('Room_ConfirmDelete_Message'), 
                () => deleteRoom(id, name, true)
            );
        }
        setRooms(rooms.filter(x => x.id !== id));
        setDepartments(departments.map(department => {
            return {
                ...department,
                roomIds: department.roomIds.filter(x => x !== id)
            };
        }));
    }
    const deleteDepartment = (id: string, name: string, force: boolean = false) => {
        if (!force) {
            openConfirmDeleteAlert(
                name, 
                resolveText('Department_ConfirmDelete_Title'), 
                resolveText('Department_ConfirmDelete_Message'), 
                () => deleteDepartment(id, name, true)
            );
        }
        setDepartments(departments.filter(x => x.id !== id));
    }
    const isParentDepartment = (departmentId: string, potentialParentDepartmentId: string) => {
        let nextDepartmentId = departmentId;
        while(nextDepartmentId) {
            let department = departments.find(x => x.id === nextDepartmentId);
            if(!department?.parentDepartmentId) {
                return false;
            }
            if(department.parentDepartmentId === potentialParentDepartmentId) {
                return true;
            }
            nextDepartmentId = department.parentDepartmentId;
        }
    }

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buildAndStoreObject(
            `api/institutions/${id}/storeviewmodel`,
            resolveText('Institution_SuccessfullyStored'),
            resolveText('Institution_CouldNotStore'),
            buildInstitution,
            () => navigate('/institutions'),
            () => setIsStoring(false)
        );
    }
    const buildInstitution = (): ViewModels.InstitutionViewModel => {
        return {
            id: id,
            name: name,
            rooms: rooms,
            departments: departments
        };
    }

    if (isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('Institution')} - '{name}'</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Institution_Name')}
                    value={name}
                    onChange={setName}
                />
                <hr />
                <h3>{resolveText('Rooms')}</h3>
                <Row>
                    <Col></Col>
                    <Col xs="auto">
                        <Button className="m-2" onClick={() => setShowRoomGeneratorModal(true)}>{resolveText('GenerateRooms')}</Button>
                        <Button className="m-2" onClick={addRoom}>{resolveText('CreateNew')}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table>
                            <colgroup>
                                <col width="100px" />
                                <col width="*" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{resolveText('Room_Name')}</th>
                                    <th>{resolveText('Room_BedPositions')}</th>
                                </tr>
                            </thead>
                            {rooms.map(room => (
                                <tr key={room.id}>
                                    <td><i className="fa fa-trash red clickable" onClick={() => deleteRoom(room.id, room.name)} /></td>
                                    <td>
                                        <FormControl
                                            value={room.name}
                                            onChange={(e: any) => setRoomProperty(room.id, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Row>
                                            <Col>
                                                <BedPositionCreator
                                                    onAdd={bedPosition => addBedPositionToRoom(room.id, bedPosition)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <ListFormControl<string>
                                                    items={room.bedPositions}
                                                    idFunc={x => x}
                                                    displayFunc={x => x}
                                                    removeItem={bedPosition => removeBedPositionFromRoom(room.id, bedPosition)}
                                                />
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </Col>
                </Row>
                <hr />
                <h3>{resolveText('Departments')}</h3>
                <Row>
                    <Col></Col>
                    <Col xs="auto">
                        <Button className="m-2" onClick={addDepartment}>{resolveText('CreateNew')}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table>
                            <colgroup>
                                <col width="100px" />
                                <col width="25%" />
                                <col width="25%" />
                                <col width="*" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{resolveText('Department_Name')}</th>
                                    <th>{resolveText('Department_ParentDepartment')}</th>
                                    <th>{resolveText('Department_Rooms')}</th>
                                </tr>
                            </thead>
                            {departments.map(department => (
                                <tr key={department.id}>
                                    <td><i className="fa fa-trash red clickable" onClick={() => deleteDepartment(department.id, department.name)} /></td>
                                    <td>
                                        <FormControl
                                            value={department.name}
                                            onChange={(e: any) => setDepartmentProperty(department.id, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            as="select"
                                            value={department.parentDepartmentId ?? ''}
                                            onChange={(e:any) => setDepartmentProperty(department.id, 'parentDepartmentId', e.target.value)}
                                        >
                                            <option value="">{resolveText('None')}</option>
                                            {departments
                                                .filter(otherDepartment => otherDepartment.id !== department.id && !isParentDepartment(otherDepartment.id, department.id))
                                                .map(otherDepartment => (
                                                <option key={otherDepartment.id} value={otherDepartment.id}>{otherDepartment.name}</option>
                                            ))}
                                        </FormControl>
                                    </td>
                                    <td>
                                        <Row>
                                            <Col>
                                                <RoomSelector
                                                    rooms={rooms}
                                                    onAdd={roomId => addRoomToDepartment(department.id, roomId)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <ListFormControl<Models.Room>
                                                    items={department.roomIds.map(roomId => rooms.find(x => x.id === roomId)).filter(x => x !== undefined) as Models.Room[]}
                                                    idFunc={room => room.id}
                                                    displayFunc={room => room.name}
                                                    removeItem={room => removeRoomFromDepartment(department.id, room.id)}
                                                />
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </Col>
                </Row>
                <AsyncButton
                    type="submit"
                    activeText={resolveText('Store')}
                    executingText={resolveText('Storing...')}
                    isExecuting={isStoring}
                />
            </Form>
            <RoomGeneratorModal
                institutionId={id}
                show={showRoomGeneratorModal}
                onGenerate={generatedRooms => setRooms(rooms.concat(generatedRooms))}
                onClose={() => setShowRoomGeneratorModal(false)}
            />
        </>
    );

}