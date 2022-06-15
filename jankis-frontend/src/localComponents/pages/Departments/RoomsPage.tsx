import { useEffect, useState } from 'react';
import { ButtonGroup, Button, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RoomGridView } from '../../components/Departments/RoomGridView';
import { Models } from '../../types/models';
import { BedOccupancyTimelineView } from '../../components/Departments/BedOccupancyTimelineView';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';
import { loadInsitutions } from '../../redux/slices/institutionsSlice';
import { loadBedOccupanciesForInstitution } from '../../redux/slices/bedOccupanciesSlice';

interface RoomsPageProps {}

enum RoomsViewType {
    Grid,
    Timeline
}
export const RoomsPage = (props: RoomsPageProps) => {

    const isLoading = useAppSelector(state => state.institutions.isLoading || state.bedOccupancies.isLoading);
    const institutions = useAppSelector(x => x.institutions.items);
    const [ selectedInstitutionId, setSelectedInstitutionId ] = useState<string>();
    const [ viewType, setViewType ] = useState<RoomsViewType>(RoomsViewType.Grid);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadInsitutions({}));
    }, []);
    useEffect(() => {
        if(!selectedInstitutionId && institutions.length > 0) {
            setSelectedInstitutionId(institutions[0].id);
        }
    }, [ institutions ]);
    useEffect(() => {
        if(!selectedInstitutionId) {
            return;
        }
        dispatch(loadBedOccupanciesForInstitution({ 
            args: selectedInstitutionId
        }));
    }, [ selectedInstitutionId ]);

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('BedOccupancies')}</h1>
            <FormGroup as={Row}>
                <Col></Col>
                <FormLabel column xs="auto">{resolveText('Institution')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={selectedInstitutionId ?? ''}
                        onChange={(e: any) => setSelectedInstitutionId(e.target.value)}
                    >
                        {institutions.length > 0
                        ? <>
                            <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                            {institutions.map(institution => (
                                <option key={institution.id} value={institution.id}>{institution.name}</option>
                            ))}
                        </>
                        : <option value="">{resolveText('NoInstitutions')}</option>}
                    </FormControl>
                </Col>
            </FormGroup>
            <Row className="mb-3">
                <Col></Col>
                <Col xs="auto">
                    <ButtonGroup>
                        <Button 
                            variant={viewType === RoomsViewType.Grid ? 'primary' : 'light'} 
                            onClick={() => setViewType(RoomsViewType.Grid)} 
                            title={resolveText('Rooms_GridView')}
                            style={{ width: '100px'}}
                        >
                            <i className="fa fa-th" />
                        </Button>
                        <Button 
                            variant={viewType === RoomsViewType.Timeline ? 'primary' : 'light'} 
                            onClick={() => setViewType(RoomsViewType.Timeline)} 
                            title={resolveText('Rooms_TimelineView')}
                            style={{ width: '100px' }}
                        >
                            <i className="fa fa-calendar" />
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {selectedInstitutionId 
            ? viewType === RoomsViewType.Grid ? <RoomGridView institutionId={selectedInstitutionId} />
            : viewType === RoomsViewType.Timeline ? <BedOccupancyTimelineView institutionId={selectedInstitutionId} />
            : null
            : null}
        </>
    );
}