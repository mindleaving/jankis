import { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { BedState } from '../../types/enums.d';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { RowFormGroup } from '../../components/RowFormGroup';
import { StoreButton } from '../../components/StoreButton';
import { PatientAutocomplete } from '../../components/PatientAutocomplete';
import { DeleteButton } from '../../components/DeleteButon';
import { deleteObject } from '../../helpers/DeleteHelpers';

interface BedOccupancyParams {
    occupancyId?: string;
    departmentId?: string;
    roomId?: string;
    bedPosition?: string;
}
interface BedOccupancyEditPageProps extends RouteComponentProps<BedOccupancyParams> {}

export const BedOccupancyEditPage = (props: BedOccupancyEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    const matchedId = props.match.params.occupancyId;
    const matchedDepartmentId = props.match.params.departmentId;
    const matchedRoomId = props.match.params.roomId;
    const matchedBedPosition = props.match.params.bedPosition;
    if(!isNew && !matchedId) {
        throw new Error('Missing ID');
    }
    if(isNew && (!matchedDepartmentId || !matchedRoomId || !matchedBedPosition)) {
        throw new Error('Missing bed information');
    }
    const id = matchedId ?? uuid();


    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ departmentId, setDepartmentId ] = useState<string | undefined>(matchedDepartmentId);
    const [ roomId, setRoomId ] = useState<string | undefined>(matchedRoomId);
    const [ bedPosition, setBedPosition ] = useState<string | undefined>(matchedBedPosition);
    const [ bedState, setBedState ] = useState<BedState>(BedState.Reserved);
    const [ patient, setPatient ] = useState<Models.Person>();
    const [ startTime, setStartTime ] = useState<Date>(new Date());
    const [ endTime, setEndTime ] = useState<Date>();
    const [ unavailabilityReason, setUnavailabilityReason ] = useState<string>();
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if(!matchedId) return;
        setIsLoading(true);
        const loadOccupancy = buildLoadObjectFunc<Models.BedOccupancy>(
            `api/bedoccupancies/${matchedId}`,
            {},
            resolveText('BedOccupancy_CouldNotLoad'),
            item => {
                setDepartmentId(item.departmentId);
                setRoomId(item.roomId);
                setBedPosition(item.bedPosition);
                setBedState(item.state);
                setPatient(item.patient);
                setStartTime(item.startTime);
                setEndTime(item.endTime ?? undefined);
                setUnavailabilityReason(item.unavailabilityReason);
            },
            () => setIsLoading(false)
        );
        loadOccupancy();
    }, [ matchedId ])

    const store = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject<Models.BedOccupancy>(
            `api/bedoccupancies/${id}`,
            resolveText('BedOccupancy_SuccessfullyStored'),
            resolveText('BedOccupancy_CouldNotLoad'),
            buildBedOccupancy,
            () => history.goBack(),
            () => setIsStoring(false)
        );
    }

    const buildBedOccupancy = (): Models.BedOccupancy => {
        return {
            id: id,
            departmentId: departmentId!,
            roomId: roomId!,
            bedPosition: bedPosition!,
            state: bedState,
            startTime: startTime,
            endTime: endTime,
            patient: bedState === BedState.Occupied || bedState === BedState.Reserved ? patient : undefined,
            unavailabilityReason: bedState === BedState.Unavailable ? unavailabilityReason : undefined
        }
    }
    const deleteOccupancy = async () => {
        setIsDeleting(true);
        await deleteObject(
            `api/bedoccupancies/${matchedId}`,
            {},
            resolveText('BedOccupancy_SuccessfullyDeleted'),
            resolveText('BedOccupancy_CouldNotDelete'),
            () => history.goBack(),
            () => setIsDeleting(false)
        );
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
            <h1>{resolveText('BedOccupancy')}</h1>
            <Form onSubmit={store}>
                <RowFormGroup
                    label={resolveText('BedOccupancy_State')}
                    as="select"
                    value={bedState}
                    onChange={setBedState}
                >
                    {Object.keys(BedState).map(x => (
                        <option key={x} value={x}>{resolveText(`BedState_${x}`)}</option>
                    ))}
                </RowFormGroup>
                <RowFormGroup required
                    label={resolveText('BedOccupancy_StartTime')}
                    type="datetime"
                    value={startTime}
                    onChange={setStartTime}
                />
                <RowFormGroup
                    label={resolveText('BedOccupancy_EndTime')}
                    type="datetime"
                    value={endTime}
                    onChange={setEndTime}
                />
                {bedState === BedState.Occupied || bedState === BedState.Reserved
                ? <FormGroup as={Row}>
                    <FormLabel column>{resolveText('BedOccupancy_Patient')}</FormLabel>
                    <Col>
                        <PatientAutocomplete
                            value={patient}
                            onChange={setPatient}
                        />
                    </Col>
                </FormGroup>
                : null}
                {bedState === BedState.Unavailable
                ? <RowFormGroup
                    label={resolveText('BedOccupancy_UnavailabilityReason')}
                    value={unavailabilityReason}
                    onChange={setUnavailabilityReason}
                />
                : null}
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
                {!isNew
                ? <DeleteButton
                    isDeleting={isDeleting}
                    onClick={deleteOccupancy}
                    requireConfirm
                    confirmDialogTitle={resolveText('BedOccupancy_ConfirmDelete_Title')}
                    confirmDialogMessage={resolveText('BedOccupancy_ConfirmDelete_Message')}
                />
                : null}
            </Form>
        </>
    );

}