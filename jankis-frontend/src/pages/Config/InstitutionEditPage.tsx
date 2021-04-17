import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, Row, Table } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { v4 as uuid } from 'uuid';
import { Models } from '../../types/models';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { RowFormGroup } from '../../components/RowFormGroup';
import { AsyncButton } from '../../components/AsyncButton';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { ListFormControl } from '../../components/ListFormControl';
import { RoomSelector } from '../../components/Config/RoomSelector';
import { RoomGeneratorModal } from '../../components/Config/RoomGeneratorModal';
import { BedPositionCreator } from '../../components/Config/BedPositionCreator';

interface InstitutionParams {
    institutionId?: string;
}
interface InstitutionEditPageProps extends RouteComponentProps<InstitutionParams> { }

export const InstitutionEditPage = (props: InstitutionEditPageProps) => {
    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if (!isNew && !props.match.params.institutionId) {
        throw new Error('Invalid link');
    }
    const id = props.match.params.institutionId ?? uuid();

    const [name, setName] = useState<string>('');
    const [rooms, setRooms] = useState<Models.Room[]>([]);
    const [departments, setDepartments] = useState<Models.Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(!isNew);
    const [isStoring, setIsStoring] = useState<boolean>(false);
    const [ showRoomGeneratorModal, setShowRoomGeneratorModal] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if (isNew) return;
        setIsLoading(true);
        const loadInstitution = buildLoadObjectFunc<Models.Institution>(
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
            name: '',
            bedPositions: []
        }));
    }
    const addDepartment = () => {
        setDepartments(departments.concat({
            id: uuid(),
            institutionId: id,
            name: '',
            rooms: []
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
        if(departments.find(x => x.id === departmentId)?.rooms.find(x => x.id === roomId)) {
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
                    rooms: department.rooms.concat(room)
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
                    rooms: department.rooms.filter(room => room.id !== roomId)
                }
            }
            return department;
        }));
    }
    const deleteRoom = (id: string, name: string, force: boolean = false) => {
        if (!force) {
            openConfirmAlert(id, name, resolveText('Room_ConfirmDelete_Title'), resolveText('Room_ConfirmDelete_Message'), () => deleteRoom(id, name, true));
        }
        setRooms(rooms.filter(x => x.id !== id));
        setDepartments(departments.map(department => {
            return {
                ...department,
                rooms: department.rooms.filter(x => x.id !== id)
            };
        }));
    }
    const deleteDepartment = (id: string, name: string, force: boolean = false) => {
        if (!force) {
            openConfirmAlert(id, name, resolveText('Department_ConfirmDelete_Title'), resolveText('Department_ConfirmDelete_Message'), () => deleteDepartment(id, name, true));
        }
        setDepartments(departments.filter(x => x.id !== id));
    }

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject(
            `api/institutions/${id}`,
            resolveText('Institution_SuccessfullyStored'),
            resolveText('Institution_CouldNotStore'),
            buildInstitution,
            () => history.push('/institutions'),
            () => setIsStoring(false)
        );
    }
    const buildInstitution = (): Models.Institution => {
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
                                <col width="*" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{resolveText('Department_Name')}</th>
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
                                                    items={department.rooms}
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
                show={showRoomGeneratorModal}
                onGenerate={generatedRooms => setRooms(rooms.concat(generatedRooms))}
                onClose={() => setShowRoomGeneratorModal(false)}
            />
        </>
    );

}